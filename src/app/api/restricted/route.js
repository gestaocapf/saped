import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ message: "Conteúdo protegido" }), {
    status: 200,
  });
}
