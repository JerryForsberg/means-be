import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/edge.js'
import { withAccelerate } from '@prisma/extension-accelerate'
import { checkJwt } from './auth.js';


dotenv.config();
const app = express();
const prisma = new PrismaClient().$extends(withAccelerate())


app.use(cors());
app.use(express.json());

app.get('/transactions', checkJwt, async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: req.user.sub
            },
            orderBy: { date: 'asc' }
        });
        res.json(transactions);
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
                userId: req.user.sub,
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
            where: { id, userId: req.user.sub },
            data: {
                date: new Date(date),
                userId: req.user.sub,
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
        console.error(error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

app.delete('/transactions/:id', checkJwt, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        await prisma.transaction.delete({
            where: { id, userId: req.user.sub },
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
