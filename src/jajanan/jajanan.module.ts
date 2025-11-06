import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JajananController } from './jajanan.controller';
import { JajananService } from './jajanan.service';
import { Jajanan, JajananSchema } from './schemas/jajanan.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Jajanan.name, schema: JajananSchema },
        ]),
    ],
    controllers: [JajananController],
    providers: [JajananService],
    exports: [JajananService],
})
export class JajananModule { }