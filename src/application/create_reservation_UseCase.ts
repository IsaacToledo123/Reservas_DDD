import { Reservation } from "../domain/entities/reservation";
import { ReservationRepository } from "../domain/repositories/reservation_repository";
import{v4 as uuidv4} from 'uuid';

export class CreateReservationUseCase {
  constructor(private reservationRepository: ReservationRepository) {}

  async execute(
    userId: string,
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Reservation> {
    // Validate input
    if (!userId || !roomId || !startDate || !endDate) {
      throw new Error("Invalid input data");
    }

    // Create a new reservation instance
    const reservation = new Reservation(
      uuidv4(),
      userId,
      roomId,
      startDate,
      endDate,
      'pending'
    );

    // Save the reservation using the repository
    return await this.reservationRepository.create(reservation);
  }
}