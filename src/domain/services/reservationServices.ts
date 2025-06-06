import { Reservation } from "../entities/reservation";
import { ReservationRepository } from "../repositories/reservation_repository";

export class ReservationServices {
  constructor(private reservationRepository: ReservationRepository) {}

  async createReservation(
    userId: string,
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const reservation= await this.reservationRepository.findByRoomId(roomId);

    for (const res of reservation) {
        const overlap =
        res.status !== 'cancelled' &&
        startDate < res.endDate &&
        endDate > res.startDate; 
        if (overlap) {
            throw new Error('Room is not available for the selected dates');
        }   
        
}
return true;
}}
