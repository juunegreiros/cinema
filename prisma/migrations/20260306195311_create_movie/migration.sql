-- CreateEnum
CREATE TYPE "AgeRate" AS ENUM ('LIVRE', 'MAIOR_10', 'MAIOR_12', 'MAIOR_14', 'MAIOR_16', 'MAIOR_18');

-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "ageRating" "AgeRate" NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);
