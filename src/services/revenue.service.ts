import { prisma } from "../lib/prisma";

export interface MonetizationSettings {
  platformSharePercentage: number;
  authorSharePercentage: number;
}

export interface AuthorMonthlyBreakdown {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  articlesCount: number;
  monthlyViews: number;
  grossRevenue: number;
  authorSharePct: number;
  platformSharePct: number;
  authorShareAmount: number;
  platformShareAmount: number;
  isCustomShare: boolean;
  status: "CALCULATED" | "SETTLED";
}

export interface MonthlyRevenueReport {
  year: number;
  month: number;
  monthName: string;
  startDate: Date;
  endDate: Date;
  totalViews: number;
  grossEstimatedRevenue: number;
  totalAuthorShareAmount: number;
  totalPlatformShareAmount: number;
  authorsCount: number;
  isCurrentMonth: boolean;
  rpmEstimate: number;
  authors: AuthorMonthlyBreakdown[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getMonetizationSettings(): Promise<MonetizationSettings> {
  const platformSetting = await prisma.platformSetting.findUnique({
    where: { key: "platformSharePercentage" },
  });

  const authorSetting = await prisma.platformSetting.findUnique({
    where: { key: "authorSharePercentage" },
  });

  return {
    platformSharePercentage: platformSetting ? parseFloat(platformSetting.value) : 30,
    authorSharePercentage: authorSetting ? parseFloat(authorSetting.value) : 70,
  };
}

export async function updateMonetizationSettings(settings: MonetizationSettings) {
  await prisma.platformSetting.upsert({
    where: { key: "platformSharePercentage" },
    update: { value: settings.platformSharePercentage.toString() },
    create: { key: "platformSharePercentage", value: settings.platformSharePercentage.toString() },
  });

  await prisma.platformSetting.upsert({
    where: { key: "authorSharePercentage" },
    update: { value: settings.authorSharePercentage.toString() },
    create: { key: "authorSharePercentage", value: settings.authorSharePercentage.toString() },
  });
}

/**
 * Generates a detailed monthly revenue report with per-user breakdown and platform cuts.
 */
export async function getMonthlyRevenueReport(
  year?: number,
  month?: number,
  rpmEstimate: number = 4.50
): Promise<MonthlyRevenueReport> {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = month || (now.getMonth() + 1);

  const startDate = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0);
  const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

  const isCurrentMonth = targetYear === now.getFullYear() && targetMonth === (now.getMonth() + 1);
  const defaultSettings = await getMonetizationSettings();

  // Fetch all users with custom shares or role AUTHOR/ADMIN
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      role: true,
      customAuthorShare: true,
      _count: {
        select: {
          articles: {
            where: {
              status: "PUBLISHED",
              publishedAt: { gte: startDate, lte: endDate }
            }
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });

  let totalViews = 0;
  let grossEstimatedRevenue = 0;
  let totalAuthorShareAmount = 0;
  let totalPlatformShareAmount = 0;

  const authorsBreakdown: AuthorMonthlyBreakdown[] = [];

  for (const user of users) {
    const userViews = await prisma.articleView.count({
      where: {
        authorId: user.id,
        timestamp: { gte: startDate, lte: endDate }
      }
    });

    const authorSharePct = user.customAuthorShare ?? defaultSettings.authorSharePercentage;
    const platformSharePct = 100 - authorSharePct;

    const userGross = (userViews / 1000) * rpmEstimate;
    const authorAmount = (userGross * authorSharePct) / 100;
    const platformAmount = (userGross * platformSharePct) / 100;

    totalViews += userViews;
    grossEstimatedRevenue += userGross;
    totalAuthorShareAmount += authorAmount;
    totalPlatformShareAmount += platformAmount;

    authorsBreakdown.push({
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
      articlesCount: user._count.articles,
      monthlyViews: userViews,
      grossRevenue: Math.round(userGross * 100) / 100,
      authorSharePct,
      platformSharePct,
      authorShareAmount: Math.round(authorAmount * 100) / 100,
      platformShareAmount: Math.round(platformAmount * 100) / 100,
      isCustomShare: user.customAuthorShare !== null && user.customAuthorShare !== undefined,
      status: isCurrentMonth ? "CALCULATED" : "SETTLED",
    });
  }

  // Sort authors by views/revenue descending
  authorsBreakdown.sort((a, b) => b.monthlyViews - a.monthlyViews);

  return {
    year: targetYear,
    month: targetMonth,
    monthName: `${MONTH_NAMES[targetMonth - 1]} ${targetYear}`,
    startDate,
    endDate,
    totalViews,
    grossEstimatedRevenue: Math.round(grossEstimatedRevenue * 100) / 100,
    totalAuthorShareAmount: Math.round(totalAuthorShareAmount * 100) / 100,
    totalPlatformShareAmount: Math.round(totalPlatformShareAmount * 100) / 100,
    authorsCount: authorsBreakdown.length,
    isCurrentMonth,
    rpmEstimate,
    authors: authorsBreakdown,
  };
}

/**
 * Returns available monthly options for report filtering (last 12 months).
 */
export function getAvailableMonthlyPeriods(): Array<{ year: number; month: number; label: string }> {
  const periods = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
    });
  }

  return periods;
}

