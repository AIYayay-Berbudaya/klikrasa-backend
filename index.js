const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

module.exports = async (req, res) => {
  const server = await bootstrap();
  server(req, res);
};
