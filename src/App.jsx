import React, { useMemo, useState } from "react";

const theme = {
  blue: "#0078d4",
  text: "#201f1e",
  subText: "#605e5c",
  muted: "#8a8886",
  border: "rgba(255,255,255,0.46)",
  canvas: "#edf2f7",
  soft: "rgba(255,255,255,0.34)",
};

const models = ["Seedream 3.0", "Midjourney 7", "nano pro", "Seedream 4.5"];
const categories = ["服装单品", "功能面料", "科技视觉", "电商KV"];
const scenes = ["凉感科技", "防晒防护", "蓬松柔软", "抗菌耐磨", "商业海报", "动态演示"];

const visualPresets = [
  ["#eaf3ff", "#d7ebff", "#b9dcff", "#0078d4"],
  ["#f3f2f1", "#e1dfdd", "#c8c6c4", "#2b88d8"],
  ["#eef6fc", "#c7e0f4", "#8abde6", "#00a2ed"],
  ["#f5f0ff", "#e6dcff", "#c7b4f7", "#8661c5"],
  ["#fff4ce", "#fde7a5", "#f3c950", "#ffb900"],
  ["#e5f5ec", "#c7ebd1", "#8fd19e", "#107c10"],
  ["#e6f7ff", "#bcecff", "#80d8ff", "#00bcf2"],
  ["#fdf3f4", "#f7d7dc", "#f3a8b7", "#e3008c"],
];

const placeholderAssets = Array.from({ length: 12 }, (_, index) => {
  const id = index + 1;
  const preset = visualPresets[index % visualPresets.length];
  const hasPrompt = index % 4 !== 1;
  return {
    id,
    title: `图片占位 ${String(id).padStart(2, "0")}`,
    mediaType: "image",
    model: models[index % models.length],
    category: categories[index % categories.length],
    scene: scenes[index % scenes.length],
    quarter: ["25Q3", "25Q4", "26Q2"][index % 3],
    favorite: index === 2 || index === 9,
    hasPrompt,
    prompt: hasPrompt ? "这里是该素材对应的 Prompt 占位内容。正式上线后，可以替换为真实生成提示词，也可以为空。" : "",
    tags: [categories[index % categories.length], scenes[index % scenes.length], models[index % models.length]],
    gradient: `linear-gradient(135deg, ${preset[0]} 0%, ${preset[1]} 48%, ${preset[2]} 100%)`,
    accent: preset[3],
  };
});

const motionAssetTitles = ["防晒科技", "抑菌科技", "舒弹科技", "透气面料", "防泼水科技", "防护科技", "易打理面料", "耐磨面料", "防雨科技", "抗静电科技", "纯棉面料", "抑菌科技", "防风科技", "透湿科技"];

const motionAssets = motionAssetTitles.map((title, index) => {
  const preset = visualPresets[index % visualPresets.length];
  return {
    id: index + 13,
    title,
    mediaType: "video",
    mediaUrl: `/aigc-assets/motion/gif${index + 1}.mp4`,
    model: "动态素材",
    category: "功能类",
    scene: title.includes("面料") ? "功能面料" : title,
    quarter: "26Q2",
    favorite: false,
    hasPrompt: false,
    prompt: "",
    tags: ["动态素材", "功能类", title],
    gradient: `linear-gradient(135deg, ${preset[0]} 0%, ${preset[1]} 48%, ${preset[2]} 100%)`,
    accent: preset[3],
  };
});

const initialAssets = [...placeholderAssets, ...motionAssets];

const navItems = [
  { key: "all", label: "全部素材", icon: "image" },
  { key: "motion", label: "动态素材", icon: "sparkle" },
  { key: "prompt", label: "Prompt 词库", icon: "copy" },
  { key: "favorite", label: "收藏", icon: "star" },
  { key: "taxonomy", label: "分类管理", icon: "tag" },
];

const quickFilters = [
  { key: "all", label: "全部" },
  { key: "image", label: "图片" },
  { key: "gif", label: "GIF" },
  { key: "video", label: "视频" },
  { key: "withPrompt", label: "有 Prompt" },
  { key: "withoutPrompt", label: "无 Prompt" },
];

const filterGroups = [
  { label: "模型", key: "model", options: models },
  { label: "分类", key: "category", options: categories },
  { label: "场景", key: "scene", options: scenes },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getAssetCounts(items) {
  return {
    all: items.length,
    image: items.filter((item) => item.mediaType === "image").length,
    motion: items.filter((item) => item.mediaType === "gif" || item.mediaType === "video").length,
    prompt: items.filter((item) => item.hasPrompt).length,
    favorite: items.filter((item) => item.favorite).length,
  };
}

function getFilteredAssets(items, section, quickFilter, categoryFilter, query) {
  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    const searchableText = [item.title, item.mediaType, item.model, item.category, item.scene, item.quarter, item.prompt, ...item.tags].join(" ").toLowerCase();
    const matchQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchSection =
      section === "all" ||
      (section === "motion" && (item.mediaType === "gif" || item.mediaType === "video")) ||
      (section === "prompt" && item.hasPrompt) ||
      (section === "favorite" && item.favorite) ||
      section === "taxonomy";
    const matchQuickFilter =
      quickFilter === "all" ||
      item.mediaType === quickFilter ||
      (quickFilter === "withPrompt" && item.hasPrompt) ||
      (quickFilter === "withoutPrompt" && !item.hasPrompt);
    const matchCategory = !categoryFilter || item[categoryFilter.key] === categoryFilter.value;
    return matchQuery && matchSection && matchQuickFilter && matchCategory;
  });
}

