import { notFoundError, unauthorizedError, paymentError , preconditionFailedError} from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";

async function isAptToHotel(userId: number){
    const enrollment = await hotelsRepository.findEnrollmentWithTicketByUserId(userId);

    if (enrollment.Ticket[0].TicketType.isRemote || !enrollment.Ticket[0].TicketType.includesHotel) throw preconditionFailedError();

    if(enrollment.Ticket[0].status !=='PAID') {
        throw paymentError();}
    return;
}

async function getHotelsList(): Promise<ReturnHotel[]> {
    const hotels = await hotelsRepository.findAllHotels();
    if (!hotels) throw notFoundError();
    return hotels;
  }

async function getHotelById(hotelId:number): Promise<ReturnHotel> {
    const hotels = await hotelsRepository.findHotelById(hotelId);
    if (!hotels) throw notFoundError();
    return exclude(hotels,"createdAt", "updatedAt");
  }
  

export type ReturnHotel = Omit<Hotel, "createdAt" | "updatedAt">

export type ReturnHotelId = Omit<Hotel, "createdAt" | "updatedAt">

const hotelsService = {
    getHotelsList,
    getHotelById,
    isAptToHotel
  };
  
  export default hotelsService ;