import { describe, it, expect, vi } from "vitest";
import { sanitizeArticleInputForUser } from "../src/lib/security/ownership";
import { sanitizeHtmlContent, generateSlug, calculateReadingTime } from "../src/lib/security/sanitizer";

describe("Security & RBAC Authorization Suite", () => {
  it("should prevent AUTHOR from tampering with authorId in article payload", () => {
    const authorSession: any = {
      userId: "user-author-123",
      email: "author@test.com",
      username: "author",
      name: "Author One",
      role: "AUTHOR",
    };

    const clientPayload = {
      title: "Intento de Hackeo",
      content: "<p>Contenido</p>",
      authorId: "user-victim-456", // Tampered authorId!
      status: "PUBLISHED", // Tampered status!
    };

    const sanitized = sanitizeArticleInputForUser(authorSession, clientPayload);

    // authorId MUST be overwritten with the requesting author's ID
    expect(sanitized.authorId).toBe("user-author-123");
    // status MUST NOT be PUBLISHED directly by non-admin
    expect(sanitized.status).toBe("PENDING_REVIEW");
  });

  it("should allow ADMIN to specify target authorId and publish directly", () => {
    const adminSession: any = {
      userId: "user-admin-999",
      email: "admin@test.com",
      username: "admin",
      name: "Admin User",
      role: "ADMIN",
    };

    const clientPayload = {
      title: "Artículo Aprobado por Admin",
      content: "<p>Contenido oficial</p>",
      authorId: "user-author-123",
      status: "PUBLISHED",
    };

    const sanitized = sanitizeArticleInputForUser(adminSession, clientPayload);

    expect(sanitized.authorId).toBe("user-author-123");
    expect(sanitized.status).toBe("PUBLISHED");
  });

  it("should sanitize malicious script tags from HTML content (XSS protection)", () => {
    const maliciousHtml = `
      <h1>Título Seguro</h1>
      <script>alert('XSS Attack!')</script>
      <p onclick="strealData()">Texto legítimo con evento malicioso</p>
      <iframe src="http://evilsite.com"></iframe>
    `;

    const clean = sanitizeHtmlContent(maliciousHtml);

    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("alert");
    expect(clean).not.toContain("onclick");
    expect(clean).not.toContain("<iframe");
    expect(clean).toContain("<h1>Título Seguro</h1>");
    expect(clean).toContain("Texto legítimo con evento malicioso");
  });

  it("should correctly generate unique slugs and reading times", () => {
    const title = "¡Hola Mundo! Producción & Desarrollo en Next.js";
    const slug = generateSlug(title);
    expect(slug).toBe("hola-mundo-produccion-desarrollo-en-nextjs");

    const content = "Palabra ".repeat(450); // 450 words
    const readingTime = calculateReadingTime(content);
    expect(readingTime).toBe(3); // 450 / 200 = 2.25 => ceil => 3 min
  });
});
