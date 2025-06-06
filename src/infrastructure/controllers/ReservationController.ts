import { Request,Response } from "express";
import { CreateReservationUseCase } from "../../application/create_reservation_UseCase"; 

export class ReservationController {
    constructor(private createReservationUseCase: CreateReservationUseCase) {}
    
    async createReservation(req: Request, res: Response): Promise<Response> {
        try {
        const { userId, roomId, startDate, endDate } = req.body;
    
        // Validate input
        if (!userId || !roomId || !startDate || !endDate) {
            return res.status(400).json({ error: "Invalid input data" });
        }
    
        // Create reservation
        const reservation = await this.createReservationUseCase.execute(
            userId,
            roomId,
            new Date(startDate),
            new Date(endDate)
        );
    
        return res.status(201).json(reservation);
        } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unknown error occurred" });
        }
    }
    }