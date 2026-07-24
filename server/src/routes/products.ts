import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { category, search, featured, page = '1', limit = '12' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { active: true };
    if (category) where.categoryId = category;
    if (search) where.name = { contains: String(search), mode: 'insensitive' };
    if (featured === 'true') where.featured = true;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true, reviews: { include: { user: { select: { name: true, image: true } } } } },
    });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug/options', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const groups = await prisma.productOptionGroup.findMany({
      where: { productId: product.id },
      include: { options: { where: { active: true }, orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    res.json(groups);
  } catch (error) {
    next(error);
  }
});

export default router;
