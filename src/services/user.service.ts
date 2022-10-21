import Prisma from '../utils/prisma.util';

export async function createUser(uuid: string) {
  return Prisma.user.create({ data: { uuid } });
}

export async function findUserByUuid(uuid: string) {
  return Prisma.user.findUnique({ where: { uuid } });
}

export async function findUserById(id: number) {
  return Prisma.user.findUnique({ where: { id } });
}

export async function updateUserById(
  id: number,
  amount: number,
  type: 'credit' | 'debit'
) {
  if (type === 'credit') {
    return Prisma.user.update({
      where: { id },
      data: { balance: { increment: amount } },
    });
  } else {
    return Prisma.user.update({
      where: { id },
      data: { balance: { decrement: amount } },
    });
  }
}

export async function updateAdminBalance(
  amount: number,
  type: 'credit' | 'debit'
) {
  if (type === 'credit') {
    return Prisma.user.update({
      where: { uuid: 'admin' },
      data: { balance: { decrement: amount } },
    });
  } else {
    return Prisma.user.update({
      where: { uuid: 'admin' },
      data: { balance: { increment: amount } },
    });
  }
}
