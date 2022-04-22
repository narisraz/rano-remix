-- CreateTable
CREATE TABLE "ReservoirsOnSites" (
    "siteId" TEXT NOT NULL,
    "reservoirId" TEXT NOT NULL,

    PRIMARY KEY ("siteId", "reservoirId"),
    CONSTRAINT "ReservoirsOnSites_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReservoirsOnSites_reservoirId_fkey" FOREIGN KEY ("reservoirId") REFERENCES "Reservoir" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
