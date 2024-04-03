import { GetRecordsOutput } from "@aws-sdk/client-dynamodb-streams";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Tank } from "../../interfaces/tankInterface";
import { determineEventType } from "../../functions/determineEventType";

exports.handler = (event: GetRecordsOutput, context: any, callback: any) => {
  event.Records?.forEach((record) => {
    console.log(JSON.stringify(record));

    if (!record.dynamodb?.OldImage) {
      return;
    }

    if (!record.dynamodb?.NewImage) {
      return;
    }

    const oldImage = unmarshall(record.dynamodb?.OldImage) as Tank;
    const newImage = unmarshall(record.dynamodb?.NewImage) as Tank;

    console.log(oldImage);
    console.log(newImage);

    // Determine event type based on change
    // Compare old image to new image
    const eventType = determineEventType(oldImage, newImage);
    console.log(eventType);
  });
}