import { inB, StringValue } from "./inb";

describe("inB", () => {
  it("should be 1B", () => {
    expect(inB("1 B")).toEqual(1);
    expect(inB("1B")).toEqual(1);
  });

  it("should be 1KB", () => {
    expect(inB("1 KB")).toEqual(1000);
    expect(inB("1KB")).toEqual(1000);
  });

  it("should be 1MB", () => {
    expect(inB("1 MB")).toEqual(10e5);
    expect(inB("1MB")).toEqual(10e5);
  });

  it("should be 1GB", () => {
    expect(inB("1 GB")).toEqual(10e8);
    expect(inB("1GB")).toEqual(10e8);
  });

  it("should be 1TB", () => {
    expect(inB("1 TB")).toEqual(10e11);
    expect(inB("1TB")).toEqual(10e11);
  });

  it("should be 1PB", () => {
    expect(inB("1 PB")).toEqual(10e14);
    expect(inB("1PB")).toEqual(10e14);
  });

  it("should be 512B", () => {
    expect(inB("512 B")).toEqual(512);
    expect(inB("512B")).toEqual(512);
  });

  it("should be 512KB", () => {
    expect(inB("512 KB")).toEqual(512e3);
    expect(inB("512KB")).toEqual(512e3);
  });

  it("should be 512MB", () => {
    expect(inB("512 MB")).toEqual(512e6);
    expect(inB("512MB")).toEqual(512e6);
  });

  it("should be 512GB", () => {
    expect(inB("512 GB")).toEqual(512e9);
    expect(inB("512GB")).toEqual(512e9);
  });

  it("should be 512TB", () => {
    expect(inB("512 TB")).toEqual(512e12);
    expect(inB("512TB")).toEqual(512e12);
  });

  it("should be 512PB", () => {
    expect(inB("512 PB")).toEqual(512e15);
    expect(inB("512PB")).toEqual(512e15);
  });

  it("should throw an error", () => {
    expect(() => inB("1" as StringValue)).toThrow("Invalid unit: ");
    expect(() => inB("1 pb" as StringValue)).toThrow("Invalid unit: pb");
  });
});
