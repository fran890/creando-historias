import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicDomain = process.env.R2_PUBLIC_DOMAIN;

const isR2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && bucketName
);

let r2Client: S3Client | null = null;

if (isR2Configured) {
  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

export async function uploadToCloudflareR2({
  buffer,
  filename,
  contentType,
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
}): Promise<{ url: string } | null> {
  if (!isR2Configured || !r2Client) {
    return null;
  }

  const fileExtension = filename.substring(filename.lastIndexOf("."));
  const uniqueKey = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  // Return public CDN URL (custom domain e.g. https://images.creandohistorias.com/uploads/... or r2.dev)
  const baseUrl = publicDomain
    ? publicDomain.replace(/\/$/, "")
    : `https://${bucketName}.${accountId}.r2.dev`;

  const publicUrl = `${baseUrl}/${uniqueKey}`;

  return { url: publicUrl };
}

function getConfiguredPublicBaseUrl(): string | null {
  if (publicDomain) return publicDomain.replace(/\/$/, "");
  if (bucketName && accountId) return `https://${bucketName}.${accountId}.r2.dev`;
  return null;
}

export function getCloudflareR2ObjectKeyFromUrl(url: string | null | undefined): string | null {
  if (!url || url.startsWith("data:") || url.startsWith("/")) return null;

  const baseUrl = getConfiguredPublicBaseUrl();
  if (!baseUrl) return null;

  try {
    const parsedUrl = new URL(url);
    const parsedBase = new URL(baseUrl);

    if (parsedUrl.origin !== parsedBase.origin) return null;

    const key = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ""));
    return key || null;
  } catch {
    return null;
  }
}

export async function deleteFromCloudflareR2ByUrl(url: string | null | undefined): Promise<boolean> {
  const key = getCloudflareR2ObjectKeyFromUrl(url);

  if (!key || !isR2Configured || !r2Client) {
    return false;
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  return true;
}
