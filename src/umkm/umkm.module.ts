import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jajanan, JajananSchema } from '../jajanan/schemas/jajanan.schema';
import { Umkm, UmkmSchema } from './schemas/umkm.schema';
import { UmkmController } from './umkm.controller';
import { UmkmService } from './umkm.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Umkm.name, schema: UmkmSchema },
            { name: Jajanan.name, schema: JajananSchema },
        ]),
    ],
    controllers: [UmkmController],
    providers: [UmkmService],
    exports: [UmkmService],
})
export class UmkmModule { }