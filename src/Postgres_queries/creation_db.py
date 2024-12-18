import json
import sqlite3
from datetime import datetime
import argparse
import os


# Créer les tables
def create_tables():
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            price REAL,
            stock INTEGER,
            date_added TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            category TEXT,
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            user TEXT,
            comment TEXT,
            rating REAL,
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            image TEXT,
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );
    """)

# Insérer les données
def insert_data(data):
    for product in data:
        # Insérer dans la table products
        cursor.execute("""
            INSERT INTO products (product_id, name, description, price, stock, date_added)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            product["product_id"],
            product["name"],
            product["description"],
            product["price"],
            product["stock"],
            product["date_added"]
        ))

        # Insérer dans la table product_categories
        for category in product.get("category", []):
            cursor.execute("""
                INSERT INTO product_categories (product_id, category)
                VALUES (?, ?)
            """, (product["product_id"], category))

        # Insérer dans la table product_reviews
        for review in product.get("reviews", []):
            cursor.execute("""
                INSERT INTO product_reviews (product_id, user, comment, rating)
                VALUES (?, ?, ?, ?)
            """, (
                product["product_id"],
                review["user"],
                review["comment"],
                review["rating"]
            ))

        # Insérer dans la table product_images
        for image in product.get("images", []):
            cursor.execute("""
                INSERT INTO product_images (product_id, image)
                VALUES (?, ?)
            """, (product["product_id"], image))


def get_args() ->str:
    """
    Get the scheduler type and taskset from the command line argument
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("taskset_path")
    return parser.parse_args().taskset_path

def get_name_db(file_path: int) ->str:
    file_name = os.path.basename(file_path)
    file_name = file_name.split(".")[0]
    file_name +=".db"
    return file_name

if __name__ == '__main__':
    # Charger le fichier JSON
    json_file = get_args()

    name_db = get_name_db(json_file)
    
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    # Connexion à la base de données SQLite
    conn = sqlite3.connect(name_db)
    cursor = conn.cursor()
    

    # Appeler les fonctions pour créer les tables et insérer les données
    create_tables()
    insert_data(data)

    # Sauvegarder et fermer la connexion
    conn.commit()
    conn.close()
