import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para acessar este recurso." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name } = body;

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(
      { success: true, category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
