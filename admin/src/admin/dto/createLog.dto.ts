export class CreateLogDto {
  // @IsEnum(['info', 'warn', 'error', 'debug'])
  level: 'info' | 'warn' | 'error' | 'debug';

  // @IsString()
  serviceName: string;

  // @IsString()
  message: string;

  firstName: string;

  lastName: string;

  // @IsObject()
  // @IsOptional()
  metadata?: Record<string, any>;

  // @IsISO8601()
  timestamp: string;

  // @IsString()
  // @IsOptional()
  traceId?: string;

  // @IsEnum(['admin', 'user'])
  role: 'admin' | 'user';
}
