import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './createPage.dto';

export class UpdatePageDto extends PartialType(CreatePageDto) {}
