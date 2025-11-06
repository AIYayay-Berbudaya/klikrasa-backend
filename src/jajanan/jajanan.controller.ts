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
import { JajananService } from './jajanan.service';
import { CreateJajananDto } from './dto/create-jajanan.dto';
import { UpdateJajananDto } from './dto/update-jajanan.dto';

@Controller('v1/api/jajanan')
export class JajananController {
    constructor(private readonly jajananService: JajananService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createJajananDto: CreateJajananDto) {
        const jajanan = await this.jajananService.create(createJajananDto);
        return {
            success: true,
            message: 'Jajanan berhasil ditambahkan',
            data: jajanan,
        };
    }

    @Get()
    async findAll(@Query() query: any) {
        const [data, total] = await Promise.all([
            this.jajananService.findAll(query),
            this.jajananService.count(query),
        ]);

        return {
            success: true,
            message: 'Data jajanan berhasil diambil',
            data,
            meta: {
                total,
                limit: Number(query.limit) || 100,
                skip: Number(query.skip) || 0,
            },
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const jajanan = await this.jajananService.findOne(id);
        return {
            success: true,
            message: 'Data jajanan berhasil diambil',
            data: jajanan,
        };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateJajananDto: UpdateJajananDto,
    ) {
        const jajanan = await this.jajananService.update(id, updateJajananDto);
        return {
            success: true,
            message: 'Jajanan berhasil diupdate',
            data: jajanan,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        await this.jajananService.remove(id);
        return {
            success: true,
            message: 'Jajanan berhasil dihapus',
        };
    }
}