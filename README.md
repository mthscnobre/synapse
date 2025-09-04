<div align="center">
  <img src="/public/Logo-dark.svg" alt="Synapse Logo" width="250px" />
</div>
<br />
<p align="center">
  <strong>A sinapse entre você e suas finanças.</strong>
  <br />
  Um aplicativo de apoio financeiro projetado com os princípios da TCC para mentes com TDAH.
</p>
<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui Badge" />
</p>

---

### 📋 Índice

- [📋 Índice](#-índice)
- [🧠 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [🚀 Stack de Tecnologia](#-stack-de-tecnologia)
- [🏁 Como Rodar o Projeto](#-como-rodar-o-projeto)
- [📜 Licença](#-licença)

---

### 🧠 Sobre o Projeto

O **SYNAPSE** é um aplicativo de apoio e psicoeducação financeira projetado especificamente para ajudar pessoas com Transtorno do Déficit de Atenção e Hiperatividade (TDAH) a organizar e gerenciar sua vida financeira.

Utilizando princípios da Terapia Cognitivo-Comportamental (TCC) e das finanças comportamentais, o objetivo é criar uma ferramenta que seja funcional, intuitiva, gentil e de baixo atrito, servindo como uma "prótese cognitiva" para a gestão de finanças pessoais.

### ✨ Funcionalidades Implementadas

- ✅ **Autenticação Segura:** Cadastro e Login com E-mail e Senha.
- ✅ **Gerenciamento de Sessão:** Sistema robusto de sessão de usuário em toda a aplicação.
- ✅ **Tema Claro/Escuro:** Sistema de tema (`dark mode`) completo e persistente.
- ✅ **Progressive Web App (PWA):** O aplicativo pode ser instalado em desktops e celulares para uma experiência nativa.
- ✅ **Dashboard Principal:** Exibe um sumário de gastos do mês e um histórico de despesas com navegação mensal.
- ✅ **CRUD Completo de Despesas:**
  - Registro de despesas com valor, descrição, data, local e categoria.
  - Sistema de **compras parceladas** que gera automaticamente as despesas futuras.
  - Campo de **notas** para adicionar contexto a cada transação.
  - **Modal de detalhes** para uma visão completa de cada gasto.
- ✅ **Gerenciamento de Entradas (Receitas):** Página dedicada para registrar e gerenciar todas as fontes de renda.
- ✅ **Gerenciamento de Cartões de Crédito:** Página dedicada para cadastrar, editar e excluir cartões, incluindo o **upload de logos** para fácil identificação.
- ✅ **Gerenciamento de Categorias:** Página para gerenciar categorias de despesa, com um sistema de **atribuição de cores** para melhor visualização.
- ✅ **Gerenciamento de Contas a Pagar:**
  - Página dedicada para gerenciar despesas recorrentes (contas).
  - Sistema de **automação** que gera despesas automaticamente a partir das contas recorrentes.
  - Opção de **"Pagar Conta"** para transformar manualmente um planejamento em um gasto real.
- ✅ **Notificações Toast:** Feedback visual instantâneo para ações do usuário (sucesso, erro) com `sonner`.
- ✅ **Design Responsivo:** Interface adaptada para uso em desktop e dispositivos móveis.

### 🚀 Stack de Tecnologia

Este projeto foi construído com as seguintes tecnologias:

- **Framework:** [Next.js](https://nextjs.org/) (com App Router) e [React](https://reactjs.org/)
- **Backend e Banco de Dados:** [Firebase](https://firebase.google.com/) (Authentication, Firestore e Storage)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Notificações Toast:** [Sonner](https://sonner.emilkowal.ski/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gerenciamento de Tema:** [next-themes](https://github.com/pacocoursey/next-themes)
- **PWA:** [next-pwa](https://www.npmjs.com/package/next-pwa)
- **Hospedagem:** [Vercel](https://vercel.com/)

### 🏁 Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

1.  **Clone o repositório:**

    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd synapse
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**

    - Crie um arquivo chamado `.env.local` na raiz do projeto.
    - Copie o conteúdo do template abaixo e preencha com as suas chaves do Firebase Web SDK.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID
    ```

4.  **Configure o Firebase:**

    - No seu console do Firebase, ative os serviços de **Authentication** (com provedor E-mail/Senha), **Firestore** e **Storage**.
    - Publique as regras de segurança para o Firestore e o Storage.

5.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Abra `http://localhost:3000` no seu navegador para ver o resultado.

### 📜 Licença

Distribuído sob a Licença MIT.
