# Advanced Database: Document Stores Analysis

## General Information

- **Course:** INFO-H415  
- **Year:** MA1  
- **Repository:** [GitHub Repository](https://github.com/gloriaakm/H415-Advanced-Database.git)

## Project Description

This project evaluates the suitability of document stores for a specific application by benchmarking Firebase Firestore against a traditional relational database (PostgreSQL).

## Prerequisites and Setup

### Tools and Technologies
- **Languages/Frameworks:** JavaScript, Node.js, Python
- **Databases:** Firestore, PostgreSQL

### System Setup

1. **Update the System:**
```bash
sudo apt update
```
2. **Install Node.js and npm:**
```bash
sudo apt install nodejs npm
```

3. Install Firebase Tools:
```bash
npm install -g firebase-tools
```

4. Install PostgreSQL:
```bash
sudo apt install postgresql
```

5. Configure PostgreSQL:
- Create a new role:
```sql
CREATE ROLE h415_user WITH CREATEDB CREATEROLE LOGIN PASSWORD '1234';
```

- Create a new database:
```sql
CREATE DATABASE h415_db;
```

6. Initialize the Database and Import Data:
- Run the initialization script:
```bash
./init.sh
```

- Export the data to the database:
```bash
node ./src/Postgres_queries/export_data.js
```

## Benchmark
Run the ``./src/Firestore_queries/benchmark.js`` and the ``./src/Postgres_queries/benchmark.js``

**Make plots**:
Retrieve the results in the console and paste them in ``./src/plot.py`` (plots are saved as png files in the root)

## Application
Install Live Server:
1. Open the project and click to Go Live from the status bar to turn the server on/off
2. Right click on ``./src/Firestore_queries/index.html`` from Explorer Window and click on Open with Live Server
