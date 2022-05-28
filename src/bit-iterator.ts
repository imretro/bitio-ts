/**
 * @ignore
 * @internal
 *
 * Base class for [[`Reader`]] and [[`Writer`]] to iterate over bits.
 */
export default abstract class BitIterator {
  protected index = 0;

  protected offset = 1;

  constructor(protected readonly bytes: Uint8Array | Uint16Array | Uint32Array) {}

  protected nextOffset(n = 1) {
    this.offset += n;
    if (this.offset > this.bitsPerElement) {
      this.nextNumber();
    }
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
   * The remaining number of bits that can be iterated over.
   */
  public get remaining(): number {
    const allBits = this.bytes.length * this.bitsPerElement;
    return allBits - (this.index * this.bitsPerElement) - this.offset + 1;
  }

  /**
   * The "index" of the byte that the iterator is on.
   *
   * Also can be used as a count of the bytes that have been iterated over.
   */
  public get byteIndex(): number {
    return (this.index * this.bytesPerElement)
      + Math.floor((this.offset - 1) / 8);
  }

  /**
   * The total number of bytes in the underlying array.
   */
  protected get byteCount(): number {
    return this.bytesPerElement * this.bytes.length;
  }
}
