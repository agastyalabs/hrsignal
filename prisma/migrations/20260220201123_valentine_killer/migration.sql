-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvotesWeek" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ToolReview" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorRole" TEXT,
    "rating" INTEGER,
    "body" TEXT NOT NULL,

    CONSTRAINT "ToolReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingTool" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PendingTool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToolReview" ADD CONSTRAINT "ToolReview_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
