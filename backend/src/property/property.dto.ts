export class CreatePropertyDto {
  title!: string;
  description!: string;
  price!: number;
  currency!: string;
  propertyType!: string;
  address!: string;
  city!: string;
  image?: string;
  state!: string;
  country!: string;
  postalCode!: string;
  coordinates!: string;
  floor?: number;
  parkingSpaces?: number;
  balcony?: boolean;
  garden?: boolean;
  furnished?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  isFeatured?: boolean;
}

export class UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  propertyType?: string;
  address?: string;
  city?: string;
  image?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: string;
  floor?: number;
  parkingSpaces?: number;
  balcony?: boolean;
  garden?: boolean;
  furnished?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  isFeatured?: boolean;
}
