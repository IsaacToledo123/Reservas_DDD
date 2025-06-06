import { Reservation } from "../domain/entities/reservation";
import { ReservationRepository } from "../domain/repositories/reservation_repository";
import { ReservationServices } from "../domain/services/reservationServices";
import{v4 as uuidv4} from 'uuid';

export class CreateUseCase {
  constructor(private reservationRepository: ReservationRepository ,private reservationServices:ReservationServices) {}

  async execute(input: {
    userId: string,
    roomId: string,
    startDate: Date,
    endDate: Date
  }): Promise<Reservation> {
    const { userId, roomId, startDate, endDate } = input;

    // Validate the reservation dates
    const isAvailable = await this.reservationServices.createReservation(userId, roomId, startDate, endDate);
    if (!isAvailable) {
      throw new Error('Room is not available for the selected dates');
    }

    // Create a new reservation
    const reservation = new Reservation(
      uuidv4(), // Generate a unique ID for the reservation
      userId,
      roomId,
      startDate,
      endDate,
      'pending' // Initial status is 'pending'
    );

    // Save the reservation to the repository
    return this.reservationRepository.create(reservation);
  }
}
