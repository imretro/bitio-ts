import Writer from '../src/writer';

describe('Writer', () => {
  describe('Uint8', () => {
    describe('writeBit', () => {
      test('writes bits', () => {
        const bits = [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0];
        const dst = new Uint8Array(2);
        const writer = new Writer(dst);

        bits.forEach((b) => writer.writeBit(b));

        expect(writer[0]).toBe(0b10101111);
        expect(writer[1]).toBe(0b00001100);
      });
    });
  });
});