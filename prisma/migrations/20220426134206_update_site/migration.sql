/*
  Warnings:

  - You are about to drop the `Reservoir` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReservoirsOnSites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReservoirToSite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Reservoir";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReservoirsOnSites";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ReservoirToSite";
PRAGMA foreign_keys=on;
