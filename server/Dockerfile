FROM rust:1.81-slim-bookworm AS builder
RUN apt update && apt install -y libssl-dev pkg-config
# sqlx requires a mock database for compile-time validation
ENV DATABASE_URL=sqlite:sqlite.db?mode=rwc
RUN cargo install sqlx-cli --locked --no-default-features --features native-tls,sqlite
WORKDIR /app
COPY . .
RUN sqlx migrate run
RUN --mount=type=cache,target=/usr/local/cargo,from=rust:1-slim-bookworm,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --release && mv ./target/release/server ./server

FROM debian:bookworm-slim
# litefs requires ca-certificates and fuse3
# database backups require curl and cron
RUN apt update && apt install -y ca-certificates fuse3 curl cron sqlite3
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
COPY litefs.yml /etc/litefs.yml
COPY migrations migrations
# setup sqlite backups
COPY sqlite_backup.sh /app/sqlite_backup.sh
COPY crontab.sh /app/crontab.sh
RUN chmod +x /app/sqlite_backup.sh /app/crontab.sh
# app setup
ENV DATABASE_URL=sqlite:/litefs/sqlite.db?mode=rwc
ENV RUST_LOG="warn,server=info"
COPY --from=builder /app/server /app/server
ENTRYPOINT /app/crontab.sh && service cron start && litefs mount
