import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateUmkmDto {
    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsString()
    @IsOptional()
    kontak?: string;

    @IsString()
    @IsOptional()
    linkToko?: string;

    @IsString()
    @IsOptional()
    daerah?: string;

    @IsMongoId()
    @IsNotEmpty()
    jajananId: string;
}