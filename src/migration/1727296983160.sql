-- SQL commands go here

-- Create a new table with the desired schema
CREATE TABLE new_jobs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    coffee_machine_id INTEGER,
    time TEXT NOT NULL,
    quantity INTEGER,
    seconds INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(coffee_machine_id) REFERENCES coffee_machines(id)
);

-- Copy data from the old table to the new table
INSERT INTO new_jobs (id, user_id, coffee_machine_id, time, quantity, seconds)
SELECT id, user_id, coffee_machine_id, time, quantity, seconds
FROM jobs;

-- Drop the old table
DROP TABLE jobs;

-- Rename the new table to the old table name
ALTER TABLE new_jobs RENAME TO jobs;