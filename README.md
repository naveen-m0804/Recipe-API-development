# Recipe API Development


## Overview

This project is a web-based recipe application that allows users to:

- Browse recipes stored in a SQLite database.
- Search and filter recipes by title and cuisine.
- Paginate results for easier navigation.
- View recipe details such as title, cuisine, rating, and description.

The application consists of a Flask backend (serving a RESTful API and the frontend) and a modern, responsive frontend. The SQLite database (`recipes.db`) contains 8,451 recipe entries.

---

## Project Structure

*(Details about the project folder structure can be added here if available)*

---

## Key Points on Converting JSON to SQLite Database

- Use `sqlite3` to interact with the SQLite database and `json` to parse the JSON file.
- Load the JSON data into Python using `json.load()`.
- Establish a connection to the SQLite database file using `sqlite3.connect()`.
- Define the table schema and create it using SQL `CREATE TABLE`.
- Loop through each JSON object and insert its values into the SQLite table using `INSERT` statements.
- Handle data types and structure:
  - **Flat JSON:** Each key-value pair maps directly to a column in the table.
  - **Nested JSON:** Store nested objects or lists as JSON strings (using `json.dumps()`) or consider normalizing into separate tables.

---

## System Requirements

- Python 3
- Flask (`pip install flask`)
- SQLite3 (included with Python)
- Web browser (Chrome, Firefox, Edge, etc.)

---

## Setup

### 1. Prepare the Database

Run the data loader script to populate the SQLite database from your JSON file. The database file (`recipes.db`) will be created in your project folder.

### 2. Start the Flask Application

```

python app.py

```

This will start the server at [http://localhost:5000](http://localhost:5000).

---

## Frontend Features

- **Search and Filter:** Filter recipes by title and/or cuisine.
- **Pagination:** Navigate through pages of recipes using page and limit controls.
- **Responsive Design:** Works on desktop and mobile devices.

---

## Backend API Endpoints

All endpoints are prefixed with `/api/recipes`:

| Endpoint                                      | Method | Description                          |
|-----------------------------------------------|--------|------------------------------------|
| `/api/recipes`                                | GET    | Fetch all recipes                   |
| `/api/recipes/title/<title>`                  | GET    | Search recipes by title             |
| `/api/recipes/cuisine?cuisine=<cuisine>`     | GET    | Search recipes by cuisine           |
| `/api/recipes?page=<page>&limit=<limit>`     | GET    | Paginate through recipes            |

---

## How to Use

- Open [http://localhost:5000](http://localhost:5000) in your browser.
- Browse recipes displayed in a table.
- Use the filter bar to search by title or cuisine.
- Use the page and limit inputs to navigate through pages.

---

## Example API Requests

- Fetch all recipes:

```

GET http://localhost:5000/api/recipes

```

- Search for recipes with "pie" in the title and "American" cuisine:

```

GET http://localhost:5000/api/recipes/search?title=pie\&cuisine=American

```

- Search by title:

```

GET http://localhost:5000/api/recipes/title/Sweet Potato Pie

```

- Search by cuisine:

```

GET http://localhost:5000/api/recipes/cuisine?cuisine=Southern Recipes

```

- Paginate results (page 2, 5 recipes per page):

```

GET http://localhost:5000/api/recipes?page=2\&limit=5

```

---

## Conclusion

### Backend

- Uses Flask for routing and API logic.
- SQLite for data storage.
- All JSON fields are stored in SQLite and parsed back to objects in the API.

### Frontend

- JavaScript for dynamic content.
- Responsive CSS for all screen sizes.
- Fetches data from the backend API using `fetch`.



