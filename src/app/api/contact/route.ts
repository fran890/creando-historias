import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, correo electrónico y mensaje son obligatorios." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Proporciona un correo electrónico válido." },
        { status: 400 }
      );
    }

    // Log the message server side (can be connected to email service such as Resend/Nodemailer/S3/Prisma if required)
    console.log("[CONTACT_FORM_SUBMISSION]", {
      name,
      email,
      subject: subject || "Consulta desde sitio web",
      message,
      timestamp: new Date().toISOString(),
      recipient: "soporte@creando-historias.com",
    });

    return NextResponse.json({
      success: true,
      message: "Tu mensaje ha sido enviado correctamente a soporte@creando-historias.com. Te responderemos a la brevedad.",
      recipient: "soporte@creando-historias.com",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el mensaje. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
