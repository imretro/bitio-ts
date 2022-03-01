import Reader from '../src/reader';

describe('Reader', () => {
  describe('readBit', () => {
    const bytes = new Uint8Array([0b00011011, 0b11011000]);
    const expectedBits = [
      0, 0, 0, 1, 1, 0, 1, 1,
      1, 1, 0, 1, 1, 0, 0, 0,
    ];

    test('expected bits', () => {
      const reader = new Reader(bytes);
      const result: Array<number | null> = [];

      for (let i = 0; i < 16; i += 1) {
        result.push(reader.readBit());
      }

      expect(result).toEqual(expectedBits);
    });

    test('no more to read', () => {
      const reader = new Reader(bytes);

      for (let i = 0; i < 16; i += 1) {
        reader.readBit();
      }

      expect(reader.readBit()).toBeNull();
    });
  });

  describe('bytesPerElement', () => {
    test('Uint32', () => {
      const reader = new Reader(new Uint32Array());

      expect(reader.bytesPerElement).toBe(4);
    });
  });

  describe('bitsPerElement', () => {
    test('Uint32', () => {
      const reader = new Reader(new Uint32Array());

      expect(reader.bitsPerElement).toBe(32);
    });
  });
});
