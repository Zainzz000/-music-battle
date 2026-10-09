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
- 这是非官方公开元数据搜索尝试，不需要网易云账号、密码、Cookie；网易云可能封锁 Cloudflare 的网络出口，**不保证自动搜索成功**。自动搜索失败时，64 首淘汰赛可用「导入歌单」功能（恰好 64 行）；瑞士轮使用自动搜索。
- 支持 64 首淘汰赛和 32 首五轮瑞士轮。淘汰赛只导出赛程流程图 PNG/SVG；瑞士轮完成五轮后可导出「从夯到拉」排名图 PNG。
- Cloudflare Pages 在中国大陆访问**不保证免梯子稳定**，请实际用国内网络、微信内置浏览器测试。
- 若仓库此前在 Vercel 部署过，不影响 Cloudflare；无需删除旧项目。

## 高潮试听

🔥 按钮会等待音频元数据加载，然后跳转到约 62% 处播放 30 秒。此为**估算片段**，并非网易云官方标注的副歌/高潮时间；不支持 seek 的音源会显示错误，不再假装高潮试听却从头播放。
