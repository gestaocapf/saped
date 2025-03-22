import { Suspense } from "react";

// Este componente pode ser usado para capturar erros na renderização
function ErrorBoundary({ children }) {
  return (
    <div>
      {/* Seu componente de fallback para erro */}
      {children}
    </div>
  );
}

export const metadata = {
  title: "SAPed - Criar Chamado",
  description:
    "Conecte-se à coordenação e setores acadêmicos de forma rápida! No SAPed, você registra solicitações e acompanha seus chamados com facilidade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Suspense fallback={<div>Carregando...</div>}>
          <ErrorBoundary>
            <main>{children}</main>
          </ErrorBoundary>
        </Suspense>
      </body>
    </html>
  );
}
