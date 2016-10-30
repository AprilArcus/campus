declare module 'memory-fs' {

  declare class MemoryFileSystemError extends Error {
    constructor(
      err: {code: string, errno: number, description: string},
      path: string
    ): void;
    code: string;
    errno: number;
    message: string;
    path: string;
  }

  declare class MemoryFileSystem {
    constructor(data?: Object): void;
    meta(path: string): ?string;
    existsSync(path: string): boolean;
    statSync(path: string): {
      isFile: () => boolean,
      isDirectory: () => boolean,
      isBlockDevice: () => boolean,
      isCharacterDevice: () => boolean,
      isSymbolicLink: () => boolean,
      isFIFO: () => boolean,
      isSocket: () => boolean
    };
    readFileSync(path: string, encoding?: buffer$Encoding): string;
    readdirSync(path: string): string[];
    mkdirpSync(path: string): void;
    mkdirSync(path: string): void;
    rmdirSync(path: string): void;
    unlinkSync(path: string): void;
    readlinkSync(path: string): void;
    writeFileSync(
      path: string, content: string | Buffer, encoding: buffer$Encoding
    ): void;
    join(path: string, request?: string): string;
    pathToArray(path: string): string[];
    normalize(path: string): string;
    createReadStream(
      path: string, options?: {start?: number, end?: number}
    ): stream$Readable;
    createWriteStream(path: string): stream$Writable;
    stat(
      path: string,
      callback: (
        error: MemoryFileSystemError,
        result: {
          isFile: () => boolean,
          isDirectory: () => boolean,
          isBlockDevice: () => boolean,
          isCharacterDevice: () => boolean,
          isSymbolicLink: () => boolean,
          isFIFO: () => boolean,
          isSocket: () => boolean
        }
      ) => mixed
    ): void;
    readdir(
      path: string,
      callback: (
        error: MemoryFileSystemError, result: string[]
      ) => mixed
    ): void;
    mkdirp(
      path: string, callback: (error: MemoryFileSystemError) => mixed
    ): void;
    rmdir(
      path: string, callback: (error: MemoryFileSystemError) => mixed
    ): void;
    unlink(
      path: string, callback: (error: MemoryFileSystemError) => mixed
    ): void;
    readlink(
      path: string, callback: (error: MemoryFileSystemError) => mixed
    ): void;
    mkdir(
      path: string, callback: (error: MemoryFileSystemError) => mixed
    ): void;
    readFile(
      path: string, callback: (error: MemoryFileSystemError) => mixed
    ): void;
    readFile(
      path: string,
      encoding: buffer$Encoding,
      callback: (error: MemoryFileSystemError, result: string) => mixed
    ): void;
    exists(path: string, callback: (result: boolean) => mixed): void;
    writeFile(
      path: string,
      content: string | Buffer,
      callback: (error: MemoryFileSystemError) => mixed
    ): void;
    writeFile(
      path: string,
      content: string | Buffer,
      encoding: buffer$Encoding,
      callback: (error: MemoryFileSystemError) => mixed
    ): void;
  }

  declare module.exports: Class<MemoryFileSystem>

}
