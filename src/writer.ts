import { Bit } from './types';
import BitIterator from './bit-iterator';

/**
 * Writes bits from a Uint* typed array.
 *
 * The number of bits per number depends on the size of the Uint. For example,
 * a `Uint16Array` results in 16 bits being written for each number in the array.
 *
 * Bits are written from *largest* to *smallest.* For example, if the result is
 * `Uint16Array([1, 1 << 15])`, `1` is the last bit written to the first
 * element, and the first bit written to the second element. This order is
 * left-to-right, assuming big-endian numbers.
 *
 * It is not possible to reverse a write.
 */
export default class Writer extends BitIterator {
  /**
   * Creates a writer that writes to `dst`.
   *
   * Currently, it is assumed that `dst` is empty. If it is not, bits that were
   * previously set may remain set.
   *
   * @param dst Where to write the bits to.
   */
  constructor(dst: Uint8Array | Uint16Array | Uint32Array) {
    super(dst);
  }

  /**
   * Writes a single [[Bit | bit]].
   *
   * Can fail if there is no more room to write bits.
   *
   * @returns `true` if the bit was successfully written.
   */
  public writeBit(bit: Bit): boolean {
    if (this.index >= this.bytes.length) {
      return false;
    }
    this.bytes[this.index] |= bit << (this.bitsPerElement - this.offset);
    this.nextOffset();

    return true;
  }

  /**
   * Writes multiple [[Bit | bits]].
   *
   * Can either take an array of bits, or the bits collected into a number. If
   * the bits are collected into a number, `n` is the number of bits to write.
   * This is to differentiate between `0` meaning no more bits and `0` being
   * leading zero bits. If the bits are collected into a number, then they will
   * be written from the largest bit to the smallest.
   *
   * For example, `{ bits: 0b1100, n: 5 }` and `[0, 1, 1, 0, 0]` are equivalent.
   *
   * This will silently fail when there is no more room to write bits. The
   * actual number of bits written can be determined by the return value.
   *
   * @param bits The bits to write.
   *
   * @returns The number of bits that were read.
   */
  writeBits(bits: Bit[] | { bits: number, n: number }): number {
    if (Array.isArray(bits)) {
      const writable = bits.slice(0, Math.min(bits.length, this.remaining));
      writable.forEach((bit) => this.writeBit(bit));
      return writable.length;
    }

    const { bits: bitNumber, n } = bits;

    if (n < 0) {
      throw new RangeError('n cannot be less than 0');
    }

    for (let i = 0; i < n; i += 1) {
      const shift = (n - i) - 1;
      if (!this.writeBit(((bitNumber >> shift) & 1) as Bit)) {
        return i;
      }
    }
    return n;
  }
}
