const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  const seedSlugs = [
    'hamburguesa-clasica',
    'salchipapas-especiales',
    'jugo-de-fresa',
    'combo-familiar',
    'alitas-acevichadas',
    'almuerzo-del-dia',
    'ensalada-fresca',
    'sandwich-de-chicharron'
  ];
  
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (!seedSlugs.includes(p.slug)) {
      await prisma.cartItem.deleteMany({ where: { productId: p.id }});
      await prisma.orderItem.deleteMany({ where: { productId: p.id }});
      await prisma.favorite.deleteMany({ where: { productId: p.id }});
      await prisma.review.deleteMany({ where: { productId: p.id }});
      await prisma.productOptionGroup.deleteMany({ where: { productId: p.id }});
      await prisma.product.delete({ where: { id: p.id }});
      console.log(`Deleted ${p.name}`);
    }
  }
  console.log('Done cleaning junk products');
}
run();
