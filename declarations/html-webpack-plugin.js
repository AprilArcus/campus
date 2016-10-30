declare module 'html-webpack-plugin' {

  declare class HtmlWebpackPlugin {
    constructor(options: {
      template?: string,
      filename?: string,
      hash?: boolean,
      inject?: 'head' | 'body' | boolean,
      compile?: boolean,
      favicon?: boolean,
      minify?: Object | false, // an html-minifier options object
      cache?: boolean,
      showErrors?: boolean,
      chunks?: 'all' | Array<string>,
      excludeChunks?: Array<string>,
      chunksSortMode?: 'none' | 'auto' | 'dependency' |
        (a: any, b: any) => number,
      title?: string,
      xhtml?: boolean
    }): void;

    options: {
      template: string,
      filename: string,
      hash: boolean,
      inject: 'head' | 'body' | boolean,
      compile: boolean,
      favicon: boolean,
      minify: Object | false, // an html-minifier options object
      cache: boolean,
      showErrors: boolean,
      chunks: 'all' | Array<string>,
      excludeChunks: Array<string>,
      chunksSortMode?: 'none' | 'auto' | 'dependency' |
        (a: any, b: any) => number,
      title: string,
      xhtml: boolean
    }
  }

  declare module.exports: Class<HtmlWebpackPlugin>

}
