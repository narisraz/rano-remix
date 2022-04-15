/*
  Warnings:

  - Added the required column `clientId` to the `Reservoir` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservoir" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "volume" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Reservoir_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservoir" ("id", "volume") SELECT "id", "volume" FROM "Reservoir";
DROP TABLE "Reservoir";
ALTER TABLE "new_Reservoir" RENAME TO "Reservoir";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
