import Koa from 'koa';
import favicon from 'koa-favicon';
import secrets from './secrets';
import postgraphql from 'postgraphql';
import { extname, join } from 'path';
import staticMiddleware from 'koa-static';
import send from 'koa-send';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.js';
import webpackMiddleware from 'koa-webpack';
import chalk from 'chalk';

const app = new Koa();

app.use(favicon(__dirname + '/src/server/favicon.ico'));

const pgConfig = {
   ...secrets.mnemosyne,
   max: 10
};
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

app.use(async (ctx, next) => {
  if (ctx.method === 'GET' || ctx.method === 'HEAD') {
    await next();
  } else {
    ctx.status = ctx.method === 'OPTIONS' ? 200 : 405;
    ctx.set('Allow', 'GET, HEAD, OPTIONS');
  }
});

const index = join(
  webpackConfig.output.path,
  webpackConfig.plugins.filter(
    plugin => plugin.constructor.name === 'HtmlWebpackPlugin'
  ).pop().options.filename
);
if (process.env.NODE_ENV === 'production') {
  app.use(staticMiddleware(webpackConfig.output.path));
  app.use(async ctx => await send(ctx, index, { root: '/' }));
} else {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware({ compiler }));
  app.use(async ctx => {
    ctx.type = extname(index);
    ctx.body = await new Promise((resolve, reject) => {
      compiler.outputFileSystem.readFile(index, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  });
}

const port = 8080;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log('');
  console.log(
    `PostGraphQL server listening on port ${
      chalk.underline(port.toString())} 🚀`)
  console.log('');
  console.log(
    `  ‣ Connected to Postgres instance ${
      chalk.underline.blue(
        `postgres://localhost:${pgConfig.port}/${pgConfig.database}`
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
