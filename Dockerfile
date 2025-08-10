# Usar Node.js 18 LTS como base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache curl

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
