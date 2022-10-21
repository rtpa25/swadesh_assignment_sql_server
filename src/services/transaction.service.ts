import {
  adminUserUuid,
  oneMinuteInMilliseconds,
} from '../utils/constants.util';
import prisma from '../utils/prisma.util';
import { findUserById } from './user.service';

interface CreateTransactionInput {
  amount: number;
  userId: number;
  status: 'pending' | 'success' | 'cancelled' | 'created';
  type: 'debit' | 'credit';
}

export async function createTransaction(input: CreateTransactionInput) {
  const { amount, userId, type } = input;

  if (amount > 1000 && type === 'credit') {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        status: 'cancelled',
        type,
        userId,
      },
    });
    return transaction;
  } else if (amount <= 500 && type === 'credit') {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        status: 'pending',
        type,
        userId,
      },
    });

    const incUserBalance = prisma.user.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        id: userId,
      },
    });

    const decAdminBalance = prisma.user.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        uuid: adminUserUuid,
      },
    });

    await prisma.$transaction([incUserBalance, decAdminBalance]);

    //artificial delay of 1 minute
    setTimeout(async () => {
      await prisma.transaction.update({
        data: {
          status: 'success',
        },
        where: {
          id: transaction.id,
        },
      });
    }, oneMinuteInMilliseconds);
    return transaction;
  } else if (amount <= 1000 && amount > 500 && type === 'credit') {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        status: 'pending',
        type,
        userId,
      },
    });

    const incUserBalance = prisma.user.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        id: userId,
      },
    });

    const decAdminBalance = prisma.user.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        uuid: adminUserUuid,
      },
    });

    await prisma.$transaction([incUserBalance, decAdminBalance]);

    //artificial delay of 1 minute
    setTimeout(async () => {
      await prisma.transaction.update({
        data: {
          status: 'success',
        },
        where: {
          id: transaction.id,
        },
      });
    }, oneMinuteInMilliseconds * 5);
    return transaction;
  } else if (type === 'debit') {
    const currentUser = await findUserById(userId);
    if (currentUser) {
      if (currentUser.balance.toNumber() < amount) {
        return null;
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        status: 'success',
        type,
        userId,
      },
    });

    const decUserBalance = prisma.user.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        id: userId,
      },
    });

    const incAdminBalance = prisma.user.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        uuid: adminUserUuid,
      },
    });

    await prisma.$transaction([decUserBalance, incAdminBalance]);

    return transaction;
  } else {
    throw new Error('should never come here');
  }
}

export async function findTransactionById(id: number) {
  return prisma.transaction.findUnique({ where: { id } });
}

export async function findTransactionsByUserId(userId: number) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteTransaction(id: number) {
  return prisma.transaction.delete({ where: { id } });
}
