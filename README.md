# Mike Sadowski's SoilFlo Interview Takehome

## Notes for reviewer
### Assumptions
- I do not perform ANY data validation of the JSON files. I am assuming all data is correct and whole (100% correct), meaning no duplicates or missing information
- Starting/re-starting the application (i.e. the server) drops ALL database tables/data and re-populates them from the JSON files provided (done for simplicity since the Postgres container is specific to this application)
- Typically the `.env` file is not committed to the repo, only the `.env.example` file is included. However, I created the `.env` file and committed it to make the setup easier for you (similarly, `.env.test` is included to run the automated local tests)
- I assumed that the `dispatchTime` field in the request body is a JS Date() object (`new Date()`) string in ISO 8601 format (e.g. `2024-09-11T19:41:17.780Z`)
- I assumed that the `dispatchTime` can be a past date as the original README only specified future date is invalid
- I assumed from the original README that the provided response object given was only for the fetch route and NOT the post route
- I assumed that the `dispatchTime` in the response object is also a JS Date() object (`new Date()`) string in ISO 8601 format (e.g. `2024-09-11T19:41:17.780Z`)
- Although not specified in the original README, I included pagination for the GET tickets route. It requires you to pass both the `pageNumber` and `pageSize` query parameters together or the API throws a 400 if one is missing. Otherwise it just fetches all data. I am not sure which method you preferred because it was not required to paginate but I think an API like this should have pagination.

## Usage
1. Spin up local docker environment: run script located at `./script/up_all` to bring up Postgres and API containers (API will start on `http://localhost:8000` unless you alter the `.env` file provided)
2. Swagger docs available at: `http://localhost:8000/api/docs/`
3. I have included postman scripts located in the `./postman/` directory. Feel free to use these to test the API or use any other method you wish
4. Automated tests can be run via `npm run test` (`.env.test` file is included and required to run the tests as that is how the tests connects to Postgres)

## Dependencies
| Package | Version |
|---|---|
| NodeJS | 22.8.0 |
| Express | ^4.19.2 |

## Installation/Usage
-

## Documentation
### API

## Testing
