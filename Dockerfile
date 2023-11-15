# Dockerfile for Fragments UI microservice

# Stage 0: install the base dependencies

# Use node version 18.18.2 for dependencies
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 AS dependencies

# Metadata for the docker
LABEL maintainer="Abdullah Al Mamun Fahim <aamfahim@myseneca.ca>" \
      description="Fragments UI"

# Use /app as our working directory
WORKDIR /app

# Copy both package.json and package-lock.json to WORKDIR
COPY package*.json ./

# Install node dependencies(production) defined in package-lock.json
RUN npm ci --only=production

###############################################################################################

# Stage 1: build with the dependencies

# Use node version 18.18.2-alpine for depoly
FROM node:18.18.2-alpine@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d AS build

# Add ARG instructions for each environment variable
ARG NEXT_PUBLIC_DEV_API_URL
ARG NEXT_PUBLIC_PROD_API_URL
ARG NEXT_PUBLIC_AWS_COGNITO_POOL_ID
ARG NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID
ARG NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN
ARG NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL
ARG NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL

# Use /app as our working directory
WORKDIR /app

# Copy cached dependencies(node_modules) from previous stage
COPY --from=dependencies /app /app

# Copy src from local to docker /app/
COPY ./ ./

# Now set the environment variables using ENV
ENV NEXT_PUBLIC_DEV_API_URL=$NEXT_PUBLIC_DEV_API_URL
ENV NEXT_PUBLIC_PROD_API_URL=$NEXT_PUBLIC_PROD_API_URL
ENV NEXT_PUBLIC_AWS_COGNITO_POOL_ID=$NEXT_PUBLIC_AWS_COGNITO_POOL_ID
ENV NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=$NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID
ENV NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN=$NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN
ENV NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL=$NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL
ENV NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL=$NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL

# Create a build and export the static files
RUN npm run build

###############################################################################################
# Stage 2: deploy with the dependencies

FROM nginx:1.24.0-alpine@sha256:62cabd934cbeae6195e986831e4f745ee1646c1738dbd609b1368d38c10c5519 AS deploy


# Copy built Next.js app to nginx html directory
COPY --from=build /app/out /usr/share/nginx/html

# Copy nginx configuration to nginx configuration directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Start the nginx server with daemon off
CMD ["nginx", "-g", "daemon off;"]

# We run our service on port 80
EXPOSE 80

# Run a healthcheck on the docker every 30s(--interval)
# Run after 30s (--start-period)
# If it failes wait 30s(--timeout) and try 3 times(--retries)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:${PORT} || exit 1c