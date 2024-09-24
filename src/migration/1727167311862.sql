 -- SQL commands go here
 CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    coffee_machine_id INTEGER NOT NULL,
    time TEXT NOT NULL,
    quantity INTEGER,
    seconds INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(coffee_machine_id) REFERENCES coffee_machines(id)
);