// @flow

import Koa from 'koa';
import type { KoaError } from 'koa';
import favicon from 'koa-favicon';
import secrets from './secrets';
import postgraphql from 'postgraphql';
import { extname, join } from 'path';
import staticMiddleware from 'koa-static';
import send from 'koa-sendfile';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MemoryFileSystem from 'memory-fs';
import webpackMiddleware from 'koa-webpack';
import chalk from 'chalk';

const app = new Koa();

/* If we don't serve our own favicon, the PostGraphQL middleware will
 * serve the GraphQL logo on our behalf. */
app.use(favicon(__dirname + '/favicon.ico'));

/* Configure and mount PostGraphQL middleware */
const pgConfig = { ...secrets.mnemosyne, max: 10 };
const schemas = ['public'];
const graphqlRoute = '/graphql';
const graphiqlRoute = '/graphiql';
app.use(postgraphql(pgConfig, schemas, {
  classicIds: false,
  dynamicJson: false,
  disableDefaultMutations: false,
  graphqlRoute,
  graphiqlRoute,
  graphiql: true,
  jwtSecret: undefined,
  jwtPgTypeIdentifier: undefined,
  pgDefaultRole: undefined,
  watchPg: undefined,
  showErrorStack: undefined,
  disableQueryLog: false,
  enableCors: false
}));

/* The remaining routes are static assets built by webpack and should
 * only respond to the HTTP verbs GET and HEAD. */
app.use(async (ctx, next) => {
  if (ctx.method === 'GET' || ctx.method === 'HEAD') {
    await next();
  } else {
    ctx.status = ctx.method === 'OPTIONS' ? 200 : 405;
    ctx.set('Allow', 'GET, HEAD, OPTIONS');
  }
});

/* Suss out the absolute path to the index file generated by HTML
 * Webpack Plugin. We don't want to specify these paths separately in
 * both webpack.config.js and in the server. */
function getIndexPath (webpackConfig) {
  const htmlWebpackPlugin = webpackConfig.plugins.filter(
    plugin => plugin instanceof HtmlWebpackPlugin
  ).pop();
  if (!htmlWebpackPlugin) throw new Error(
    'No instance of HTML Webpack Plugin found in webpack config'
  );
  return join(
    webpackConfig.output.path,
    htmlWebpackPlugin.options.filename
  );
}
const indexPath = getIndexPath(webpackConfig);
if (process.env.NODE_ENV === 'production') {
  /* Serve the static assets built by webpack */
  app.use(staticMiddleware(webpackConfig.output.path));
  /* Serve index.html on a wildcard route to facillitate client-side
   * routing. In real life we'd like this to be accompanied by an
   * appropriate HTTP status code. */
  app.use(async ctx => await send(ctx, indexPath));
} else {
  /* same idea, but do it from webpack's in-memory filesystem. */
  const compiler = webpack(webpackConfig);
  /* webpack-dev-middleware and koa-webpack make it a breeze for files
   * in the manifest */
  app.use(webpackMiddleware({ compiler }));
  /* The wildcard route is trickier. We use a weird trick courtesy of
   * @jantimon to fish index.html out of memory.
   * https://github.com/ampedandwired/html-webpack-plugin/issues/145#issuecomment-170554832 */
  app.use(ctx => {
    if (compiler.outputFileSystem instanceof MemoryFileSystem) {
      /* FIXME 2016-10-31
       * While implementing this I encountered a variety of type errors
       * and felt that annotating the relevant objects would be prudent
       * should future refactoring prove necessary. However, it's very
       * difficult to get Flow to check this object!
       *
       * I don't understand why this cast is necessary in addition to
       * the runtime test refinement. I think it may have something to
       * do with the fact that I've declared the underlying type as a
       * global, $npm$memoryFs$MemoryFileSystem, so that it can be used
       * in the webpack declarations. It might also have something to do
       * with the use of commonJS exports over es6 exports, c.f.
       * https://github.com/facebook/flow/issues/2723 . Efforts to
       * produce a minimal testcase have been frustrating. */
      const outputFileSystem: MemoryFileSystem = compiler.outputFileSystem;
      try {
        ctx.body = outputFileSystem.readFileSync(indexPath);
        ctx.type = extname(indexPath);
      } catch (error) {
        error.expose = true;
        throw error;
      }
    } else {
      const error: KoaError = new Error(
        "The webpack compiler's output file system has not been" +
        'properly initialized by webpack-dev-middleware'
      );
      error.expose = true;
      throw error;
    }
  });
}

const port = 8080;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log('');
  console.log(
    `PostGraphQL server listening on port ${
      chalk.underline(port.toString())} `
  );
  console.log('');
  console.log(
    `  ‣ Connected to Postgres instance ${
      chalk.underline.blue(
        `postgres://${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`
      )
    }`
  );
  console.log(
    `  ‣ Introspected Postgres schema(s) ${
      schemas.map(schema => chalk.magenta(schema)).join(', ')
    }`
  );
  console.log(
    `  ‣ GraphQL endpoint served at ${
      chalk.underline(`http://localhost:${port}${graphqlRoute}`)
    }`
  );
  console.log(
    `  ‣ GraphiQL endpoint served at ${
      chalk.underline(`http://localhost:${port}${graphiqlRoute}`)
    }`
  );
  console.log('');
  console.log(chalk.gray('* * *'));
  console.log('');
  /* eslint-enable no-console */
});
