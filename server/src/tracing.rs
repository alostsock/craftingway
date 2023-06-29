mod size_based_file_appender;

use size_based_file_appender::SizeBasedFileAppender;
use tracing_subscriber::{prelude::*, EnvFilter};

pub fn setup_tracing() -> tracing_appender::non_blocking::WorkerGuard {
    let stdout_log = tracing_subscriber::fmt::layer();

    let current_exe = std::env::current_exe().expect("couldn't obtain the path of this executable");
    let current_path = current_exe.parent().unwrap();
    let file_appender =
        SizeBasedFileAppender::new(current_path, "server.log", 10 * 1024 * 1024, 10);
    let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);
    let file_log = tracing_subscriber::fmt::layer()
        .with_writer(non_blocking)
        .with_ansi(false)
        .compact();

    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(stdout_log)
        .with(file_log)
        .init();

    guard
}
