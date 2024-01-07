import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

class Service {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default Service;