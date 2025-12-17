-- CreateTable
CREATE TABLE "Staffs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "wage" DOUBLE PRECISION,
    "hoursWorked" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Staffs" ADD CONSTRAINT "Staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staffs" ADD CONSTRAINT "Staffs_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurants" ADD CONSTRAINT "Restaurants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
