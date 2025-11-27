# AgriStock Control 🌱

Sistema de Controle de Estoque Agrícola desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Como Executar o Projeto na Sua Máquina

Este projeto foi desenhado para ser moderno e performático. A maneira mais fácil de rodar localmente é utilizando o **Vite**.

### Pré-requisitos
- **Node.js** (versão 18 ou superior) instalado.
- Gerenciador de pacotes (**NPM** ou **Yarn**).

### Passo a Passo de Instalação

1. **Criar a estrutura do projeto:**
   Abra seu terminal e rode o comando abaixo para criar uma base React + TypeScript:
   ```bash
   npm create vite@latest agristock -- --template react-ts
   cd agristock
   ```

2. **Instalar Dependências:**
   Instale as bibliotecas utilizadas no projeto (ícones, gráficos e utilitários):
   ```bash
   npm install lucide-react recharts date-fns clsx tailwind-merge
   ```

3. **Configurar Tailwind CSS:**
   Instale e inicialize o Tailwind:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

   - Abra o arquivo `tailwind.config.js` criado e altere a linha `content` para:
     ```javascript
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     ```
   - Abra o arquivo `./src/index.css` e substitua todo o conteúdo por:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. **Importar os Arquivos:**
   Agora, copie os códigos fornecidos anteriormente para dentro da pasta `src/` do seu novo projeto:

   - `src/types.ts`
   - `src/constants.ts`
   - `src/App.tsx` (Substitua o existente)
   - Crie a pasta `src/components` e adicione: `Dashboard.tsx`, `Inventory.tsx`, `MovementForm.tsx`.
   - Crie a pasta `src/services` e adicione: `storageService.ts`, `mockData.ts`.

5. **Rodar a Aplicação:**
   No terminal, execute:
   ```bash
   npm run dev
   ```
   Acesse o link mostrado (geralmente `http://localhost:5173`) no seu navegador.

---

## 📂 Estrutura de Arquivos Sugerida

```
agristock/
├── src/
│   ├── components/       # Componentes visuais (Dashboard, Forms, Listas)
│   ├── services/         # Lógica de negócio e acesso a dados (API/Storage)
│   ├── types.ts          # Definições de Tipos (TypeScript)
│   ├── constants.ts      # Cores e configurações estáticas
│   ├── App.tsx           # Componente Raiz e Roteamento simples
│   └── main.tsx          # Ponto de entrada (Entry point)
├── public/               # Assets estáticos
└── package.json          # Dependências
```

---

## 🔮 Como Continuar (Roadmap de Evolução)

Como Engenheiro Sênior, aqui estão os passos técnicos recomendados para levar este MVP para produção:

### 1. Integração com Backend (Fase 2)
Atualmente o projeto usa `localStorage` (`services/storageService.ts`).
- **Ação:** Criar uma API (Node.js/NestJS ou Python/FastAPI).
- **Mudança:** Substituir as funções do `storageService.ts` para fazer chamadas HTTP (`fetch` ou `axios`) para sua API.

### 2. Leitura do CSV Real
O arquivo CSV (`produtos_estruturados.csv`) mencionado deve ser processado no Backend ou importado uma única vez.
- **Frontend:** Adicionar um botão de "Importar CSV" na tela de Configurações.
- **Lib Sugerida:** `papaparse` para ler o CSV no navegador e popular o estado inicial.

### 3. Banco de Dados
Para persistência real e multiusuário:
- Migrar de JSON/Local Storage para **PostgreSQL** ou **MongoDB**.

### 4. Melhorias de UI/UX
- Adicionar feedbacks de erro mais robustos (ex: `react-hot-toast`).
- Implementar autenticação (Login) para separar perfis (Admin vs Aplicador).
- Criar versão PWA (Progressive Web App) para funcionar offline no campo.

---

## 🛠 Tecnologias Utilizadas
- **Frontend:** React 19, TypeScript
- **Estilização:** Tailwind CSS
- **Gráficos:** Recharts
- **Ícones:** Lucide React
