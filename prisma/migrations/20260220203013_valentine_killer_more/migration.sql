/*
  Warnings:

  - You are about to drop the `PendingTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToolReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToolReview" DROP CONSTRAINT "ToolReview_toolId_fkey";

-- DropTable
DROP TABLE "PendingTool";

-- DropTable
DROP TABLE "ToolReview";

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_role" TEXT,
    "rating" INTEGER,
    "body" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_tools" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "pending_tools_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
