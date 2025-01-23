import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '@elastic/elasticsearch';
import { Property } from 'src/property/property.schema';
const nlp = require('compromise');

interface CompromiseDocument {
  locations: () => string[];
}

@Injectable()
export class ElasticsearchService {
  private readonly logger = new Logger(ElasticsearchService.name);
  private client: Client;

  
  constructor(@InjectModel('Property') private propertyModel: Model<Property>) {
    this.client = new Client({
      node: process.env.ELASTIC_SEARCH_URL,
      auth: {
        apiKey: process.env.ELASTIC_SEARCH_API_KEY,
      },
    });
  }

  async syncPropertiesToElasticSearch() {
    try {
      const properties = await this.propertyModel.find().exec();
      console.log(`Found ${properties.length} properties in MongoDB`);

      const bulkOps = [];
      properties.forEach((property) => {
        bulkOps.push({
          index: {
            _index: 'properties',
            _id: property._id.toString(),
          },
        });

        bulkOps.push({
          title: property.title,
          description: property.description,
          price: property.price,
          currency: property.currency,
          propertyType: property.propertyType,
          address: property.address,
          city: property.city,
          state: property.state,
          country: property.country,
          postalCode: property.postalCode,
          coordinates: property.coordinates,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          floor: property.floor,
          parkingSpaces: property.parkingSpaces,
          balcony: property.balcony,
          garden: property.garden,
          furnished: property.furnished,
          image: property.image,
          isFeatured: property.isFeatured,
          createdAt: property.createdAt,
        });
      });

      console.log('Executing bulk operation with Elasticsearch');
      const response = await this.client.bulk({
        refresh: true,
        body: bulkOps,
      });

      // Check for errors in the response
      const errors = response.items.filter((item: any) => item.index?.error);
      if (errors.length > 0) {
        this.logger.error('Bulk operation failed:', errors);
        throw new Error('Error syncing data to Elasticsearch');
      } else {
        this.logger.log('Data synced successfully to Elasticsearch');
      }
    } catch (error) {
      this.logger.error('Error during bulk sync operation:', error);
      throw error;
    }
  }
  async printSampleDocuments() {
    try {
      const sampleDocs = await this.client.search({
        index: 'properties',
        body: {
          query: {
            match_all: {},
          },
          size: 2, // Adjust the number of documents to print
        },
      });
      console.log('Sample documents from Elasticsearch:', sampleDocs.hits.hits);
    } catch (error) {
      console.error('Error fetching sample documents:', error);
    }
  }
  

  private buildFilters(processedQuery: any) {
    const filterArray = [];

    // Bedrooms filter (numeric range)
    if (processedQuery.bedrooms) {
      filterArray.push({
        range: {
          bedrooms: { gte: processedQuery.bedrooms },
        },
      });
    }

    if (processedQuery.propertyType) {
      filterArray.push({
        term: {
          propertyType: processedQuery.propertyType.toLowerCase(),
        },
      });
    }
  
  

    // Property Type filter (exact match)
    if (processedQuery.propertyType) {
      filterArray.push({
        term: {
          propertyType: processedQuery.propertyType.toLowerCase(),
        },
      });
    }

   
    // Amenities filters (boolean match for garden, furnished, etc.)
    if (processedQuery.garden !== undefined) {
      filterArray.push({
        term: {
          garden: processedQuery.garden, // Filter by garden (true/false)
        },
      });
    }

    if (processedQuery.furnished !== undefined) {
      filterArray.push({
        term: {
          furnished: processedQuery.furnished, // Filter by furnished (true/false)
        },
      });
    }

    if (processedQuery.balcony !== undefined) {
      filterArray.push({
        term: {
          balcony: processedQuery.balcony, // Filter by balcony (true/false)
        },
      });
    }

    return filterArray;
  }

