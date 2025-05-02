import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/edge.js'
import { withAccelerate } from '@prisma/extension-accelerate'
import checkJwt from './auth.js';
import { transactionResponse } from './transformResponse.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient().$extends(withAccelerate())

app.use(cors());
app.use(express.json());

app.get('/transactions', checkJwt, async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: req.auth.sub
            },
            orderBy: { date: 'asc' }
        });
        console.log('Transformed transaction:', transactionResponse(transactions[2]));
        console.log('Raw from DB:', transactions[2]);

        res.json(transactions.map(transactionResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all transactions' });
    }
});

app.post('/transactions', checkJwt, async (req, res) => {
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
                userId: req.auth.sub,
                description,
                type,
                amount,
                isRecurring,
                intervalValue,
                intervalType,
            }
        });
        res.json(transactions.map(transactionResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});


app.put('/transactions/:id', checkJwt, async (req, res) => {
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
            where: { id, userId: req.auth.sub },
            data: {
                date: new Date(date),
                userId: req.auth.sub,
                description,
                type,
                amount,
                isRecurring,
                intervalValue,
                intervalType,
            }
        });
        res.json(transactions.map(transactionResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

app.delete('/transactions/:id', checkJwt, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        await prisma.transaction.delete({
            where: { id, userId: req.auth.sub },
        });
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
});
