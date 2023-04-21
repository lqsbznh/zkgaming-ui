# zkgaming-ui

## [Install rust](https://rustup.rs/)
``` bash
rustup -V
cargo -V
cargo add wasm-pack
```

## [Install node](https://nodejs.org/en)
``` bash
node -v
corepack enable
```

## Build wasm
``` bash
git clone git@github.com:lqsbznh/zkgaming-ui.git
cd zkgaming-ui
cd aleo/wasm
wasm-pack build --target web
```

## Installing Dependencies
```bash
cd ../sdk && npm i
```

## Run project
```bash
cd ../../zkgaming-ui/ && npm i && npm run dev
```

## Description
`./zkgaming-ui/src/page/.vue`
The game will start from 0 height, if you need to start a new game, you can change currentHeight to the latest height.