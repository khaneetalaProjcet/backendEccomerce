import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class userFilterDto {

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
