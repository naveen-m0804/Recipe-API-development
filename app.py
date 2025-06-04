from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import json

app = Flask(__name__, static_folder='static')
DB_FILE = "recipes.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    conn = get_db_connection()
    cursor = conn.cursor()
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM recipes LIMIT ? OFFSET ?", (limit, offset))
    recipes = cursor.fetchall()
    conn.close()
    result = []
    for recipe in recipes:
        recipe_dict = dict(recipe)
        recipe_dict['ingredients'] = json.loads(recipe_dict['ingredients'])
        recipe_dict['instructions'] = json.loads(recipe_dict['instructions'])
        recipe_dict['nutrients'] = json.loads(recipe_dict['nutrients'])
        result.append(recipe_dict)
    return jsonify(result)

@app.route('/api/recipes/search', methods=['GET'])
def search_recipes():
    title = request.args.get('title', default=None, type=str)
    cuisine = request.args.get('cuisine', default=None, type=str)
    rating = request.args.get('rating', default=None, type=float)
    total_time = request.args.get('total_time', default=None, type=str)
    serves = request.args.get('serves', default=None, type=str)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    offset = (page - 1) * limit

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM recipes WHERE 1=1"
    params = []

    if title:
        query += " AND title LIKE ?"
        params.append(f"%{title}%")
    if cuisine:
        query += " AND cuisine = ?"
        params.append(cuisine)
    if rating is not None:
        query += " AND rating >= ?"
        params.append(rating)
    if total_time:
        # Assuming total_time stored as string or integer minutes, adjust accordingly
        query += " AND total_time = ?"
        params.append(total_time)
    if serves:
        query += " AND serves LIKE ?"
        params.append(f"{serves}%")

    query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    recipes = cursor.fetchall()
    conn.close()

    result = []
    for recipe in recipes:
        recipe_dict = dict(recipe)
        # Deserialize JSON fields if any
        for key in ['ingredients', 'instructions', 'nutrients']:
            if key in recipe_dict and recipe_dict[key]:
                recipe_dict[key] = json.loads(recipe_dict[key])
        result.append(recipe_dict)

    return jsonify(result)


@app.route('/api/recipes/title/<title>', methods=['GET'])
def get_recipe_by_title(title):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE title = ?", (title,))
    recipe = cursor.fetchone()
    conn.close()
    if recipe:
        recipe_dict = dict(recipe)
        recipe_dict['ingredients'] = json.loads(recipe_dict['ingredients'])
        recipe_dict['instructions'] = json.loads(recipe_dict['instructions'])
        recipe_dict['nutrients'] = json.loads(recipe_dict['nutrients'])
        return jsonify(recipe_dict)
    else:
        return jsonify({"error": "Recipe not found"}), 404

@app.route('/api/recipes/cuisine', methods=['GET'])
def get_recipes_by_cuisine():
    cuisine = request.args.get('cuisine', default=None, type=str)
    if not cuisine:
        return jsonify({"error": "Cuisine parameter is required"}), 400
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    offset = (page - 1) * limit
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM recipes WHERE cuisine = ? LIMIT ? OFFSET ?",
        (cuisine, limit, offset)
    )
    recipes = cursor.fetchall()
    conn.close()
    result = []
    for recipe in recipes:
        recipe_dict = dict(recipe)
        recipe_dict['ingredients'] = json.loads(recipe_dict['ingredients'])
        recipe_dict['instructions'] = json.loads(recipe_dict['instructions'])
        recipe_dict['nutrients'] = json.loads(recipe_dict['nutrients'])
        result.append(recipe_dict)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
