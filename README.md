# craftingway

[Craftingway](https://craftingway.app/) is a website that simulates the crafting system in FFXIV, similar to tools like [Teamcraft](https://github.com/ffxiv-teamcraft). It also has a [crafting solver](https://github.com/alostsock/crafty) built in that is able to simulate thousands or millions of possible crafting actions in just a few seconds, generating a crafting rotation based on the player's stats. The goal of this site is to provide an accessible way of creating improvised, ad hoc rotations quickly, without needing to follow a guide or tinker with a rotation for longer than necessary.

If you have questions, suggestions, or would like to contribute, please join the [Discord server](https://discord.gg/sKC4VxeMjY)!

## Demo

[demo.webm](https://user-images.githubusercontent.com/49344439/230846092-07c67043-f4c5-47f5-b700-0e4e54f2dff7.webm)

## FAQ

#### Isn't this site kinda useless since Teamcraft exists?
- Maybe. The first few iterations of this app were made just as an experiment that happened to work relatively well, so I figured I'd make a website out of it. I have received feedback from folks saying they enjoy the "no-frills" aspect of it, though.

#### There are some actions that don't exist in the app, like Hasty Touch and Rapid Synthesis. Will you be supporting these?
- While possible, this is unlikely due to the amount of effort and complexity it would add. I intend to keep gameplay elements that involve RNG out of scope for as long as possible, since it is not necessary to rely on it for normal crafting (yet -- we'll see what the future holds). Keeping rotations deterministic also improves the performance of the solver in two ways: 1) it limits the number of available moves, and 2) it reduces the amount of branching possibilities to consider.

#### Will you be supporting expert crafts?
- Probably not, for the reasons above.

#### How does the solver work?
- It uses [Monte Carlo tree search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) along with a few bits of [hard-coded logic](https://github.com/alostsock/crafty/blob/d788fedadb7fe01f219fef6e39d4bd8c9934386a/crafty/src/craft_state.rs#L156-L240).

## Development

The site itself is a relatively straightforward React app. However, it heavily relies on the [simulator/solver](https://github.com/alostsock/crafty), which is a library written in Rust and compiled to WASM with Javascript bindings. The simulator package is included as a git submodule. If you haven't interacted with submodules before, you'll need to run this after cloning the repo:

```sh
git submodule update --init
```

From here, there are two ways to develop: either with or without a container.

### Using the dev container

If you use VS Code, the editor should automatically detect the dev container and prompt you to use it when you open the project. After the container starts, it will start building the submodule.

Afterwards, run the following inside the container:

```sh
yarn run build-submodule # optional, if you want to rebuild the submodule
yarn install
yarn run dev
```

#### Podman

If you are on podman 4.4.x, downgrade to 4.3.x: https://github.com/containers/podman/issues/17313#issuecomment-1508452808

### Using a manually built container

You can build and run the container yourself with either `podman` or `docker`:

```sh
docker build -f Containerfile . -t craftingway
docker run --rm -it -v `pwd`:/usr/src craftingway bash
```

Then, run the `yarn` commands in the section above.

### Without a container

Running the app requires Node.js, the [yarn](https://classic.yarnpkg.com/lang/en/docs/install) package manager, the Rust toolchain, and [`wasm-pack`](https://rustwasm.github.io/wasm-pack/) for compilation. All of these should be installed. A couple scripts also kinda assume a Linux system -- if you're on Windows, I strongly recommend just using WSL.

After everything is installed, you should be able to build the submodule and run the app using the same `yarn` commands above.

### arm64 (including Apple silicon Macs)

`wasm-pack` 0.11.x supports arm64, but you will get "Error: no prebuilt wasm-opt binaries are available for this platform". Modify `crafty/web/Cargo.toml` as the error message suggests.
