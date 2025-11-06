import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Jajanan } from '../jajanan/schemas/jajanan.schema';
import { CreateUmkmDto } from './dto/create-umkm.dto';
import { UpdateUmkmDto } from './dto/update-umkm.dto';
import { Umkm } from './schemas/umkm.schema';

@Injectable()
export class UmkmService {
    constructor(
        @InjectModel(Umkm.name) private umkmModel: Model<Umkm>,
        @InjectModel(Jajanan.name) private jajananModel: Model<Jajanan>,
    ) { }

    async create(createUmkmDto: CreateUmkmDto): Promise<Umkm> {
        // Validasi jajanan exists
        const jajananExists = await this.jajananModel.findById(createUmkmDto.jajananId);
        if (!jajananExists) {
            throw new NotFoundException(`Jajanan dengan ID ${createUmkmDto.jajananId} tidak ditemukan`);
        }

        const createdUmkm = new this.umkmModel(createUmkmDto);
        return createdUmkm.save();
    }

    async findByJajananId(jajananId: string, query?: any): Promise<Umkm[]> {
        // Validasi MongoDB ObjectId
        if (!Types.ObjectId.isValid(jajananId)) {
            throw new BadRequestException('Invalid Jajanan ID format');
        }

        // Validasi jajanan exists
        const jajananExists = await this.jajananModel.findById(jajananId);
        if (!jajananExists) {
            throw new NotFoundException(`Jajanan dengan ID ${jajananId} tidak ditemukan`);
        }

        const { daerah, search, limit = 100, skip = 0 } = query || {};

        const filter: any = { jajananId: new Types.ObjectId(jajananId) };

        if (daerah) {
            filter.daerah = new RegExp(daerah, 'i');
        }

        if (search) {
            filter.$or = [
                { nama: new RegExp(search, 'i') },
                { daerah: new RegExp(search, 'i') },
            ];
        }

        return this.umkmModel
            .find(filter)
            .populate('jajananId', 'nama daerah gambarUrl')
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    async findAll(query?: any): Promise<Umkm[]> {
        const { daerah, search, limit = 100, skip = 0 } = query || {};

        const filter: any = {};

        if (daerah) {
            filter.daerah = new RegExp(daerah, 'i');
        }

        if (search) {
            filter.$or = [
                { nama: new RegExp(search, 'i') },
                { daerah: new RegExp(search, 'i') },
            ];
        }

        return this.umkmModel
            .find(filter)
            .populate('jajananId', 'nama daerah gambarUrl')
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    async findOne(id: string): Promise<Umkm> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid UMKM ID format');
        }

        const umkm = await this.umkmModel
            .findById(id)
            .populate('jajananId')
            .exec();

        if (!umkm) {
            throw new NotFoundException(`UMKM dengan ID ${id} tidak ditemukan`);
        }

        return umkm;
    }

    async update(id: string, updateUmkmDto: UpdateUmkmDto): Promise<Umkm> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid UMKM ID format');
        }

        // Validasi jajanan jika jajananId diupdate
        if (updateUmkmDto.jajananId) {
            const jajananExists = await this.jajananModel.findById(updateUmkmDto.jajananId);
            if (!jajananExists) {
                throw new NotFoundException(`Jajanan dengan ID ${updateUmkmDto.jajananId} tidak ditemukan`);
            }
        }

        const updatedUmkm = await this.umkmModel
            .findByIdAndUpdate(id, updateUmkmDto, { new: true })
            .populate('jajananId')
            .exec();

        if (!updatedUmkm) {
            throw new NotFoundException(`UMKM dengan ID ${id} tidak ditemukan`);
        }

        return updatedUmkm;
    }

    async remove(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid UMKM ID format');
        }

        const result = await this.umkmModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`UMKM dengan ID ${id} tidak ditemukan`);
        }
    }

    async countByJajananId(jajananId: string, query?: any): Promise<number> {
        const { daerah, search } = query || {};
        const filter: any = { jajananId: new Types.ObjectId(jajananId) };

        if (daerah) {
            filter.daerah = new RegExp(daerah, 'i');
        }

        if (search) {
            filter.$or = [
                { nama: new RegExp(search, 'i') },
                { daerah: new RegExp(search, 'i') },
            ];
        }

        return this.umkmModel.countDocuments(filter).exec();
    }

    async count(query?: any): Promise<number> {
        const { daerah, search } = query || {};
        const filter: any = {};

        if (daerah) {
            filter.daerah = new RegExp(daerah, 'i');
        }

        if (search) {
            filter.$or = [
                { nama: new RegExp(search, 'i') },
                { daerah: new RegExp(search, 'i') },
            ];
        }

        return this.umkmModel.countDocuments(filter).exec();
    }
}