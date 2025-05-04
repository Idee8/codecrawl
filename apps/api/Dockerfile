FROM node:22.2.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Tell Node.js not to run scripts as root
ENV npm_config_unsafe_perm true

# Prepare the specific pnpm version mentioned in the error
RUN corepack prepare pnpm@9.1.0 --activate
RUN corepack enable

# Create app directory
WORKDIR /app

# Add node user and group
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nodejs

# Copy application code first
COPY . /app

# Copy entrypoint script and set permissions early
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && \
    chown nodejs:nodejs /app/docker-entrypoint.sh && \
    chmod +x /app/docker-entrypoint.sh

# Change ownership for subsequent RUN commands
RUN chown -R nodejs:nodejs /app

# Switch to non-root user for subsequent commands
USER nodejs

FROM base AS prod-deps
WORKDIR /app
USER root
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter api --prod
# Ensure node_modules is owned by nodejs user
RUN chown -R nodejs:nodejs /app/node_modules
USER nodejs

FROM base AS build
WORKDIR /app
USER root
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter api && pnpm run build
# Ensure dist is owned by nodejs user
RUN chown -R nodejs:nodejs /app/dist
USER nodejs

# Final runtime image
FROM node:22.2.0-slim
ENV NODE_ENV production # Set NODE_ENV for production runtime
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV npm_config_unsafe_perm true

WORKDIR /app

# Add node user and group again in the final stage
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nodejs

# Copy built artifacts and dependencies
COPY --from=build /app/dist /app/dist
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=base /app/docker-entrypoint.sh /app/docker-entrypoint.sh

# Ensure correct ownership of application files
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the API listens on (value often set via compose)
# Dockerfile EXPOSE is informational; the actual binding happens in compose
EXPOSE 3002

# Run the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
# CMD is implicitly handled by the entrypoint script based on PROCESS_TYPE