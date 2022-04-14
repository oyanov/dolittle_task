# Instructions

There are two projects:
1. avinorpuller which pulls data from the Avinor services and stores via dolittle sdk (index.ts). 
Another part of this project hosts service with aggregated data (api.ts)
2. React web page that utilizes api and shows data in user readable view.

To run the project:
1. Run dolittle environment `docker run -p 50053:50053 -p 51052:51052 -p 27017:27017 -d dolittle/runtime:latest-development`
2. Install npm dependencies inside each project with `npm install`
3. Run Data puller with `npx ts-node index.ts`
4. Run Web api with `npx ts-node api.ts`
5. Run web project with `npm start`