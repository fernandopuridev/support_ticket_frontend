# Support Tickets Frontend

Frontend Vue para o sistema de chamados de suporte técnico, listagem de tickets, tela de detalhe e mensagens entre cliente e suporte. O projeto foi pensado para facilitar a comunicação entre clientes e atendentes para a resolução de dúvidas e problemas em viagens da Amazon Trips 

## Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios

## Funcionalidades

- login e cadastro
- listagem de tickets com busca e filtro
- criação de ticket
- tela de detalhe com mensagens

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Rotas principais

- `/login`
- `/register`
- `/tickets`
- `/tickets/:id`

## Observações

- o frontend espera a API rodando em `http://localhost:3000`
