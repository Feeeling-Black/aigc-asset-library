import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

const prompts = [
  {
    title: "三防面料流体表现",
    model: "Seedream 3.0",
    category: "功能类",
    quarter: "Q3",
    scene: "适合功能面料、电商详情页、科技卖点图",
    prompt: "正视图视角，灰色的面料，倾斜45度，水、油、可乐，三种不同流体从上到下流动在面料表面，体现三防科技。",
    color: "from-sky-100 via-white to-blue-200",
  },
  {
    title: "抑菌科技微距可视化",
    model: "Seedream 3.0",
    category: "功能类",
    quarter: "Q3",
    scene: "适合面料科技、健康功能、抑菌概念表达",
    prompt: "C4D白色极其纤细编织面料肌理，景深透视，有两个不规则的圆形细菌，浅绿色玻璃材质，表现抑菌科技。",
    color: "from-emerald-100 via-white to-cyan-200",
  },
  {
    title: "冰封凉感外套",
    model: "nano pro",
    category: "模型类",
    quarter: "Q2",
    scene: "适合夏季凉感、防晒衣、户外新品主视觉",
    prompt: "一件轻薄的凉感连帽外套被封存在巨大的透明冰块中，整体氛围极致降温、冰封般的冷感科技广告视觉。",
    color: "from-blue-100 via-white to-indigo-200",
  },
  {
    title: "冰晶纤维材质",
    model: "nano pro",
    category: "功能类",
    quarter: "Q2",
    scene: "适合凉感科技、纤维结构、详情页局部放大",
    prompt: "超微距特写镜头，柔软的白色编织纤维相互交织，中心是冰蓝色半透明凝胶材质，高端商业CG风格。",
    color: "from-cyan-50 via-slate-100 to-blue-200",
  },
  {
    title: "商业海报主视觉",
    model: "Midjourney",
    category: "场景类",
    quarter: "Q1",
    scene: "适合品牌 Campaign、KV、活动主视觉参考",
    prompt: "高级商业广告构图，极简背景，产品居中，柔和自然光，高级材质细节，干净留白，适合品牌级视觉海报。",
    color: "from-stone-100 via-white to-zinc-200",
  },
  {
    title: "动态分镜氛围参考",
    model: "Runway / Kling",
    category: "场景类",
    quarter: "Q4",
    scene: "适合视频脚本、镜头语言、动态广告分镜",
    prompt: "慢镜头推进，产品在冷色调环境中被柔和光线扫过，背景有轻微粒子漂浮，整体氛围高级、安静、克制。",
    color: "from-slate-200 via-white to-blue-100",
  },
  {
    title: "户外机能场景",
    model: "Seedream 3.0",
    category: "场景类",
    quarter: "Q1",
    scene: "适合户外服饰、山系视觉、场景氛围图",
    prompt: "清晨山谷中的户外机能服装场景，远处薄雾和柔和阳光，人物站在岩石边缘，整体画面干净、高级、自然，商业广告摄影质感。",
    color: "from-lime-100 via-white to-sky-100",
  },
  {
    title: "面料科技切面",
    model: "nano pro",
    category: "功能类",
    quarter: "Q2",
    scene: "适合功能结构、材质剖面、科技说明图",
    prompt: "高端商业CG风格，面料纤维的微观切面结构，半透明蓝色能量层夹在纤维之间，表现轻薄、透气、凉感与科技功能。",
    color: "from-blue-50 via-white to-cyan-200",
  },
  {
    title: "产品静物光影",
    model: "Midjourney",
    category: "模型类",
    quarter: "Q3",
    scene: "适合产品主图、静物摄影、品牌视觉",
    prompt: "极简产品静物摄影，产品放置在浅色磨砂平台上，柔和侧逆光，背景有微弱渐变和干净留白，整体高级、克制、适合商业主视觉。",
    color: "from-zinc-100 via-white to-stone-200",
  },
];

const categories = ["全部", "模型类", "功能类", "场景类"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];
const quarterThemes = {
  Q1: {
    pill: "bg-gradient-to-r from-emerald-400/95 to-lime-300/95",
    shadow: "shadow-[0_8px_24px_rgba(34,197,94,0.22)]",
  },
  Q2: {
    pill: "bg-gradient-to-r from-sky-400/95 to-blue-500/95",
    shadow: "shadow-[0_8px_24px_rgba(59,130,246,0.22)]",
  },
  Q3: {
    pill: "bg-gradient-to-r from-amber-300/95 to-yellow-400/95",
    shadow: "shadow-[0_8px_24px_rgba(245,158,11,0.22)]",
  },
  Q4: {
    pill: "bg-gradient-to-r from-orange-400/95 to-red-400/95",
    shadow: "shadow-[0_8px_24px_rgba(239,68,68,0.22)]",
  },
};

