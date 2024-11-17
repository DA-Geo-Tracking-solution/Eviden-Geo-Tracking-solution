-- docker exec -it cassandra cqlsh -f /path/to/create_tables.cql

-- Create Keyspace
CREATE KEYSPACE IF NOT EXISTS geo_tracking_keyspace
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

-- Switch to Keyspace
USE geo_tracking_keyspace;

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


-- Table: User by Group
CREATE TABLE IF NOT EXISTS user_by_group (
    uid UUID,
    groupID UUID,
    username TEXT,
    PRIMARY KEY (groupID, uid)
);

-- Table: User by Squad
CREATE TABLE IF NOT EXISTS user_by_squad (
    uid UUID,
    squadID UUID,
    username TEXT,
    PRIMARY KEY (squadID, uid)
);

-- Table: Messages by Chat
CREATE TABLE IF NOT EXISTS messages_by_chat (
    chat_id UUID,
    message_id TIMEUUID,
    user_id UUID,
    username TEXT,
    message TEXT,
    timestamp TIMESTAMP,
    PRIMARY KEY (chat_id, message_id)
) WITH CLUSTERING ORDER BY (message_id ASC);

-- Table: Chats by User
CREATE TABLE IF NOT EXISTS chats_by_user (
    user_id UUID,
    chat_id UUID,
    chat_name TEXT,
    PRIMARY KEY (user_id, chat_id)
);

-- Table: Users by Chat
CREATE TABLE IF NOT EXISTS users_by_chat (
    chat_id UUID,
    user_id UUID,
    username TEXT,
    PRIMARY KEY (chat_id, user_id)
);


-- Insert into Users Table
INSERT INTO users (username, created_at) VALUES ('john_doe', toTimestamp(now()));
INSERT INTO users (username, created_at) VALUES ('jane_doe', toTimestamp(now()));
INSERT INTO users (username, created_at) VALUES ('alice', toTimestamp(now()));

-- Insert into GPS Data Table
INSERT INTO gps_data (username, timestamp, id, latitude, longitude)
VALUES ('john_doe', toTimestamp(now()), uuid(), 40.7128, -74.0060);
INSERT INTO gps_data (username, timestamp, id, latitude, longitude)
VALUES ('jane_doe', toTimestamp(now()), uuid(), 34.0522, -118.2437);
INSERT INTO gps_data (username, timestamp, id, latitude, longitude)
VALUES ('alice', toTimestamp(now()), uuid(), 51.5074, -0.1278);

-- Insert into User by Group Table
INSERT INTO user_by_group (uid, groupID, username)
VALUES (uuid(), uuid(), 'john_doe');
INSERT INTO user_by_group (uid, groupID, username)
VALUES (uuid(), uuid(), 'jane_doe');

-- Insert into User by Squad Table
INSERT INTO user_by_squad (uid, squadID, username)
VALUES (uuid(), uuid(), 'alice');
INSERT INTO user_by_squad (uid, squadID, username)
VALUES (uuid(), uuid(), 'john_doe');

-- Insert into Messages by Chat Table
INSERT INTO messages_by_chat (chat_id, message_id, user_id, username, message, timestamp)
VALUES (uuid(), now(), uuid(), 'john_doe', 'Hello, this is my first message!', toTimestamp(now()));
INSERT INTO messages_by_chat (chat_id, message_id, user_id, username, message, timestamp)
VALUES (uuid(), now(), uuid(), 'jane_doe', 'Hi, welcome to the chat!', toTimestamp(now()));

-- Insert into Chats by User Table
INSERT INTO chats_by_user (user_id, chat_id, chat_name)
VALUES (uuid(), uuid(), 'General Chat');
INSERT INTO chats_by_user (user_id, chat_id, chat_name)
VALUES (uuid(), uuid(), 'Project Discussion');

-- Insert into Users by Chat Table
INSERT INTO users_by_chat (chat_id, user_id, username)
VALUES (uuid(), uuid(), 'john_doe');
INSERT INTO users_by_chat (chat_id, user_id, username)
VALUES (uuid(), uuid(), 'jane_doe');
INSERT INTO users_by_chat (chat_id, user_id, username)
VALUES (uuid(), uuid(), 'alice');


