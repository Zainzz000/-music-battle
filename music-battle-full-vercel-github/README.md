# 网易云音乐64首歌淘汰赛（完整版）

## 最推荐：Vercel 部署（无需 Cloudflare）

GitHub Pages 是纯静态网站，无法运行搜索后端。这个项目包含 `api/search.js`，可以由 Vercel 自动作为后端部署，并让网站通过同一域名访问搜索接口。

1. 将解压后的 **index.html、api 文件夹、vercel.json**（以及 README.md）上传至 GitHub 仓库 `Zainzz000/music-battle` 的根目录。上传时保持 `api/search.js` 目录结构。
2. 打开 https://vercel.com/new ，用 GitHub 登录并授权 Vercel 读取该仓库。
3. Import `music-battle`，Framework Preset 选 **Other**，不填构建命令，点击 **Deploy**。
4. 部署后得到 `https://你的项目.vercel.app`，在这个地址打开网页即可自动使用同域名 `/api/search`。**请先测试歌手搜索，再分享给朋友。**

> 注意：搜索使用网易云的非官方公开接口，网易云可能限制 Vercel 服务器 IP、接口调用或返回内容。项目部署成功**不等于**网易云搜索一定成功；若出现 502，请查看 Vercel Functions 日志。此方案不要求你或朋友输入网易云密码、Cookie 或会员凭据。

## 如果继续使用 GitHub Pages

1. 上传 `index.html` 到仓库根目录；Settings → Pages → Deploy from a branch → main / (root)。
2. GitHub Pages 地址 `https://zainzz000.github.io/music-battle/` 只运行前端，**不能直接运行 `api/search.js`**。
3. 可先按上面的 Vercel 方法部署搜索服务，再在 GitHub Pages 网页的「搜索服务地址」输入 **Vercel 站点的完整 https:// 地址**，点击保存。以后这个浏览器会记住地址。
4. 但分享给新朋友时，他们的浏览器没有你的本地设置，需自行填入服务地址。因此**直接分享 Vercel 网站**最省事。

## 功能与限制

- 经典64强淘汰赛；瑞士轮5/6/7轮、Top 8；数学上确定的晋级/淘汰标记；自动保存；移动端。
- 搜索时按歌手名筛选并去重；需要恰好64首才开始，数量不足会提示。可手动导入64首歌作为备用。
- 试听使用公开音频地址，可能受版权、会员、浏览器或网络限制。可点击链接到网易云官方页面收听。
- 微信内置浏览器通常需要手动点击播放。
- 账号登录不是必须功能；不会收集密码、Cookie，亦不会共享会员权限。

## 文件说明

- `index.html`：完整网页，Vercel 和 GitHub Pages 均可托管。
- `api/search.js`：Vercel Serverless Function 搜索代理。
- `vercel.json`：Vercel 部署配置。
- `worker.js`：可选 Cloudflare Worker 版本（不使用 Cloudflare 可忽略）。
