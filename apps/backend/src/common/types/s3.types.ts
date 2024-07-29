import { Readable } from "node:stream";

export type S3Body =
  | string
  | Uint8Array
  | Buffer
  | Readable
  | ReadableStream
  | Blob;
