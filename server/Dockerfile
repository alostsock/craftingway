# Note that sqlx currently bundles libsqlite3. At the time of writing, the
# sqlite version used is 3.38.2.

FROM debian:bullseye-slim AS sqlite
RUN apt update && apt install -y build-essential curl
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

FROM rust:1-slim-bullseye AS builder
RUN apt update && apt install -y libssl-dev pkg-config
# sqlx requires a mock database for compile-time validation
ENV DATABASE_URL=sqlite:sqlite.db?mode=rwc
RUN cargo install sqlx-cli --no-default-features --features native-tls,sqlite
WORKDIR /app
COPY . .
RUN sqlx migrate run
RUN --mount=type=cache,target=/usr/local/cargo,from=rust:1-slim-bullseye,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --release && mv ./target/release/server ./server

FROM debian:bullseye-slim

# litefs requires ca-certificates and fuse3
# database backups require curl and cron
RUN apt update && apt install -y ca-certificates fuse3 curl cron
COPY --from=flyio/litefs:0.5.2 /usr/local/bin/litefs /usr/local/bin/litefs
COPY --from=sqlite /usr/bin/sqlite3 /usr/bin/sqlite3
COPY litefs.yml /etc/litefs.yml
COPY migrations migrations

# for sqlite backups
COPY sqlite_backup.sh /app/sqlite_backup.sh
COPY crontab.sh /app/crontab.sh
RUN chmod +x /app/sqlite_backup.sh /app/crontab.sh

# app setup
ENV DATABASE_URL=sqlite:/litefs/sqlite.db?mode=rwc
ENV RUST_LOG="warn,server=info"
COPY --from=builder /app/server /app/server

ENTRYPOINT /app/crontab.sh && service cron start && litefs mount
