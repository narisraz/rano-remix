/*
  Warnings:

  - You are about to drop the column `reservoirId` on the `Site` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ReservoirToSite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Reservoir" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "telephones" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Site_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Site" ("addressId", "clientId", "createdAt", "id", "name", "telephones", "updatedAt") SELECT "addressId", "clientId", "createdAt", "id", "name", "telephones", "updatedAt" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ReservoirToSite_AB_unique" ON "_ReservoirToSite"("A", "B");

-- CreateIndex
CREATE INDEX "_ReservoirToSite_B_index" ON "_ReservoirToSite"("B");