  async searchProperties(
    textQuery: string | { textQuery: string },
    page: number,
    limit: number,
    filters: any,
  ) {
    console.log('performing full text search with elastic search', textQuery);

    let textQuery1: string = '';
    if (typeof textQuery === 'object' && textQuery !== null && 'textQuery' in textQuery) {
      textQuery1 = textQuery.textQuery; // Use the textQuery field of the object
    } else if (typeof textQuery === 'string') {
      textQuery1 = textQuery;
    } else {
      console.error('Invalid textQuery:', textQuery);
      return { error: 'Invalid textQuery parameter' };
    }
    const doc = nlp(textQuery1);

    // Get locations (cities or locations) from the text
    const locations = doc.places().out('array');
    let city
    if (locations.length > 0) {
      city = locations[0].split('"}')[0].toLowerCase(); // Clean up and convert to lowercase
    
    }

    // Optionally: If no city is found, you can still fall back to MongoDB city list matching
    if (!city) {
      const properties = await this.propertyModel.find().exec();
      const cities = properties.map((property) => property.city);
      for (const cit of cities) {
        if (textQuery1.toLowerCase().includes(city.toLowerCase())) {
          city = cit.toLowerCase(); // Convert to lowercase
          break;
        }
      }
    }
    //console.log('this is city',city)
    const query = await this.processQuery(textQuery1);
   
    const body: any = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: textQuery1, // Perform a full-text search on the raw query
                fields: ['title', 'description', 'propertyType', 'city'], // Relevant fields
                fuzziness: 'AUTO', // Optional fuzziness for spelling variations
              },
            },
            ...this.buildFilters(query),
            {
              match_phrase: {
                city: city
              },
            },
          ],
        },
      },
      from: (page - 1) * limit,
      size: limit,
    };

    // Log the query body for debugging
   // this.logger.log(JSON.stringify(body, null, 2));
    //await this.printSampleDocuments();
    try {
      const eresponse = await this.client.search({
        index: 'properties',
        body: body,
      });
      console.log('response.hits.total',eresponse.hits.total)
      const totalProperties = eresponse.hits.total;
      const properties = eresponse.hits.hits.map((h: any) => h._source);
      const totalPages = Math.ceil(Number(totalProperties) / limit);
      const result = {
        properties,
        totalProperties,
        page,
        totalPages,
      };
      console.log('this is total properties after elastic search',totalProperties)
      return result;
    
      
    } catch (error) {
      console.error('Error querying Elasticsearch:', error);
      throw new Error('Error querying Elasticsearch');
    }
  }

  private async processQuery(textQuery1: string) {
    let textQuery = '';
    if (textQuery1 && typeof textQuery1 === 'object' && textQuery1) {
      textQuery = String(textQuery1); // Ensure it's a string
    } else if (typeof textQuery1 === 'string') {
      textQuery = textQuery1;
    } else {
      console.error('Invalid textQuery:', textQuery);
      return { error: 'Invalid textQuery parameter' };
    }

    // Extract location entities using compromise
  
    const processedQuery: any = {};

    // Extract number of bedrooms (e.g., "2 bedroom" or "2 br")
    const bedroomMatch = textQuery.match(/(\d+)\s*(bedroom|br)/i);
    if (bedroomMatch) {
      processedQuery.bedrooms = parseInt(bedroomMatch[1], 10);
    }

    // Extract property type (e.g., "apartment", "penthouse", "villa", "house")
    const propertyTypeMatch = textQuery.match(
      /\b(apartment|penthouse|villa|house)\b/i,
    );
    if (propertyTypeMatch) {
      processedQuery.propertyType = propertyTypeMatch[1]; // Use the matched property type
    }

    const amenitiesMatch = textQuery.match(
      /\b(swimming pool|gym|garden|balcony|furnished)\b/i,
    );
    if (amenitiesMatch) {
      amenitiesMatch.forEach((amenity) => {
        switch (amenity.toLowerCase()) {
          case 'garden':
            processedQuery.garden = true;
            break;
          case 'balcony':
            processedQuery.balcony = true;
            break;
          case 'furnished':
            processedQuery.furnished = true;
            break;
          default:
            break;
        }
      });
    }
    if (textQuery.match(/\bunfurnished\b/i)) {
      processedQuery.furnished = false;
    }

    // If compromise detects a location (city), add it to the query
   

    return processedQuery;
  }
}
