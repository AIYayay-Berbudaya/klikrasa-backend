import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJajananDto } from './dto/create-jajanan.dto';
import { UpdateJajananDto } from './dto/update-jajanan.dto';
import { Jajanan } from './schemas/jajanan.schema';

@Injectable()
export class JajananService {
    constructor(
        @InjectModel(Jajanan.name) private jajananModel: Model<Jajanan>,
    ) { }

    async create(createJajananDto: CreateJajananDto): Promise<Jajanan> {
        const createdJajanan = new this.jajananModel(createJajananDto);
        return createdJajanan.save();
    }

    async findAll(query?: any): Promise<Jajanan[]> {
        const { daerah, search, limit = 100, skip = 0 } = query || {};

        const filter: any = {};

        if (daerah) {
            filter.daerah = new RegExp(daerah, 'i');
        }

        if (search) {
            filter.$or = [
                { nama: new RegExp(search, 'i') },
                { deskripsi: new RegExp(search, 'i') },
                { daerah: new RegExp(search, 'i') },
            ];
        }

        return this.jajananModel
            .find(filter)
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    async findOne(id: string): Promise<Jajanan> {
        const jajanan = await this.jajananModel.findById(id).exec();

        if (!jajanan) {
            throw new NotFoundException(`Jajanan with ID ${id} not found`);
        }

        return jajanan;
    }

    async update(id: string, updateJajananDto: UpdateJajananDto): Promise<Jajanan> {
        const updatedJajanan = await this.jajananModel
            .findByIdAndUpdate(id, updateJajananDto, { new: true })
            .exec();

        if (!updatedJajanan) {
            throw new NotFoundException(`Jajanan with ID ${id} not found`);
        }

        return updatedJajanan;
    }

    async remove(id: string): Promise<void> {
        const result = await this.jajananModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`Jajanan with ID ${id} not found`);
        }
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
                { deskripsi: new RegExp(search, 'i') },
            ];
        }

        return this.jajananModel.countDocuments(filter).exec();
    }
}