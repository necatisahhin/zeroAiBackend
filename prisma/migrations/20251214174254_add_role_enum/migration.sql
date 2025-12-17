-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'premium', 'elite');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
