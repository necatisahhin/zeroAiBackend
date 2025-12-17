import { Router } from "express";
import { createRestaurant , updateRestaurant, deleteRestaurant } from "@/controllers/v1/restaurants/restaurants";
import { createRestaurantValidation, updateRestaurantValidation, deleteRestaurantValidation } from "@/utils/validators/restaurantsValidators";
import { authMiddleware } from "@/middleware/auth";

const router = Router();

router.post(
    "/createRestaurant",
    authMiddleware,
    createRestaurantValidation,
    createRestaurant
);

router.put(
    "/updateRestaurant",
    authMiddleware,
    updateRestaurantValidation,
    updateRestaurant
);

router.delete(
    "/deleteRestaurant",
    authMiddleware,
    deleteRestaurantValidation,
    deleteRestaurant
);

export default router;