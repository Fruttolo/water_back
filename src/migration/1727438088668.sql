-- SQL commands go here
CREATE TABLE menu (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  deleted INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES user(id)
);