CREATE TABLE history_actions (
                id SERIAL PRIMARY KEY,
                utente VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP NOT NULL
            )