CREATE TABLE wifi_settings (
    id SERIAL PRIMARY KEY,
    ssid VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)