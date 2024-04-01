import { GetRecordsOutput } from "@aws-sdk/client-dynamodb-streams";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Tank } from "../../src/interfaces/tankInterface";

exports.handler = (event: GetRecordsOutput, context: any, callback: any) => {
  event.Records?.forEach((record) => {
    console.log(JSON.stringify(record));

    if (!record.dynamodb?.OldImage) {
      return;
    }

    if (!record.dynamodb?.NewImage) {
      return;
    }

    const tank_oldImage = unmarshall(record.dynamodb?.OldImage) as Tank;
    const tank_newImage = unmarshall(record.dynamodb?.NewImage) as Tank;

    console.log(tank_oldImage);
    console.log(tank_newImage);
  });
}