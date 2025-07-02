import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


class userController {


    async addCordinate(req: Request, res: Response): Promise<any> {
        const { cordinates } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!cordinates) {
            return res.status(400).json({ message: "Cordinates and token are required" });
        }


        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            const userId = (decoded as { id: number }).id;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token" });
            }
            // Check if the user exists
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Update the user's cordinates

            //create randomid 
            let randomid = Math.floor(Math.random() * 1000000);
            let idExists = await prisma.busStops.findUnique({ where: { id: randomid } });
            while (idExists) {
                // If the ID exists, generate a new one
                randomid = Math.floor(Math.random() * 1000000);
                idExists = await prisma.busStops.findUnique({ where: { id: randomid } });
            }



            const BusStopCreation = await prisma.busStops.create({
                data: {
                    id: randomid,
                    userId: user.id,
                    source: cordinates.source,
                    destination: cordinates.destination,

                }
            })
            return res.status(201).json({
                message: "Cordinates added successfully",
                busStop: BusStopCreation
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });

        }
    }
}