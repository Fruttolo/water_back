 -- SQL commands go here
-- Create a new table with the desired schema
CREATE TABLE users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    session_token VARCHAR(255)
);

-- Copy data from the old table to the new table
INSERT INTO users_new (id, email, username, password, salt, session_token)
SELECT id, email, username, password, salt, session_token
FROM users;

-- Drop the old table
DROP TABLE users;

-- Rename the new table to the old table name
ALTER TABLE users_new RENAME TO users;

CREATE TABLE coffee_machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    seconds INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);