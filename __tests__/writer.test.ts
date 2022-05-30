import type { Bit } from '../src/index';
import Writer from '../src/writer';

describe('Writer', () => {
  describe('Uint8', () => {
    describe('writeBit', () => {
      test('writes bits', () => {
        const bits: (0 | 1)[] = [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0];
        const dst = new Uint8Array(2);
        const writer = new Writer(dst);

        bits.forEach((b) => writer.writeBit(b));

        expect(dst[0]).toBe(0b10101111);
        expect(dst[1]).toBe(0b00001100);
      });
    });
  });

  describe('writeBit', () => {
    test.each([
      [new Uint8Array(1), 8],
      [new Uint16Array(1), 16],
      [new Uint32Array(1), 32],
    ])("%p doesn't return false until %d bits written to it", (dst, bits) => {
      const writer = new Writer(dst);
      for (let i = 0; i < bits; i += 1) {
        expect(writer.writeBit(0)).toBe(true);
      }
      expect(writer.writeBit(0)).toBe(false);
    });
  });

  describe('writeBits', () => {
    test.each([
      [[0, 0, 1, 1, 0, 1, 0, 1] as Bit[], 8, 0b00110101],
      [{ bits: 0b00110101, n: 8 }, 8, 0b00110101],
      [[0, 0, 0, 1, 1, 0, 1, 0, 1] as Bit[], 8, 0b00011010],
      [{ bits: 0b00110101, n: 9 }, 8, 0b00011010],
    ])('writeBits(%p) writes %d bits: %d', (bits, expectedCount, expectedBits) => {
      const dst = new Uint8Array(1);
      const writer = new Writer(dst);

      const count = writer.writeBits(bits);
      expect(dst[0]).toBe(expectedBits);
      expect(count).toBe(expectedCount);
    });
  });

  test('throws when n < 0', () => {
    const writer = new Writer(new Uint8Array(0));

    expect(() => writer.writeBits({ bits: 0, n: -1 })).toThrow(RangeError);
  });
});
