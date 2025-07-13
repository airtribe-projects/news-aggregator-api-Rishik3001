# News Aggregator API

## Overview

This is a RESTful API built with Node.js, Express.js, MongoDB, and JWT that allows users to:
- Register and log in securely
- Save and retrieve news preferences
- Fetch personalized news articles via an external API
- Includes input validation, error handling, and token-based authentication.

---

## Setup Instructions

1. Clone the repository or download the project folder:

   git clone https://github.com/airtribe-projects/news-aggregator-api-Rishik3001.git
   cd news-aggregator-api-Rishik3001

2. Install dependencies:

   npm install

3. Start the server:

   nodemom app.js

   The server will run on: http://localhost:3000

---

## API Endpoints

### Register an user

- Method: POST
- URL: /tasks
- Body Example:
  {
    "email": "user@example.com",
    "password": "securepassword",
    "preferences": ["sports"]
  }

### Login User
- Method: POST
- URL: /login
- Body Example:
  {
    "email": "user@example.com",
    "password": "securepassword"
  }

### Get Preferences (Protected)
- Method: GET
- URL: /preferences
- Headers:
- Authorization: Bearer <token>

### Update Preferences (Protected)
- Method: PUT
- URL: /preferences
- Headers:
- Authorization: Bearer <token>
- Body Example:
{
  "newPreferences": ["technology", "health"]
}

### Get News (Protected)
- Method: GET
- URL: /news
- Headers:
- Authorization: Bearer <token>
- Returns: Articles based on user preferences.

## How to Test the API

You can test the API using:

### Postman

1. Open Postman and create a new request.
2. Set the method and URL (e.g. POST http://localhost:3000/tasks).
3. For POST and PUT, use the Body > raw > JSON format.
4. Click Send to see the response.

### curl (command line)

# Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"123456"}'


# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"123456"}'

# Get Preferences 
curl -X GET http://localhost:3000/preferences \
-H "Authorization: Bearer <token>"

# Update Preferences
curl -X PUT http://localhost:3000/preferences \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"newPreferences":["science","sports"]}'


# Get News
curl -X GET http://localhost:3000/news \
  -H "Authorization: Bearer <your_token>"