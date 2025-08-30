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
- [🗺️ Roadmap de Próximas Funcionalidades](#️-roadmap-de-próximas-funcionalidades)
- [📜 Licença](#-licença)

---

### 🧠 Sobre o Projeto

O **SYNAPSE** é um aplicativo de apoio e psicoeducação financeira projetado especificamente para ajudar pessoas com Transtorno do Déficit de Atenção e Hiperatividade (TDAH) a organizar e gerenciar sua vida financeira.

Utilizando princípios da Terapia Cognitivo-Comportamental (TCC) e das finanças comportamentais, o objetivo é criar uma ferramenta que seja funcional, intuitiva, gentil e de baixo atrito, servindo como uma "prótese cognitiva" para a gestão de finanças pessoais.

### ✨ Funcionalidades Implementadas

- ✅ **Autenticação Segura:** Cadastro e Login com E-mail e Senha.
- ✅ **Gerenciamento de Sessão:** Sistema robusto de sessão de usuário em toda a aplicação.
- ✅ **Tema Claro/Escuro:** Sistema de tema (`dark mode`) completo e persistente.
- ✅ **Dashboard Principal:** Exibe um sumário de gastos do mês e um histórico de despesas em tempo real.
- ✅ **CRUD de Despesas:** Funcionalidade completa para Criar, Ler, Atualizar e Excluir despesas.
- ✅ **Formulário Inteligente:** Modal para adicionar/editar despesas com campos para:
  - Valor (R$)
  - Descrição
  - Data (com `DatePicker`)
  - Localidade (campo de texto)
  - Categorias dinâmicas com opção de "criar na hora" (`Combobox`)
  - Forma de Pagamento com seletor condicional para Cartão de Crédito
- ✅ **Notificações Toast:** Feedback visual instantâneo para ações do usuário (sucesso, erro) com `sonner`.
- ✅ **Design Responsivo:** Interface adaptada para uso em desktop e dispositivos móveis.

### 🚀 Stack de Tecnologia

Este projeto foi construído com as seguintes tecnologias:

- **Frontend:** [Next.js](https://nextjs.org/) (com App Router) e [React](https://reactjs.org/)
- **Backend e Banco de Dados:** [Firebase](https://firebase.google.com/) (Authentication e Firestore)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Notificações:** [Sonner](https://sonner.emilkowal.ski/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gerenciamento de Tema:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Hospedagem:** [Vercel](https://vercel.com/)

### 🏁 Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/synapse.git](https://github.com/seu-usuario/synapse.git)
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

4.  **Configure o Firestore:**

    - No seu console do Firebase, crie as coleções `expenses` e `categories`.
    - Adicione as Regras de Segurança do Firestore para permitir que usuários autenticados acessem seus próprios dados.

5.  **Rode o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### 🗺️ Roadmap de Próximas Funcionalidades

O futuro do SYNAPSE inclui:

- **Fase 1:** Gerenciamento completo de Cartões e Categorias.
- **Fase 2:** Implementação de Cadastro de Entradas (Receitas) e Compras Parceladas.
- **Fase 3:** Cadastro de Contas a Pagar, Dashboard com Calendário e Notificações PWA.
- **Fase 4:** Filtros avançados para o histórico de gastos e uma página de Estatísticas com Gráficos.

### 📜 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.
