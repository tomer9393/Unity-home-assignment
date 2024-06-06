# Unity-home-assignment

## News Api

#### Running News Articles API:
* run: npm install
* run: node index.js

#### Endpoints:

#### Get Latest News

Returns all the latest news
Method: GET

Endpoint: `http://127.0.0.1:8000/api/news`

#### Get Breaking news

Get the breaking news
Method: GET

You can define the limit of results by passing the `limit` query parameter.    
Default limit is 10.
Max limit is 100.
Minimum limit is 0.

**Example:**   
Endpoint: `http://127.0.0.1:8000/api/breaking-news?limit=25`

## News App

### Installation:
* run: npm install
* run: npm start
* go to: `http://localhost:3000/`
