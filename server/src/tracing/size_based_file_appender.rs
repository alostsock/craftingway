use chrono::prelude::*;
use std::{
    fs::{self, File, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, RwLock,
    },
};

// Basically https://github.com/tokio-rs/tracing/commit/6acc204ea64dcf305001b16903b0f7bdbddc8924

pub struct SizeBasedFileAppender {
    writer: RwLock<File>,
    current_size: Arc<AtomicU64>,
    log_directory: PathBuf,
    log_filename_prefix: String,
    max_bytes: u64,
    max_files: usize,
}

impl SizeBasedFileAppender {
    pub fn new(
        directory: impl AsRef<Path>,
        filename_prefix: &str,
        max_bytes: u64,
        max_files: usize,
    ) -> Self {
        let log_directory = directory.as_ref().to_path_buf();

        prune_old_logs(&log_directory, filename_prefix, max_files);

        Self {
            writer: RwLock::new(
                create_writer(&log_directory, filename_prefix).expect("failed to create log file"),
            ),
            current_size: Arc::new(AtomicU64::new(0)),
            log_directory,
            log_filename_prefix: String::from(filename_prefix),
            max_bytes,
            max_files,
        }
    }

    fn get_valid_writer(&mut self) -> &mut File {
        let writer = self.writer.get_mut().unwrap();

        if self.current_size.load(Ordering::Acquire) >= self.max_bytes {
            prune_old_logs(
                &self.log_directory,
                &self.log_filename_prefix,
                self.max_files,
            );

            match create_writer(&self.log_directory, &self.log_filename_prefix) {
                Ok(new_writer) => {
                    if let Err(error) = writer.flush() {
                        eprintln!("Couldn't flush previous log writer: {error}");
                    }
                    *writer = new_writer;
                    self.current_size.store(0, Ordering::Release);
                }
                Err(error) => eprintln!("Couldn't create log writer: {error}"),
            }
        }

        writer
    }
}

impl Write for SizeBasedFileAppender {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        let writer = self.get_valid_writer();
        let written_bytes = writer.write(buf)?;
        self.current_size.fetch_add(
            u64::try_from(written_bytes).expect("usize to u64 conversion"),
            Ordering::SeqCst,
        );
        Ok(written_bytes)
    }

    fn flush(&mut self) -> std::io::Result<()> {
        self.writer.get_mut().unwrap().flush()
    }
}

fn prune_old_logs(log_directory: &Path, log_filename_prefix: &str, max_files: usize) {
    let files = fs::read_dir(log_directory);

    if let Err(error) = files {
        eprintln!("Error reading the log directory/files: {error}");
        return;
    }

    let mut files = files
        .unwrap()
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let metadata = entry.metadata().ok()?;

            if !metadata.is_file() {
                return None;
            }

            let filename = entry.file_name();
            let filename = filename.to_str()?;
            if !filename.starts_with(log_filename_prefix) {
                return None;
            }

            let created = metadata.created().ok()?;

            Some((entry, created))
        })
        .collect::<Vec<_>>();

    if files.len() < max_files {
        return;
    }

    files.sort_by_key(|(_, created)| *created);

    for (file, _) in files.iter().take(files.len() - (max_files - 1)) {
        if let Err(error) = fs::remove_file(file.path()) {
            let path = file.path();
            eprintln!("Failed to remove old log file {path:?}: {error}");
        }
    }
}

fn create_writer(directory: &Path, filename_prefix: &str) -> std::io::Result<File> {
    let datetime = Utc::now().format("%Y-%m-%d_%H-%M-%S");
    let path = directory.join(format!("{filename_prefix}.{datetime}"));

    let mut open_options = OpenOptions::new();
    open_options.append(true).create(true);

    let new_file = open_options.open(&path);
    if new_file.is_err() {
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
            return open_options.open(path);
        }
    }

    new_file
}
