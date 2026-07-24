import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { prisma } from '../index';
export interface AuthRequest extends Request {
  userId?: string;
}

export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    // Modo maqueta: Iniciar sesión automáticamente como Camila
    const user = await prisma.user.findFirst({ where: { email: 'camila@email.com' } });
    if (!user) {
      throw new AppError('No hay usuarios en la DB. Corre el seed.', 500);
    }
    req.userId = user.id;
    next();
  } catch (error) {
    next(error);
  }
}
