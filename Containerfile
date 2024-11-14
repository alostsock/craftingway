FROM docker.io/library/node:22-bookworm

RUN apt update && apt install sqlite3

USER node
WORKDIR /home/node
RUN curl -sSf https://sh.rustup.rs | sh -s -- -y --quiet
ENV PATH=/home/node/.cargo/bin:$PATH

RUN cargo install wasm-pack cargo-watch
RUN cargo install sqlx-cli --locked --no-default-features --features native-tls,sqlite
RUN rustup component add clippy
ENV DATABASE_URL=sqlite:sqlite.db?mode=rwc
ENV APP_URL=http://localhost:5173
