# Mike Sadowski's SoilFlo Interview Takehome

## Notes for reviewer
### Assumptions
- I do not perform ANY data validation of the JSON files. I am assuming all data is correct and whole (100% correct), meaning no duplicates or missing information
- Starting/re-starting the application (i.e. the server) drops ALL database tables/data and re-populates them from the JSON files provided (done for simplicity since the Postgres container is specific to this application)
- Typically the `.env` file is not committed to the repo, only the `.env.example` file is included. However, I created the `.env` file and committed it to make the setup easier for you (similarly, `.env.test` is included to run the automated local tests)
- I assumed that the `dispatchTime` field in the request body is a JS Date() object (`new Date()`) string (e.g. `2024-09-11T19:41:17.780Z`)
- I assumed that the `dispatchTime` can be a past date as the original README only specified future date is invalid
- I assumed from the original README that the provided response object given was only for the fetch route and NOT the post route

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
