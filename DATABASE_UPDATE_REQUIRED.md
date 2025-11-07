# Database Schema Update Required

## Structure Table Changes

The `structures` table schema needs to be updated to match the new organizational chart requirements.

### Old Schema
```sql
CREATE TABLE structures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT NOT NULL,
  imagePath TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  createdBy TEXT,
  updatedBy TEXT
);
```

### New Schema Required
```sql
-- Drop old columns and add new ones
ALTER TABLE structures 
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS description,
  ADD COLUMN IF NOT EXISTS personName TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS position TEXT NOT NULL DEFAULT '';

-- Update column names if using migration
-- OR create new table:

CREATE TABLE structures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personName TEXT NOT NULL,
  position TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  imagePath TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  createdBy TEXT,
  updatedBy TEXT
);
```

### Field Changes
- **Removed:** `name` (was: nama struktur organisasi)
- **Removed:** `description` (was: deskripsi struktur)
- **Added:** `personName` (nama pengurus/person)
- **Added:** `position` (jabatan/role)

### Data Migration (if needed)
If you have existing data, you may want to migrate it:

```sql
-- Example migration (adjust as needed)
UPDATE structures 
SET personName = name,
    position = COALESCE(description, 'Pengurus');
```

### Order Field Usage
The `order` field is used to determine hierarchy and positioning in the organizational chart:
- **1-2:** Top level (Ketua RW, Wakil RW)
- **3-6:** Second level (Sekretaris 1, Sekretaris 2, Bendahara 1, Bendahara 2)
- **7+:** Third level (Divisi, RT, etc.)

## Example Data
```sql
INSERT INTO structures (personName, position, imageUrl, imagePath, "order", isActive) VALUES
('Mashud Sasaki', 'KETUA RW', 'url_to_image', 'path', 1, true),
('Imam Kudori', 'WAKIL RW', 'url_to_image', 'path', 2, true),
('Ganis Sista Maria', 'SEKRETARIS 1', 'url_to_image', 'path', 3, true),
('Sutami', 'SEKRETARIS 2', 'url_to_image', 'path', 4, true),
('Budi Wibowo', 'BENDAHARA 1', 'url_to_image', 'path', 5, true),
('Suradji', 'BENDAHARA 2', 'url_to_image', 'path', 6, true);
```

## Important Notes
1. Run the schema update in your Supabase dashboard
2. The application code has been updated to use the new field names
3. All existing structure data will need to be re-entered or migrated
4. The organizational chart component automatically arranges people based on the `order` field
