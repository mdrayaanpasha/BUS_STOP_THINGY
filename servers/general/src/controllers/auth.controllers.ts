import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class AuthController {
    async Register(req: Request, res: Response): Promise<any> {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password, and name are required" });
        }

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            let newUser = null;

            while (true) {
                const randomId = Math.floor(Math.random() * 1000000);

                const idExists = await prisma.user.findUnique({ where: { id: randomId } });

                if (!idExists) {
                    newUser = await prisma.user.create({
                        data: {
                            id: randomId,
                            email,
                            password: hashedPassword,
                            name,
                            state: "UNKNOWN"
                        }
                    });
                    break; // Exit the loop once successful
                }
                // Optional: Add a console log for debugging
                console.log(`ID ${randomId} already exists, retrying...`);
            }

            return res.status(201).json({ message: "User created successfully", user: newUser });

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async Login(req: Request, res: Response): Promise<any> {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Here you would typically generate a JWT token and send it back
            return res.status(200).json({ message: "Login successful", user });

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}

export default new AuthController();
