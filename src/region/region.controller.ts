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
    Patch,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { AddJajananToRegionDto } from './dto/add-jajanan-to-region.dto';

@Controller('v1/api/region')
export class RegionController {
    constructor(private readonly regionService: RegionService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createRegionDto: CreateRegionDto) {
        const region = await this.regionService.create(createRegionDto);
        return {
            success: true,
            message: 'Region berhasil ditambahkan',
            data: region,
        };
    }

    @Get()
    async findAll(@Query() query: any) {
        const [data, total] = await Promise.all([
            this.regionService.findAll(query),
            this.regionService.count(query),
        ]);

        return {
            success: true,
            message: 'Data region berhasil diambil',
            data,
            meta: {
                total,
                limit: Number(query.limit) || 100,
                skip: Number(query.skip) || 0,
            },
        };
    }

    @Get('nearby')
    async findNearby(@Query() query: any) {
        const { lat, lng, radius = 100 } = query;

        if (!lat || !lng) {
            return {
                success: false,
                message: 'Parameter lat dan lng harus diisi',
            };
        }

        const data = await this.regionService.findNearby(
            Number(lat),
            Number(lng),
            Number(radius),
        );

        return {
            success: true,
            message: 'Region terdekat berhasil ditemukan',
            data,
            meta: {
                center: { lat: Number(lat), lng: Number(lng) },
                radiusKm: Number(radius),
                found: data.length,
            },
        };
    }

    @Get('statistics')
    async getStatistics() {
        const stats = await this.regionService.getStatistics();
        return {
            success: true,
            message: 'Statistik region berhasil diambil',
            data: stats,
        };
    }

    @Get('name/:namaDaerah')
    async findByName(@Param('namaDaerah') namaDaerah: string) {
        const region = await this.regionService.findByName(namaDaerah);
        return {
            success: true,
            message: 'Data region berhasil diambil',
            data: region,
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const region = await this.regionService.findOne(id);
        return {
            success: true,
            message: 'Data region berhasil diambil',
            data: region,
        };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRegionDto: UpdateRegionDto,
    ) {
        const region = await this.regionService.update(id, updateRegionDto);
        return {
            success: true,
            message: 'Region berhasil diupdate',
            data: region,
        };
    }

    @Patch(':id/jajanan')
    async addJajanan(
        @Param('id') id: string,
        @Body() addJajananDto: AddJajananToRegionDto,
    ) {
        const region = await this.regionService.addJajananToRegion(
            id,
            addJajananDto.jajananId,
        );
        return {
            success: true,
            message: 'Jajanan berhasil ditambahkan ke region',
            data: region,
        };
    }

    @Delete(':id/jajanan/:jajananId')
    async removeJajanan(
        @Param('id') id: string,
        @Param('jajananId') jajananId: string,
    ) {
        const region = await this.regionService.removeJajananFromRegion(id, jajananId);
        return {
            success: true,
            message: 'Jajanan berhasil dihapus dari region',
            data: region,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        await this.regionService.remove(id);
        return {
            success: true,
            message: 'Region berhasil dihapus',
        };
    }
}