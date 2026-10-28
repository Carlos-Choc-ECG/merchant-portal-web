# syntax=docker/dockerfile:1

# ── Base ──────────────────────────────────────────────────────────────────────
# node:22-slim: LTS runway through 2027, glibc (sharp + Image Optimization work
# out of the box), and a smaller footprint than the full Debian image.
FROM node:22-slim AS base

# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# Rewrite CodeArtifact resolved URLs to the public registry before installing.
# The lockfile was generated against a private CodeArtifact mirror; the packages
# themselves are all public, so the domain swap is safe.
RUN sed -i 's|https://e20co-511753100151.d.codeartifact.us-west-2.amazonaws.com/npm/e20co|https://registry.npmjs.org|g' package-lock.json \
 && npm ci

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next build picks up output: 'standalone' from next.config.ts and writes
# a self-contained server to .next/standalone — no node_modules needed at
# runtime beyond what the standalone bundle includes.
RUN npm run build

# ── Stage 3: production runner ────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# HOSTNAME=0.0.0.0 tells the standalone server to bind on all interfaces so
# Docker port mapping works correctly.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Non-root user — principle of least privilege.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# The standalone directory is a fully self-contained Next.js server.
# Static assets must be copied in separately — the standalone output does not
# bundle them automatically.
COPY --from=builder                          /app/public            ./public
COPY --from=builder --chown=nextjs:nodejs    /app/.next/standalone  ./
COPY --from=builder --chown=nextjs:nodejs    /app/.next/static      ./.next/static

USER nextjs

EXPOSE 3000

# server.js is the entry point emitted by Next.js standalone output.
CMD ["node", "server.js"]
