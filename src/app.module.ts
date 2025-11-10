import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JajananModule } from './jajanan/jajanan.module';
import { UmkmModule } from './umkm/umkm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('Connected to MongoDB Atlas');
        });
        connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        return connection;
      },
    }),
    JajananModule,
    UmkmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
