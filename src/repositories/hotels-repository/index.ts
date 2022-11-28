import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";


async function findAllHotels() {
    return prisma.hotel.findMany({
      select:{
        id:true,
        name: true,
        image:true
      }
    });
  }

async function findHotelById(hotelId: number) {
    return prisma.hotel.findFirst({
      where: {
        id:hotelId
      },
      include:{
        Rooms:{
            select:{
                capacity:true,
                id:true,
                hotelId:true,
                name:true
            }
        }
      }
    });
  }


async function findEnrollmentWithTicketByUserId(userId: number) {
    return prisma.enrollment.findFirst({
      where: { userId },
      include: {
        Ticket: {
            include: {
                TicketType:true
            }
        }
      },
    });
  }

const hotelsRepository = {
    findAllHotels,
    findHotelById,
    findEnrollmentWithTicketByUserId
  };
  
  export default hotelsRepository;