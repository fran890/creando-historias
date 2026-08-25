import { prisma } from "../prisma";
import { AuthSession } from "../auth";

export interface OwnershipResult {
  authorized: boolean;
  reason?: string;
  article?: any;
}

/**
  * Server-side authorization check enforcing Role-Based Access Control (RBAC) and Ownership.
  * @param user Active session of the requesting user
  * @param articleId Target article ID
  * @returns OwnershipResult indicating whether the action is permitted
  */
export async function validateArticleOwnership(
  user: AuthSession | null,
  articleId: string
): Promise<OwnershipResult> {
  if (!user) {
    return { authorized: false, reason: "UNAUTHENTICATED" };
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    return { authorized: false, reason: "ARTICLE_NOT_FOUND" };
  }

  // ADMIN can manage any article
  if (user.role === "ADMIN") {
    return { authorized: true, article };
  }

  // AUTHOR can only manage their own articles
  if (article.authorId !== user.userId) {
    return { authorized: false, reason: "FORBIDDEN_NOT_OWNER" };
  }

  return { authorized: true, article };
}

/**
  * Server sanitization helper to prevent clients from tampering with critical fields like `authorId` or `status`.
  * Admins and Auto-Approved authors can publish directly without review approval.
  */
export async function sanitizeArticleInputForUserAsync(
  user: AuthSession,
  inputData: Record<string, any>,
  existingArticleAuthorId?: string
) {
  const sanitized = { ...inputData };

  // Fetch user DB settings to check autoApprove flag
  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { role: true, autoApprove: true },
  });

  const canAutoPublish = dbUser?.role === "ADMIN" || dbUser?.autoApprove === true;

  if (user.role !== "ADMIN") {
    // Lock authorId to current user's ID
    sanitized.authorId = user.userId;

    if (canAutoPublish) {
      // Auto-approved author: PENDING_REVIEW or PUBLISHED converts immediately to PUBLISHED
      if (sanitized.status && ["PENDING_REVIEW", "PUBLISHED"].includes(sanitized.status)) {
        sanitized.status = "PUBLISHED";
      }
    } else {
      // Standard author: Constrained to DRAFT or PENDING_REVIEW
      if (sanitized.status && !["DRAFT", "PENDING_REVIEW"].includes(sanitized.status)) {
        sanitized.status = "PENDING_REVIEW";
      }
    }
  } else {
    // Admin user: Default to authorId or Admin's userId, and auto-publish when submitted for review
    if (!sanitized.authorId) {
      sanitized.authorId = existingArticleAuthorId || user.userId;
    }
    if (sanitized.status === "PENDING_REVIEW") {
      sanitized.status = "PUBLISHED";
    }
  }

  return sanitized;
}

export function sanitizeArticleInputForUser(
  user: AuthSession,
  inputData: Record<string, any>,
  existingArticleAuthorId?: string
) {
  const sanitized = { ...inputData };

  if (user.role !== "ADMIN") {
    sanitized.authorId = user.userId;
    if (sanitized.status && !["DRAFT", "PENDING_REVIEW"].includes(sanitized.status)) {
      sanitized.status = "PENDING_REVIEW";
    }
  } else {
    if (!sanitized.authorId) {
      sanitized.authorId = existingArticleAuthorId || user.userId;
    }
    if (sanitized.status === "PENDING_REVIEW") {
      sanitized.status = "PUBLISHED";
    }
  }

  return sanitized;
}
