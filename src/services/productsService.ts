import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TABLE } from '../constants/table';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { Product } from '../interfaces/productInterface';

interface GetProductResponse {
  data: Product | Product[] | undefined,
  message: string
}

interface PutProductResponse {
  data: PutCommandOutput | undefined,
  message: string
}

interface DeleteProductResponse {
  data: DeleteCommandOutput | undefined,
  message: string
}

class ProductService {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  async getAllProducts():Promise<GetProductResponse> {
    const command = new ScanCommand({
      "TableName": TABLE.PRODUCT
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NO_ITEMS_FOUND
        };
      }

      const products = response.Items as Product[];

      return {
        data: products,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get products: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async getProductByName(product_name: string) {
    const command = new GetCommand({
      "TableName": TABLE.PRODUCT,
      "Key": {
        "name": product_name
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (!response.Item) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      const product = response.Item as Product;

      return {
        data: product,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get product with name ${product_name}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async createProduct(product: Product): Promise<PutProductResponse> {
    const command = new PutCommand({
      "TableName": TABLE.PRODUCT,
      "Item": product
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to create product: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async putProduct(product: Product): Promise<PutProductResponse> {
    const command = new PutCommand({
      "TableName": TABLE.PRODUCT,
      "Item": product
    });

    try {
      const exists = await this.checkProductExists(product.name);
      const response = await this.docClient.send(command);

      if (!exists) {
        response.$metadata.httpStatusCode = 201;
        return {
          data: response,
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.log(`failed to update product: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async deleteProduct(product_name: string): Promise<DeleteProductResponse> {
    const command = new DeleteCommand({
      "TableName": TABLE.PRODUCT,
      "Key": {
        "name": product_name
      }
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.log(`failed to delete product with name ${product_name}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async checkProductExists(product_name: string): Promise<boolean> {
    const response = await this.getProductByName(product_name);
    const exists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return exists;
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default ProductService;