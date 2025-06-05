import sqlite3
import json

# Connect to SQLite database (creates it if it doesn't exist)
conn = sqlite3.connect('recipes.db')
cursor = conn.cursor()

# Create table (if it doesn't exist)
cursor.execute('''
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    cuisine TEXT,
    rating REAL,
    total_time TEXT,
    serves TEXT,
    description TEXT,
    cook_time TEXT,
    prep_time TEXT,
    nutrients TEXT  -- Store as JSON string
)
''')

# Load JSON data
with open('US_recipes_null.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Insert data into the table
for recipe_id, recipe in data.items():
    # Convert nutrients dict to JSON string
    nutrients_json = json.dumps(recipe.get('nutrients', {}))
    cursor.execute('''
        INSERT INTO recipes (title, cuisine, rating, total_time, serves, description, cook_time, prep_time, nutrients)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        recipe.get('title'),
        recipe.get('cuisine'),
        recipe.get('rating'),
        recipe.get('total_time'),
        recipe.get('serves'),
        recipe.get('description'),
        recipe.get('cook_time'),
        recipe.get('prep_time'),
        nutrients_json
    ))

# Commit and close the connection
conn.commit()
conn.close()

print("JSON data successfully converted to SQLite database.")
