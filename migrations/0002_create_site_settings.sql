CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO site_settings(key,value,updated_at)
VALUES('theme_color','#21734e',CURRENT_TIMESTAMP);
