import mysql from 'mysql2/promise';
import {Reservation} from '../../domain/entities/reservation';
import {ReservationRepository} from '../../domain/repositories/reservation_repository';

export class MySQLReservationRepository implements ReservationRepository {
  private pool: mysql.Pool;
  private isInitialized: boolean = false;

  constructor(pool: mysql.Pool) {
    this.pool = pool;
  }

  // Método para inicializar las tablas
  private async ensureTablesExist(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS reservations (
          id VARCHAR(255) PRIMARY KEY,
          userId VARCHAR(255) NOT NULL,
          roomId VARCHAR(255) NOT NULL,
          startDate DATETIME NOT NULL,
          endDate DATETIME NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_reservations_userId (userId),
          INDEX idx_reservations_roomId (roomId),
          INDEX idx_reservations_status (status),
          INDEX idx_reservations_dates (startDate, endDate)
        ) ENGINE=InnoDB;
      `;

      await this.pool.execute(createTableQuery);
      this.isInitialized = true;
      console.log('Tablas de reservaciones inicializadas correctamente');
    } catch (error) {
      console.error('Error al crear las tablas:', error);
      throw new Error(`Error al inicializar las tablas: ${error}`);
    }
  }

  // Método público para inicializar manualmente (opcional)
  async initialize(): Promise<void> {
    await this.ensureTablesExist();
  }

  async create(reservation: Reservation): Promise<Reservation> {
    await this.ensureTablesExist();
    
    const query = `
      INSERT INTO reservations (id, userId, roomId, startDate, endDate, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      reservation.id, 
      reservation.userId, 
      reservation.roomId, 
      reservation.startDate, 
      reservation.endDate, 
      reservation.status
    ];
    
    await this.pool.execute(query, values);
    
    // Recuperar el registro creado
    const [rows] = await this.pool.execute(
      'SELECT * FROM reservations WHERE id = ?', 
      [reservation.id]
    ) as any;
    
    return rows[0];
  }

  async findById(id: string): Promise<Reservation | null> {
    await this.ensureTablesExist();
    
    const query = 'SELECT * FROM reservations WHERE id = ?';
    const [rows] = await this.pool.execute(query, [id]) as any;
    return rows[0] || null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    await this.ensureTablesExist();
    
    const query = 'SELECT * FROM reservations WHERE userId = ? ORDER BY startDate DESC';
    const [rows] = await this.pool.execute(query, [userId]) as any;
    return rows;
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    await this.ensureTablesExist();
    
    const query = 'SELECT * FROM reservations WHERE roomId = ? ORDER BY startDate DESC';
    const [rows] = await this.pool.execute(query, [roomId]) as any;
    return rows;
  }

  async update(reservation: Reservation): Promise<Reservation> {
    await this.ensureTablesExist();
    
    const query = `
      UPDATE reservations 
      SET userId = ?, roomId = ?, startDate = ?, endDate = ?, status = ? 
      WHERE id = ?
    `;
    const values = [
      reservation.userId, 
      reservation.roomId, 
      reservation.startDate, 
      reservation.endDate, 
      reservation.status, 
      reservation.id
    ];
    
    await this.pool.execute(query, values);
    
    // Recuperar el registro actualizado
    const [rows] = await this.pool.execute(
      'SELECT * FROM reservations WHERE id = ?', 
      [reservation.id]
    ) as any;
    
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.ensureTablesExist();
    
    const query = 'DELETE FROM reservations WHERE id = ?';
    await this.pool.execute(query, [id]);
  }

  async findAll(): Promise<Reservation[]> {
    await this.ensureTablesExist();
    
    const query = 'SELECT * FROM reservations ORDER BY createdAt DESC';
    const [rows] = await this.pool.execute(query) as any;
    return rows;
  }

  // Métodos adicionales útiles
  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    await this.ensureTablesExist();
    
    const query = `
      SELECT * FROM reservations 
      WHERE (startDate BETWEEN ? AND ?) 
         OR (endDate BETWEEN ? AND ?)
         OR (startDate <= ? AND endDate >= ?)
      ORDER BY startDate ASC
    `;
    const [rows] = await this.pool.execute(query, [
      startDate, endDate, 
      startDate, endDate, 
      startDate, endDate
    ]) as any;
    return rows;
  }

  async findByStatus(status: string): Promise<Reservation[]> {
    await this.ensureTablesExist();
    
    const query = 'SELECT * FROM reservations WHERE status = ? ORDER BY startDate DESC';
    const [rows] = await this.pool.execute(query, [status]) as any;
    return rows;
  }

  // Método para verificar conflictos de reserva
  async findConflictingReservations(roomId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<Reservation[]> {
    await this.ensureTablesExist();
    
    let query = `
      SELECT * FROM reservations 
      WHERE roomId = ? 
        AND status != 'cancelled'
        AND (
          (startDate BETWEEN ? AND ?) 
          OR (endDate BETWEEN ? AND ?)
          OR (startDate <= ? AND endDate >= ?)
        )
    `;
    const values: any[] = [
      roomId, 
      startDate, endDate, 
      startDate, endDate, 
      startDate, endDate
    ];

    if (excludeId) {
      query += ' AND id != ?';
      values.push(excludeId);
    }

    const [rows] = await this.pool.execute(query, values) as any;
    return rows;
  }
}