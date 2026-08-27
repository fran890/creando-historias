import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  // Clean DB
  await prisma.auditLog.deleteMany();
  await prisma.articleView.deleteMany();
  await prisma.revenueRecord.deleteMany();
  await prisma.authorRevenue.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformSetting.deleteMany();

  // Create Settings
  await prisma.platformSetting.createMany({
    data: [
      { key: "platformSharePercentage", value: "30" },
      { key: "authorSharePercentage", value: "70" },
    ],
  });

  const passwordHashAdmin = await bcrypt.hash("admin123", 12);
  const passwordHashAuthor = await bcrypt.hash("autor123", 12);

  // Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      username: "admin",
      name: "Administrador Principal",
      passwordHash: passwordHashAdmin,
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      bio: "Administrador general y editor jefe de Creando-Historias.",
    },
  });

  // Authors
  const author1 = await prisma.user.create({
    data: {
      email: "autor1@example.com",
      username: "carlos_tech",
      name: "Carlos Mendoza",
      passwordHash: passwordHashAuthor,
      role: "AUTHOR",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "Especialista en Inteligencia Artificial, software y desarrollo web moderno.",
    },
  });

  const author2 = await prisma.user.create({
    data: {
      email: "autor2@example.com",
      username: "elena_finanzas",
      name: "Elena Rostova",
      passwordHash: passwordHashAuthor,
      role: "AUTHOR",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      bio: "Analista de mercados globales, finanzas digitales y negocios sostenibles.",
    },
  });

  const author3 = await prisma.user.create({
    data: {
      email: "autor3@example.com",
      username: "david_estilo",
      name: "David Silva",
      passwordHash: passwordHashAuthor,
      role: "AUTHOR",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      bio: "Periodista enfocado en productividad, cultura, tecnología y estilo de vida.",
    },
  });

  // Categories
  const catTech = await prisma.category.create({
    data: { name: "Tecnología", slug: "tecnologia", description: "Innovación, IA y desarrollo de software." },
  });
  const catBiz = await prisma.category.create({
    data: { name: "Negocios", slug: "negocios", description: "Finanzas, startups y estrategia empresarial." },
  });
  const catCulture = await prisma.category.create({
    data: { name: "Cultura & Estilo", slug: "cultura", description: "Productividad, sociedad y reflexiones." },
  });

  // Tags
  const tagAI = await prisma.tag.create({ data: { name: "IA", slug: "ia" } });
  const tagWeb = await prisma.tag.create({ data: { name: "Web", slug: "web" } });
  const tagStartup = await prisma.tag.create({ data: { name: "Startups", slug: "startups" } });

  // Articles for Author 1 (Carlos Mendoza)
  const art1 = await prisma.article.create({
    data: {
      title: "El Futuro del Desarrollo Web con Next.js y Server Components",
      slug: "futuro-desarrollo-web-nextjs",
      excerpt: "Exploramos cómo la arquitectura basada en servidores está transformando la velocidad y el SEO de las aplicaciones modernas.",
      content: "<p>La web moderna evoluciona a un ritmo sin precedentes. Los React Server Components permiten ejecutar código en el servidor con latencia cero en el cliente...</p><p>Esto no solo mejora los Core Web Vitals sino que optimiza significativamente la indexación por motores de búsqueda.</p>",
      featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
      status: "PUBLISHED",
      categoryId: catTech.id,
      readingTime: 5,
      viewCount: 1450,
      authorId: author1.id,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  const art1B = await prisma.article.create({
    data: {
      title: "Revolución de la IA Generativa en la Creación Editorial",
      slug: "revolucion-ia-generativa-editorial",
      excerpt: "Cómo las herramientas inteligentes están transformando las salas de redacción y los flujos de trabajoPeriodísticos.",
      content: "<p>La inteligencia artificial ha dejado de ser una promesa lejana para convertirse en el asistente de redacción indispensable...</p><p>Desde la estructuración de argumentos hasta la optimización SEO automática, el futuro del periodismo digital se acelera.</p>",
      featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
      status: "PUBLISHED",
      categoryId: catTech.id,
      readingTime: 4,
      viewCount: 920,
      authorId: author1.id,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  // Articles for Author 2 (Elena Rostova)
  const art2 = await prisma.article.create({
    data: {
      title: "Cómo Estructurar un Modelo de Ingresos Recurrentes en 2026",
      slug: "modelo-ingresos-recurrentes-2026",
      excerpt: "Las mejores estrategias para diversificar la monetización editorial y plataformas digitales.",
      content: "<p>La atribución transparente de ingresos es la piedra angular para atraer a los mejores creadores de contenido...</p><p>Modelos mixtos de publicidad programática y reparto equitativo están demostrando ser los más sostenibles.</p>",
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
      status: "PUBLISHED",
      categoryId: catBiz.id,
      readingTime: 4,
      viewCount: 890,
      authorId: author2.id,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  const art2B = await prisma.article.create({
    data: {
      title: "Claves de Inversión y Finanzas Personales para Creadores",
      slug: "claves-inversion-finanzas-creadores",
      excerpt: "Estrategias prácticas para gestionar el flujo de caja e inversiones a largo plazo.",
      content: "<p>La economía de los creadores requiere de una planificación financiera sólida para mitigar la volatilidad mensual de los ingresos...</p>",
      featuredImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200",
      status: "PUBLISHED",
      categoryId: catBiz.id,
      readingTime: 6,
      viewCount: 640,
      authorId: author2.id,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Articles for Admin (Administrador Principal)
  const art3 = await prisma.article.create({
    data: {
      title: "El líder más temido de la prisión humilló al novato que llamaba a su madre: lo que pasó después paralizó a todo el penal",
      slug: "lider-prision-humillo-novato-historia",
      excerpt: "Una historia sobre coraje, dignidad e giros inesperados que nadie en la prisión pudo anticipar jamás.",
      content: "<p>El patio de la prisión estaba cubierto por un silencio denso y amenazante. Marcus, el prisionero más veterano y temido del pabellón B, caminaba con paso firme hacia el nuevo recluso...</p><p>Lo que parecía una simple humillación matutina se convirtió en una lección de vida que cambiaría las reglas del penal para siempre.</p>",
      featuredImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200",
      status: "PUBLISHED",
      categoryId: catCulture.id,
      readingTime: 7,
      viewCount: 3450,
      authorId: admin.id,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const art3B = await prisma.article.create({
    data: {
      title: "Visión General de la Plataforma y Estándares Editoriales 2026",
      slug: "vision-general-de-la-plataforma",
      excerpt: "Un mensaje especial de la administración sobre nuestras políticas de calidad y distribución.",
      content: "<p>Bienvenidos a Creando-Historias. Como administradores, impulsamos la calidad editorial y la atribución justa para cada autor...</p>",
      featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
      status: "PUBLISHED",
      categoryId: catCulture.id,
      readingTime: 3,
      viewCount: 320,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  });

  // Connect tags
  await prisma.articleTag.createMany({
    data: [
      { articleId: art1.id, tagId: tagWeb.id },
      { articleId: art1.id, tagId: tagAI.id },
      { articleId: art2.id, tagId: tagStartup.id },
    ],
  });

  // Simulated Views
  console.log("📊 Generando simulación de visitas y analíticas...");
  const viewsData = [];
  for (let i = 0; i < 50; i++) {
    viewsData.push({
      articleId: art1.id,
      authorId: author1.id,
      country: "ES",
      deviceType: "desktop",
      anonymousSessionHash: `hash-${i}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)),
    });
  }
  for (let i = 0; i < 30; i++) {
    viewsData.push({
      articleId: art2.id,
      authorId: author2.id,
      country: "MX",
      deviceType: "mobile",
      anonymousSessionHash: `hash-m-${i}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)),
    });
  }
  await prisma.articleView.createMany({ data: viewsData });

  console.log("✅ Seed completado con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
