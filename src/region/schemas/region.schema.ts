import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Region extends Document {
    @Prop({ required: true, unique: true })
    namaDaerah: string;

    @Prop({ required: true, enum: ['provinsi', 'kabupaten', 'kota'] })
    tipe: string;

    @Prop({ type: Number, required: true })
    lat: number;

    @Prop({ type: Number, required: true })
    lng: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Jajanan' }] })
    jajananList: Types.ObjectId[];

    @Prop()
    deskripsi?: string;

    @Prop()
    provinsi?: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);

RegionSchema.index({ namaDaerah: 'text' });
RegionSchema.index({ tipe: 1 });
RegionSchema.index({ lat: 1, lng: 1 });