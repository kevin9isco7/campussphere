# CampusSphere Database Workflow

## Fresh install

Use `school_management.sql` only when creating a new empty local database.

Do not import `school_management.sql` over a live XAMPP, Aiven, or production database. The file is a full schema and seed baseline, not a deployment patch.

## Updating an existing database

Use files in `database/migrations/`.

Before running a migration:

1. Create a full backup with `mysqldump` or your provider backup tool.
2. Confirm you are connected to the intended database.
3. Run the migration once.
4. Verify the application health endpoint and a database-backed login.

Current migration:

- `migrations/20260711_preserve_data_institution_admins.sql`

This migration separates secondary-school and university data by adding `institution_type` columns and institution-specific settings. It does not drop, truncate, or delete live records.
