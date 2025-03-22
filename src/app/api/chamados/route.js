import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react"; // Importe o getSession
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET, // Ensure JWT_SECRET is set in .env.local
    });

    if (!token) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para acessar este recurso." },
        { status: 401 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      include: {
        category: true,
        assignedTo: true,
      },
    });

    return NextResponse.json({ success: true, tickets }, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter chamados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
