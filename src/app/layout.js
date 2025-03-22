import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: "500",
});

export const metadata = {
  title: "SAPed",
  description:
    "Conecte-se à coordenação e setores acadêmicos de forma rápida! No SAPed, você registra solicitações e acompanha seus chamados com facilidade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
