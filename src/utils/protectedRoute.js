import { getSession } from "next-auth/react";

export const protectedRoute = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      error: "Você precisa estar autenticado para acessar este recurso",
    });
  }

  return session;
};
