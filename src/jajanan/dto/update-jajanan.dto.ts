import { PartialType } from '@nestjs/mapped-types';
import { CreateJajananDto } from './create-jajanan.dto';

export class UpdateJajananDto extends PartialType(CreateJajananDto) {}