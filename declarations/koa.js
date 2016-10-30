import type Server from 'http';

declare module 'koa' {

  declare type KoaError = Error & {
    expose?: boolean;
    status?: number;
    code?: string;
    headers?: Object;
  }

  declare class Application extends events$EventEmitter {
    use(
      middleware: (ctx: any, next: () => Promise<mixed>) => mixed
    ): Application;
    // copied from flow-typed/definitions/npm/express_v4.x.x
    listen(
      port: number,
      hostname?: string,
      backlog?: number,
      callback?: (err?: ?Error) => mixed
    ): Server;
    listen(
      port: number,
      hostname?: string,
      callback?: (err?: ?Error) => mixed
    ): Server;
    listen(port: number, callback?: (err?: ?Error) => mixed): Server;
    listen(path: string, callback?: (err?: ?Error) => mixed): Server;
    listen(handle: Object, callback?: (err?: ?Error) => mixed): Server;
  }

  declare module.exports: Class<Application>

}
