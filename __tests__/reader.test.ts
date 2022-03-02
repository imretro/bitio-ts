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

  describe('readBits', () => {
    describe('Uint16', () => {
      const bytes = new Uint16Array([0x1234, 0xABCD]);

      test('sums up bits', () => {
        const reader = new Reader(bytes);

        const result = reader.readBits(32);

        expect(result).toBe(0x1234ABCD);
      });

      test('n too large', () => {
        const reader = new Reader(bytes);

        expect(() => reader.readBits(33)).toThrow();
      });
    });
  });

  describe('readAll', () => {
    describe('Uint8', () => {
      const bytes = new Uint8Array([0x12, 0x34, 0x56]);

      test('read all bits', () => {
        const reader = new Reader(bytes);

        expect(reader.readAll()).toBe(0x123456);
      });

      test('read remaining bits', () => {
        const reader = new Reader(bytes);
        reader.readBits(4);

        expect(reader.readAll()).toBe(0x23456);
      });
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

  describe('remaining', () => {
    test('Uint32', () => {
      const reader = new Reader(new Uint32Array([0, 0, 0]));

      expect(reader.remaining).toBe(96);
      reader.readBit();
      expect(reader.remaining).toBe(95);
      for (let i = 0; i < 32; i += 1) {
        reader.readBit();
      }
      expect(reader.remaining).toBe(63);

      for (let i = 0; i < 63; i += 1) {
        reader.readBit();
      }
      expect(reader.remaining).toBe(0);
      reader.readBit();
      expect(reader.remaining).toBe(0);
    });
  });
});
