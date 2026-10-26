# TodoList – Frontend (React + Vite)

## Como rodar
1. Backend: crie o banco (`schema.sql`), ajuste o `.env` e rode `npm install && npm run dev` (porta 3333).
2. Frontend: `npm install && npm run dev` → http://localhost:5173
   (a URL da API fica em `.env` → `VITE_API_URL`).

## Publicar no seu GitHub (Passo 7)
```bash
git remote -v                                   # mostra o remoto do professor
git remote set-url origin https://github.com/SEU_USUARIO/todolist.git
git add . && git commit -m "Adiciona frontend React + Vite"
git branch -M main
git push -u origin main
```
