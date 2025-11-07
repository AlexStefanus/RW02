CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    image_path TEXT,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('normal', 'penting', 'urgent')) DEFAULT 'normal',
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'expired')) DEFAULT 'active',
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON announcements(slug);

CREATE TABLE IF NOT EXISTS agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agenda_date ON agenda(date);

CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gallery_is_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

CREATE TABLE IF NOT EXISTS structure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_name TEXT NOT NULL,
    position TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_structure_order ON structure("order");
CREATE INDEX IF NOT EXISTS idx_structure_is_active ON structure(is_active);

CREATE TABLE IF NOT EXISTS structure_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_mode TEXT NOT NULL CHECK (display_mode IN ('image', 'chart')) DEFAULT 'chart',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO structure_settings (display_mode) 
VALUES ('chart')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS visitor_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_visitors INTEGER DEFAULT 0,
    daily_visits JSONB DEFAULT '{}',
    page_views INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO visitor_stats (total_visitors, daily_visits, page_views)
VALUES (0, '{}', 0)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS storage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_size BIGINT DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO storage_stats (total_size, file_count)
VALUES (0, 0)
ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Catatan: Bucket harus dibuat manual di Supabase Dashboard
-- atau menggunakan Supabase CLI dengan perintah:
-- 
-- 1. Buat bucket 'articles' untuk gambar berita
-- 2. Buat bucket 'gallery-images' untuk galeri foto
-- 3. Buat bucket 'structure' untuk foto struktur organisasi
-- 
-- Pastikan bucket bersifat PUBLIC agar gambar bisa diakses

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE structure_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view users"
ON users FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid()::text = uid);

CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
TO public
USING (status = 'published');

CREATE POLICY "Authenticated users can view all articles"
ON articles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = author_id);

CREATE POLICY "Authors can update own articles"
ON articles FOR UPDATE
TO authenticated
USING (auth.uid()::text = author_id);

CREATE POLICY "Authors can delete own articles"
ON articles FOR DELETE
TO authenticated
USING (auth.uid()::text = author_id);

CREATE POLICY "Public can view active announcements"
ON announcements FOR SELECT
TO public
USING (status = 'active');

CREATE POLICY "Authenticated users can view all announcements"
ON announcements FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert announcements"
ON announcements FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = author_id);

CREATE POLICY "Authors can update own announcements"
ON announcements FOR UPDATE
TO authenticated
USING (auth.uid()::text = author_id);

CREATE POLICY "Authors can delete own announcements"
ON announcements FOR DELETE
TO authenticated
USING (auth.uid()::text = author_id);

CREATE POLICY "Public can view agenda"
ON agenda FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert agenda"
ON agenda FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update agenda"
ON agenda FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete agenda"
ON agenda FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Public can view active gallery"
ON gallery FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Authenticated users can view all gallery"
ON gallery FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert gallery"
ON gallery FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery"
ON gallery FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete gallery"
ON gallery FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Public can view active structure"
ON structure FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Authenticated users can view all structure"
ON structure FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert structure"
ON structure FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update structure"
ON structure FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete structure"
ON structure FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Public can view structure settings"
ON structure_settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can update structure settings"
ON structure_settings FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Public can view visitor stats"
ON visitor_stats FOR SELECT
TO public
USING (true);

CREATE POLICY "Public can update visitor stats"
ON visitor_stats FOR UPDATE
TO public
USING (true);

CREATE POLICY "Public can view storage stats"
ON storage_stats FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can update storage stats"
ON storage_stats FOR UPDATE
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_structure_updated_at
    BEFORE UPDATE ON structure
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_structure_settings_updated_at
    BEFORE UPDATE ON structure_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitor_stats_updated_at
    BEFORE UPDATE ON visitor_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storage_stats_updated_at
    BEFORE UPDATE ON storage_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();