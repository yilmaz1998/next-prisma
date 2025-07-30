-- CreateEnum
CREATE TYPE "TodoType" AS ENUM ('WORK', 'HOME', 'FUN', 'HEALTH');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "type" "TodoType" NOT NULL DEFAULT 'HOME';
