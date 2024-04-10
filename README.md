An app designed to manage multiple aquariums - their parameters, livestock, plants, products, nitrogen cycles, and more.

Backend RESTful API project built with NodeJS Express and TypeScript:
- Routers: Take in HTTP requests and call the service's functions
- Services: Receive necessary arguments from routers, communicate with DynamoDB to make changes
- AWS DynamoDB: Stores data sent to it by the services
- AWS Lambda: Responds to updates made to the tanks in order to add entries in the tank event table
- Insomnium: Tests sending HTTP requests and viewing responses

Focused on:
- Creating a project that is useful in my day-to-day life as an aquarist
- Gaining new backend experience, combining something familiar (RESTful API) with something less familiar (NodeJS Express)
- Familiarizing myself with HTTP requests and responses
- Error handling of DB communication issues

Additional learning:
- Used a common software pattern of Routers accepting requests and Services handling DB communication
- Designed a NoSQL DB from scratch, updating the general structure of the data stored to fit the real-life needs of the project as it evolved
- Used ESBuild to generate a plain .js file from a .ts file, including the specified file as well as it's dependencies (allowed for Lambda .zip files to be generated efficiently with PowerShell)
