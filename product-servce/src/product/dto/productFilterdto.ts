import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ProductFilterDto {
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  color: string | undefined;
  size: number | undefined;
  minWeight: number | undefined;
  maxWeight: number | undefined;
  search: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page: number | undefined;

  @Transform(({ value }) => {
    const x = parseInt(value);
    if (x > 50) return 50;

    return x;
  })
  @IsOptional()
  limit: number | undefined;
}
