import { PartialType } from '@nestjs/mapped-types';
import { CreateUmkmDto } from './create-umkm.dto';

export class UpdateUmkmDto extends PartialType(CreateUmkmDto) {}