const spring = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 15V7a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function VisualCard({ color }) {
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      whileHover={{ scale: 1.015 }}
      transition={spring}
      className={`relative h-full min-h-[320px] overflow-hidden rounded-[34px] bg-gradient-to-br ${color}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,.85), transparent 34%)`,
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.72, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[15%] top-[16%] h-36 w-36 rounded-[44%] bg-white/70 shadow-2xl shadow-slate-900/10"
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[16%] right-[14%] h-44 w-36 rotate-6 rounded-[42%] bg-white/50 shadow-2xl shadow-slate-900/10"
        animate={{ y: [0, 12, 0], rotate: [6, 2, 6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function AnimatedBackground({ scrollYProgress }) {
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.32, 0.14, 0.08]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ y: glowY, scale: glowScale }}
        className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.18),rgba(90,200,250,0.08)_38%,transparent_68%)] blur-2xl"
      />
      <motion.div
        animate={{ x: [0, 42, -18, 0], y: [0, -24, 36, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-blue-300/18 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -36, 24, 0], y: [0, 28, -18, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-indigo-300/16 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 22, -16, 0], y: [0, -18, 18, 0], opacity: [0.13, 0.24, 0.16, 0.13] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/3 h-80 w-80 rounded-full bg-cyan-200/22 blur-3xl"
      />
      <motion.div
        style={{ opacity: gridOpacity }}
        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_50%_12%,black,transparent_68%)]"
      />
      <motion.div
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_42%)]"
      />
    </div>
  );
}

