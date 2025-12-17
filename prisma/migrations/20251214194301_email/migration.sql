/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Restaurants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `Restaurants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurants" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurants_email_key" ON "Restaurants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurants_phone_number_key" ON "Restaurants"("phone_number");
