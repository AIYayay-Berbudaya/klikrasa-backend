import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Jajanan } from '../jajanan/schemas/jajanan.schema';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './schemas/region.schema';

@Injectable()
export class RegionService {
    constructor(
        @InjectModel(Region.name) private regionModel: Model<Region>,
        @InjectModel(Jajanan.name) private jajananModel: Model<Jajanan>,
    ) { }

    async create(createRegionDto: CreateRegionDto): Promise<Region> {
        const existingRegion = await this.regionModel.findOne({
            namaDaerah: createRegionDto.namaDaerah,
        });

        if (existingRegion) {
            throw new ConflictException(`Daerah ${createRegionDto.namaDaerah} sudah terdaftar`);
        }

        if (createRegionDto.jajananList && createRegionDto.jajananList.length > 0) {
            const jajananIds = createRegionDto.jajananList.map(id => new Types.ObjectId(id));
            const jajananCount = await this.jajananModel.countDocuments({
                _id: { $in: jajananIds },
            });

            if (jajananCount !== createRegionDto.jajananList.length) {
                throw new BadRequestException('Beberapa ID jajanan tidak valid');
            }
        }

        const createdRegion = new this.regionModel(createRegionDto);
        return createdRegion.save();
    }

    async findAll(query?: any): Promise<Region[]> {
        const { tipe, search, provinsi, limit = 100, skip = 0 } = query || {};

        const filter: any = {};

        if (tipe) {
            filter.tipe = tipe;
        }

        if (provinsi) {
            filter.provinsi = new RegExp(provinsi, 'i');
        }

        if (search) {
            filter.namaDaerah = new RegExp(search, 'i');
        }

        return this.regionModel
            .find(filter)
            .populate('jajananList', 'nama gambarUrl daerah rasa')
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    async findOne(id: string): Promise<Region> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid Region ID format');
        }

        const region = await this.regionModel
            .findById(id)
            .populate('jajananList')
            .exec();

        if (!region) {
            throw new NotFoundException(`Region dengan ID ${id} tidak ditemukan`);
        }

        return region;
    }

    async findByName(namaDaerah: string): Promise<Region> {
        const region = await this.regionModel
            .findOne({ namaDaerah: new RegExp(`^${namaDaerah}$`, 'i') })
            .populate('jajananList')
            .exec();

        if (!region) {
            throw new NotFoundException(`Region ${namaDaerah} tidak ditemukan`);
        }

        return region;
    }

    async findNearby(lat: number, lng: number, radiusKm: number = 100): Promise<Region[]> {
        const regions = await this.regionModel
            .find()
            .populate('jajananList', 'nama gambarUrl daerah rasa')
            .exec();

        return regions.filter(region => {
            const distance = this.calculateDistance(lat, lng, region.lat, region.lng);
            return distance <= radiusKm;
        });
    }

    async update(id: string, updateRegionDto: UpdateRegionDto): Promise<Region> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid Region ID format');
        }

        if (updateRegionDto.jajananList && updateRegionDto.jajananList.length > 0) {
            const jajananIds = updateRegionDto.jajananList.map(id => new Types.ObjectId(id));
            const jajananCount = await this.jajananModel.countDocuments({
                _id: { $in: jajananIds },
            });

            if (jajananCount !== updateRegionDto.jajananList.length) {
                throw new BadRequestException('Beberapa ID jajanan tidak valid');
            }
        }

        const updatedRegion = await this.regionModel
            .findByIdAndUpdate(id, updateRegionDto, { new: true })
            .populate('jajananList')
            .exec();

        if (!updatedRegion) {
            throw new NotFoundException(`Region dengan ID ${id} tidak ditemukan`);
        }

        return updatedRegion;
    }

    async addJajananToRegion(regionId: string, jajananId: string): Promise<Region> {
        if (!Types.ObjectId.isValid(regionId) || !Types.ObjectId.isValid(jajananId)) {
            throw new BadRequestException('Invalid ID format');
        }

        const jajanan = await this.jajananModel.findById(jajananId);
        if (!jajanan) {
            throw new NotFoundException(`Jajanan dengan ID ${jajananId} tidak ditemukan`);
        }

        const region = await this.regionModel.findById(regionId);
        if (!region) {
            throw new NotFoundException(`Region dengan ID ${regionId} tidak ditemukan`);
        }

        const jajananObjectId = new Types.ObjectId(jajananId);
        if (region.jajananList.some(id => id.equals(jajananObjectId))) {
            throw new ConflictException('Jajanan sudah ada di region ini');
        }

        region.jajananList.push(jajananObjectId);
        await region.save();

        return this.regionModel
            .findById(regionId)
            .populate('jajananList')
            .exec();
    }

    async removeJajananFromRegion(regionId: string, jajananId: string): Promise<Region> {
        if (!Types.ObjectId.isValid(regionId) || !Types.ObjectId.isValid(jajananId)) {
            throw new BadRequestException('Invalid ID format');
        }

        const region = await this.regionModel.findById(regionId);
        if (!region) {
            throw new NotFoundException(`Region dengan ID ${regionId} tidak ditemukan`);
        }

        const jajananObjectId = new Types.ObjectId(jajananId);
        region.jajananList = region.jajananList.filter(id => !id.equals(jajananObjectId));
        await region.save();

        return this.regionModel
            .findById(regionId)
            .populate('jajananList')
            .exec();
    }

    async remove(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid Region ID format');
        }

        const result = await this.regionModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`Region dengan ID ${id} tidak ditemukan`);
        }
    }

    async count(query?: any): Promise<number> {
        const { tipe, search, provinsi } = query || {};
        const filter: any = {};

        if (tipe) {
            filter.tipe = tipe;
        }

        if (provinsi) {
            filter.provinsi = new RegExp(provinsi, 'i');
        }

        if (search) {
            filter.namaDaerah = new RegExp(search, 'i');
        }

        return this.regionModel.countDocuments(filter).exec();
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radius bumi dalam km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
            Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    async getStatistics(): Promise<any> {
        const totalRegions = await this.regionModel.countDocuments();
        const byTipe = await this.regionModel.aggregate([
            { $group: { _id: '$tipe', count: { $sum: 1 } } },
        ]);

        const regionsWithJajanan = await this.regionModel.aggregate([
            { $match: { jajananList: { $exists: true, $ne: [] } } },
            { $project: { namaDaerah: 1, jajananCount: { $size: '$jajananList' } } },
            { $sort: { jajananCount: -1 } },
            { $limit: 10 },
        ]);

        return {
            totalRegions,
            byTipe,
            topRegionsWithMostJajanan: regionsWithJajanan,
        };
    }
}