DDNS by Cloudflare Worker
=========================

白嫖Cloudflare的Worker和KV数据存储追踪设备动态IPv6

## Quickstart
1. 创建 Cloudflare Worker
	1. 注册 Cloudflare 账号
	2. 创建 KV存储
	3. 创建 Worker
	4. 绑定 KV存储到 Worker
	5. 参考 `worker.js` 编辑 Worker 代码
2. 服务器部署 Python 更新脚本
	1. 将 `cloud-ip.py` 放到服务器
	2. 参考 `cron.tab` 配置定时任务 `crontab -e`

## About
- `worker.js` 实现了一个对KV存储的读写接口，通过访问URL的方式可以读写任意KV对数据。
- `cloud-ip.py` 只是通过预设的URL将设备的公网IPv6存储其中。
- 这一方法旨在提供一种DDNS和邮件追踪动态IP的替代方案，故同时以`_t`结尾的K记录更新时间戳。