export default function PreviewPromptGallery() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeQuarter, setActiveQuarter] = useState(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(null);
  const [hoveredPrompt, setHoveredPrompt] = useState(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0.28]);

  const filteredPrompts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return prompts.filter((item) => {
      const matchCategory = activeCategory === "全部" || item.category === activeCategory;
      const matchQuarter = !activeQuarter || item.quarter === activeQuarter;
      const matchKeyword = !keyword || [item.title, item.model, item.category, item.quarter, item.scene, item.prompt]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
      return matchCategory && matchQuarter && matchKeyword;
    });
  }, [activeCategory, activeQuarter, query]);

  async function handleCopy(item) {
    await navigator?.clipboard?.writeText?.(item.prompt);
    setCopied(item.title);
    setTimeout(() => setCopied(null), 1300);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-200/60">
      <AnimatedBackground scrollYProgress={scrollYProgress} />
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-[#0071e3]"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f5f5f7]/72 backdrop-blur-2xl">
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5"
        >
          <motion.div whileHover={{ scale: 1.03 }} className="text-sm font-semibold tracking-tight">
            AIGC Prompt Library
          </motion.div>
          <nav className="hidden items-center gap-7 text-xs text-black/60 md:flex">
            {['Prompts', 'Visuals', 'Motion', 'About'].map((item) => (
              <motion.span key={item} whileHover={{ y: -1, color: "#1d1d1f" }} className="cursor-pointer">
                {item}
              </motion.span>
            ))}
          </nav>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white"
          >
            复制使用
          </motion.button>
        </motion.div>
      </header>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0, scale: 0.96 }}
            transition={spring}
            className="fixed left-1/2 top-20 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/85 px-4 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl"
          >
            <CheckIcon /> 已复制「{copied}」
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-5xl px-6 pb-12 pt-24 text-center"
        >
          <motion.p
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 text-sm font-semibold text-blue-600"
          >
            For team creative workflow
          </motion.p>
          <motion.h1
            initial={{ y: 24, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.16, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-6xl font-semibold tracking-[-0.065em] text-[#1d1d1f] md:text-8xl"
          >
            Prompts that help ideas move faster.
          </motion.h1>
          <motion.p
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-black/58"
          >
            把常用 Prompt 整理成清晰的创作入口。少一点管理感，多一点可理解、可复制、可复用的团队灵感库。
          </motion.p>
        </motion.section>

        <motion.section
          initial={{ y: 22, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-16 z-20 mx-auto max-w-7xl px-5 pb-10"
        >
          <div className="rounded-[28px] border border-white/70 bg-white/48 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2 overflow-x-auto rounded-full border border-white/70 bg-[#f1f2f4]/85 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl">
                  {categories.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveCategory(item)}
                      className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        activeCategory === item ? "text-white" : "text-black/56 hover:text-black"
                      }`}
                    >
                      {activeCategory === item && (
                        <motion.span
                          layoutId="activeCategoryPill"
                          transition={spring}
                          className="absolute inset-0 rounded-full bg-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
                        />
                      )}
                      <span className="relative z-10">{item}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center overflow-x-auto rounded-full border border-white/70 bg-[#f1f2f4]/85 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl">
                  {quarters.map((item, index) => {
                    const theme = quarterThemes[item];

                    return (
                      <React.Fragment key={item}>
                        <button
                          onClick={() => setActiveQuarter(activeQuarter === item ? null : item)}
                          className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                            activeQuarter === item ? "text-white" : "text-black/52 hover:text-black"
                          }`}
                        >
                          {activeQuarter === item && (
                            <motion.span
                              layoutId="activeQuarterPill"
                              transition={spring}
                              className={`absolute inset-0 rounded-full ${theme.pill} ${theme.shadow}`}
                            />
                          )}
                          <span className="relative z-10">{item}</span>
                        </button>
                        {index < quarters.length - 1 && (
                          <span className="select-none px-1.5 text-sm text-black/14" aria-hidden="true">
                            丨
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <motion.label
                whileFocusWithin={{ scale: 1.015 }}
                transition={spring}
                className="relative block w-full lg:max-w-[300px]"
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/36">
                  <SearchIcon />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索 Prompt"
                  className="h-11 w-full rounded-full border border-white/70 bg-[#f1f2f4]/85 pl-11 pr-5 text-sm text-black/78 outline-none backdrop-blur-xl placeholder:text-black/35 transition focus:bg-white/80 focus:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                />
              </motion.label>
            </div>
          </div>
        </motion.section>

        <motion.section layout className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-14 px-5 pb-28 sm:grid-cols-2 lg:grid-cols-3 xl:gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((item, index) => (
              <motion.button
                layout
                key={item.title}
                type="button"
                aria-label={`复制 Prompt：${item.title}`}
                onClick={() => handleCopy(item)}
                onMouseEnter={() => setHoveredPrompt(item.title)}
                onMouseLeave={() => setHoveredPrompt(null)}
                onFocus={() => setHoveredPrompt(item.title)}
                onBlur={() => setHoveredPrompt(null)}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 620, damping: 38, mass: 0.55 }}
                className="group relative block overflow-hidden rounded-[38px] text-left shadow-[0_24px_70px_rgba(0,0,0,0.12)] outline-none ring-0 transition-shadow duration-300 hover:shadow-[0_38px_110px_rgba(0,0,0,0.18)] focus-visible:ring-4 focus-visible:ring-blue-300/50"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[38px]">
                  <motion.div
                    className="absolute inset-0"
                    transition={spring}
                    whileHover={{ scale: 1.045 }}
                  >
                    <VisualCard color={item.color} />
                  </motion.div>

                  <motion.div
                    initial={false}
                    animate={{
                      opacity: hoveredPrompt && hoveredPrompt !== item.title ? 0.68 : 0,
                    }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-black"
                  />
                  <motion.div
                    className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.2),transparent_42%)] transition-opacity duration-500 ${
                      hoveredPrompt === item.title ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className={`absolute left-5 top-5 z-10 rounded-full border border-white/30 bg-white/18 px-3.5 py-1.5 text-xs font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl transition duration-500 ${hoveredPrompt === item.title ? "bg-white/24" : ""}`}>
                    {item.model}
                  </div>

                  <div
                    className={`absolute inset-x-5 bottom-5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      hoveredPrompt === item.title ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    }`}
                  >
                    <div className="rounded-3xl border border-white/14 bg-black/7 p-4 text-white/68 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-[14px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/15 hover:bg-black/72 hover:text-white/92 hover:shadow-[0_18px_48px_rgba(0,0,0,0.28)] hover:backdrop-blur-[24px]">
                      <p className="line-clamp-6 text-sm leading-7">{item.prompt}</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}
