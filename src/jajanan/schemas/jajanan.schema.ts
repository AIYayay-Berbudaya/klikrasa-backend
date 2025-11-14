import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Jajanan extends Document {
    @Prop({ required: true })
    nama_kue: string;

    @Prop()
    deskripsi: string;

    @Prop({ type: [String] })
    sejarah_kue: string[];

    @Prop()
    cara_pembuatan: string;

    @Prop()
    daerah_kue: string;

    @Prop()
    gambarUrl: string;

    @Prop()
    linksumber: string;

    @Prop()
    link_peta_administrasi: string;
}

export const JajananSchema = SchemaFactory.createForClass(Jajanan);

JajananSchema.index({ nama_kue: 'text', daerah_kue: 'text' });