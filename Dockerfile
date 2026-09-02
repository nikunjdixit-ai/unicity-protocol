FROM node:20-bookworm-slim

ENV NODE_ENV=production \
    PORT=3000 \
    PYTHONUNBUFFERED=1 \
    ALGOD_SERVER=https://testnet-api.algonode.cloud \
    ALGOD_PORT=443 \
    ALGOD_NETWORK=testnet \
    USDC_ASSET_ID=10458941 \
    AVM_ADDRESS=GD647DXYZTNWXZAUJ447K7K54D6V6L7P7W6KFF44P722YFFLFLJ2G72K4E \
    APP_SECRET_SALT=algorand_anti_sybil_hackathon_super_secret_salt_2026 \
    ISSUER_DID=did:sybil:algorand:authority:0x001

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    gcc \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages \
    && npm install --omit=dev

COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY x402/package*.json x402/tsconfig.json ./x402/
RUN cd x402 && npm install && npm install typescript

COPY . .

RUN cd x402 && npx tsc

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3000) + '/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "backend/server.js"]

