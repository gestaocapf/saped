import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic"; // Evita caching

export async function PUT(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET, // Ensure JWT_SECRET is set in .env.local
      cookieName: "next-auth.session-token",
      secureCookie: true,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para acessar este recurso." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      id,
      title,
      content,
      isAnonymous,
      categoryId,
      senderName,
      senderEnrollment,
      senderEmail,
      status,
      assignedToId,
      answer,
    } = body;

    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket não encontrado" },
        { status: 404 }
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        content,
        isAnonymous,
        categoryId,
        senderName: isAnonymous ? null : senderName,
        senderEnrollment: isAnonymous ? null : senderEnrollment,
        senderEmail: isAnonymous ? null : senderEmail,
        status,
        answer,
        assignedToId: assignedToId || null, // Permite atribuir ou remover o responsável
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { success: true, ticket: updatedTicket },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
