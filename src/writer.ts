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
export default class Writer {
  constructor(private readonly dst: Uint8Array | Uint16Array | Uint32Array) {}
}