export async function calculateAuthorEstimatedRevenue(authorId: string, rpmEstimate: number = 4.50) {
  const defaultSettings = await getMonetizationSettings();

  const authorUser = await prisma.user.findUnique({
    where: { id: authorId },
    select: { customAuthorShare: true },
  });

  const authorSharePercentage = authorUser?.customAuthorShare ?? defaultSettings.authorSharePercentage;
  const platformSharePercentage = 100 - authorSharePercentage;

  const totalViews = await prisma.articleView.count({
    where: { authorId },
  });

  const grossEstimatedRevenue = (totalViews / 1000) * rpmEstimate;

  const authorShare = (grossEstimatedRevenue * authorSharePercentage) / 100;
  const platformShare = (grossEstimatedRevenue * platformSharePercentage) / 100;

  return {
    authorId,
    totalViews,
    rpmEstimate,
    grossEstimatedRevenue: Math.round(grossEstimatedRevenue * 100) / 100,
    authorShareAmount: Math.round(authorShare * 100) / 100,
    platformShareAmount: Math.round(platformShare * 100) / 100,
    platformSharePercentage,
    authorSharePercentage,
    isCustomShare: authorUser?.customAuthorShare !== null && authorUser?.customAuthorShare !== undefined,
    isEstimate: true,
  };
}

export async function getGlobalRevenueSummary(rpmEstimate: number = 4.50) {
  const defaultSettings = await getMonetizationSettings();

  const totalViews = await prisma.articleView.count();
  const grossEstimatedRevenue = (totalViews / 1000) * rpmEstimate;

  const totalAuthorShare = (grossEstimatedRevenue * defaultSettings.authorSharePercentage) / 100;
  const totalPlatformShare = (grossEstimatedRevenue * defaultSettings.platformSharePercentage) / 100;

  const importedRevenueRecords = await prisma.revenueRecord.findMany({
    where: { source: "MANUAL_IMPORT" },
  });

  const totalImportedRevenue = importedRevenueRecords.reduce((acc, curr) => acc + curr.estimatedRevenue, 0);

  return {
    totalViews,
    rpmEstimate,
    grossEstimatedRevenue: Math.round(grossEstimatedRevenue * 100) / 100,
    totalAuthorShare: Math.round(totalAuthorShare * 100) / 100,
    totalPlatformShare: Math.round(totalPlatformShare * 100) / 100,
    totalImportedRevenue: Math.round(totalImportedRevenue * 100) / 100,
    settings: defaultSettings,
  };
}
