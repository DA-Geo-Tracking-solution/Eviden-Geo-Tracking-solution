-- docker exec -it cassandra cqlsh -f /path/to/create_tables.cql

-- Create Keyspace
CREATE KEYSPACE IF NOT EXISTS my_keyspace
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

-- Switch to Keyspace
USE my_keyspace;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    created_at TIMESTAMP
);

-- Create GPS Data Table
CREATE TABLE IF NOT EXISTS gps_data (
    username text,
    timestamp timestamp,
    id uuid,
    latitude float,
    longitude float,
    PRIMARY KEY (username, timestamp)
) WITH CLUSTERING ORDER BY (timestamp ASC);

