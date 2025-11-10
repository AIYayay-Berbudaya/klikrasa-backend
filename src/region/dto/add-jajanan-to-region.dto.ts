import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AddJajananToRegionDto {
    @IsMongoId()
    @IsNotEmpty()
    jajananId: string;
}