import { IsString, IsOptional, IsArray, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateJajananDto {
    @IsString()
    @IsNotEmpty()
    nama_kue: string;

    @IsString()
    @IsOptional()
    deskripsi?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    sejarah_kue?: string[];

    @IsString()
    @IsOptional()
    cara_pembuatan?: string;

    @IsString()
    @IsOptional()
    daerah_kue?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    gambarUrl?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    linksumber?: string;
}