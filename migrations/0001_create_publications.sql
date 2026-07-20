CREATE TABLE publications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('promotion','news','announcement')),
  title TEXT NOT NULL,
  description TEXT,
  image_key TEXT,
  start_date TEXT,
  end_date TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  button_text TEXT,
  button_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
CREATE INDEX idx_publications_active ON publications(active);
CREATE INDEX idx_publications_type ON publications(type);
CREATE INDEX idx_publications_start_date ON publications(start_date);
CREATE INDEX idx_publications_end_date ON publications(end_date);
CREATE INDEX idx_publications_created_at ON publications(created_at);
