import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId! },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

router.post('/add', async (req: AuthRequest, res, next) => {
  try {
    const { productId, quantity = 1, options = '[]' } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.userId! } });
    }

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, options },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
});

router.put('/item/:itemId', async (req: AuthRequest, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity },
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete('/item/:itemId', async (req: AuthRequest, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    next(error);
  }
});

export default router;
