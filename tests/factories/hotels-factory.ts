import faker from "@faker-js/faker";
import { Hotel, Room } from "@prisma/client";
import { prisma } from "@/config";

export async function createHotel(params: Partial<Hotel> = {}): Promise<Hotel> {

    return prisma.hotel.create({
      data: {
        name: faker.name.firstName(),
        image:faker.image.imageUrl(),
      },
    });
  }

  export async function createRooms(hotel?:Hotel): Promise<Room> {
    const incomingHotel = hotel || (await createHotel());

    return prisma.room.create({
      data: {
        hotelId: incomingHotel.id,
        name: faker.name.firstName(),
        capacity: Number(faker.random.numeric())
      },
    });
  }
  