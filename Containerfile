FROM docker.io/library/node:18

# https://github.com/diesel-rs/diesel/blob/c5a9f7b7fc9d1ebd7b02aa49fd861e78933906c4/.github/workflows/ci.yml#L75-L109
RUN curl -sSf -o sqlite-autoconf-3380200.tar.gz https://sqlite.org/2022/sqlite-autoconf-3380200.tar.gz \
    && tar zxf sqlite-autoconf-3380200.tar.gz
WORKDIR sqlite-autoconf-3380200
RUN CFLAGS="$CFLAGS -O2 -fno-strict-aliasing \
      -DSQLITE_DEFAULT_FOREIGN_KEYS=1 \
      -DSQLITE_SECURE_DELETE \
      -DSQLITE_ENABLE_COLUMN_METADATA \
      -DSQLITE_ENABLE_FTS3_PARENTHESIS \
      -DSQLITE_ENABLE_RTREE=1 \
      -DSQLITE_SOUNDEX=1 \
      -DSQLITE_ENABLE_UNLOCK_NOTIFY \
      -DSQLITE_OMIT_LOOKASIDE=1 \
      -DSQLITE_ENABLE_DBSTAT_VTAB \
      -DSQLITE_ENABLE_UPDATE_DELETE_LIMIT=1 \
      -DSQLITE_ENABLE_LOAD_EXTENSION \
      -DSQLITE_ENABLE_JSON1 \
      -DSQLITE_LIKE_DOESNT_MATCH_BLOBS \
      -DSQLITE_THREADSAFE=1 \
      -DSQLITE_ENABLE_FTS3_TOKENIZER=1 \
      -DSQLITE_MAX_SCHEMA_RETRY=25 \
      -DSQLITE_ENABLE_PREUPDATE_HOOK \
      -DSQLITE_ENABLE_SESSION \
      -DSQLITE_ENABLE_STMTVTAB \
      -DSQLITE_MAX_VARIABLE_NUMBER=250000" \
    ./configure --prefix=/usr \
      --enable-threadsafe \
      --enable-dynamic-extensions \
      --libdir=/usr/lib/x86_64-linux-gnu \
      --libexecdir=/usr/lib/x86_64-linux-gnu/sqlite3
RUN make && make install

USER node
WORKDIR /home/node
RUN curl -sSf https://sh.rustup.rs | sh -s -- -y --quiet
ENV PATH=/home/node/.cargo/bin:$PATH

RUN cargo install wasm-pack cargo-watch
RUN cargo install sqlx-cli --no-default-features --features native-tls,sqlite
RUN rustup component add clippy
ENV DATABASE_URL=sqlite:sqlite.db?mode=rwc
ENV APP_URL=http://localhost:5173
