// Setup for a minimal Express server using JS
import express, { Express } from 'express';
import dotenv from 'dotenv';
import { TankRouter } from './routers/tank';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const client = new DynamoDBClient({});

// ROUTERS
app.use('/tanks', TankRouter);

app.get('/', async (req, res) => {
  const command = new ListTablesCommand({});
  const response = await client.send(command);
  res.send(response.TableNames);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});