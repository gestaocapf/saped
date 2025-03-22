import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
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

    const users = await prisma.user.findMany(); // Busca todos os usuários
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
