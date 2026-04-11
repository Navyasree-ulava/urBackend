import { UrBackendClient } from '../client';
import { CollectionSchema } from '../types';

export class SchemaModule {
  constructor(private client: UrBackendClient) {}

  /**
   * Fetch the schema definition for a collection
   */
  public async getSchema(collection: string): Promise<CollectionSchema> {
    const response = await this.client.request<{
      message: string;
      collection: CollectionSchema;
    }>('GET', `/api/schemas/${collection}`);

    return response.collection;
  }
}
