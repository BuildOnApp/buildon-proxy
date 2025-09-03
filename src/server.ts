import express from 'express';
import env from './env';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const targets: Record<string, string> = {
	'buildon-proxy.vercel.app':
		'https://buildon-develop-7mwbcnhl4a-ew.a.run.app',
	'buildon.tech': 'https://buildon-develop-7mwbcnhl4a-ew.a.run.app',
	'buildon.app': 'https://buildon-7mwbcnhl4a-ew.a.run.app',
};

app.use((req, res, next) => {
	const host = req.headers.host || '';

	for (const [key, target] of Object.entries(targets)) {
		if (host.endsWith(key)) {
			return createProxyMiddleware({
				target,
				changeOrigin: true,
			})(req, res, next);
		}
	}

	res.status(404).send('Domain not configured');
});

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
