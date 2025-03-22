import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Lê o corpo da requisição (esperando um JSON com o campo 'id')
    const body = await req.json(); // Leitura do corpo como JSON
    const { id } = body; // Desestruturação para obter o id

    if (!id) {
      return NextResponse.json(
        { error: "ID do chamado não fornecido" },
        { status: 404 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: id }, // Specify the field name explicitly
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Chamado não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ticket }, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter chamado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
