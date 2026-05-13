import React, { useMemo, useState } from "react";

const theme = {
  blue: "#0078d4",
  text: "#201f1e",
  subText: "#605e5c",
  muted: "#8a8886",
  border: "#edebe9",
  canvas: "#f3f2f1",
  panel: "rgba(255,255,255,0.94)",
  soft: "#faf9f8",
};

const mediaTypes = ["image", "gif", "video"];
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

const initialAssets = Array.from({ length: 18 }, (_, index) => {
  const id = index + 1;
  const mediaType = mediaTypes[index % mediaTypes.length];
  const hasPrompt = index % 4 !== 1;
  const preset = visualPresets[index % visualPresets.length];

  return {
    id,
    title: `${mediaType === "image" ? "图片" : mediaType === "gif" ? "动态素材" : "视频片段"}占位 ${String(id).padStart(2, "0")}`,
    mediaType,
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
    const searchableText = [item.title, item.mediaType, item.model, item.category, item.scene, item.quarter, item.prompt, ...item.tags]
      .join(" ")
      .toLowerCase();

    const matchQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchSection =
      section === "all" ||
      (section === "image" && item.mediaType === "image") ||
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

function toggleSelectedAsset(currentSelectedId, nextId) {
  return currentSelectedId === nextId ? null : nextId;
}

function getMediaLabel(type) {
  if (type === "gif") return "GIF";
  if (type === "video") return "视频";
  return "图片";
}

function getPromptPanelState(pointerRatioY) {
  if (pointerRatioY < 0.18 || pointerRatioY > 0.96) return { visible: false, depth: 0, interactive: false };
  const depth = clamp((pointerRatioY - 0.42) / 0.3);
  return { visible: true, depth, interactive: depth > 0.55 };
}

function getVisualTone(isFocused, hasFocusedAsset, isSelected) {
  if (hasFocusedAsset) return isFocused ? "focused" : "dimmed";
  return isSelected ? "selected" : "idle";
}

function getAssetVisualStyle(visualTone) {
  const transition =
    "opacity 680ms cubic-bezier(.16,1,.3,1), filter 760ms cubic-bezier(.16,1,.3,1), transform 720ms cubic-bezier(.16,1,.3,1), box-shadow 720ms cubic-bezier(.16,1,.3,1), outline-color 520ms cubic-bezier(.16,1,.3,1)";

  const base = { transition, outlineColor: "rgba(255,255,255,0)" };

  if (visualTone === "focused") return { ...base, opacity: 1, filter: "saturate(1) brightness(1)", transform: "translateY(-4px) scale(1.018)" };
  if (visualTone === "selected") {
    return {
      ...base,
      opacity: 1,
      filter: "saturate(1.04) brightness(1.03)",
      transform: "translateY(-6px) scale(1.035)",
      outlineColor: "rgba(0,120,212,0.36)",
    };
  }
  if (visualTone === "dimmed") return { ...base, opacity: 0.18, filter: "saturate(0) brightness(0.48)", transform: "translateY(2px) scale(0.975)" };
  return { ...base, opacity: 1, filter: "saturate(1) brightness(1)", transform: "translateY(0) scale(1)" };
}

function getSidebarTransform(isOpen) {
  return isOpen ? "translateX(0)" : "translateX(calc(-100% - 18px))";
}

function getSidebarPointerState(isOpen) {
  return isOpen ? "auto" : "none";
}

async function copyTextSafely(text) {
  if (!text || typeof navigator === "undefined" || !navigator.clipboard?.writeText) return { ok: false, reason: "unsupported" };
  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, reason: "copied" };
  } catch {
    return { ok: false, reason: "blocked" };
  }
}

function iconPath(name) {
  const paths = {
    search: ["M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8Z", "M16 16l5 5"],
    image: ["M5 5h14v14H5z", "M8 15l3-3 2 2 3-4 3 5", "M9 9h.01"],
    sparkle: ["M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z", "M19 16l.6 2.1L22 19l-2.4.9L19 22l-.6-2.1L16 19l2.4-.9L19 16Z"],
    star: ["M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z"],
    copy: ["M8 8h11v11H8z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
    check: ["M5 13l4 4L19 7"],
    alert: ["M12 9v4", "M12 17h.01", "M10.3 4.7 2.9-1.7 8.2 14.2A2 2 0 0 1 19.7 20H4.3a2 2 0 0 1-1.7-2.8l8.2-14.2Z"],
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
    <div className={cn("rounded-2xl border p-4 backdrop-blur", className)} style={{ background: theme.panel, borderColor: theme.border, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", ...style }}>
      {children}
    </div>
  );
}

function AssetPreview({ item }) {
  const isMotion = item.mediaType === "gif" || item.mediaType === "video";

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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />

      {item.mediaType === "video" ? (
        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-black bg-opacity-35 text-white backdrop-blur">
          <Icon name="play" size={15} />
        </div>
      ) : null}

      {item.mediaType === "gif" ? <div className="absolute left-4 top-4 rounded-md bg-black bg-opacity-35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">GIF</div> : null}
    </div>
  );
}

function AssetHoverPanel({ item }) {
  const [panelState, setPanelState] = useState({ visible: false, depth: 0, interactive: false });
  const [copyStatus, setCopyStatus] = useState("idle");

  const { visible, depth, interactive } = panelState;
  const overlayOpacity = visible ? 0.1 + depth * 0.22 : 0;
  const toastVisible = copyStatus !== "idle";
  const toastText = copyStatus === "copied" ? "已复制 Prompt" : "当前环境不支持自动复制";
  const toastIcon = copyStatus === "copied" ? "check" : "alert";

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    setPanelState(getPromptPanelState(ratioY));
  }

  async function handleCopy(event) {
    event.stopPropagation();
    if (!item.hasPrompt) return;
    const result = await copyTextSafely(item.prompt);
    setCopyStatus(result.ok ? "copied" : result.reason);
    if (typeof window !== "undefined") window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <div className="absolute inset-0 z-20" onPointerMove={handlePointerMove} onPointerLeave={() => { setPanelState({ visible: false, depth: 0, interactive: false }); setCopyStatus("idle"); }}>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out" style={{ opacity: overlayOpacity, background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.14) 45%, rgba(0,0,0,0.52) 100%)" }} />

      <div className={cn("pointer-events-none absolute right-5 top-5 z-30 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium text-white backdrop-blur transition-all duration-300", toastVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0")} style={{ background: copyStatus === "copied" ? "rgba(32,31,30,.68)" : "rgba(92,45,145,.75)", borderColor: "rgba(255,255,255,.2)", boxShadow: "0 12px 32px rgba(0,0,0,.22)" }}>
        <Icon name={toastIcon} size={14} />
        {toastText}
      </div>

      <div className={cn("absolute left-4 right-4 overflow-hidden rounded-2xl border text-white backdrop-blur-2xl transition-all duration-300", visible ? "opacity-100" : "pointer-events-none opacity-0")} style={{ top: `${56 - depth * 28}%`, bottom: `${4 + depth}%`, padding: `${16 + depth * 6}px 22px`, backgroundColor: `rgba(32,31,30,${0.18 + depth * 0.36})`, borderColor: `rgba(255,255,255,${0.42 - depth * 0.25})`, boxShadow: `0 ${18 + depth * 14}px ${52 + depth * 24}px rgba(0,0,0,${0.1 + depth * 0.22})`, transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(.985)" }}>
        <div className="mb-3 flex items-center gap-2 text-xs text-white text-opacity-75">
          <span>{getMediaLabel(item.mediaType)}</span><span>·</span><span>{item.model}</span><span>·</span><span>{item.scene}</span>
        </div>

        {item.hasPrompt ? (
          <button type="button" onClick={handleCopy} title="点击复制 Prompt" className="block w-full cursor-copy text-left outline-none">
            <p className={cn("text-sm font-medium leading-7 text-white text-opacity-95 transition-all duration-300", interactive ? "line-clamp-5" : "line-clamp-3")}>{item.prompt}</p>
          </button>
        ) : (
          <p className="text-sm font-medium leading-7 text-white text-opacity-90">该素材暂未绑定 Prompt。后续可在详情页补充生成提示词、参考图、模型参数与备注。</p>
        )}

        <div className="pointer-events-none mt-3 flex items-center gap-2 text-xs text-white text-opacity-75 transition-all duration-300" style={{ opacity: visible ? Math.max(0.45, clamp((depth - 0.32) / 0.32)) : 0 }}>
          <Icon name={item.hasPrompt ? "copy" : "tag"} size={14} />
          {item.hasPrompt ? "点击文字复制 Prompt" : "素材信息预览"}
        </div>
      </div>
    </div>
  );
}

function AssetCard({ item, index, onToggleFavorite, isFocused, hasFocusedAsset, isSelected, onSelectAsset, onHoverStart, onHoverEnd, layoutClassName = "", frameClassName = "aspect-[4/5]", showModelLabel = true, showPromptPanel = true }) {
  const visualTone = getVisualTone(isFocused, hasFocusedAsset, isSelected);
  const visualStyle = getAssetVisualStyle(visualTone);

  return (
    <article onClick={() => onSelectAsset(item.id)} onPointerEnter={() => onHoverStart(item.id)} onPointerLeave={onHoverEnd} style={{ animationDelay: `${index * 45}ms`, ...visualStyle, boxShadow: visualTone === "focused" || visualTone === "selected" ? "0 12px 36px rgba(0,120,212,.22)" : "0 4px 16px rgba(0,0,0,.08)" }} className={cn("group cursor-pointer overflow-hidden rounded-2xl border bg-white outline outline-2 outline-offset-4", layoutClassName)}>
      <div className={cn("relative overflow-hidden bg-gray-100", frameClassName)}>
        <AssetPreview item={item} />

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-end p-4">
          <button type="button" aria-label={item.favorite ? "取消收藏" : "收藏素材"} onClick={(event) => { event.stopPropagation(); onToggleFavorite(item.id); }} className="flex h-9 w-9 items-center justify-center rounded-md bg-white bg-opacity-90 backdrop-blur transition hover:scale-105" style={{ color: item.favorite ? "#ffb900" : theme.subText }}>
            <Icon name="star" size={17} filled={item.favorite} />
          </button>
        </div>

        {showModelLabel ? (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 transition-opacity duration-300 group-hover:opacity-0">
            <span className="rounded-md px-3 py-1 text-xs font-medium text-white backdrop-blur" style={{ background: "rgba(50,49,48,.72)" }}>{item.model}</span>
          </div>
        ) : null}

        {showPromptPanel ? <AssetHoverPanel item={item} /> : null}
      </div>
    </article>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button onClick={onClick} className="rounded-md px-4 py-2 text-sm font-medium transition" style={{ background: active ? theme.blue : theme.soft, color: active ? "white" : theme.subText, border: `1px solid ${active ? theme.blue : theme.border}`, boxShadow: active ? "0 3px 10px rgba(0,120,212,.22)" : "none" }}>
      {children}
    </button>
  );
}

function SectionTitle({ activeSection, filteredCount }) {
  const titleMap = { all: "全局素材预览", image: "图片素材", motion: "动态素材", prompt: "Prompt 词库", favorite: "收藏素材", taxonomy: "分类管理" };
  const subtitleMap = {
    all: `共找到 ${filteredCount} 个素材资产`,
    image: `共找到 ${filteredCount} 张图片素材`,
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

function EmptyState({ title = "没有找到匹配结果", description = "尝试更换关键词，或清空当前筛选。" }) {
  return (
    <Panel className="p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: theme.canvas, color: theme.muted }}><Icon name="search" size={24} /></div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm" style={{ color: theme.subText }}>{description}</p>
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
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold tracking-tight">{item.title}</h3>
                <div className="mt-1 text-xs" style={{ color: theme.muted }}>{getMediaLabel(item.mediaType)} · {item.model} · {item.category} · {item.scene}</div>
              </div>
              <button onClick={() => onToggleFavorite(item.id)} className="rounded-md p-2" style={{ background: theme.canvas, color: item.favorite ? "#ffb900" : theme.muted }}><Icon name="star" size={16} filled={item.favorite} /></button>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6" style={{ color: theme.subText }}>{item.hasPrompt ? item.prompt : "该素材暂未绑定 Prompt，可后续补充。"}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function AssetGridView({ assets, onToggleFavorite, hoveredAssetId, selectedAssetId, onSelectAsset, onHoverStart, onHoverEnd }) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {assets.map((item, index) => (
        <AssetCard key={item.id} item={item} index={index} onToggleFavorite={onToggleFavorite} isFocused={hoveredAssetId === item.id} hasFocusedAsset={hoveredAssetId !== null} isSelected={selectedAssetId === item.id} onSelectAsset={onSelectAsset} onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
      ))}
    </section>
  );
}

function AssetMarquee({ assets }) {
  const stillAssets = assets.filter((item) => item.mediaType === "image");
  const sourceAssets = stillAssets.length > 0 ? stillAssets : assets;
  const marqueeAssets = [...sourceAssets, ...sourceAssets, ...sourceAssets];

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white py-6" style={{ borderColor: theme.border, boxShadow: "0 10px 34px rgba(0,0,0,.055)" }}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-white to-transparent" />
      <div className="mb-8 px-6 text-center md:px-8">
        <h3 className="text-2xl font-semibold tracking-[-0.035em] md:text-4xl" style={{ color: theme.text }}>竖构图素材循环</h3>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style={{ color: theme.subText }}>以连续滚动的方式快速浏览静态图片素材，先建立整体视觉印象，再进入下方分类内容查看细节。</p>
      </div>
      <div className="marquee-track flex w-max gap-5 px-6 md:px-8">
        {marqueeAssets.map((item, index) => (
          <div key={`${item.id}-${index}`} className="h-72 w-48 shrink-0 overflow-hidden rounded-2xl border bg-white" style={{ borderColor: theme.border, boxShadow: "0 6px 20px rgba(0,0,0,.07)" }}>
            <AssetPreview item={{ ...item, mediaType: "image" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GlobalPreviewGridView({ assets, onToggleFavorite, hoveredAssetId, selectedAssetId, onSelectAsset, onHoverStart, onHoverEnd }) {
  const stillAssets = assets.filter((item) => item.mediaType === "image");
  const motionAssets = assets.filter((item) => item.mediaType === "gif" || item.mediaType === "video");
  const promptAssets = assets.filter((item) => item.hasPrompt);
  const showcaseAssets = [...stillAssets, ...motionAssets, ...promptAssets].slice(0, 12);

  function renderAssetCard(item, index, frameClassName = "aspect-square") {
    return (
      <AssetCard
        key={`${item.id}-${index}`}
        item={item}
        index={index}
        onToggleFavorite={onToggleFavorite}
        isFocused={hoveredAssetId === item.id}
        hasFocusedAsset={hoveredAssetId !== null}
        isSelected={selectedAssetId === item.id}
        onSelectAsset={onSelectAsset}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        frameClassName={frameClassName}
        showModelLabel={false}
        showPromptPanel={false}
      />
    );
  }

  return (
    <section className="space-y-10">
      <AssetMarquee assets={assets} />
      <section className="rounded-[36px] border bg-white px-6 py-12 md:px-12 md:py-16" style={{ borderColor: theme.border, boxShadow: "0 10px 34px rgba(0,0,0,.045)" }}>
        <div className="mx-auto mb-16 max-w-5xl px-4 pb-2 pt-6 text-center md:mb-20 md:pt-10">
          <h3 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl lg:text-7xl" style={{ color: theme.text }}>让每一次生成，<br className="hidden md:block" />都成为下一次创作的起点。</h3>
          <p className="mx-auto mt-10 max-w-3xl text-lg leading-9 md:text-xl" style={{ color: theme.subText }}>以更清晰的比例、更安静的留白和更稳定的分区，把模型探索、功能表达和视觉资产统一沉淀。浏览素材时先看整体风格，再进入具体分类，让图片、动态素材与 Prompt 自然形成一个可复用的创意资产库。</p>
        </div>
        <div className="space-y-8">
          <div className="grid gap-5 lg:grid-cols-2">
            {showcaseAssets[0] ? renderAssetCard(showcaseAssets[0], 0, "aspect-[4/3]") : null}
            {showcaseAssets[1] ? renderAssetCard(showcaseAssets[1], 1, "aspect-[4/3]") : null}
          </div>
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><h4 className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl" style={{ color: theme.text }}>模型类</h4><p className="mt-3 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style={{ color: theme.subText }}>按不同生成模型沉淀代表性画面，方便横向比较模型风格、质感控制和画面稳定性。</p></div>
              <span className="hidden rounded-full px-3 py-1 text-xs font-medium md:block" style={{ background: theme.soft, color: theme.subText, border: `1px solid ${theme.border}` }}>2 Column</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {showcaseAssets.slice(2, 8).map((item, index) => renderAssetCard(item, index + 2, "aspect-[3/4]"))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><h4 className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl" style={{ color: theme.text }}>功能类</h4><p className="mt-3 max-w-2xl text-base leading-7 md:text-lg md:leading-8" style={{ color: theme.subText }}>围绕防晒、凉感、透气、蓬松、抗菌等功能表达归档素材，适合后续快速复用到商品卖点和视觉提案。</p></div>
              <span className="hidden rounded-full px-3 py-1 text-xs font-medium md:block" style={{ background: theme.soft, color: theme.subText, border: `1px solid ${theme.border}` }}>2 Column</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {showcaseAssets.slice(8, 14).map((item, index) => renderAssetCard(item, index + 8, "aspect-[3/4]"))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function PromptLibraryView({ assets, viewMode, onToggleFavorite, hoveredAssetId, selectedAssetId, onSelectAsset, onHoverStart, onHoverEnd }) {
  const promptAssets = assets.filter((asset) => asset.hasPrompt);
  if (promptAssets.length === 0) return <EmptyState title="没有找到 Prompt" description="尝试切换筛选条件，或先为素材补充 Prompt。" />;
  return viewMode === "grid" ? (
    <AssetGridView assets={promptAssets} onToggleFavorite={onToggleFavorite} hoveredAssetId={hoveredAssetId} selectedAssetId={selectedAssetId} onSelectAsset={onSelectAsset} onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
  ) : (
    <AssetListView assets={promptAssets} onToggleFavorite={onToggleFavorite} />
  );
}

function TaxonomyView() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {filterGroups.map((group) => (
        <Panel key={group.key} className="p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold tracking-tight">{group.label}</h3><Icon name="layers" size={18} /></div>
          <div className="space-y-2">
            {group.options.map((option) => <div key={option} className="rounded-md px-4 py-3 text-sm font-medium" style={{ background: theme.canvas, color: theme.subText }}>{option}</div>)}
          </div>
        </Panel>
      ))}
    </section>
  );
}

export default function AIGCAssetLibrary() {
  const [activeSection, setActiveSection] = useState("all");
  const [quickFilter, setQuickFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assets, setAssets] = useState(initialAssets);
  const [hoveredAssetId, setHoveredAssetId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

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

  function handleSelectAsset(id) {
    setSelectedAssetId((currentId) => toggleSelectedAsset(currentId, id));
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: theme.canvas, color: theme.text }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute left-0 top-0 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(222,236,249,.7)" }} /><div className="absolute right-0 top-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(199,224,244,.55)" }} /></div>
      <div className="fixed left-0 top-0 z-50 hidden h-screen w-4 lg:block"><button type="button" aria-label="打开侧栏" onClick={() => setIsSidebarOpen(true)} onMouseEnter={() => setIsSidebarOpen(true)} className="absolute left-0 top-1/2 h-24 w-2 -translate-y-1/2 rounded-r-md border-y border-r bg-white shadow transition-all duration-300 hover:w-3" style={{ borderColor: theme.border, opacity: isSidebarOpen ? 0 : 1 }} /></div>

      <aside onMouseEnter={() => setIsSidebarOpen(true)} onMouseLeave={() => setIsSidebarOpen(false)} className="fixed left-6 top-6 z-50 hidden h-[calc(100vh-48px)] w-72 rounded-2xl border p-5 backdrop-blur transition-all duration-300 lg:block" style={{ background: theme.panel, borderColor: theme.border, boxShadow: "0 8px 28px rgba(0,0,0,.14)", opacity: isSidebarOpen ? 1 : 0, transform: getSidebarTransform(isSidebarOpen), pointerEvents: getSidebarPointerState(isSidebarOpen) }}>
        <div className="mb-10 flex items-center gap-3 px-2"><div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: theme.blue, boxShadow: "0 4px 12px rgba(0,120,212,.28)" }}><Icon name="sparkle" size={20} /></div><div><div className="text-lg font-semibold tracking-tight">AIGC Library</div><div className="text-xs" style={{ color: theme.subText }}>图片 · 动态 · Prompt</div></div></div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const count = counts[item.key] ?? "";
            const active = activeSection === item.key;
            return <button key={item.key} onClick={() => handleSectionChange(item.key)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition" style={{ background: active ? theme.blue : "transparent", color: active ? "white" : theme.subText, boxShadow: active ? "0 4px 12px rgba(0,120,212,.24)" : "none" }}><span className="flex items-center gap-3"><Icon name={item.icon} size={18} /><span className="font-medium">{item.label}</span></span>{count !== "" ? <span className="text-xs" style={{ color: active ? "rgba(255,255,255,.75)" : theme.muted }}>{count}</span> : null}</button>;
          })}
        </nav>
        <div className="mt-10 rounded-xl border p-4" style={{ background: theme.soft, borderColor: theme.border }}><div className="mb-2 text-sm font-semibold">资产结构</div><p className="text-sm leading-6" style={{ color: theme.subText }}>主页面展示所有历史图片与动态素材，Prompt 作为素材详情和词库子页面维护。</p></div>
      </aside>

      <main className="relative mx-auto max-w-[1440px] px-6 py-6">
        <Panel className="mb-6 p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div><div className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-medium" style={{ background: theme.soft, borderColor: theme.border, color: theme.subText }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: "#107c10" }} />可部署框架版 · 无外部图片依赖</div><h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">AIGC 素材资产库</h1><p className="mt-4 max-w-2xl text-base leading-7 md:text-lg" style={{ color: theme.subText }}>统一管理历史图片、GIF、视频片段与 Prompt。先跑通框架，后续直接替换真实素材与提示词。</p></div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl border p-3 md:min-w-[420px]" style={{ background: theme.soft, borderColor: theme.border }}>{[["全部素材", counts.all], ["动态素材", counts.motion], ["Prompt", counts.prompt]].map(([label, value]) => <div key={label} className="rounded-xl border bg-white px-4 py-4 text-center" style={{ borderColor: theme.border, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}><div className="text-2xl font-semibold tracking-tight">{value}</div><div className="mt-1 text-xs" style={{ color: theme.subText }}>{label}</div></div>)}</div>
          </div>
        </Panel>

        <Panel className="mb-6">
          <label className="mb-4 flex min-w-0 items-center gap-3 rounded-xl border px-4 py-3" style={{ background: theme.soft, borderColor: theme.border }}><Icon name="search" size={19} className="shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索素材、模型、场景、标签或 Prompt" className="w-full bg-transparent text-sm outline-none" /></label>
          <div className="mb-4 flex flex-wrap items-center gap-2">{quickFilters.map((filter) => <FilterPill key={filter.key} active={quickFilter === filter.key} onClick={() => setQuickFilter(filter.key)}>{filter.label}</FilterPill>)}<div className="ml-auto flex rounded-xl border p-1" style={{ background: theme.soft, borderColor: theme.border }}><button aria-label="网格视图" onClick={() => setViewMode("grid")} className="rounded-md p-2 transition" style={{ background: showGrid ? "white" : "transparent", color: showGrid ? theme.blue : theme.subText }}><Icon name="grid" size={16} /></button><button aria-label="列表视图" onClick={() => setViewMode("list")} className="rounded-md p-2 transition" style={{ background: !showGrid ? "white" : "transparent", color: !showGrid ? theme.blue : theme.subText }}><Icon name="rows" size={16} /></button></div></div>
          <div className="grid gap-2 md:grid-cols-3">{filterGroups.map((group) => { const active = categoryFilter?.key === group.key; return <button key={group.key} onClick={() => setCategoryFilter(active ? null : { key: group.key, value: group.options[0] })} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition" style={{ background: active ? theme.blue : theme.soft, color: active ? "white" : theme.subText, border: `1px solid ${active ? theme.blue : theme.border}` }}><span>{active ? `${group.label}：${categoryFilter.value}` : group.label}</span><Icon name="down" size={14} className="opacity-70" /></button>; })}</div>
          {categoryFilter ? <div className="mt-3 flex flex-wrap gap-2">{filterGroups.find((group) => group.key === categoryFilter.key)?.options.map((option) => <FilterPill key={option} active={categoryFilter.value === option} onClick={() => setCategoryFilter({ key: categoryFilter.key, value: option })}>{option}</FilterPill>)}</div> : null}
        </Panel>

        <SectionTitle activeSection={activeSection} filteredCount={filteredAssets.length} />

        {activeSection === "prompt" ? <PromptLibraryView assets={filteredAssets} viewMode={viewMode} onToggleFavorite={handleToggleFavorite} hoveredAssetId={hoveredAssetId} selectedAssetId={selectedAssetId} onSelectAsset={handleSelectAsset} onHoverStart={setHoveredAssetId} onHoverEnd={() => setHoveredAssetId(null)} /> : activeSection === "taxonomy" ? <TaxonomyView /> : filteredAssets.length === 0 ? <EmptyState /> : showGrid ? activeSection === "all" ? <GlobalPreviewGridView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} hoveredAssetId={hoveredAssetId} selectedAssetId={selectedAssetId} onSelectAsset={handleSelectAsset} onHoverStart={setHoveredAssetId} onHoverEnd={() => setHoveredAssetId(null)} /> : <AssetGridView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} hoveredAssetId={hoveredAssetId} selectedAssetId={selectedAssetId} onSelectAsset={handleSelectAsset} onHoverStart={setHoveredAssetId} onHoverEnd={() => setHoveredAssetId(null)} /> : <AssetListView assets={filteredAssets} onToggleFavorite={handleToggleFavorite} />}
      </main>

      <style>{`
        @keyframes floatAsset { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(12px, -16px, 0) scale(1.08); } }
        @keyframes pulseLine { 0%, 100% { opacity: .35; transform: scaleX(.82); } 50% { opacity: .9; transform: scaleX(1); } }
        @keyframes marqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .preview-glow { background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.95), transparent 32%), radial-gradient(circle at 80% 75%, rgba(255,255,255,.45), transparent 28%); }
        .motion-orb { animation: floatAsset 3.2s ease-in-out infinite; }
        .motion-block { animation: floatAsset 4.5s ease-in-out infinite; }
        .motion-line { animation: pulseLine 2.4s ease-in-out infinite; }
        .marquee-track { animation: marqueeLeft 32s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
