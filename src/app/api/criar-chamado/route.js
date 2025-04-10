import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

const prisma = new PrismaClient();
export const dynamic = "force-dynamic"; // Evita caching

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
});

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

    try {
      const data = await mg.messages.create(
        "sandbox0908e4f194ae456ea1b7bfd436f8f99a.mailgun.org",
        {
          from: "Mailgun Sandbox <postmaster@sandbox0908e4f194ae456ea1b7bfd436f8f99a.mailgun.org>",
          to: ["Matheus S Oliveira <matheusoliveira18rj@gmail.com>"],
          subject: "SAPED - Seu chamado foi criado com sucesso ",
          text: `Seu chamado com título ${title} foi criado com sucesso. Anote seu protocolo para acompanhar pelo site. Assim que tivemos alguma atualização, tentaremos enviar para você por aqui.`,
        }
      );

      console.log(data); // logs response data
    } catch (error) {
      console.log(error); //logs any error
    }

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
