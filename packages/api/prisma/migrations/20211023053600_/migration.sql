-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerTeamId" INTEGER NOT NULL,
    "playerCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerStarred" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("gameId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Player_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("gameId", "memberId", "playerCreatedAt", "playerId", "playerTeamId") SELECT "gameId", "memberId", "playerCreatedAt", "playerId", "playerTeamId" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Players_1" ON "Player"("gameId", "memberId", "playerTeamId");
Pragma writable_schema=0;
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
