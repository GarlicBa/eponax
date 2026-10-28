# EponaX 源码包与 GitHub Pages 部署

## 包内内容

- `app/`、`offline/`：完整页面源码与样式，包括保留的旧模板组件。
- `public/`：当前页面使用的全部静态图片。
- `package.json`、`package-lock.json`、`vite.config.ts`、`index.html`：开发与构建配置。
- `.github/workflows/deploy.yml`：推送到 `main` 后自动构建并部署。
- `dist/`：本次构建的静态页面，可用于检查或单独发布；不需要提交到源码仓库。
- 不包含 `node_modules/`、缓存、原始 `素材/` 或 Git 登录凭据。原始素材不参与当前页面运行。

## 在另一台电脑继续修改

安装 Node.js 22，然后在解压后的项目根目录执行：

```bash
npm ci
npm run dev
```

打开 http://localhost:5173。主要修改 `app/page.tsx` 和 `offline/page.css`，保存后自动更新。

## 上传到个人 GitHub 账号

1. 在个人账号下创建一个空的公开仓库，例如 `eponax`，不要预先添加 README、许可证或 `.gitignore`。
2. 在解压后的项目根目录执行以下命令，把 `YOUR_USERNAME` 换成自己的账号：

```bash
git init -b main
git add .
git commit -m "Add EponaX project page"
git remote add origin https://github.com/YOUR_USERNAME/eponax.git
git push -u origin main
```

3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 如果首次推送发生在启用 Pages 之前，在 **Actions → Deploy project page → Run workflow** 手动重跑一次。
5. 等部署成功后访问 `https://YOUR_USERNAME.github.io/eponax/`，实际地址也会显示在 Pages 设置中。

仓库名可以不是 `eponax`，相对资源路径同样适用。若要使用个人账号主页根地址，仓库必须叫 `YOUR_USERNAME.github.io`。只有账号或组织名为 `eponax` 才能使用 `https://eponax.github.io/`。

上传的是解压后的源码文件，不是 ZIP 本身，也不要只上传 `dist/`。请保留 `.github/`、`.gitignore` 和 `public/.nojekyll` 等隐藏文件。推荐以上 Git 命令，避免网页上传时遗漏隐藏文件。

## 他人 clone 后修改

```bash
git clone https://github.com/YOUR_USERNAME/eponax.git
cd eponax
npm ci
npm run dev
```

有仓库写权限的协作者推送到 `main` 后会自动重新部署；其他人可以 fork 后提交 Pull Request。

## 检查构建产物

```bash
npm run build
npm run preview
```

预览也使用 5173，请先停止开发服务，避免端口冲突。不要直接双击 `dist/index.html`，应通过 HTTP 服务预览。

## 正式公开前检查

本包保留当前页面效果，不替换尚未确认的论文信息。`index.html` 的 description、canonical、citation 元数据及 `app/citations.ts` 的 BibTeX 仍有旧模板内容；部分资源按钮仍为占位链接。当前 `Download .bib` 指向的文件也尚未提供，正式发布前应补齐或调整。

原模板被注释的模块仍保留代码，但其旧视频、动作数据和无关图片已清理；本包覆盖的是当前可见页面，不包含那些旧模块的全部素材。不要运行 `npm run sync-assets`，除非确实要恢复原模板资源。公开代码及素材前，请确认公司授权及原模板使用许可。
