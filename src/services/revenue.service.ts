import { prisma } from "../lib/prisma";

export interface MonetizationSettings {
  platformSharePercentage: number;
  authorSharePercentage: number;
}

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
 * Calculates estimated revenue attributed to an author based on view counts and RPM (Revenue Per Mille).
 * Distinguishes clearly between estimated and actual revenue records.
 */
export async function calculateAuthorEstimatedRevenue(authorId: string, rpmEstimate: number = 4.50) {
  const settings = await getMonetizationSettings();

  // Get total views for author
  const totalViews = await prisma.articleView.count({
    where: { authorId },
  });

  // Calculate gross estimated revenue (e.g. 1000 views * $4.50 RPM = $4.50 gross)
  const grossEstimatedRevenue = (totalViews / 1000) * rpmEstimate;

  const authorShare = (grossEstimatedRevenue * settings.authorSharePercentage) / 100;
  const platformShare = (grossEstimatedRevenue * settings.platformSharePercentage) / 100;

  return {
    authorId,
    totalViews,
    rpmEstimate,
    grossEstimatedRevenue: Math.round(grossEstimatedRevenue * 100) / 100,
    authorShareAmount: Math.round(authorShare * 100) / 100,
    platformShareAmount: Math.round(platformShare * 100) / 100,
    platformSharePercentage: settings.platformSharePercentage,
    authorSharePercentage: settings.authorSharePercentage,
    isEstimate: true,
  };
}

export async function getGlobalRevenueSummary(rpmEstimate: number = 4.50) {
  const settings = await getMonetizationSettings();

  const totalViews = await prisma.articleView.count();
  const grossEstimatedRevenue = (totalViews / 1000) * rpmEstimate;

  const totalAuthorShare = (grossEstimatedRevenue * settings.authorSharePercentage) / 100;
  const totalPlatformShare = (grossEstimatedRevenue * settings.platformSharePercentage) / 100;

  // Real/Imported revenue records count
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
    settings,
  };
}
