import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const ebToken = env.EVENTBRITE_PRIVATE_TOKEN || '';

  return {
    plugins: [react()],
    server: {
      proxy: ebToken
        ? {
            '/eventbrite-api': {
              target: 'https://www.eventbriteapi.com/v3',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/eventbrite-api/, ''),
              configure(proxy) {
                proxy.on('proxyReq', (req) => {
                  req.setHeader('Authorization', `Bearer ${ebToken}`);
                });
              },
            },
          }
        : {},
    },
  };
});
