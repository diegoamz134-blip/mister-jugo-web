import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  // ── Usuarios ───────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@misterjugo.com' },
    update: {},
    create: {
      name: 'Admin Mister Jugo',
      email: 'admin@misterjugo.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+51999999999',
      address: 'Av. Principal 123, Lima',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'camila@email.com' },
    update: {},
    create: {
      name: 'Camila',
      email: 'camila@email.com',
      password: hashedPassword,
      phone: '+51988888888',
      address: 'Calle Las Flores 456, Miraflores',
    },
  });

  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  // ── Categorías ─────────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Hamburguesas', slug: 'hamburguesas', icon: '🍔', color: '#FFF3E0', order: 1 },
    { name: 'Salchipapas',  slug: 'salchipapas',  icon: '🍟', color: '#FFF8E1', order: 2 },
    { name: 'Jugos Frescos',slug: 'jugos-frescos', icon: '🥤', color: '#E8F5E9', order: 3 },
    { name: 'Combos',       slug: 'combos',        icon: '🎉', color: '#FCE4EC', order: 4 },
    { name: 'Alitas',       slug: 'alitas',        icon: '🍗', color: '#FFF3E0', order: 5 },
    { name: 'Almuerzos',    slug: 'almuerzos',     icon: '🍱', color: '#E8F5E9', order: 6 },
    { name: 'Ensaladas',    slug: 'ensaladas',     icon: '🥗', color: '#F1F8E9', order: 7 },
    { name: 'Sandwich',     slug: 'sandwich',      icon: '🥪', color: '#FFF8E1', order: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }

  // ── Productos destacados (uno por imagen de assets) ─────────────────────────
  // Las imágenes están en /images/ (client/public/images/)
  const products = [
    {
      name: 'Hamburguesa Clásica',
      slug: 'hamburguesa-clasica',
      description: 'Jugosa hamburguesa con carne de res, lechuga, tomate, cebolla y nuestra salsa especial de la casa.',
      price: 18.9,
      discountPrice: 22.0,
      image: '/images/hamburgesas.png',
      rating: 4.8,
      ratingCount: 124,
      prepTime: 15,
      categoryId: categories['hamburguesas'],
      featured: true,
    },
    {
      name: 'Salchipapas Especiales',
      slug: 'salchipapas-especiales',
      description: 'Papas fritas crujientes con salchichas premium, acompañadas de nuestras salsas secretas.',
      price: 14.5,
      image: '/images/salchipapas.png',
      rating: 4.6,
      ratingCount: 98,
      prepTime: 10,
      categoryId: categories['salchipapas'],
      featured: true,
    },
    {
      name: 'Jugo de Fresa',
      slug: 'jugo-de-fresa',
      description: 'Refrescante jugo natural de fresas seleccionadas, sin azúcar añadida. 100% fruta fresca.',
      price: 8.5,
      image: '/images/jugos.png',
      rating: 4.9,
      ratingCount: 210,
      prepTime: 5,
      categoryId: categories['jugos-frescos'],
      featured: true,
    },
    {
      name: 'Combo Familiar',
      slug: 'combo-familiar',
      description: '2 hamburguesas clásicas + 2 salchipapas medianas + 2 jugos frescos a tu elección. ¡El favorito de la familia!',
      price: 52.0,
      discountPrice: 65.0,
      image: '/images/hamburgesas.png',
      rating: 4.7,
      ratingCount: 75,
      prepTime: 20,
      categoryId: categories['combos'],
      featured: true,
    },
    {
      name: 'Alitas Acevichadas',
      slug: 'alitas-acevichadas',
      description: 'Alitas de pollo al estilo ceviche: marinadas en leche de tigre, ají amarillo y culantro. Crujientes, jugosas y llenas de sabor peruano.',
      price: 22.0,
      image: '/images/alitas.png',
      rating: 4.8,
      ratingCount: 156,
      prepTime: 25,
      categoryId: categories['alitas'],
      featured: true,
    },
    {
      name: 'Almuerzo del Día',
      slug: 'almuerzo-del-dia',
      description: 'Lomo saltado, fetuccini, ensalada proteica y más. Menú completo que cambia cada día con los mejores platos de la cocina peruana.',
      price: 16.0,
      image: '/images/almuerzos.png',
      rating: 4.5,
      ratingCount: 88,
      prepTime: 20,
      categoryId: categories['almuerzos'],
      featured: true,
    },
    {
      name: 'Ensalada Fresca',
      slug: 'ensalada-fresca',
      description: 'Mix de lechugas, tomate cherry, pepino, zanahoria rallada y aderezo de limón con hierbas frescas.',
      price: 12.0,
      image: '/images/ensaladas.png',
      rating: 4.4,
      ratingCount: 62,
      prepTime: 8,
      categoryId: categories['ensaladas'],
      featured: true,
    },
    {
      name: 'Sandwich de Chicharrón',
      slug: 'sandwich-de-chicharron',
      description: 'Chicharrón de cerdo crocante con salsa criolla de cebolla morada, camote sancochado y ají amarillo en pan francés recién horneado.',
      price: 15.5,
      image: '/images/sandwich.png',
      rating: 4.6,
      ratingCount: 103,
      prepTime: 12,
      categoryId: categories['sandwich'],
      featured: true,
    },
  ];

  // Limpiar slugs renombrados para evitar duplicados
  await prisma.product.deleteMany({
    where: { slug: { in: ['alitas-bbq', 'sandwich-de-pollo'] } },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { name: product.name, description: product.description },
      create: product,
    });
  }

  console.log('✅ Seed completado: categorías + 8 productos destacados creados.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
