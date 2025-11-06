import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UmkmService } from './umkm.service';
import { CreateUmkmDto } from './dto/create-umkm.dto';
import { UpdateUmkmDto } from './dto/update-umkm.dto';

@Controller('v1/api/umkm')
export class UmkmController {
    constructor(private readonly umkmService: UmkmService) { }

    @Post('daftar')
    @HttpCode(HttpStatus.CREATED)
    async daftar(@Body() createUmkmDto: CreateUmkmDto) {
        const umkm = await this.umkmService.create(createUmkmDto);
        return {
            success: true,
            message: 'UMKM berhasil didaftarkan',
            data: umkm,
        };
    }

    @Get(':idJajanan')
    async findByJajananId(
        @Param('idJajanan') idJajanan: string,
        @Query() query: any,
    ) {
        const [data, total] = await Promise.all([
            this.umkmService.findByJajananId(idJajanan, query),
            this.umkmService.countByJajananId(idJajanan, query),
        ]);

        return {
            success: true,
            message: 'Data UMKM berhasil diambil',
            data,
            meta: {
                total,
                limit: Number(query.limit) || 100,
                skip: Number(query.skip) || 0,
            },
        };
    }

    @Post(':idJajanan')
    @HttpCode(HttpStatus.CREATED)
    async createForJajanan(
        @Param('idJajanan') idJajanan: string,
        @Body() createUmkmDto: Omit<CreateUmkmDto, 'jajananId'>,
    ) {
        const umkm = await this.umkmService.create({
            ...createUmkmDto,
            jajananId: idJajanan,
        } as CreateUmkmDto);

        return {
            success: true,
            message: 'UMKM berhasil ditambahkan',
            data: umkm,
        };
    }

    @Get()
    async findAll(@Query() query: any) {
        const [data, total] = await Promise.all([
            this.umkmService.findAll(query),
            this.umkmService.count(query),
        ]);

        return {
            success: true,
            message: 'Data UMKM berhasil diambil',
            data,
            meta: {
                total,
                limit: Number(query.limit) || 100,
                skip: Number(query.skip) || 0,
            },
        };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUmkmDto: UpdateUmkmDto,
    ) {
        const umkm = await this.umkmService.update(id, updateUmkmDto);
        return {
            success: true,
            message: 'UMKM berhasil diupdate',
            data: umkm,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        await this.umkmService.remove(id);
        return {
            success: true,
            message: 'UMKM berhasil dihapus',
        };
    }
}