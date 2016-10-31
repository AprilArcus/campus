declare module 'webpack' {

  declare type LoaderCondition =
    RegExp | string | (absPath: string) => boolean;

  declare type LoadersConfig = Array<{|
    test?: LoaderCondition | LoaderCondition[],
    exclude?: LoaderCondition | LoaderCondition[],
    include?: LoaderCondition | LoaderCondition[],
    loader?: string,
    loaders?: string[]
  |}>;

  declare type ResolveConfig = {|
    alias?: { [key: string]: string },
    root?: string | string[],
    modulesDirectories?: string[],
    fallback?: string | string[],
    extensions?: string[],
    packageMains?: Array<string | string[]>,
    packageAlias?: any,
    unsafeCache?: RegExp[] | RegExp | true
  |};

  declare type ExternalsConfig = string |
    { [key: string]: boolean | string | string[] } |
    ( context: any,
      request: any,
      callback: (err: any, result: any) => mixed
    ) => mixed |
    RegExp |
    ExternalsConfig[];


  declare type Configuration = {|
    context?: string,
    entry: string | string[] | { [key: string]: string | string[] },
    output?: string | {|
      filename?: string,
      path?: string,
      publicPath?: string,
      chunkFilename?: string,
      sourceMapFilename?: string,
      devtoolModuleFilenameTemplate?: string,
      devtoolFallbackModuleFilenameTemplate?: string,
      devtoolLineToLine?: boolean |
        {| test: boolean, include: boolean, exclude: boolean |},
      hotUpdateChunkFilename?: string,
      hotUpdateMainFilename?: string,
      jsonpFunction?: string,
      hotUpdateFunction?: string,
      pathinfo?: boolean,
      library?: string,
      libraryTarget?: 'var' | 'this' | 'commonjs' | 'commonjs2' |
        'amd' | 'umd',
      umdNamedDefine?: true,
      sourcePrefix?: string,
      crossOriginLoading?: false | 'anonymous' | 'use-credentials',
    |},
    module?: {|
      loaders?: LoadersConfig,
      preLoaders?: LoadersConfig,
      postLoaders?: LoadersConfig,
      noParse?: RegExp | RegExp[],
      unknownContextRequest?: string,
      unknownContextRecursive?: boolean,
      unknownContextRegExp?: RegExp,
      unknownContextCritical?: boolean,
      exprContextRequest?: string,
      exprContextRecursive?: boolean,
      exprContextRegExp?: RegExp,
      exprContextCritical?: boolean,
      wrappedContextRecursive?: boolean,
      wrappedContextRegExp?: RegExp,
      wrappedContextCritical?: boolean
    |},
    resolve?: ResolveConfig & {|
      resolveLoader: ResolveConfig & {| moduleTemplates: string[] |}
    |},
    externals?: ExternalsConfig,
    target?: 'web' | 'webworker' | 'node' | 'async-node' |
      'node-webkit' | 'electron',
    bail?: boolean,
    profile?: boolean,
    cache?: boolean | Object,
    watch?: boolean,
    watchOptions?: {|
      aggregateTimeout?: number,
      poll?: true | number
    |},
    debug?: boolean,
    devtool?: string,
    devServer?: any,
    node?: {
      console: boolean,
      global: boolean,
      process: boolean | 'mock',
      Buffer: boolean,
      __filename: boolean | 'mock',
      __dirname: boolean | 'mock'
    },
    amd?: Object,
    loader?: Object,
    recordsPath?: string,
    recordsInputPath?: string,
    recordsOutputPath?: string,
    plugins: any[],
  |};

  // dummy types
  declare type NodeOutputFileSystem = mixed;

  declare class Compiler {
    outputFileSystem: null |
      NodeOutputFileSystem |
      $npm$memoryFs$MemoryFileSystem;
  }

  declare module.exports: (
  	options: Configuration | Configuration[],
    callback?: (err: any, stats: any) => mixed
  ) => Compiler

}
