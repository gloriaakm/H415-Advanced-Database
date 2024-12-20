#!/bin/bash

echo "Benchmarking"

# Create the database
# CREATE ROLE h415_user WITH
#    SUPERUSER
#    CREATEDB
#    CREATEROLE
#    REPLICATION
#    BYPASSRLS
#    LOGIN
#    PASSWORD '1234';
# CREATE DATABASE h415_db;
psql -U h415_user -d h415_db -W -f src/Postgres_queries/insert_ecommerce_data.sql
# node src/Postgres_queries/export_data.js