import { Readable } from "stream";

export interface BlobLike {
  size: number;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  stream(): Readable;
}

export interface FileLike extends BlobLike {
  readonly lastModified: number;
  readonly name: string;
}

export class FileLikeImpl implements FileLike {
  private buffer: Buffer;
  public name: string;
  public lastModified: number;
  private mime: string;

  constructor(
    buffer: Buffer,
    name: string,
    options: { lastModified?: number; type?: string } = {}
  ) {
    this.buffer = buffer;
    this.name = name;
    this.lastModified = options.lastModified ?? Date.now();
    this.mime = options.type ?? "";
  }

  get size(): number {
    return this.buffer.length;
  }

  get type(): string {
    return this.mime;
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    const arrayBuffer = new ArrayBuffer(this.buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < this.buffer.length; ++i) {
      view[i] = this.buffer[i];
    }
    return Promise.resolve(arrayBuffer);
  }

  text(): Promise<string> {
    return Promise.resolve(this.buffer.toString("utf-8"));
  }

  stream(): Readable {
    const buffer = this.buffer; // 클래스의 buffer 속성을 로컬 변수에 할당
    const readable = new Readable({
      read() {
        this.push(buffer);
        this.push(null); // End the stream
      },
    });
    return readable;
  }
}
