export interface Property {
    _id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    propertyType?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      type: string;
      coordinates: [number, number]; // [latitude, longitude]
    };
    bedrooms?: number;
    bathrooms?: number;
    floor?: number; // optional, for properties with a specific floor number
    parkingSpaces?: number; // optional, number of parking spaces
    balcony?: boolean; // optional, if the property has a balcony
    garden?: boolean; // optional, if the property has a garden
    furnished?: boolean; // optional, if the property is furnished
    image?: string; // optional, array of image URLs
    
    isFeatured?: boolean; // optional, if the property is featured
   
    createdAt?: Date; // optional, the date when the property was listed
  }
  