 -- SQL commands go here
-- Step 1: Create a new table with the desired schema
CREATE TABLE coffee_machines_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER, -- Make user_id nullable
    token VARCHAR(255),
    quantity INTEGER DEFAULT 20,
    seconds INTEGER DEFAULT 120,
    UNIQUE (name), -- Add unique constraint
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Step 2: Copy data from the old table to the new table
INSERT INTO coffee_machines_new (id, name, user_id, token, quantity, seconds)
SELECT id, name, user_id, token, quantity, seconds FROM coffee_machines;

-- Step 3: Drop the old table
DROP TABLE coffee_machines;

-- Step 4: Rename the new table to the old table's name
ALTER TABLE coffee_machines_new RENAME TO coffee_machines;