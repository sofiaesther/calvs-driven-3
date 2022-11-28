import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotels, getHotelById } from "@/controllers/hotels-controller";


const hotelsRouter = Router();

hotelsRouter
    .get("",authenticateToken, getAllHotels)
    .get("/:hotelId", authenticateToken, getHotelById);

export { hotelsRouter };
