FROM docker.io/library/node:18

WORKDIR /root
RUN curl -sSf https://sh.rustup.rs | sh -s -- -y --quiet
ENV PATH=/root/.cargo/bin:$PATH
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | bash
