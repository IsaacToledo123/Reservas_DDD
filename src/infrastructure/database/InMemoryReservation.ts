import { ReservationRepository } from "../../domain/repositories/reservation_repository";
import { Reservation } from "../../domain/entities/reservation";

export class InMemoryReservationRepository implements ReservationRepository {
  private reservations: Reservation[] = [];

  async create(reservation: Reservation): Promise<Reservation> {
    this.reservations.push(reservation);
    return reservation;
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservations.find(reservation => reservation.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.userId === userId);
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.roomId === roomId);
  }

  async update(reservation: Reservation): Promise<Reservation> {
    const index = this.reservations.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      this.reservations[index] = reservation;
      return reservation;
    }
    throw new Error('Reservation not found');
  }

  async delete(id: string): Promise<void> {
    this.reservations = this.reservations.filter(reservation => reservation.id !== id);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservations;
  }
}