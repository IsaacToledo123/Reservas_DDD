import { Request,Response } from "express";
import { CreateUseCase } from "../../application/createUseCase";
import { CancelUseCase } from "../../application/cancelUseCase";

export class ReservationController {
  constructor(
    private createUseCase: CreateUseCase,
    private cancelUseCase: CancelUseCase
  ) {}

  async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body;
      const reservation = await this.createUseCase.execute(input);
      res.status(201).json(reservation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }

  async cancelReservation(req: Request, res: Response): Promise<void> {
    try {
      const { reservationId } = req.params;
      await this.cancelUseCase.execute(reservationId);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }
}