# Structure Display Mode Feature

## Overview
Added a new feature that allows admins to choose how the structure page is displayed to the public:
- **Gambar (Image)**: Display a single static image of the organizational structure
- **Struktur (Chart)**: Display a dynamic organizational chart built from individual member data

## Database Setup Required

### 1. Create the structure_settings table
Run this SQL in your Supabase dashboard:

```sql
CREATE TABLE IF NOT EXISTS structure_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  displayMode TEXT NOT NULL DEFAULT 'chart' CHECK (displayMode IN ('image', 'chart')),
  imageUrl TEXT,
  imagePath TEXT,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedBy TEXT
);

INSERT INTO structure_settings (displayMode, updatedAt)
VALUES ('chart', NOW())
ON CONFLICT DO NOTHING;
```

## Features Added

### 1. Admin Settings Page
**Location:** `/dashboard/structure/settings`

**Features:**
- Toggle between two display modes:
  - **Gambar Struktur**: Upload a single image showing the complete organizational structure
  - **Bagan Organisasi**: Use the dynamic chart built from member data
- Image upload functionality (max 5MB)
- Preview of uploaded image
- Save settings

### 2. Updated Sidebar Menu
- "Kelola Struktur" now has an expandable submenu:
  - **Data Pengurus**: Manage individual member data
  - **Pengaturan Tampilan**: Choose display mode

### 3. Public Structure Page
**Location:** `/struktur`

**Behavior:**
- Checks the `structure_settings` table for display mode
- If mode is "image" and image exists: Shows the uploaded image
- Otherwise: Shows the dynamic organizational chart

## How to Use

### For Admins:

1. **Go to Dashboard → Kelola Struktur → Pengaturan Tampilan**

2. **Choose Display Mode:**
   - **Gambar Struktur**: 
     - Click this option
     - Upload your structure image (PNG/JPG, max 5MB)
     - Click "Simpan Pengaturan"
   
   - **Bagan Organisasi**:
     - Click this option
     - Make sure you have member data in "Data Pengurus"
     - Click "Simpan Pengaturan"

3. **View the public page** at `/struktur` to see the result

### For Managing Members (if using Chart mode):

1. Go to **Dashboard → Kelola Struktur → Data Pengurus**
2. Add members with:
   - Foto Profil (photo)
   - Nama Pengurus (name)
   - Jabatan (position)
   - Urutan (order number for hierarchy)

**Order Guidelines:**
- 1-2: Top level (Ketua RW, Wakil RW)
- 3-6: Second level (Sekretaris, Bendahara)
- 7+: Third level (Divisi, RT, etc.)

## Files Created/Modified

### New Files:
- `src/lib/settingsService.ts` - Service for structure settings CRUD
- `src/app/dashboard/structure/settings/page.tsx` - Admin settings page
- `STRUCTURE_SETTINGS_TABLE.sql` - Database schema

### Modified Files:
- `src/app/struktur/page.tsx` - Added display mode check
- `src/component/common/Sidebar.tsx` - Added expandable submenu
- `src/component/structure/OrganizationalChart.tsx` - Fixed empty image error

## Benefits

1. **Flexibility**: Choose the best way to display your structure
2. **Easy Updates**: 
   - Image mode: Just upload a new image
   - Chart mode: Update individual member data
3. **Professional**: Both modes look polished and professional
4. **User-Friendly**: Simple toggle interface for admins
