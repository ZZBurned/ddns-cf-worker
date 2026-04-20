export default {
	async fetch(request, env, ctx) {
		const path_ddns_update = env.PATH_DDNS_UPDATE || '/update';
		const path_ddns_track = env.PATH_DDNS_TRACK || '/read';
		const db_ddns_bind = env.BD_DIP;

		const url = new URL(request.url);
		const path = url.pathname;

		// You can view your logs in the Observability dashboard
		console.info({ message: 'Worker received a request:' + path });

		if (path === '/') {
			return new Response(await hello_page(), {
				status: 200,
				"headers": {
					'Content-Type': 'text/html; charset=UTF-8',
				}
			});
		} else if (path === path_ddns_update) {
			if (url.search.indexOf('?') === -1) {
				return new Response('Error Parametric!')
			}

			try {
				const kvs = url.search.substring(1).split('&');
				const kv0 = kvs[0].split('=');
				if (kv0.length != 2) {
					return new Response('Error Parametric!');
				}
				const host = kv0[0];
				const ip = kv0[1].replace(/_n/g, "\n");
				const timestamp = new Date(Date.now()).toISOString();
				await db_ddns_bind.put(host, ip);
				await db_ddns_bind.put(host + "_t", timestamp);
				return new Response('Update ' + host, {
					status: 201,
				});
			} catch (e) {
				return new Response(e.message, { status: 500 });
			}
		} else if (path === path_ddns_track) {
			try {
				const host = url.search.substring(1);
				const ip = await db_ddns_bind.get(host);
				return new Response(ip);
			} catch (e) {
				return new Response(e.message, { status: 500 });
			}
		} else {
			return new Response('Not Found!', {status: 404});
		}
	}
};

async function hello_page() {
	const html = `
	<!DOCTYPE html>
	<html lang="zh-CN">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Cloudflare Worker Node</title>
	<style>
	:root {
		--primary-color: #6366f1;
		--bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	body, html {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #0f172a;
		color: white;
		overflow: hidden;
	}

	/* 动态背景动画 */
	.bg-animation {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
		z-index: -1;
	}

	.blob {
		position: absolute;
		width: 500px;
		height: 500px;
		background: var(--primary-color);
		filter: blur(80px);
		border-radius: 50%;
		opacity: 0.15;
		animation: move 20s infinite alternate;
	}

	@keyframes move {
		from { transform: translate(-20%, -20%); }
		to { transform: translate(20%, 20%); }
	}

	/* 主卡片 */
	.container {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 3rem;
		border-radius: 24px;
		text-align: center;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		max-width: 500px;
		width: 90%;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(to right, #fff, #94a3b8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: -1px;
	}

	p.subtitle {
		color: #94a3b8;
		font-size: 1rem;
		margin-bottom: 2rem;
	}

	/* 热词标签样式 */
	.tag-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}

	.tag {
		background: rgba(255, 255, 255, 0.08);
		padding: 6px 14px;
		border-radius: 100px;
		font-size: 0.85rem;
		color: #cbd5e1;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
	}

	.tag:hover {
		background: rgba(99, 102, 241, 0.2);
		border-color: var(--primary-color);
		color: white;
		transform: translateY(-2px);
	}

	.status {
		margin-top: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		color: #4ade80;
		opacity: 0.8;
	}

	.dot {
		width: 8px;
		height: 8px;
		background-color: #4ade80;
		border-radius: 50%;
		margin-right: 8px;
		box-shadow: 0 0 10px #4ade80;
	}
	</style>
	</head>
	<body>
	<div class="bg-animation">
	<div class="blob"></div>
	</div>

	<div class="container">
	<h1>D. I. P.</h1>
	<p class="subtitle">Edge Computing Node Active</p>

	<div class="tag-container">
	<span class="tag">大语言模型</span>
	<span class="tag">边缘计算</span>
	<span class="tag">分布式系统</span>
	<span class="tag">极速响应</span>
	<span class="tag">云原生</span>
	<span class="tag">AI</span>
	<span class="tag">Serverless</span>
	<span class="tag">Cloudflare</span>
	<span class="tag">Edge Runtime</span>
	<span class="tag">Latency-Free</span>
	<span class="tag">JavaScript</span>
	<span class="tag">WebAssembly</span>
	</div>

	<div class="status">
	<div class="dot"></div>
	Welcome Everyone
	</div>
	</div>
	</body>
	</html>
	`;
	return html;
}
