import type { Bit } from './types';

type Bytes = Uint8Array | Uint16Array | Uint32Array;

/**
 * Reads bits from a Uint* typed array.
 *
 * The number of bits per number depends on the size of the Uint. For example,
 * a `Uint8Array` results in 8 bits being read for each number in the array.
 *
 * Bits are read from *largest* to *smallest.* For example, with
 * `new Uint8Array([1, 1 << 7])`, `1` is the last bit read from the first
 * element, and the first bit read from the second element. This order is
 * left-to-right, assuming little-endian numbers.
 *
 * This acts as an iterator, meaning it is not possible to reverse a read.
 */
export default class Reader {
  private index = 0;

  private offset = 1;

  private readonly bytes: Bytes;

  constructor(bytes: Bytes) {
    this.bytes = bytes;
  }

  /**
   * Reads a single bit.
   *
   * @returns A single bit, or null if there are no more bits to read.
   */
  public readBit(): Bit | null {
    if (this.index >= this.bytes.length) {
      return null;
    }

    const bit = this.bytes[this.index] >> (this.bitsPerElement - this.offset);

    this.offset += 1;
    if (this.offset > this.bitsPerElement) {
      this.nextNumber();
    }

    return (bit & 1) === 0 ? 0 : 1;
  }

  private nextNumber(): void {
    this.index += 1;
    this.offset = 1;
  }

  /**
   * The number of bytes in each element in the typed array.
   */
  public get bytesPerElement(): number {
    return this.bytes.BYTES_PER_ELEMENT;
  }

  /**
   * The number of bits in each lement in the typed array.
   */
  public get bitsPerElement(): number {
    return this.bytesPerElement * 8;
  }
}
