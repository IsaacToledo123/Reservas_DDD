import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

import { MySQLReservationRepository } from './infrastructure/repositories/reservationRepository';
import { Pool } from 'pg';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'reservaciones'
});

import { CreateUseCase } from './application/createUseCase';
import { CancelUseCase } from './application/cancelUseCase';

import { ReservationServices } from './domain/services/reservationServices';

import { ReservationController } from './infrastructure/controllers/ReservationController';



const reservationRepository = new MySQLReservationRepository(pool);
const reservationServices = new ReservationServices(reservationRepository);
const createUseCase = new CreateUseCase(reservationRepository,reservationServices);
const cancelUseCase = new CancelUseCase(reservationRepository, reservationServices);

const reservationController = new ReservationController(createUseCase, cancelUseCase);

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.post('/reservations', (req, res) => reservationController.createReservation(req, res));
app.delete('/reservations/:id', (req, res) => reservationController.cancelReservation(req, res));  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
