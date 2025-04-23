CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION randomid(size int DEFAULT 10)
RETURNS text AS $$
DECLARE
  id text := '';
  i int := 0;
  alphabet char(64) := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  bytes bytea := gen_random_bytes(size);
  byte int;
  pos int;
BEGIN
  WHILE i < size LOOP
    byte := get_byte(bytes, i);
    pos := (byte & 63) + 1; -- 1-based index
    id := id || substr(alphabet, pos, 1);
    i := i + 1;
  END LOOP;
  RETURN id;
END;
$$ LANGUAGE plpgsql STABLE;

-- credit: https://dev.to/reggi/how-to-use-a-custom-generated-nanoid-for-prisma-primary-key-3nbf

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "contactID" SET DEFAULT randomid();

-- AlterTable
ALTER TABLE "Division" ALTER COLUMN "divisionID" SET DEFAULT randomid();

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "employeeID" SET DEFAULT randomid();

-- AlterTable
ALTER TABLE "Facility" ALTER COLUMN "facilityID" SET DEFAULT randomid();

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "serviceID" SET DEFAULT randomid();

-- AlterTable
ALTER TABLE "UpdateLog" ALTER COLUMN "updateLogID" SET DEFAULT randomid();