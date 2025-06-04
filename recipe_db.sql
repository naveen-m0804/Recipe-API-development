CREATE DATABASE IF NOT EXISTS recipe_db;
USE recipe_db;

CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    cuisine TEXT,
    title TEXT,
    rating REAL,
    prep_time INTEGER,
    cook_time INTEGER,
    total_time INTEGER,
    description TEXT,
    nutrients TEXT,
    serves TEXT
);

