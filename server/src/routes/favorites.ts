import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites);
  } catch (error) {
    next(error);
  }
});

router.post('/:productId', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: req.userId!, productId: req.params.productId } },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      res.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: { userId: req.userId!, productId: req.params.productId },
      });
      res.json({ favorited: true });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
