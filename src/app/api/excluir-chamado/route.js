// pages/api/excluir-chamado.js

import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic"; // Evita caching

export async function DELETE(req) {
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
    const { id } = body;

    // Verifica se o ticket existe
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket não encontrado" },
        { status: 404 }
      );
    }

    // Exclui o ticket
    const deletedTicket = await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, ticket: deletedTicket },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir ticket:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
