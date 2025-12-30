const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

module.exports = async (req, res) => {
  const server = await bootstrap();
  return server(req, res);
};
