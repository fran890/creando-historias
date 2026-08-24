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
  * If the requester is an AUTHOR, `authorId` is strictly locked to their `user.userId`,
  * and `status` changes are constrained to DRAFT or PENDING_REVIEW.
  */
export function sanitizeArticleInputForUser(
  user: AuthSession,
  inputData: Record<string, any>,
  existingArticleAuthorId?: string
) {
  const sanitized = { ...inputData };

  if (user.role !== "ADMIN") {
    // Lock authorId to current user's ID
    sanitized.authorId = user.userId;

    // Non-admins cannot publish directly or reject/archive
    if (sanitized.status && !["DRAFT", "PENDING_REVIEW"].includes(sanitized.status)) {
      sanitized.status = "PENDING_REVIEW";
    }
  } else {
    // If Admin is creating/editing, authorId can be specified, but defaults to Admin's userId if omitted
    if (!sanitized.authorId) {
      sanitized.authorId = existingArticleAuthorId || user.userId;
    }
  }

  return sanitized;
}
