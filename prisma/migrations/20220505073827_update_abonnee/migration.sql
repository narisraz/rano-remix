/*
  Warnings:

  - You are about to drop the `AbonneeType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `abonneeTypeId` on the `Abonnee` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AbonneeType";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Abonnee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "contractDate" DATETIME NOT NULL,
    "telephones" TEXT,
    "abonneeTypeId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "siteId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    CONSTRAINT "Abonnee_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Abonnee_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Abonnee" ("abonneeTypeId", "addressId", "contractDate", "createdAt", "firstName", "id", "name", "siteId", "telephones", "updatedAt") SELECT "abonneeTypeId", "addressId", "contractDate", "createdAt", "firstName", "id", "name", "siteId", "telephones", "updatedAt" FROM "Abonnee";
DROP TABLE "Abonnee";
ALTER TABLE "new_Abonnee" RENAME TO "Abonnee";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
