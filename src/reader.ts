import type { Bit } from './types';

/**
 * Reads bits from a Uint* typed array.
 *
 * The number of bits per number depends on the size of the Uint. For example,
 * a `Uint16Array` results in 16 bits being read for each number in the array.
 *
 * Bits are read from *largest* to *smallest.* For example, with
 * `new Uint16Array([1, 1 << 15])`, `1` is the last bit read from the first
 * element, and the first bit read from the second element. This order is
 * left-to-right, assuming big-endian numbers.
 *
 * This acts as an iterator, meaning it is not possible to reverse a read.
 */
export default class Reader {
  private index = 0;

  private offset = 1;

  constructor(private readonly bytes: Uint8Array | Uint16Array | Uint32Array) {
  }

  /**
   * Reads a single [[Bit | bit]].
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

  /**
   * Collects multiple bits into a number.
   *
   * For example, if 16 bits were collected from
   * `new Uint8Array([0xAB, 0xCD])`, the resulting number is `0xABCD`.
   *
   * If `n` exceeds the number of available bits, an error will be thrown.
   *
   * @param n The number of bits to read.
   *
   * @returns The bits collected into a `number`.
   */
  public readBits(n: number): number {
    if (n > this.remaining) {
      throw new RangeError('n exceeds the number of remaining bits');
    }
    let result = 0;

    for (let i = 1; i <= n; i += 1) {
      const bit = this.readBit() as Bit;
      result |= bit << (n - i);
    }
    return result;
  }

  /**
   * Reads all remaining bits to a number. Equivalent to
   * `reader.readBits(reader.remaining)`.
   *
   * @returns The remaining bits.
   */
  public readAll(): number {
    return this.readBits(this.remaining);
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
   * The number of bits in each element in the typed array.
   */
  public get bitsPerElement(): number {
    return this.bytesPerElement * 8;
  }

  /**
   * The remaining number of bits that can be read.
   */
  public get remaining(): number {
    const allBits = this.bytes.length * this.bitsPerElement;
    return allBits - (this.index * this.bitsPerElement) - this.offset + 1;
  }

  /**
   * Iterates over [[Bit | bits]].
   *
   * When done, returns the number of bits read.
   *
   * @returns Number of bits read.
   */
  public* [Symbol.iterator](): Generator<Bit, number, void> {
    let count = 0;
    while (true) {
      const bit = this.readBit();
      if (bit == null) {
        return count;
      }
      yield bit;
      count += 1;
    }
  }
}
