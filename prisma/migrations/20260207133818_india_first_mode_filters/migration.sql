-- CreateEnum
CREATE TYPE "ToolDeployment" AS ENUM ('CLOUD', 'ONPREM', 'HYBRID');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "registeredCountry" TEXT NOT NULL DEFAULT 'IN',
ADD COLUMN     "verifiedInIndia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "multiStateSupport" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "deployment" "ToolDeployment",
ADD COLUMN     "indiaComplianceTags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
