import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Jajanan extends Document {
    @Prop({ required: true })
    nama: string;

    @Prop()
    daerah: string;

    @Prop({ type: [String] })
    bahanUtama: string[];

    @Prop()
    deskripsi: string;

    @Prop()
    ceritaBudaya: string;

    @Prop()
    gambarUrl: string;

    @Prop()
    rasa: string;

    @Prop()
    tekstur: string;
}

export const JajananSchema = SchemaFactory.createForClass(Jajanan);

// Tambahkan index untuk pencarian
JajananSchema.index({ nama: 'text', daerah: 'text' });