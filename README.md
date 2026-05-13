# AIGC 素材资产库

这是一个 Vite + React + Tailwind 的公开展示页面，用于部署到 Vercel。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 Vercel

1. 把整个项目上传到 GitHub。
2. 打开 Vercel，新建项目。
3. 选择这个 GitHub 仓库。
4. Framework Preset 选择 Vite。
5. Build Command 使用 `npm run build`。
6. Output Directory 使用 `dist`。
7. 点击 Deploy。

## 后续接入真实素材

未来可以把真实图片/GIF/视频放到：

```txt
public/aigc-assets/
```

然后在 `src/App.jsx` 中把 `initialAssets` 替换成真实数据，并增加字段：

```js
mediaUrl: "/aigc-assets/example.webp"
```

之后再把 `AssetPreview` 改成优先读取真实 `mediaUrl` 即可。
