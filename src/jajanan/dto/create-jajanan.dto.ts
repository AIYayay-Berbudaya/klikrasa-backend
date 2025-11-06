import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateJajananDto {
    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsString()
    @IsOptional()
    daerah?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    bahanUtama?: string[];

    @IsString()
    @IsOptional()
    deskripsi?: string;

    @IsString()
    @IsOptional()
    ceritaBudaya?: string;

    @IsString()
    @IsOptional()
    gambarUrl?: string;

    @IsString()
    @IsOptional()
    rasa?: string;

    @IsString()
    @IsOptional()
    tekstur?: string;
}