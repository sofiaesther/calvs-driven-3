
import hotelsService from "@/services/hotels-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: Request, res: Response) {
    const {userId} = req.body;

  try {

    await hotelsService.isAptToHotel(userId);
    const hotels = await hotelsService.getHotelsList();

    return res.status(httpStatus.OK).send(hotels);

  } catch (error) {

    if (error.name === "PreconditionFailedError") {
        return res.send(httpStatus.PRECONDITION_FAILED);
      }
    if (error.name === "PaymentError") {
        return res.send(httpStatus.PAYMENT_REQUIRED);
      }
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getHotelById(req: Request, res: Response) {
    let hotelId = parseInt(req.params.hotelId);
    const {userId} = req.body;

        try {
    await hotelsService.isAptToHotel(userId);
    if(isNaN(hotelId)){
        return res.status(httpStatus.BAD_REQUEST).send({})
    }
      const hotel = await hotelsService.getHotelById(hotelId);
  
      return res.status(httpStatus.OK).send(hotel);
    } catch (error) {
        if (error.name === "PreconditionFailedError") {
            return res.status(httpStatus.PRECONDITION_FAILED).send({});
          }
        if (error.name === "PaymentError") {
            return res.status(httpStatus.PAYMENT_REQUIRED).send({});
          }
        return res.status(httpStatus.NOT_FOUND).send({});
      }
  }