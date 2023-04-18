import { UnixIntoReadablePipe } from "./unix-into-readable.pipe";

describe('UnixIntoReadablePipe', () => {
  let pipe = new UnixIntoReadablePipe();

  it('Should transform valid timestamp to valid HH:mm format', () => {
      const someValidTimestamp = "1681679100";

      const result = pipe.transform(someValidTimestamp);

      expect(result).toBe("00:05")
  });

  it('Should transform invalid timestamp to Invalid Date value', () => {
      const someInvalidTimestamp = "undefined";
      
      const result = pipe.transform(someInvalidTimestamp);

      expect(result).toBe("Invalid Date")
  });
});