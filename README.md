# ✈️ Fluxtur - Sistema de Propostas Digitais Interativas

> Plataforma web de alta performance desenvolvida para agências de turismo e consultores de viagem. Permite a geração, personalização e envio de **Propostas Digitais Interativas** em tempo real via link exclusivo/token público e WhatsApp.

---

## 🌟 Recursos Principais

- ✈️ **Voos Estruturados & Escalas (Multi-segmentos)**:
  - Detalhamento de **Voo de Ida** e **Voo de Volta** trecho por trecho.
  - Linha do tempo (timeline) com horários de saída/chegada, companhias aéreas, aeroportos de conexão e tempo de espera entre escalas.

- 🏨 **Hospedagem Estruturada & Rede Parceira**:
  - Seleção de hotéis parceiros cadastrados ou preenchimento avulso.
  - Galeria interativa de fotos da acomodação, datas de check-in/out, noites, categoria do quarto, regime de alimentação (*All Inclusive, Café da Manhã, Meia Pensão*) e política de cancelamento.

- 💳 **Simulador de Pagamento & Parcelamento**:
  - Detalhamento de valores (Subtotal de Produtos + Taxas de Embarque = Valor Total).
  - Tabela interativa de parcelamento em cartão de crédito em **1x até 12x** (sem juros e com juros).
  - Destaque para desconto de pagamento à vista via PIX.

- 👤 **Card do Agente de Viagens**:
  - Identificação com foto do consultor, nome, e-mail, telefone e botão direto para iniciar conversa pelo WhatsApp.

- 🖨️ **Exportação para PDF / Impressão Nativa**:
  - Suporte completo a `@media print` para salvar a proposta em vetor/PDF sem poluição de menus de navegação ou botões de tela.

- 📊 **Dashboard Administrativo Executivo**:
  - Métricas em tempo real de **Propostas Lançadas**, **Propostas Pendentes**, **Propostas Aprovadas** e **Lucro/Volume Mensal em R$**.
  - Tabela das últimas cotações geradas com botões para copiar link, visualizar e editar.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [TailwindCSS v4](https://tailwindcss.com/)
- **Navegação & Estado**: React 19 Client Components & Server-side Props

### Backend
- **Framework**: [.NET 10 Web API](https://dotnet.microsoft.com/)
- **Linguagem**: C# 13
- **ORM & Banco de Dados**: Entity Framework Core + PostgreSQL ([Npgsql](https://www.npgsql.org/))
- **Segurança**: Autenticação JWT (Bearer Token) & Hash de Senhas BCrypt
- **Mapeamento**: DTOs modulares e limpos (*Clean Architecture*)

---

## 📁 Estrutura do Projeto

```text
fluxtur/
├── backend/
│   ├── backend/
│   │   ├── Controllers/       # Controllers da API RESTful (Orcamentos, Hotels, Pacotes, Auth)
│   │   ├── DTOs/              # Data Transfer Objects modulares
│   │   ├── Models/            # Entidades do Entity Framework Core
│   │   ├── Migrations/        # Migrações do banco PostgreSQL
│   │   ├── Program.cs         # Inicialização do pipeline .NET
│   │   └── appsettings.Example.json
│   └── docker-compose.yml     # Container PostgreSQL
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── admin/         # Painel Administrativo (/admin, /orcamentos, /hoteis, /pacotes)
    │   │   ├── proposta/      # Espelho público da Proposta Digital (/proposta/[token])
    │   │   └── login/         # Tela de Acesso Restrito
    │   ├── services/          # Cliente de integração API HTTP
    │   └── utils/             # Máscaras de telefone e utilitários
    └── package.json
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) instalado.
- [Node.js 20+](https://nodejs.org/) instalado.
- Instância do banco de dados [PostgreSQL](https://www.postgresql.org/) rodando na porta `5432` (ou via Docker).

---

### 1. Configurando o Backend (.NET 10)

1. Navegue até a pasta do backend:
   ```bash
   cd backend/backend
   ```

2. Duplique o arquivo `appsettings.Example.json` para `appsettings.json` e configure a sua string de conexão PostgreSQL:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=127.0.0.1;Port=5432;Database=fluxtur;Username=seu_usuario;Password=sua_senha"
     },
     "JwtSettings": {
       "SecretKey": "SuaChaveSecretaJWTMinimo32Caracteres!",
       "Issuer": "FluxturApi",
       "Audience": "FluxturApp"
     }
   }
   ```

3. Execute as migrações do banco de dados e inicie a API:
   ```bash
   dotnet run
   ```
   *A API estará rodando em `http://localhost:5008` (ou na porta configurada).*

---

### 2. Configurando o Frontend (Next.js 16)

1. Em outro terminal, navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O aplicativo web estará disponível em `http://localhost:3000`.*

---

## 🔒 Segurança & Boas Práticas

- **Proteção de Credenciais**: O repositório inclui um `.gitignore` rigoroso que bloqueia o versionamento de chaves privadas, senhas de banco e variáveis de ambiente (`.env`, `appsettings.json`, `appsettings.Development.json`).
- **Standardized DTOs**: Arquitetura modular que desacopla o contrato da API do modelo interno de dados.
- **Auto-migration**: Execução automática de `ALTER TABLE IF NOT EXISTS` no carregamento da aplicação backend.

---

## 📝 Licença

Desenvolvido para **Fluxtur Viagens** por [Higor German](https://github.com/HigorGerman). Todos os direitos reservados.
