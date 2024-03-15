# frontend
Decompilation of the Kasm Workspaces frontend with fixes to use free packages and to make webpack happy.

**Info**: The original sourcemaps are gzipped as they are extremely large.

## How to Build?
```bash
cd kasmweb/
npm i --legacy-peer-deps
node build.cjs
```
**DO NOT build this using Webpack, as it will take an extremely long amount of time. ESBuild is so much faster.**

## `TODO`:

- **Mapping Webpack'd files**:
- [x] Map `webpack_out_audio` to `assets/audio`
- [x] Map `webpack_out_fonts` to `assets/images` and `assets/public/img` (maybe?)
- [x] Combine `webpack_out_img` into `assets/public/img`

- **Other**
- [x] Make a `package.json` file from `node_modules`
- [x] Somehow find a way to build this mess
- [ ] Does this even work?
