import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Umkm extends Document {
    @Prop({ required: true })
    nama: string;

    @Prop()
    kontak: string;

    @Prop()
    linkToko: string;

    @Prop()
    daerah: string;

    @Prop({ type: Types.ObjectId, ref: 'Jajanan', required: true })
    jajananId: Types.ObjectId;
}

export const UmkmSchema = SchemaFactory.createForClass(Umkm);

// Index untuk performa pencarian
UmkmSchema.index({ jajananId: 1 });
UmkmSchema.index({ daerah: 'text', nama: 'text' });