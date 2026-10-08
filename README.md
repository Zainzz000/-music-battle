# MUSIC BATTLE — Cloudflare Pages 版

无需自有服务器。前端为 `index.html`，网易云搜索接口为 Cloudflare Pages Function：`functions/api/search.js`。

## 推荐：GitHub 连接部署

1. 将**本压缩包解压后的内容**上传到 GitHub 仓库**根目录**，不要把整个外层文件夹上传。仓库根目录应有 `index.html` 和 `functions/` 文件夹。
2. Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git → 选择 GitHub 仓库。
3. Framework preset: None；Build command: 留空；Build output directory: `/`（如果控制台不接受 `/`，选择 `.`）。
4. 部署后访问 `https://<项目名>.pages.dev/`。
5. 先测试 `https://<项目名>.pages.dev/api/search?artist=周杰伦`。返回 `{"songs":[...]}` 表示接口可用；返回 `{"error":...}` 表示网易云上游搜索受限；404 则检查 `functions/api/search.js` 是否正确放置、部署日志是否包含 Functions。

## 注意

- **请使用 Git 集成部署**。Cloudflare Pages 的直接上传/拖拽静态文件流程不一定会部署 `functions/`，可能导致搜索接口 404。
- 这是非官方公开元数据搜索尝试，不需要网易云账号、密码、Cookie；网易云可能封锁 Cloudflare 的网络出口，**不保证自动搜索成功**。失败时可使用网页中的「导入歌单」功能（恰好 64 行）。
- 64 强经典淘汰赛；两种导出：完整赛程图 PNG/SVG、横向彩色封面卡片「从夯到拉」排行榜 PNG；不含瑞士轮。
- Cloudflare Pages 在中国大陆访问**不保证免梯子稳定**，请实际用国内网络、微信内置浏览器测试。
- 若仓库此前在 Vercel 部署过，不影响 Cloudflare；无需删除旧项目。
