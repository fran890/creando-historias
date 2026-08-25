import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
