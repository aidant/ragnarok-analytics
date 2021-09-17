-- CreateTable
CREATE TABLE "Event" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventLabel" TEXT,
    "eventCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventCompletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Game" (
    "eventId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameMap" TEXT,
    "gameWinningTeamId" INTEGER,
    "gameCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameCompletedAt" DATETIME,
    CONSTRAINT "Game_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("eventId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "memberId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberDiscordId" TEXT NOT NULL,
    "memberDiscordAvatar" TEXT NOT NULL,
    "memberDiscordUsername" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerTeamId" INTEGER NOT NULL,
    "playerCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("gameId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Player_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("memberId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Members_1" ON "Member"("memberDiscordId");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Players_1" ON "Player"("gameId", "memberId", "playerTeamId");
Pragma writable_schema=0;
