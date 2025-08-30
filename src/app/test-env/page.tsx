"use client";

export default function TestEnvPage() {
  const testVar = process.env.NEXT_PUBLIC_TEST_VARIABLE;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", fontSize: "16px" }}>
      <h1>Teste de Variáveis de Ambiente (Produção)</h1>

      <div
        style={{ marginTop: "1rem", border: "1px solid #555", padding: "1rem" }}
      >
        <h2>Variável de Teste:</h2>
        <p>
          <code>NEXT_PUBLIC_TEST_VARIABLE:</code>
          <strong
            style={{ color: testVar ? "green" : "red", marginLeft: "10px" }}
          >
            {testVar || "NÃO ENCONTRADA"}
          </strong>
        </p>
      </div>

      <div
        style={{ marginTop: "1rem", border: "1px solid #555", padding: "1rem" }}
      >
        <h2>Chave da API do Firebase:</h2>
        <p>
          <code>NEXT_PUBLIC_FIREBASE_API_KEY:</code>
          <strong
            style={{ color: apiKey ? "green" : "red", marginLeft: "10px" }}
          >
            {apiKey
              ? `ENCONTRADA (começa com: ${apiKey.substring(0, 4)}...)`
              : "NÃO ENCONTRADA"}
          </strong>
        </p>
      </div>
    </div>
  );
}
