import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateRegionDto {
    @IsString()
    @IsNotEmpty()
    namaDaerah: string;

    @IsEnum(['provinsi', 'kabupaten', 'kota'])
    @IsNotEmpty()
    tipe: string;

    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsNumber()
    @IsNotEmpty()
    lng: number;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    jajananList?: string[];

    @IsString()
    @IsOptional()
    deskripsi?: string;

    @IsString()
    @IsOptional()
    provinsi?: string;
}