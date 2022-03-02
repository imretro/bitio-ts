# bitio

[![npm](https://img.shields.io/npm/v/@imretro/bitio)](https://www.npmjs.com/package/@imretro/bitio)
[![CI](https://github.com/imretro/bitio-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/imretro/bitio-ts/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imretro/bitio-ts/branch/main/graph/badge.svg?token=QsT7nr21hY)](https://codecov.io/gh/imretro/bitio-ts)

I/O with bits

## Examples

### Node

```javascript
const { Reader } = require('@imretro/bitio');
const bytes = new Uint8Array([0xAB, 0xCD, 0xEF]);
const reader = new Reader(bytes);

console.log(reader.readBits(12)); // 2748 (0xABC)
```

## [Documentation](https://imretro.github.io/bitio-ts/)
