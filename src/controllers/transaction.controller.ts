import { Request, Response } from 'express';
import {
  createTransaction,
  deleteTransaction,
  findTransactionsByUserId,
} from '../services/transaction.service';
import { logger } from '../utils/logger.util';

interface CreateTransactionInput {
  amount: number;
  userId: number;
  status: 'pending' | 'success' | 'cancelled' | 'created';
  type: 'debit' | 'credit';
}

export async function createTransactionHandler(
  req: Request<{}, {}, CreateTransactionInput>,
  res: Response
) {
  try {
    const { amount, type, userId, status } = req.body;

    const transaction = await createTransaction({
      amount,
      status,
      type,
      userId,
    });

    if (!transaction) {
      return res.status(400).send('Insufficient balance');
    }

    return res.status(201).send(transaction);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error.message);
  }
}

export async function getAllTransactionByUserIdHandler(
  req: Request<{}, {}, {}, { userId: string }>,
  res: Response
) {
  try {
    const { userId } = req.query;
    const transactions = await findTransactionsByUserId(parseInt(userId));
    return res.status(200).send(transactions);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error.message);
  }
}

export async function deleteTransactionHandler(
  req: Request<{}, {}, { id: number }>,
  res: Response
) {
  try {
    const { id } = req.body;
    const transaction = await deleteTransaction(id);
    return res.status(200).send(transaction);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error.message);
  }
}
