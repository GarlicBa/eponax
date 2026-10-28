# EPONAX Project Page

源码包在其他电脑上的使用、个人 GitHub 账号部署及协作修改步骤见 `DEPLOY.md`。自动部署配置位于 `.github/workflows/deploy.yml`，支持个人仓库子路径。

初始模板来自 https://lambdahumanoid.github.io/ 和 `LambdaHumanoid/LambdaHumanoid.github.io` 仓库，暂时保留原站内容，后续替换为自己的 tech report。保留原站的 React 页面组件，使用轻量的 Vite 开发入口，不依赖原仓库的 Cloudflare / vinext 部署环境。

## 本地开发

需要 Node.js 20.19+（当前环境已安装）。首次运行安装依赖，以后只需要启动开发服务：

```bash
cd /home/users/zhijian.shu/tech_page
npm install
npm run dev
```

打开 http://localhost:5173。修改保存后页面自动更新，不需要部署到 GitHub，也不需要每次手动执行构建。按 `Ctrl+C` 停止服务。

如果目录位于远程服务器，在 VS Code 的 Ports 面板转发 `5173`，或在自己电脑运行 `ssh -L 5173:127.0.0.1:5173 用户名@服务器地址`，再打开本机的 http://localhost:5173。服务监听 `0.0.0.0`，仅在可信网络中使用。

## 修改入口

- `app/page.tsx`：首页主体、标题、作者、摘要、方法、结果等。
- `app/research.ts`：实验数据和视频配置。
- `app/HeroReport.tsx`、`app/DemoPlayer.tsx` 等：原站交互组件。
- `offline/page.css`：当前使用的原站发布版完整样式。
- `index.html`：网页标题、描述、图标、canonical / citation 元数据。
- `public/figures/`、`public/videos/`、`public/motion/`：图片、视频和 3D 动作素材。

`app/layout.tsx` 和 `app/globals.css` 是原仓库附带的布局与原始样式，当前 Vite 入口不使用它们；实际入口为 `app/main.tsx`，样式修改 `offline/page.css` 即可。

## 模板素材

当前页面的静态素材已清理，仅保留 EponaX 标识、吉祥物和 Architecture 使用的六张图；`素材/` 中的原始素材完整保留。旧模板模块的代码仍以注释形式保留，但其视频、动作数据和无关图片已移除。

以下脚本仅用于恢复原模板素材，会重新下载已删除的资源，当前页面无需运行：

```bash
npm run sync-assets
```

页面源码、样式、主要图片和演示视频已经在本地。原模板还附带大量 3D 动作数据和扩展视频：开发与预览服务优先使用本地文件，缺少的原站素材通过代理按需联网加载，不影响修改自己的页面。需要完全离线浏览时，运行上面的同步命令补齐资源。

同步需要 Python 3 和 curl，系统有 aria2c 时自动使用多连接下载。已有完整文件不会覆盖，未完成的下载保存在 `.cache/assets/`，中断后可重新执行。全量动作库较大，首次同步可能较慢；后续替换为自己的报告时，可以直接删除不需要的素材与组件。

当前服务器到 GitHub Raw 的连接不稳定，未下载的 3D 动作数据及扩展素材可能暂时无法加载；这不影响首页内容、样式和本地编辑。完整介绍视频可以按需从原站加载，其他未缓存素材从原仓库加载。

## 本地构建与发布

```bash
npm run build
npm run preview
```

构建结果在 `dist/`，预览地址同样是 http://localhost:5173；先停止开发服务，避免端口冲突。`preview` 用于检查发布版本，继续编辑时使用 `npm run dev`。

本步骤不会创建远程仓库、推送代码或修改线上网站。之后将 `dist/` 的内容发布到 `eponax` 账号或组织下的 `eponax.github.io` 仓库即可使用 GitHub Pages；不要直接把未构建的 TypeScript 源码当作静态网页发布。`public/.nojekyll` 会随构建复制到输出目录。GitHub Pages 不运行本地素材代理，发布前需补齐保留的素材，或移除不需要的原站演示组件。

公开发布前，需要替换原站的项目名称、作者、论文链接、元数据、图片和视频，并确认原模板代码及素材的使用授权。下载到本地不代表获得了原站素材的转载许可。
