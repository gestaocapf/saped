import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic"; // Evita caching

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      isAnonymous,
      categoryId,
      senderName,
      senderEnrollment,
      senderEmail,
    } = body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 400 }
      );
    }
    if (title.length < 10) {
      return res
        .status(400)
        .json({ error: "Title must be at least 10 characters long." });
    }

    if (content.length < 200) {
      return res
        .status(400)
        .json({ error: "Content must be at least 300 characters long." });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        content,
        isAnonymous,
        categoryId,
        senderName: isAnonymous ? null : senderName,
        senderEnrollment: isAnonymous ? null : senderEnrollment,
        senderEmail: isAnonymous ? null : senderEmail,
      },
    });

    return NextResponse.json(
      { success: true, ticket: newTicket },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
