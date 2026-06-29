/*
  Warnings:

  - You are about to drop the `GoalHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GoalHistory" DROP CONSTRAINT "GoalHistory_userId_fkey";

-- DropTable
DROP TABLE "GoalHistory";

-- CreateTable
CREATE TABLE "goal_history" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "goal_history_userId_idx" ON "goal_history"("userId");

-- AddForeignKey
ALTER TABLE "goal_history" ADD CONSTRAINT "goal_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
