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
    owner: { type: String, required: true }, // Property owner as string (e.g., "John Doe")
    listingAgent: { type: Schema.Types.ObjectId, ref: 'User', required: true },

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
  { timestamps: true }, // Enable timestamps (createdAt, updatedAt)
);
PropertySchema.index({ coordinates: '2dsphere' });

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
  owner: string; // Directly set as a string (can be a name, address, etc., or just a reference)
  listingAgent: Schema.Types.ObjectId;
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
