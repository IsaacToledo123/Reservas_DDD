import { Reservation } from "../entities/reservation";


export interface ReservationRepository {
  create(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findByRoomId(roomId: string): Promise<Reservation[]>;
  update(reservation: Reservation): Promise<Reservation>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Reservation[]>;
}