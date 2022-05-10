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

  describe('readBitsSafe', () => {
    test('collects bits into an array', () => {
      const bytes = new Uint8Array([0b10110101]);
      const reader = new Reader(bytes);

      expect(reader.readBitsSafe(9)).toEqual([1, 0, 1, 1, 0, 1, 0, 1, null]);
    });
  });

  describe('collectBits', () => {
    test('collects bits into a number', () => {
      expect(Reader.collectBits([1, 1, 0, 1])).toBe(0b1101);
    });

    test('returns 0 if there are no bits', () => {
      expect(Reader.collectBits([])).toBe(0);
    });
  });

  describe.each([
    [new Uint8Array([0xAB, 0x12, 0x34, 0x56])],
    [new Uint16Array([0xAB12, 0x3456])],
    [new Uint32Array([0xAB123456])],
  ])('readByte %p', (bytes) => {
    test('reads a byte', () => {
      const reader = new Reader(bytes);

      expect(reader.readByte()).toBe(0xAB);
      expect(reader.readByte()).toBe(0x12);
      expect(reader.readByte()).toBe(0x34);
      expect(reader.readByte()).toBe(0x56);
    });

    test('does not read when there is a partial unread byte', () => {
      const reader = new Reader(bytes);
      reader.readBit();

      expect(() => reader.readByte()).toThrow();
    });

    test('returns null when there are no more bytes to read', () => {
      const reader = new Reader(bytes);

      // NOTE Reading all bytes
      for (let i = 0; i < 4; i++) {
        reader.readByte();
      }

      expect(reader.readByte()).toBeNull();
    });
  });

  describe.each([
    [new Uint8Array([0xAB, 0x12, 0x34, 0x56])],
    [new Uint16Array([0xAB12, 0x3456])],
    [new Uint32Array([0xAB123456])],
  ])('readBytes %p', (bytes) => {
    test('reads two bytes', () => {
      const reader = new Reader(bytes);

      expect(reader.readBytes(2)).toEqual([0xAB, 0x12]);
    });

    test('reads null for extra bytes', () => {
      const reader = new Reader(bytes);

      expect(reader.readBytes(5)).toEqual([0xAB, 0x12, 0x34, 0x56, null]);
    });

    test('does not read when there is a partial unread byte', () => {
      const reader = new Reader(bytes);
      reader.readBit();

      expect(() => reader.readBytes(1)).toThrow();
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

  describe.each([
    ['Uint8', new Uint8Array([0, 0, 0, 0])],
    ['Uint16', new Uint16Array([0, 0])],
    ['Uint32', new Uint32Array([0])],
  ])('byteIndex (%s)', (_name, bytes) => {
    test.each([[0], [1], [2], [3]])('after reading %d bytes', (readCount) => {
      const reader = new Reader(bytes);
      for (let i = 0; i < readCount; i += 1) {
        reader.readBits(8);
      }
      expect(reader.byteIndex).toBe(readCount);
    });
  });

  test.each([
    { value: 0, done: false },
    { value: 1, done: false },
    { value: 0, done: false },
    { value: 1, done: false },
    { value: 0, done: false },
    { value: 1, done: false },
    { value: 0, done: false },
    { value: 1, done: false },
    { value: 8, done: true },
  ].map((want, i) => [i + 1, want]))('iterating %i times', (iterations, expected) => {
    const reader = new Reader(new Uint8Array([0x55]));
    const iter = reader[Symbol.iterator]();
    for (let i = 1; i < iterations; i += 1) {
      iter.next();
    }
    expect(iter.next()).toEqual(expected);
  });
});
