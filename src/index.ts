import express from 'express';
import bodyParser from 'body-parser';
import { ReservationController } from './infrastructure/controllers/ReservationController';
import { CreateReservationUseCase } from './application/create_reservation_UseCase';
import { InMemoryReservationRepository } from './infrastructure/database/InMemoryReservation';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const reservationRepository = new InMemoryReservationRepository();
const createReservationUseCase = new CreateReservationUseCase(reservationRepository);
const reservationController = new ReservationController(createReservationUseCase);

app.post('/reservations', async (req, res) => {
    await reservationController.createReservation(req, res);
});

app.get('/reservations', async (req, res) => {
    try {
        const reservations = await reservationRepository.findAll();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reservations' });
    }
});

app.get('/reservations/:id', async (req, res) => {
    try {
        const reservation = await reservationRepository.findById(req.params.id);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the reservation' });
    }
});

app.delete('/reservations/:id', async (req, res) => {
    try {
        await reservationRepository.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the reservation' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});