import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class TrackerController {

    async UpdateMyState(req: Request, res: Response): Promise<any> {

        const { cordinates, userId } = req.body;

        if (!cordinates || !userId) {
            return res.status(400).json({ message: "Cordinates and userId are required" });
        }

        try {
            // see if these cordinates are in the bus_stop model

            /*

model BusStops {
  id          Int    @id
  userId      Int
  source      String
  destination String
  user        User   @relation(fields: [userId], references: [id])
}
            */

            // is it destination?
            const isDestination = await prisma.busStops.findFirst({
                where: {
                    userId: userId,
                    destination: {
                        contains: cordinates
                    }
                }
            });

            if (isDestination) {
                // update the user state to "AT_DESTINATION"
                await prisma.user.update({
                    where: { id: userId },
                    data: { state: "DESTINATION" }
                });
                return res.status(200).json({ message: "User state updated to AT_DESTINATION" });
            }

            // is it source?
            const isSource = await prisma.busStops.findFirst({
                where: {
                    userId: userId,
                    source: {
                        contains: cordinates
                    }
                }
            });

            if (isSource) {
                // update the user state to "AT_SOURCE"
                await prisma.user.update({
                    where: { id: userId },
                    data: { state: "SOURCE" }
                });
                return res.status(200).json({ message: "User state updated to AT_SOURCE" });
            }

            // if not found in both, update the user state to "UNKNOWN"
            await prisma.user.update({
                where: { id: userId },
                data: { state: "UNKNOWN" }
            });
            return res.status(200).json({ message: "User state updated to UNKNOWN" });



        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
            console.error("Error updating user state:", error);
        }


    }
}