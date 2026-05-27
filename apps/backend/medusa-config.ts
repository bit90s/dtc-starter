import { defineConfig, loadEnv } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
    databaseDriverOptions: {
      ssl: false,
      sslmode: 'disable',
    },
  },
  modules: [
    {
      resolve: './src/modules/brand',
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/notification-local',
            id: 'local',
            options: {
              channels: ['email', 'log'],
            },
          },
          {
            resolve: './src/modules/notification-console',
            id: 'console',
            options: {
              channels: ['console'],
              prefix: '🚀',
            },
          },
        ],
      },
    },
  ],
  admin: {
    vite: (config) => {
      return {
        server: {
          host: '0.0.0.0',
          // Allow all hosts when running in Docker (development mode)
          // In production, this should be more restrictive
          allowedHosts: ['localhost', '.localhost', '127.0.0.1'],
          hmr: {
            // HMR websocket port inside container
            port: 5173,
            // Port browser connects to (exposed in docker-compose.yml)
            clientPort: 5173,
          },
        },
      };
    },
  },
});
