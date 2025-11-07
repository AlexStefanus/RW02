-- Create structure_settings table for managing display mode
CREATE TABLE IF NOT EXISTS structure_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  displayMode TEXT NOT NULL DEFAULT 'chart' CHECK (displayMode IN ('image', 'chart')),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedBy TEXT
);

-- Insert default settings
INSERT INTO structure_settings (displayMode, updatedAt)
VALUES ('chart', NOW())
ON CONFLICT DO NOTHING;

-- Add comment
COMMENT ON TABLE structure_settings IS 'Settings for structure page display mode: image (struktur.png) or organizational chart';
