import { ReservationRepository } from "../domain/repositories/reservation_repository";
import { ReservationServices } from "../domain/services/reservationServices";

export class CancelUseCase {
  constructor(
    private reservationRepository: ReservationRepository,
    private reservationServices: ReservationServices
  ) {}

  async execute(reservationId: string): Promise<void> {
    // Find the reservation by ID
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Check if the reservation can be cancelled
    if (reservation.status === 'cancelled') {
      throw new Error('Reservation is already cancelled');
    }

    // Update the reservation status to 'cancelled'
    reservation.status = 'cancelled';
    await this.reservationRepository.update(reservation);
  }
}