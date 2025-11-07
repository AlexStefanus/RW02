# Structure Feature Cleanup Guide

## ✅ Already Completed:
1. ✅ Removed "Kelola Struktur" from sidebar menu
2. ✅ Simplified `/struktur` public page to show only static image

## 🗑️ Files/Folders to Delete Manually:

### Dashboard Pages (delete entire folders):
```
src/app/dashboard/structure/
├── create/
│   └── page.tsx
├── update/
│   └── page.tsx
├── settings/
│   └── page.tsx
└── page.tsx
```

**Action:** Delete the entire `src/app/dashboard/structure/` folder

### Components:
```
src/component/dashboard/StructureForm.tsx
src/component/structure/OrganizationalChart.tsx
```

**Action:** Delete these two component files

### Services:
```
src/lib/structureService.ts
src/lib/settingsService.ts
```

**Action:** Delete these two service files

### Hooks:
```
src/hooks/useStructure.ts
```

**Action:** Delete this hook file

### Documentation Files (optional cleanup):
```
DATABASE_UPDATE_REQUIRED.md
STRUCTURE_SETTINGS_TABLE.sql
STRUCTURE_DISPLAY_MODE_FEATURE.md
```

**Action:** Delete these documentation files if you don't need them

## 🗄️ Database Cleanup:

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop structure-related tables
DROP TABLE IF EXISTS structure_settings CASCADE;
DROP TABLE IF EXISTS structures CASCADE;
```

**File:** `DROP_STRUCTURE_TABLES.sql` (already created for you)

## 📝 Summary:

After cleanup, you'll have:
- ✅ No structure management in dashboard
- ✅ Public `/struktur` page showing only static image from `/public/struktur.png`
- ✅ No database tables for structure data
- ✅ Cleaner codebase

To update the structure image in the future, just replace `/public/struktur.png` with a new file!