function toggleFavoriteInItems(items, id) {
  return items.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item));
}

function iconPath(name) {
  const paths = {
    search: ["M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8Z", "M16 16l5 5"],
    image: ["M5 5h14v14H5z", "M8 15l3-3 2 2 3-4 3 5", "M9 9h.01"],
    sparkle: ["M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z", "M19 16l.6 2.1L22 19l-2.4.9L19 22l-.6-2.1L16 19l2.4-.9L19 16Z"],
    star: ["M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z"],
    copy: ["M8 8h11v11H8z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
    tag: ["M4 11V5h6l10 10-6 6L4 11Z", "M8 8h.01"],
    grid: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M14 14h6v6h-6z"],
    rows: ["M4 6h16", "M4 12h16", "M4 18h16"],
    layers: ["M12 3 3 8l9 5 9-5-9-5Z", "M3 13l9 5 9-5", "M3 17l9 5 9-5"],
    play: ["M8 5v14l11-7-11-7Z"],
    down: ["M7 10l5 5 5-5"],
  };
  return paths[name] || [];
}

function Icon({ name, size = 18, className = "", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {iconPath(name).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

function Panel({ children, className = "", style = {} }) {
  return (
    <div
      className={cn("rounded-[28px] border p-4 backdrop-blur-2xl", className)}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.34) 100%)",
        borderColor: "rgba(255,255,255,0.46)",
        boxShadow: "0 10px 30px rgba(31,38,135,0.10), inset 0 1px 0 rgba(255,255,255,0.55)",
        WebkitBackdropFilter: "blur(22px)",
        backdropFilter: "blur(22px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function AssetPreview({ item }) {
  const isMotion = item.mediaType === "gif" || item.mediaType === "video";
  if (item.mediaUrl) {
    if (item.mediaType === "video") {
      return (
        <div className="relative h-full w-full overflow-hidden bg-black">
          <video className="h-full w-full object-cover" src={item.mediaUrl} autoPlay loop muted playsInline preload="metadata" />
        </div>
      );
    }
    return (
      <div className="relative h-full w-full overflow-hidden bg-gray-100">
        <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: item.gradient }}>
      <div className="absolute inset-0 preview-glow" />
      <div className="absolute left-6 top-7 h-20 w-28 rounded-2xl bg-white bg-opacity-40 shadow-xl backdrop-blur" />
      <div className="absolute right-7 top-24 h-28 w-28 rounded-full bg-white bg-opacity-30 shadow-xl backdrop-blur" />
      <div className="absolute bottom-12 left-8 h-16 w-36 rounded-full opacity-70 blur-2xl" style={{ background: item.accent }} />
      <div className="absolute inset-x-8 bottom-8 h-px bg-white bg-opacity-70" />
      {isMotion ? (
        <div className="absolute inset-0">
          <div className="motion-orb absolute left-12 top-32 h-16 w-16 rounded-full bg-white bg-opacity-35 blur-sm" />
          <div className="motion-block absolute right-12 top-44 h-24 w-24 rounded-2xl bg-white bg-opacity-25 backdrop-blur" />
          <div className="motion-line absolute bottom-24 left-20 h-2 w-40 rounded-full bg-white bg-opacity-60" />
        </div>
      ) : null}
    </div>
  );
}

function AssetCard({ item, index, onToggleFavorite, frameClassName = "aspect-[4/5]", showModelLabel = true }) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border bg-white transition duration-500 hover:-translate-y-1 hover:shadow-2xl" style={{ borderColor: theme.border, animationDelay: `${index * 45}ms` }}>
      <div className={cn("relative overflow-hidden bg-gray-100", frameClassName)}>
        <AssetPreview item={item} />
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-end p-4">
          <button type="button" aria-label={item.favorite ? "取消收藏" : "收藏素材"} onClick={() => onToggleFavorite(item.id)} className="flex h-9 w-9 items-center justify-center rounded-md bg-white bg-opacity-90 backdrop-blur transition hover:scale-105" style={{ color: item.favorite ? "#ffb900" : theme.subText }}>
            <Icon name="star" size={17} filled={item.favorite} />
          </button>
        </div>
        {showModelLabel ? (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 transition-opacity duration-300 group-hover:opacity-0">
            <span className="rounded-md px-3 py-1 text-xs font-medium text-white backdrop-blur" style={{ background: "rgba(50,49,48,.72)" }}>{item.model}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl px-4 py-2 text-sm font-medium transition backdrop-blur-xl"
      style={{
        background: active ? "rgba(0,120,212,0.92)" : "rgba(255,255,255,0.34)",
        color: active ? "white" : theme.subText,
        border: `1px solid ${active ? "rgba(0,120,212,.95)" : "rgba(255,255,255,.44)"}`,
        boxShadow: active ? "0 6px 16px rgba(0,120,212,.22)" : "inset 0 1px 0 rgba(255,255,255,.48)",
      }}
    >
      {children}
    </button>
  );
}

function SectionTitle({ activeSection, filteredCount }) {
  const titleMap = { all: "全局素材预览", motion: "动态素材", prompt: "Prompt 词库", favorite: "收藏素材", taxonomy: "分类管理" };
  const subtitleMap = {
    all: `共找到 ${filteredCount} 个素材资产`,
    motion: `共找到 ${filteredCount} 个 GIF / 视频素材`,
    prompt: `共找到 ${filteredCount} 条已绑定 Prompt 的素材`,
    favorite: `共找到 ${filteredCount} 个收藏素材`,
    taxonomy: "按模型、分类、场景维护素材结构",
  };
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight" style={{ color: theme.text }}>{titleMap[activeSection]}</h2>
      <p className="mt-1 text-sm" style={{ color: theme.subText }}>{subtitleMap[activeSection]}</p>
    </section>
  );
}

function EmptyState() {
  return (
    <Panel className="p-12 text-center">
      <h3 className="text-xl font-semibold tracking-tight">没有找到匹配结果</h3>
      <p className="mt-2 text-sm" style={{ color: theme.subText }}>尝试更换关键词，或清空当前筛选。</p>
    </Panel>
  );
}

function AssetListView({ assets, onToggleFavorite }) {
  return (
    <section className="space-y-3">
      {assets.map((item) => (
        <article key={item.id} className="flex gap-4 rounded-2xl border bg-white p-3" style={{ borderColor: theme.border, boxShadow: "0 4px 14px rgba(0,0,0,.06)" }}>
          <div className="h-28 w-36 shrink-0 overflow-hidden rounded-xl"><AssetPreview item={item} /></div>
          <div className="min-w-0 flex-1 py-2">
            <h3 className="truncate text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6" style={{ color: theme.subText }}>{item.hasPrompt ? item.prompt : "该素材暂未绑定 Prompt，可后续补充。"}</p>
          </div>
          <button onClick={() => onToggleFavorite(item.id)} className="h-10 rounded-md p-2" style={{ background: theme.canvas, color: item.favorite ? "#ffb900" : theme.muted }}><Icon name="star" size={16} filled={item.favorite} /></button>
        </article>
      ))}
    </section>
  );
}

function AssetGridView({ assets, onToggleFavorite }) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {assets.map((item, index) => <AssetCard key={item.id} item={item} index={index} onToggleFavorite={onToggleFavorite} />)}
    </section>
  );
}

