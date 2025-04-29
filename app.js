import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/transactions/:date', async (req, res) => {
    const date = req.params.date;
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                date: new Date(date)
            },
            orderBy: { createdAt: 'asc' },
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.post('/transactions', async (req, res) => {
    const {
        date,
        description,
        type,
        amount,
        isRecurring,
        intervalValue,
        intervalType
    } = req.body;

    try {
        const transaction = await prisma.transaction.create({
            data: {
                date: new Date(date),
                description,
                type,
                amount,
                isRecurring,
                intervalValue,
                intervalType,
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});


app.put('/transactions/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const {
        date,
        description,
        type,
        amount,
        isRecurring,
        intervalValue,
        intervalType
    } = req.body;

    try {
        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                date: new Date(date),
                description,
                type,
                amount,
                isRecurring,
                intervalValue,
                intervalType,
            }
        });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

app.delete('/transactions/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        await prisma.transaction.delete({
            where: { id }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
});
