export class UpdateAdminAccessDto {
  data: {
    _id: string;
    access: boolean;
    persianName?: string;
    englishName?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
}