function MotionGridView({ assets, onToggleFavorite }) {
  return (
    <section className="grid gap-6 sm:grid-cols-2">
      {assets.slice(0, 14).map((item, index) => <AssetCard key={item.id} item={item} index={index} onToggleFavorite={onToggleFavorite} frameClassName="aspect-[3/2]" showModelLabel={false} />)}
    </section>
  );
}

function ThumbnailTileWall() {
  const [hoveredThumb, setHoveredThumb] = useState(null);
  const cols = 28;
  const thumbCount = 196;
  const colorSets = [
    ["#6ee7ff", "#0ea5e9", "#075985"],
    ["#c4b5fd", "#8b5cf6", "#312e81"],
    ["#f9a8d4", "#ec4899", "#831843"],
    ["#86efac", "#22c55e", "#14532d"],
    ["#fde68a", "#f59e0b", "#78350f"],
    ["#99f6e4", "#14b8a6", "#134e4a"],
    ["#bfdbfe", "#3b82f6", "#1e3a8a"],
    ["#fecaca", "#ef4444", "#7f1d1d"],
  ];
  function getThumbStyle(index) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const edgeDistanceX = Math.min(col, cols - 1 - col) / (cols / 2);
    const edgeFade = clamp(edgeDistanceX * 1.85, 0.08, 1);
    if (hoveredThumb === null) return { transform: "translate3d(0,0,0) scale(1)", zIndex: 1, opacity: 0.18 + edgeFade * 0.28, boxShadow: "inset 0 1px 0 rgba(255,255,255,.32)" };
    const hoverRow = Math.floor(hoveredThumb / cols);
    const hoverCol = hoveredThumb % cols;
    const dx = col - hoverCol;
    const dy = row - hoverRow;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const safeDistance = Math.max(distance, 0.001);
    const influence = Math.max(0, 1 - distance / 6.4);
    const magnetic = influence * influence * (3 - 2 * influence);
    if (index === hoveredThumb) return { transform: "translate3d(0,-10px,0) scale(3.55)", zIndex: 220, opacity: 1, filter: "saturate(1.16) brightness(1.08)", boxShadow: "0 28px 64px rgba(0,0,0,.22), 0 0 0 1px rgba(255,255,255,.32), 0 0 52px rgba(74,168,255,.14)" };
    const directionX = dx / safeDistance;
    const directionY = dy / safeDistance;
    return { transform: `translate3d(${directionX * magnetic * 24}px, ${directionY * magnetic * 24}px, 0) scale(${0.94 + (1 - magnetic) * 0.06})`, zIndex: Math.max(1, Math.round(magnetic * 64)), opacity: 0.12 + edgeFade * 0.18 + magnetic * 0.28, boxShadow: magnetic > 0.48 ? "0 8px 18px rgba(31,38,135,.08)" : "none" };
  }
  return (
    <section className="thumbnail-inline-stage relative mb-6 overflow-hidden rounded-[28px] px-5 py-6 md:px-8">
      <div className="thumbnail-wall-shell relative z-10">
        <div className="grid gap-1.5 md:gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} onMouseLeave={() => setHoveredThumb(null)}>
          {Array.from({ length: thumbCount }, (_, index) => {
            const palette = colorSets[index % colorSets.length];
            const isActive = hoveredThumb === index;
            return (
              <button key={index} type="button" onMouseEnter={() => setHoveredThumb(index)} className={cn("thumbnail-tile relative aspect-[3/4] overflow-hidden outline-none", isActive ? "thumbnail-tile-active" : "")} style={{ ...getThumbStyle(index), borderRadius: "9px", background: `linear-gradient(${120 + (index % 10) * 18}deg, ${palette[0]} 0%, ${palette[1]} 52%, ${palette[2]} 100%)` }}>
                <span className="thumbnail-frost absolute inset-0" style={{ background: isActive ? "linear-gradient(to bottom right, rgba(255,255,255,.08), rgba(255,255,255,.02), rgba(0,0,0,.06))" : "linear-gradient(to bottom right, rgba(255,255,255,.72), rgba(255,255,255,.40), rgba(255,255,255,.18))" }} />
                <span className="thumbnail-glint pointer-events-none absolute inset-y-0 -left-[120%] w-[80%] rotate-12 bg-gradient-to-r from-transparent via-white/44 to-transparent" />
                <span className="absolute left-[12%] top-[13%] h-[25%] w-[44%] rounded-lg bg-white/20" />
                <span className="absolute bottom-[13%] right-[13%] h-[26%] w-[29%] rounded-full bg-white/13" />
              </button>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[300] w-44 bg-gradient-to-r from-[#eef4f8] via-[#eef4f8]/88 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[300] w-44 bg-gradient-to-l from-[#eef4f8] via-[#eef4f8]/88 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[300] h-24 bg-gradient-to-b from-[#eef4f8] via-[#eef4f8]/82 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[300] h-24 bg-gradient-to-t from-[#f2f4f7] via-[#f2f4f7]/82 to-transparent" />
      </div>
    </section>
  );
}

function AssetMarquee() {
  const makeAssets = (folder, prefix, direction) => Array.from({ length: 6 }, (_, index) => ({
    id: `${direction}-${index + 1}`,
    title: `${direction}循环素材 ${String(index + 1).padStart(2, "0")}`,
    mediaType: "image",
    mediaUrl: `/aigc-assets/${folder}/${prefix}-${String(index + 1).padStart(2, "0")}.webp`,
    model: "Marquee",
    category: "全局预览",
    scene: "竖构图素材循环",
    hasPrompt: false,
    prompt: "",
    tags: ["竖构图", direction],
    gradient: "linear-gradient(135deg, #eaf3ff 0%, #d7ebff 48%, #b9dcff 100%)",
    accent: "#0078d4",
  }));
  const repeatAssets = (items) => [...items, ...items, ...items, ...items];
  const left = repeatAssets(makeAssets("marquee", "marquee", "向左"));
  const right = repeatAssets(makeAssets("marquee-right", "marquee-right", "向右"));
  const renderRow = (items, className) => (
    <div className={cn("marquee-track flex w-max gap-5 px-6 md:px-8", className)}>
      {items.map((item, index) => (
        <div key={`${className}-${item.id}-${index}`} className="h-80 w-60 shrink-0 overflow-hidden rounded-2xl border bg-white" style={{ borderColor: theme.border, boxShadow: "0 6px 20px rgba(0,0,0,.07)" }}><AssetPreview item={item} /></div>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white py-6" style={{ borderColor: theme.border, boxShadow: "0 10px 34px rgba(0,0,0,.055)" }}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-white to-transparent" />
      <div className="mb-8 px-6 text-center md:px-8">
        <h3 className="text-2xl font-semibold tracking-[-0.035em] md:text-4xl" style={{ color: theme.text }}>竖构图素材循环</h3>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style={{ color: theme.subText }}>精选竖构图静态图片循环展示，先建立整体视觉印象，再进入下方分类内容查看细节。</p>
      </div>
      <div className="space-y-5">{renderRow(left, "marquee-left")}{renderRow(right, "marquee-right")}</div>
    </div>
  );
}

function GlobalPreviewGridView({ assets, onToggleFavorite }) {
  const stillAssets = assets.filter((item) => item.mediaType === "image");
  const motionAssets = assets.filter((item) => item.mediaType === "gif" || item.mediaType === "video");
  const promptAssets = assets.filter((item) => item.hasPrompt);
  const showcaseAssets = [...stillAssets, ...motionAssets, ...promptAssets].slice(0, 12);
  const overviewHeroAssets = [
    {
      id: "overview-hero-01",
      title: "全局预览主展示图 01",
      mediaType: "image",
      mediaUrl: "/aigc-assets/overview/overview-hero-01.webp",
      model: "Overview",
      category: "全局预览",
      scene: "主展示图",
      hasPrompt: false,
      prompt: "",
      tags: ["主展示", "全局预览"],
      gradient: "linear-gradient(135deg, #eaf3ff 0%, #d7ebff 48%, #b9dcff 100%)",
      accent: "#0078d4",
    },
    {
      id: "overview-hero-02",
      title: "全局预览主展示图 02",
      mediaType: "image",
      mediaUrl: "/aigc-assets/overview/overview-hero-02.webp",
      model: "Overview",
      category: "全局预览",
      scene: "主展示图",
      hasPrompt: false,
      prompt: "",
      tags: ["主展示", "全局预览"],
      gradient: "linear-gradient(135deg, #f3f2f1 0%, #e1dfdd 48%, #c8c6c4 100%)",
      accent: "#2b88d8",
    },
  ];
  const modelPreviewAssets = [
    { id: "model-01", title: "模型类主展示图 01", mediaType: "image", mediaUrl: "/aigc-assets/model/model-01.webp", model: "Model Preview", category: "模型类", scene: "主展示图", hasPrompt: false, prompt: "", tags: ["模型类", "主展示"], gradient: "linear-gradient(135deg, #eaf3ff 0%, #d7ebff 48%, #b9dcff 100%)", accent: "#0078d4" },
    { id: "model-02", title: "模型类主展示图 02", mediaType: "image", mediaUrl: "/aigc-assets/model/model-02.webp", model: "Model Preview", category: "模型类", scene: "主展示图", hasPrompt: false, prompt: "", tags: ["模型类", "主展示"], gradient: "linear-gradient(135deg, #f5f0ff 0%, #e6dcff 48%, #c7b4f7 100%)", accent: "#8661c5" },
  ];
  const renderAssetCard = (item, index, frameClassName = "aspect-square") => <AssetCard key={`${item.id}-${index}`} item={item} index={index} onToggleFavorite={onToggleFavorite} frameClassName={frameClassName} showModelLabel={false} />;
  return (
    <section className="space-y-10">
      <AssetMarquee />
      <section className="rounded-[36px] border bg-white px-6 py-12 md:px-12 md:py-16" style={{ borderColor: theme.border, boxShadow: "0 10px 34px rgba(0,0,0,.045)" }}>
        <div className="mx-auto mb-16 max-w-5xl px-4 pb-2 pt-6 text-center md:mb-20 md:pt-10">
          <h3 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl lg:text-7xl" style={{ color: theme.text }}>让每一次生成，<br className="hidden md:block" />都成为下一次创作的起点。</h3>
          <p className="mx-auto mt-10 max-w-3xl text-lg leading-9 md:text-xl" style={{ color: theme.subText }}>以更清晰的比例、更安静的留白和更稳定的分区，把模型探索、功能表达和视觉资产统一沉淀。</p>
        </div>
        <div className="space-y-8">
          <div className="grid gap-5 lg:grid-cols-2">{renderAssetCard(overviewHeroAssets[0], 0, "aspect-[3/2]")}{renderAssetCard(overviewHeroAssets[1], 1, "aspect-[3/2]")}</div>
          <div>
            <div className="mb-4 flex items-end justify-between gap-4"><div><h4 className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl" style={{ color: theme.text }}>模型类</h4><p className="mt-3 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style={{ color: theme.subText }}>按不同生成模型沉淀代表性画面，方便横向比较模型风格、质感控制和画面稳定性。</p></div><span className="hidden rounded-full px-3 py-1 text-xs font-medium md:block" style={{ background: theme.soft, color: theme.subText, border: `1px solid ${theme.border}` }}>2 Column</span></div>
            <div className="grid gap-5 sm:grid-cols-2">{[...modelPreviewAssets, ...showcaseAssets.slice(4, 8)].map((item, index) => renderAssetCard(item, index + 2, "aspect-[3/4]"))}</div>
          </div>
          <div>
            <div className="mb-4 flex items-end justify-between gap-4"><div><h4 className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl" style={{ color: theme.text }}>功能类</h4><p className="mt-3 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style={{ color: theme.subText }}>围绕防晒、凉感、透气、蓬松、抗菌等功能表达归档素材，适合后续快速复用到商品卖点和视觉提案。</p></div><span className="hidden rounded-full px-3 py-1 text-xs font-medium md:block" style={{ background: theme.soft, color: theme.subText, border: `1px solid ${theme.border}` }}>2 Column</span></div>
            <div className="grid gap-5 sm:grid-cols-2">{showcaseAssets.slice(8, 14).map((item, index) => renderAssetCard(item, index + 8, "aspect-[3/4]"))}</div>
          </div>
        </div>
      </section>
    </section>
  );
}

function PromptLibraryView({ assets, viewMode, onToggleFavorite }) {
  const promptAssets = assets.filter((asset) => asset.hasPrompt);
  if (promptAssets.length === 0) return <EmptyState />;
  return viewMode === "grid" ? <AssetGridView assets={promptAssets} onToggleFavorite={onToggleFavorite} /> : <AssetListView assets={promptAssets} onToggleFavorite={onToggleFavorite} />;
}

function TaxonomyView() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {filterGroups.map((group) => (
        <Panel key={group.key} className="p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold tracking-tight">{group.label}</h3><Icon name="layers" size={18} /></div>
          <div className="space-y-2">{group.options.map((option) => <div key={option} className="rounded-md px-4 py-3 text-sm font-medium" style={{ background: theme.canvas, color: theme.subText }}>{option}</div>)}</div>
        </Panel>
      ))}
    </section>
  );
}

export function runAssetLibrarySmokeTests() {
  const counts = getAssetCounts(initialAssets);
  console.assert(counts.all === 26, "expected 26 total assets");
  console.assert(counts.motion === 14, "expected 14 motion assets");
  console.assert(getFilteredAssets(initialAssets, "motion", "all", null, "").length === 14, "motion filter should return 14 assets");
  console.assert(getFilteredAssets(initialAssets, "all", "video", null, "").length === 14, "video quick filter should return 14 assets");
  return true;
}

export default function AIGCAssetLibrary() {
  const [activeSection, setActiveSection] = useState("all");
  const [quickFilter, setQuickFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assets, setAssets] = useState(initialAssets);

  const counts = useMemo(() => getAssetCounts(assets), [assets]);
  const filteredAssets = useMemo(() => getFilteredAssets(assets, activeSection, quickFilter, categoryFilter, query), [assets, activeSection, quickFilter, categoryFilter, query]);
  const showGrid = viewMode === "grid";

  function handleSectionChange(section) {
    setActiveSection(section);
    setQuickFilter("all");
    setCategoryFilter(null);
  }

  function handleToggleFavorite(id) {
    setAssets((items) => toggleFavoriteInItems(items, id));
  }

  return (
    <div className="animated-page-bg min-h-screen font-sans" style={{ color: theme.text }}>
      <div className="pointer-events-none fixed -inset-40 overflow-hidden">
        <div className="ambient-wash absolute -inset-32" />
        <div className="ambient-orb ambient-orb-a absolute -left-6 top-4 h-[34rem] w-[34rem] rounded-full blur-3xl" style={{ background: "rgba(93,171,255,.42)" }} />
        <div className="ambient-orb ambient-orb-b absolute right-0 top-16 h-[38rem] w-[38rem] rounded-full blur-3xl" style={{ background: "rgba(171,219,255,.48)" }} />
        <div className="ambient-orb ambient-orb-c absolute bottom-0 left-1/4 h-[32rem] w-[32rem] rounded-full blur-3xl" style={{ background: "rgba(255,255,255,.72)" }} />
        <div className="ambient-sheen absolute -inset-32 opacity-90" />
      </div>
      <div className="fixed left-0 top-0 z-50 hidden h-screen w-4 lg:block"><button type="button" aria-label="打开侧栏" onClick={() => setIsSidebarOpen(true)} onMouseEnter={() => setIsSidebarOpen(true)} className="absolute left-0 top-1/2 h-24 w-2 -translate-y-1/2 rounded-r-md border-y border-r bg-white shadow transition-all duration-300 hover:w-3" style={{ borderColor: theme.border, opacity: isSidebarOpen ? 0 : 1 }} /></div>

      <aside onMouseEnter={() => setIsSidebarOpen(true)} onMouseLeave={() => setIsSidebarOpen(false)} className="fixed left-6 top-6 z-50 hidden h-[calc(100vh-48px)] w-72 rounded-2xl border p-5 backdrop-blur transition-all duration-300 lg:block" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.42) 100%)", borderColor: "rgba(255,255,255,0.42)", boxShadow: "0 12px 32px rgba(31,38,135,0.12), inset 0 1px 0 rgba(255,255,255,.52)", WebkitBackdropFilter: "blur(24px)", backdropFilter: "blur(24px)", opacity: isSidebarOpen ? 1 : 0, transform: isSidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 18px))", pointerEvents: isSidebarOpen ? "auto" : "none" }}>
        <div className="mb-10 flex items-center gap-3 px-2"><div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: theme.blue, boxShadow: "0 4px 12px rgba(0,120,212,.28)" }}><Icon name="sparkle" size={20} /></div><div><div className="text-lg font-semibold tracking-tight">AIGC Library</div><div className="text-xs" style={{ color: theme.subText }}>图片 · 动态 · Prompt</div></div></div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const count = counts[item.key] ?? "";
            const active = activeSection === item.key;
            return <button key={item.key} onClick={() => handleSectionChange(item.key)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition" style={{ background: active ? theme.blue : "transparent", color: active ? "white" : theme.subText, boxShadow: active ? "0 4px 12px rgba(0,120,212,.24)" : "none" }}><span className="flex items-center gap-3"><Icon name={item.icon} size={18} /><span className="font-medium">{item.label}</span></span>{count !== "" ? <span className="text-xs" style={{ color: active ? "rgba(255,255,255,.75)" : theme.muted }}>{count}</span> : null}</button>;
          })}
        </nav>
      </aside>

      <main className="relative mx-auto max-w-[1440px] px-6 py-6">
        <Panel className="mb-6 p-6 md:p-8" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.64) 0%, rgba(255,255,255,0.36) 100%)" }}>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div><div className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-medium" style={{ background: theme.soft, borderColor: theme.border, color: theme.subText }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: "#107c10" }} />可部署框架版 · 无外部图片依赖</div><h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">AIGC 素材资产库</h1><p className="mt-4 max-w-2xl text-base leading-7 md:text-lg" style={{ color: theme.subText }}>统一管理历史图片、GIF、视频片段与 Prompt。先跑通框架，后续直接替换真实素材与提示词。</p></div>
            <div className="grid grid-cols-3 gap-3 rounded-[24px] border p-3 md:min-w-[420px]" style={{ background: "rgba(255,255,255,0.22)", borderColor: "rgba(255,255,255,0.38)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.45)" }}>{[["全部素材", counts.all], ["动态素材", counts.motion], ["Prompt", counts.prompt]].map(([label, value]) => <div key={label} className="rounded-[18px] border px-4 py-4 text-center backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.42)", borderColor: "rgba(255,255,255,0.46)", boxShadow: "0 8px 20px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,.55)" }}><div className="text-2xl font-semibold tracking-tight">{value}</div><div className="mt-1 text-xs" style={{ color: theme.subText }}>{label}</div></div>)}</div>
          </div>
        </Panel>

        {activeSection === "all" ? <ThumbnailTileWall /> : null}

        <Panel className="relative mb-6 overflow-hidden p-5 md:p-6">
          <label className="mb-5 flex min-w-0 items-center gap-3 rounded-2xl border px-4 py-3.5 backdrop-blur-2xl" style={{ background: "rgba(255,255,255,0.36)", borderColor: "rgba(255,255,255,0.50)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.58), 0 8px 22px rgba(31,38,135,.06)" }}>
            <Icon name="search" size={19} className="shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索素材、模型、场景、标签或 Prompt" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <div className="mb-5 flex flex-wrap items-center gap-2">{quickFilters.map((filter) => <FilterPill key={filter.key} active={quickFilter === filter.key} onClick={() => setQuickFilter(filter.key)}>{filter.label}</FilterPill>)}<div className="ml-auto flex rounded-2xl border p-1 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.30)", borderColor: "rgba(255,255,255,0.44)" }}><button aria-label="网格视图" onClick={() => setViewMode("grid")} className="rounded-xl p-2 transition" style={{ background: showGrid ? "rgba(255,255,255,0.74)" : "transparent", color: showGrid ? theme.blue : theme.subText }}><Icon name="grid" size={16} /></button><button aria-label="列表视图" onClick={() => setViewMode("list")} className="rounded-xl p-2 transition" style={{ background: !showGrid ? "rgba(255,255,255,0.74)" : "transparent", color: !showGrid ? theme.blue : theme.subText }}><Icon name="rows" size={16} /></button></div></div>
          <div className="grid gap-3 md:grid-cols-3">{filterGroups.map((group) => { const active = categoryFilter?.key === group.key; return <button key={group.key} onClick={() => setCategoryFilter(active ? null : { key: group.key, value: group.options[0] })} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition backdrop-blur-xl" style={{ background: active ? "rgba(0,120,212,0.92)" : "rgba(255,255,255,0.30)", color: active ? "white" : theme.subText, border: `1px solid ${active ? "rgba(0,120,212,.95)" : "rgba(255,255,255,.44)"}` }}><span>{active ? `${group.label}：${categoryFilter.value}` : group.label}</span><Icon name="down" size={14} /></button>; })}</div>
          {categoryFilter ? <div className="mt-4 flex flex-wrap gap-2">{filterGroups.find((group) => group.key === categoryFilter.key)?.options.map((option) => <FilterPill key={option} active={categoryFilter.value === option} onClick={() => setCategoryFilter({ key: categoryFilter.key, value: option })}>{option}</FilterPill>)}</div> : null}
        </Panel>

        <SectionTitle activeSection={activeSection} filteredCount={filteredAssets.length} />
        {activeSection === "prompt" ? <PromptLibraryView assets={filteredAssets} viewMode={viewMode} onToggleFavorite={handleToggleFavorite} /> : activeSection === "taxonomy" ? <TaxonomyView /> : filteredAssets.length === 0 ? <EmptyState /> : showGrid ? activeSection === "all" ? <GlobalPreviewGridView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} /> : activeSection === "motion" ? <MotionGridView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} /> : <AssetGridView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} /> : <AssetListView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} />}
      </main>

      <style>{`
        input::placeholder { color: rgba(96,94,92,.58); }
        .animated-page-bg { background: linear-gradient(180deg, rgba(239,247,255,1) 0%, rgba(226,236,246,1) 46%, rgba(242,244,247,1) 100%); position: relative; overflow-x: hidden; }
        .animated-page-bg::before { content: ""; position: fixed; inset: -34%; pointer-events: none; background: radial-gradient(circle at 18% 20%, rgba(0,120,212,.18), transparent 24%), radial-gradient(circle at 72% 18%, rgba(124,94,255,.14), transparent 24%), radial-gradient(circle at 48% 78%, rgba(0,188,242,.12), transparent 28%); filter: blur(8px); opacity: .9; animation: backgroundBreath 12s ease-in-out infinite; will-change: transform, opacity; }
        .ambient-wash { background: radial-gradient(circle at 16% 12%, rgba(0,120,212,.22), transparent 25%), radial-gradient(circle at 88% 8%, rgba(132,118,255,.18), transparent 27%), radial-gradient(circle at 42% 70%, rgba(0,188,242,.16), transparent 28%), linear-gradient(120deg, rgba(255,255,255,.18), transparent 48%, rgba(255,255,255,.22)); opacity: .9; animation: ambientWashMove 11s ease-in-out infinite; will-change: transform, opacity; }
        @keyframes backgroundBreath { 0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: .72; } 50% { transform: translate3d(2.5%,-1.5%,0) scale(1.08); opacity: 1; } }
        @keyframes ambientWashMove { 0%, 100% { transform: translate3d(-2%,-1%,0) scale(1); opacity: .76; } 50% { transform: translate3d(2%,1.5%,0) scale(1.06); opacity: 1; } }
        @keyframes ambientDriftA { 0%, 100% { transform: translate3d(-28px,0,0) scale(1.04); } 50% { transform: translate3d(64px,42px,0) scale(1.16); } }
        @keyframes ambientDriftB { 0%, 100% { transform: translate3d(28px,0,0) scale(1.04); } 50% { transform: translate3d(-72px,54px,0) scale(1.12); } }
        @keyframes ambientSheen { 0%, 100% { opacity: .56; transform: translateX(-4%) translateY(-1%); } 50% { opacity: .95; transform: translateX(4%) translateY(1%); } }
        .ambient-orb-a { animation: ambientDriftA 12s ease-in-out infinite; }
        .ambient-orb-b { animation: ambientDriftB 14s ease-in-out infinite; }
        .ambient-orb-c { animation: ambientDriftA 13s ease-in-out infinite reverse; }
        .ambient-sheen { background: radial-gradient(circle at 20% 18%, rgba(255,255,255,.55), transparent 28%), radial-gradient(circle at 82% 16%, rgba(255,255,255,.42), transparent 24%), linear-gradient(115deg, transparent 0%, rgba(255,255,255,.34) 42%, transparent 68%); animation: ambientSheen 9s ease-in-out infinite; }
        @keyframes floatAsset { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(12px,-16px,0) scale(1.08); } }
        @keyframes pulseLine { 0%, 100% { opacity: .35; transform: scaleX(.82); } 50% { opacity: .9; transform: scaleX(1); } }
        @keyframes marqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .preview-glow { background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.95), transparent 32%), radial-gradient(circle at 80% 75%, rgba(255,255,255,.45), transparent 28%); }
        .motion-orb { animation: floatAsset 3.2s ease-in-out infinite; }
        .motion-block { animation: floatAsset 4.5s ease-in-out infinite; }
        .motion-line { animation: pulseLine 2.4s ease-in-out infinite; }
        .marquee-track { animation-duration: 32s; animation-timing-function: linear; animation-iteration-count: infinite; }
        .marquee-left { animation-name: marqueeLeft; }
        .marquee-right { animation-name: marqueeRight; }
        .marquee-track:hover { animation-play-state: paused; }
        .thumbnail-inline-stage { min-height: 255px; background: radial-gradient(circle at 18% 8%, rgba(255,255,255,.82), transparent 30%), radial-gradient(circle at 80% 16%, rgba(191,219,254,.48), transparent 32%), radial-gradient(circle at 45% 86%, rgba(0,188,242,.12), transparent 32%), linear-gradient(180deg, rgba(239,247,255,.52) 0%, rgba(226,236,246,.26) 100%); }
        .thumbnail-wall-shell { position: relative; -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.08) 5%, rgba(0,0,0,.36) 10%, #000 21%, #000 79%, rgba(0,0,0,.36) 90%, rgba(0,0,0,.08) 95%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.08) 5%, rgba(0,0,0,.36) 10%, #000 21%, #000 79%, rgba(0,0,0,.36) 90%, rgba(0,0,0,.08) 95%, transparent 100%); }
        .thumbnail-tile { transition: transform 540ms cubic-bezier(.22,1,.36,1), opacity 420ms ease, box-shadow 540ms cubic-bezier(.22,1,.36,1); transform-origin: center; will-change: transform, opacity; backface-visibility: hidden; transform-style: preserve-3d; contain: layout paint style; }
        .thumbnail-frost { transition: opacity 420ms ease, background 420ms ease; will-change: opacity; }
        .thumbnail-glint { opacity: 0; }
        .thumbnail-tile-active .thumbnail-glint { animation: thumbnailGlint 680ms cubic-bezier(.22,1,.36,1) both; }
        @keyframes thumbnailGlint { 0% { transform: translateX(0) rotate(12deg); opacity: 0; } 18% { opacity: .75; } 100% { transform: translateX(330%) rotate(12deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .ambient-orb, .ambient-wash, .ambient-sheen, .animated-page-bg::before, .motion-orb, .motion-block, .motion-line, .marquee-track { animation: none !important; } }
      `}</style>
    </div>
  );
}
