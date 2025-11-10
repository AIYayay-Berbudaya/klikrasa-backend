import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jajanan, JajananSchema } from '../jajanan/schemas/jajanan.schema';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { Region, RegionSchema } from './schemas/region.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Region.name, schema: RegionSchema },
            { name: Jajanan.name, schema: JajananSchema },
        ]),
    ],
    controllers: [RegionController],
    providers: [RegionService],
    exports: [RegionService],
})
export class RegionModule { }
