import { Schema, Document } from 'mongoose';

export const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'AED' },
    propertyType: { type: String, default: 'Apartment' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
    bedrooms: { type: Number, required: false },
    floor: { type: Number, required: false },
    parkingSpaces: { type: Number, required: false },
    balcony: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    bathrooms: { type: Number, required: false },
    isFeatured: { type: Boolean, default: false },
    image: { type: String, required: false },
  },
  { timestamps: true } // Enable timestamps (createdAt, updatedAt)
);

export interface Property extends Document {
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: { type: string; coordinates: [number, number] };
  bedrooms?: number;
  bathrooms?: number;
  isFeatured?: boolean;
  floor?: number;
  parkingSpaces?: number;
  balcony?: boolean;
  garden?: boolean;
  furnished?: boolean;
  image?: string;
  createdAt: Date; // This field will now be automatically populated
  updatedAt: Date; // This field will now be automatically populated
}
