import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar todas as categorias no banco de dados
    const categories = await prisma.category.findMany();

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
