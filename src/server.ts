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

const proxyMap = Object.fromEntries(
	Object.entries(targets).map(([host, target]) => [
		host,
		createProxyMiddleware({
			target,
			changeOrigin: true,
			xfwd: true,
			secure: true,
			ws: true,
		}),
	]),
);

app.use((req, res, next) => {
	const host = req.headers.host || '';

	for (const [key, proxy] of Object.entries(proxyMap)) {
		if (host.endsWith(key)) {
			return proxy(req, res, next);
		}
	}

	res.status(404).send('Domain not configured');
});

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
