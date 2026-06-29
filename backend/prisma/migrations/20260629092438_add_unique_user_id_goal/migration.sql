/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `goal_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "goal_history_userId_key" ON "goal_history"("userId");
