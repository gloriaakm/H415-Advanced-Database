# Advanced Database: Document stores analysis

## Course
- **Course:** INFO-H415
- **Year:** MA1

## Description

Suitability of document stores in our specific application by benchmarking Firebase and Firestore against a traditional relational database (PostgreSQL).
https://github.com/gloriaakm/H415-Advanced-Database.git

## Softwares

**JavaScript** & **Node.js** & **Python**
``sudo apt update``
``sudo apt install nodejs npm``

**Firestore**: 

``npm install -g firebase-tools``

**PostgreSQL**:

``sudo apt install postgresql``

## Benchmark
run the ``./src/Firestore_queries/benchmark.js`` and the ``./src/Postgres_queries/benchmark.js``

**Make plots**:

retrieve the results in the console and paste them in ``./src/plot.py`` (plots are saved as png files in the root)