# NotebookOS AI API - Deploy na Vercel

Esta pasta contém todos os arquivos necessários para deployar a API de IA do NotebookOS na Vercel.

## 📁 Estrutura dos arquivos:
```
vercel-deploy/
├── api/
│   └── generate.js      # Endpoint principal da API
├── package.json          # Dependências do servidor
├── vercel.json          # Configuração da Vercel
└── README.md            # Este arquivo
```

## 🚀 Como fazer o deploy:

### 1. **Instalar Vercel CLI:**
```bash
npm i -g vercel
```

### 2. **Fazer login na Vercel:**
```bash
vercel login
```

### 3. **Deployar o projeto:**
```bash
cd vercel-deploy
vercel
```

### 4. **Configurar variável de ambiente:**
```bash
vercel env add OPENAI_API_KEY
```
Digite sua chave da OpenAI quando solicitado.

### 5. **Fazer deploy de produção:**
```bash
vercel --prod
```

## 🔑 Configurações necessárias:

### **Variáveis de ambiente na Vercel:**
- `OPENAI_API_KEY`: Sua chave da API OpenAI

### **Para configurar via dashboard da Vercel:**
1. Acesse seu projeto na Vercel
2. Vá em "Settings" → "Environment Variables"
3. Adicione: `OPENAI_API_KEY` com sua chave

## 📱 Como usar no app Electron:

Após o deploy, você receberá uma URL como:
`https://seu-projeto.vercel.app`

### **Configure no seu app:**
1. Crie um arquivo `.env` na raiz do projeto:
```bash
VITE_AI_API_URL=https://seu-projeto.vercel.app/api/generate
```

2. Faça nova build do Electron:
```bash
npm run electron:build
```

## 🧪 Testar a API:

### **Endpoint:** `POST /api/generate`

### **Body da requisição:**
```json
{
  "prompt": "Seu texto aqui",
  "option": "continue",
  "command": "comando opcional"
}
```

### **Opções disponíveis:**
- `"continue"`: Continua o texto
- `"improve"`: Melhora o texto
- `"shorter"`: Encurta o texto
- `"longer"`: Aumenta o texto
- `"zap"`: Comando personalizado

## 🔧 Solução de problemas:

### **Erro 500:**
- Verifique se `OPENAI_API_KEY` está configurada
- Verifique os logs na Vercel

### **Erro de CORS:**
- A API já está configurada com CORS para `*`
- Se persistir, verifique se está usando HTTPS

### **Timeout:**
- A função está configurada para 30 segundos
- Se precisar de mais tempo, ajuste em `vercel.json`

## 📞 Suporte:
Se tiver problemas, verifique:
1. Logs na Vercel
2. Configuração das variáveis de ambiente
3. Formato da requisição
