import app, { init } from "@/app";
import { prisma } from "@/config";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createTicketTypeHotel, createTicketTypeRemote, createUser } from "../factories";
import { createHotel, createRooms } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
    await cleanDb();
  });
  afterEach(async () => {
    await cleanDb();
  });

const server = supertest(app);

describe("GET / hotels", ()=>{
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      describe("when token is valid", () => {
        it("should respond with status 412 when is do not have Hotel for the user ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id,ticketType.id,'PAID')
             
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
          
            expect(response.status).toBe(httpStatus.PRECONDITION_FAILED);
          });

        it("should respond with status 402 when do not have compleeted payment", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeHotel();
            const ticket = await createTicket(enrollment.id,ticketType.id,'RESERVED')
             
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
          
            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
          });
        
        describe("when user is apt to get hotels", () => {
            it("should respond with status 200 and a list of hotels", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeHotel();
                const ticket = await createTicket(enrollment.id,ticketType.id,'PAID')
                
                await createHotel();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual([{
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String)
            }]);
            });
        });
    });
});

describe("GET /hotels/:hotelId", ()=>{
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels/:hotelId");
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);


        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      describe("when token is valid", () => {
        it("should respond with status 412 when is do not have Hotel for the user ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id,ticketType.id,'PAID')
             
            const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
          
            expect(response.status).toBe(httpStatus.PRECONDITION_FAILED);
          });

        it("should respond with status 402 when do not have compleeted payment", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeHotel();
            const ticket = await createTicket(enrollment.id,ticketType.id,'RESERVED')
             
            const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
          
            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
          });
        
        describe("when user is apt to get hotels", () => {
            it("should respond with status 400 when id passed is not a number", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeHotel();
                const ticket = await createTicket(enrollment.id,ticketType.id,'PAID')  
                
                const hotelId = faker.lorem.word();

            const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        })
        it("should respond with status 404 when not exist hotel with this Id", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeHotel();
            const ticket = await createTicket(enrollment.id,ticketType.id,'PAID')  
            
            const hotelId = 0;

        const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })
            it("should respond with status 200 and an Hotel object with a list of Rooms", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeHotel();
                const ticket = await createTicket(enrollment.id,ticketType.id,'PAID');
                const hotel = await createHotel();
                const room = await createRooms(hotel);

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({
                id: hotel.id,
                name: expect.any(String),
                image: expect.any(String),
                Rooms: [{
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: hotel.id,
                }]
            });
    })
})
})
});
  