import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

const promptLibrarySeed = String.raw`
25Q3 模型类 01	Seedream 3.0	模型类	25Q3	男⼠灰⾊休闲裤，版型宽松，全⻓的轮廓，采⽤柔软的纯棉⾯料，⼀只腿呈现夸张弯曲的姿势。单品独⽴拍摄，纯⽩⾊背景，专业的影棚灯光，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现
25Q3 模型类 02	Seedream 3.0	模型类	25Q3	⼥防晒外套，在空中飘动，形态⾃然平整，展现整个⾐服版型，⽆明显褶皱，背景蓝天⼾外，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现，
25Q3 模型类 03	Seedream 3.0	模型类	25Q3	男⼠休闲⽜仔裤，版型宽松，全⻓的轮廓，采⽤柔软的⽜仔⾯料，⼀只腿呈弯曲的姿势。单品独⽴拍摄，纯⽩⾊背景，专业的影棚灯光，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现
25Q3 模型类 04	Seedream 3.0	模型类	25Q3	男⼠冲锋⾐外套，采⽤三防的特氟⻰⾯料，在空中飘动，背景是灰⽩⾊渐变，专业的影棚灯光，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现
25Q3 模型类 05	Seedream 3.0	模型类	25Q3	男⼠休闲⽜仔裤，版型宽松，全⻓的轮廓，采⽤柔软的⽜仔⾯料，⼀只腿呈弯曲的姿势。单品独⽴拍摄，背景是⼾外雪⼭的场景，裤⼦上覆盖了⼀层冰霜，⽆模特，画⾯中⽆⼈出现
25Q3 模型类 06	Seedream 3.0	模型类	25Q3	男⼠冲锋⾐外套，采⽤三防的特氟⻰⾯料，在空中飘动，⾯料平整⽆褶皱，背景⼾外的森林场景，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现
25Q3 模型类 07	Seedream 3.0	模型类	25Q3	四件⼥⼠短袖T恤从左到右依次悬挂，颜⾊分别是粉⾊、⽩⾊、⻩⾊、卡其⾊。版型很⼩巧，⽆褶皱，圆领设计。⾐物通过⽊夹悬挂在细绳上，展现出轻盈的垂坠感，突显其轻薄的⾯料特性。单品独⽴拍摄，背景是⼾外的蓝天。⽆模特穿着，正视视⻆
25Q3 模型类 08	Seedream 3.0	模型类	25Q3	四件⼥⼠短袖T恤从左到右依次悬挂，颜⾊分别是粉⾊、⽩⾊、⻩⾊、卡其⾊。版型⼩巧⽆褶皱，圆领设计。⾐物通过⽊夹悬挂在细绳上，展现出轻盈的垂坠感，突显其轻薄的⾯料特性。单品独⽴拍摄，背景为纯净的⽩⾊，专业摄影棚灯光下，纯⾊的背景，⾯料的细腻质感得到清晰展现。⽆模特穿着，正视视⻆
25Q3 功能类 09	Seedream 3.0	功能类	25Q3	正视图视角，灰色的面料，倾斜45度，水、油、可乐，三种不同流体从上到下流动在面料表面，体现三防科技。
25Q3 功能类 10	Seedream 3.0	功能类	25Q3	蓝色的面料，白色蒸汽从下而上喷出，灰色的背景，摄影灯光照明，平视视角，表现透气面料的空气流动感。
25Q3 功能类 11	Seedream 3.0	功能类	25Q3	浅灰渐变背景下的蓬松棉花，柔和光线，下方是满一层丝状的棉絮，虚幻5引擎，表现纯棉面料的天然柔软质感。
25Q3 功能类 12	Seedream 3.0	功能类	25Q3	灰色的平整面料上，泼撒水，形态优美，水在接触面料后自然滑落，体现防泼水科技。
25Q3 功能类 13	Seedream 3.0	功能类	25Q3	浅咖色面料，雨水击打的面料上，灰色背景，视角旋转45度，雨水击打在面料上发生轻微形变，表现防雨科技。
25Q3 功能类 14	Seedream 3.0	功能类	25Q3	灰色的面料上，放着一个圆形刷子，刷子背面朝向面料放置，体现面料的耐磨性。
25Q3 功能类 15	Seedream 3.0	功能类	25Q3	一层浅蓝色的面料侧面展示，面料下方有圆形水珠，面料上方有水蒸气冒起，表现透湿排湿科技。
25Q3 功能类 16	Seedream 3.0	功能类	25Q3	灰白渐变背景在同一个面料上呈现对比形式，左侧面料呈现褶皱纹理，右侧展现顺滑平整效果，柔光精准区分两种状态纤维细节，虚幻5引擎渲染超写实织物动态，飘动轨迹中保持面料形态稳定。
25Q3 功能类 17	Seedream 3.0	功能类	25Q3	C4D白色极其纤细编织面料肌理，景深透视，有两个不规则的圆形细菌，大小不一，浅绿色玻璃材质，超远摄像机视角，表现抑菌科技。
25Q4 模型类 18	Midjourney 7	模型类	25Q4	⼀件简洁⼲净的连帽灰⾊⽻绒服在空中飘浮，⽻绒服⾮常饱满。⽻绒服侧⾯45度呈现。形态⾃在;没有明显的褶皱。纹理清晰可⻅。拉链是处于敞开状态。⽻绒服内部照射着橙红⾊的光。背景为蓝天雪⼭场景。
25Q4 模型类 19	Midjourney 7	模型类	25Q4	⼀件简洁⼲净的连帽浅咖⾊外套在空中飘浮。⾐服⾮常饱满侧⾯45度呈现。形态⾃在;没有明显的褶皱,纹理清断可⻅。背景为蓝天。
25Q4 模型类 20	Midjourney 7	模型类	25Q4	⼀件简洁⼲净的灰⾊⽻绒服在空中飘浮。两个袖⼝向上抬起。⽻绒服⾮常饱满。⽻绒服朝向左侧45度。形态⾃在；没有明显的褶皱。纹理清晰可⻅。⽻绒服内部是⽆缝合的⾯料。背景为灰⾊场景。
25Q4 功能类 21	Midjourney 7	功能类	25Q4	The surrealist art style centers on soft elements, presenting soft and rounded white fluffy spheres. Their tiny hairs naturally extend and float in the air. The gentle light and shadow blend gently on the surface, enhancing the three-dimensionality. The background is a gradient of orange, creating a warm and peaceful spatial sense. It presents a serene, dreamlike and textured aesthetic atmosphere. --ar 4:3 --style raw --stylize 300
25Q4 功能类 22	Midjourney 7	功能类	25Q4	A close-up of a small, round, fluffy white material floating in the air against an orange background with white silk floss, soft lighting, macro photography, with a few strands of fluff around a white square device, blurred background, high resolution, hyper-realistic.
25Q4 功能类 23	Midjourney 7	功能类	25Q4	The surreal natural art style showcases the fine texture of a layer of textile, enhancing the overall delicacy and luster. The fibers are arranged naturally and vertically, with a soft and fluffy texture, as if expressing the visual effect of the combination of natural fibers and modern technology. The background is warm and soft. The pale light passes through the fibers to create a gentle and beautiful light and shadow effect, creating a warm, comfortable and textured atmosphere, showcasing the touch of natural materials and a poetic visual effect. --ar 4:3 --raw
25Q4 功能类 24	Seedream 3.0	功能类	25Q4	正视图视⻆，以红橙⾊渐变⾊为背景，⽻绒纤维堆积在画⾯的下半部分整体材质呈现半透明，前景景深，空中还有零星的圆形绒丝缓缓飘落，超细腻⽻丝，漂浮状态，轻盈蓬松，⽩⾊半透明结构，逼真质感，微距摄影，⾼清细节，边缘的绒感；
25Q4 功能类 25	Seedream 3.0	功能类	25Q4	⼀朵⽻绒簇，超细腻⽻丝，漂浮状态，轻盈蓬松，⽩⾊半透明结构，逼真质感，微距摄影，⾼清细节，逆光光线照亮⽻绒每⼀跟绒⽑，背景呈红橙⾊的渐变⾊，在它围绕三个很⼤的不规则的⽔珠，⽻绒簇与⽔珠相互挤压进⾏交互。呈现灵动的画⾯⻛格
26Q2 模型类 26	nano pro	模型类	26Q2	⼀件带有兜帽的轻盈⽩⾊浮空夹克，⾥⾯⽆⼈，⾯料柔软透⽓，纯⽩⾊织物，质地细腻，夹克悬于半空，拉链敞开，袖⼦轻轻展开，超轻超透⽓的感觉，流动的⽓流中带有明显的渐隐彩虹光效沿着夹克整体轮廓（光效要远离夹克），清新洁净的氛围，淡蓝⾊渐变的天空背景，⾼端服装商业⻛格，极简构图，柔和的漫射光，没有刺眼的阴影，超⾼端的CG⻛格，优质品质，8K细节。需后期微调
26Q2 模型类 27	nano pro	模型类	26Q2	⼀件轻薄的凉感连帽外套被封存在巨⼤的透明冰块中，外套呈柔和的浅粉⾊，并带有淡⻩⾊的⾛线，⾯料轻透、褶皱⾃然，悬浮在冰块内部。冰块边缘清晰透明，内部充满冰裂纹、凝霜纹理与被折射的冷⾊光线，呈现⾼亮的冰晶质感。冰块四周散发淡淡的冷⽓前景为柔和的雪地起伏，背景为⼲净的天空蓝渐变。整体光线明亮冷感，带有强烈的冰⾯反射，使画⾯显得清爽、极寒、纯净。整体氛围：极致降温、冰封般的冷感科技⼴告视觉。冰块必须保持透明+冰裂纹+折射光，不能变成玻璃外套的颜⾊必须保持浅粉+淡⻩⾊⾛线雪地应为柔软曲线形状，不是硬质冰⾯整体饱和度不应过⾼背景为天空蓝渐变，不可出现杂⾊
26Q2 模型类 28	nano pro	模型类	26Q2	商业级别CG渲染，悬浮的⽩⾊连帽防晒，具备防晒阻隔技术，⾐服四周有透明的六边形蜂窝结构，形成弧形穹顶，先进⾯料防护可视化表现，⼲净的蓝⾊天空渐变背景;8K;需后期微调
26Q2 模型类 29	nano pro	模型类	26Q2	⼀件由透明流体组成的裤⼦悬浮在空中。外套整体为流体材质，线条柔和流畅，边缘带有轻微折射与⾼光，表⾯带有⾃然透亮的冷感质地。裤⼦内部有极轻微的光散射，传递清凉触感。背景为从浅天蓝到⽩⾊的柔和纵向渐变，营造⼭泉般的清爽感。整体光源明亮柔和，极简清新。整体构图轻盈、空灵。透明材质要保持柔和⽔感，不能变成玻璃或冰块；材质折射的颜⾊需要是⽩⾊背景必须保留淡蓝→⽩的竖向渐变裤⼦形态需呈轻盈漂浮、⽆实体模特
26Q2 模型类 30	Seedream 4.5	模型类	26Q2	⾼端功能性CG渲染⻛格。漂浮的⽩⾊织物T恤，轻盈透⽓的⾯料，⽔蒸⽓从⾯料表⾯向外散发，背景是蓝⾊到⽩⾊渐变（⽆杂⾊）；⾯料质地⼲爽顺滑，内部不吸⽔，洁净清新的清凉肤感，影棚级布光，柔和⾼光，极简⼲净的构图，8K画质
26Q2 模型类 31	nano pro	模型类	26Q2	⾼端功能性CG渲染⻛格。漂浮的⽩⾊织物T恤，轻盈透⽓的⾯料，⽔蒸⽓从⾯料⾯向外散发，背景是蓝⾊到⽩⾊渐变（⽆杂⾊）；⾯料质地⼲爽顺滑，内部不吸⽔，洁净清新的清凉肤感，影棚级布光，柔和⾼光，极简⼲净的构图，8K画质
26Q2 模型类 32	nano pro	模型类	26Q2	夏季凉感服装产品视觉，⼀条悬浮展示的⽩⾊T恤漂浮在空中，视觉轻盈，不透明⾯料。⾐服表⾯附着细腻冰霜颗粒质感与冷凝质感，周围散发出很淡的⽩⾊凉雾，表现持续降温与透⽓凉感功能。背景从上到下是蓝⾊到⽩⾊的渐变⾊，空⽓中带有⼤⼩不⼀的冰感粒⼦，整体⻛格清爽、理性、⾼端电商产品KV，⽆⼈物，⽆光效，⾐服上⽆⽔滴，⽆夸张变形。
26Q2 功能类 33	nano pro	功能类	26Q2	⼀张超写实的微距照⽚，⼀块晶莹剔透的冰块飘在空中，下⽅是柔软的浅蓝⾊布料。冰块⼀⻆轻轻触碰到⾯料，⾯料被接触的局部表⾯增加⽔晶形态凸起表层（呈现透明冰霜颗粒纹理）；背景从上到下是蓝⾊到浅蓝⾊的渐变⾊（⽆其他杂⾊）；布料具有细腻的⾯料纹理，⾯料⾃然摆动。冰块向下散发出柔和的冷雾。⾼调照明。景深效果，焦点在冰块上，边缘模糊。3D产品渲染⻛格，Octane渲染，8k分辨率，构图⼲净，极简美学。
26Q2 功能类 34	nano pro	功能类	26Q2	超微距特写镜头，抽象纤维结构，柔软的⽩⾊编织纤维以流畅重复的纹理相互交织，中⼼是冰蓝⾊半透明凝胶材质与⽩⾊纤维相互交织，呈现冰冻质感；表⾯嵌有冰晶与精致雪花，点缀着霜粒与微⽔滴，视觉效果极致洁净清新。整体为⾼端商业CG⻛格，材质渲染超精细，质感丝滑柔顺，⾊彩过渡柔和渐变，冷⾊调配⾊，以⽩⾊与冰蓝⾊为主；采⽤⾼调打光、柔和影棚灯光，⽆⽣硬阴影，浅景深效果，电影感微距构图，营造未来感护肤或⾯料科技概念，画⾯超写实，8K超清画质，焦点清晰锐利，背景极简
26Q2 功能类 35	nano pro	功能类	26Q2	柔软的⽩⾊编织纤维以流畅重复的纹理相互紧密交织⽆缝隙（处于画⾯下半部分）；视⻆处于画⾯中⼼位置；背景从上到下是淡蓝⾊到⽩⾊渐变，⼀个不规则的圆形⽔滴从织物上⽅向下飘动，四周有很⼩的⽔珠；⽔滴跟纤维有交互；飘动过程中细微⽔汽与雾⽓向上扩散；整体画⾯⼲净；⾼端CG⻛格；强对⽐，⾼质感需后期微调
26Q2 功能类 36	nano pro	功能类	26Q2	⾼端功能⾯料科技CG可视化；COOLMAX⻛格功能性⾯料微距特写，浅蓝⾊冷⾊调，⾼密度、规则排列的织物纹理清晰可⻅，⾯料中央区域呈现吸湿微微凹陷结构，形成深浅渐变的湿润区域，⽔分被迅速吸⼊纤维内部的可视化效果，湿润区域向上飘动烟雾，湿⽓向内集中并向外扩散的排湿表现，整体画⾯⼲净、轻盈、清爽，写实⻛格，
26Q2 功能类 37	nano pro	功能类	26Q2	⾼端CG渲染⻛格；特写侧拍⼀条动感的⽩⾊⾯料扭曲横跨画⾯。⼀束带有彩虹折射效果的光束击中表层，光线完全被反射并产⽣多⾊偏折；光线照射在⽩⾊表层上的点呈现出温暖的橙⾊扩散，表明有热阻隔效果。织物背⾯是浅蓝⾊，⾯料下⽅伴有淡淡的冷⽓和冰碴，象征着有效的隔热。背景是天空⾊；⾼对⽐度、图表⻛格、光线追踪、8K分辨率、构图简洁。
26Q2 功能类 38	nano pro	功能类	26Q2	抗菌防护科技可视化，透明实体⽔泡悬浮在画⾯中⼼，⽔泡包裹着零星绿⾊杆状微⽣物，⽔泡边缘呈不规则形态，内部还有零星的⼀些细⼩的⽔泡，表⾯具有流动性和厚重感；（避免出现玻璃质感，要是流体质感）下⽅为⽩⾊动态⾯料，背景从上到下是蓝⾊到⽩⾊渐变，⾊阶过渡极其平滑⾃然，背景中带有⼏乎不可察觉的细腻纹理与轻微空⽓感，避免任何⾊带或渐变断层，整体⼲净统⼀。画⾯清洁、轻盈；⾼端商业CG渲染⻛格；需后期微调
26Q2 功能类 39	nano pro	功能类	26Q2	⽣成⾼科技隔热织物的特写宏观横截展示（两层），⾯料呈弧形层状结构。表⾯呈现淡蓝⾊并具有清晰的织物纹理⼀束带彩虹折射效果的光束击中材料表层，全部被反射并产⽣光线偏折。材料下⽅散发轻柔冷雾，突出其凉感与散热效果。背景为⼲净的蓝⾊渐变，整体呈现现代科技产品⼴告视觉。整体⻛格：未来感材料科技展示、纹理写实、结构清晰、突出产品功能特性。光束必须保留彩虹折射效果，避免变成单⾊激光六边形纹理要保持“织物/涂层”质感，⽽不是⾦属⽹冷雾不能过浓，应为轻微科技雾⽓
26Q2 功能类 40	nano pro	功能类	26Q2	主体(Subject):图像中⼼是⼀个由⽔构成的漩涡（Vortex），并且有⼤量⻜溅的⽔花和⽔滴。在⽔漩涡的中空，⼀条⽩⾊的⾯料带正呈螺旋状扭动，看起来像是被强劲的⽔流冲刷清洗。（⾯料整体褶皱没有那么多）环境(Environment):漩涡悬浮在⼀个平静的⽔⾯上⽅，背景是浅蓝⾊的渐变⾊，营造出⼲净清爽的氛围⻛格(Style):图像⾮常清晰、真实，不像是⼿绘，更偏向于“3D渲染”（3DRender）或“⾼速摄影”（High-speed photography）。细节(Details):⽔是“清澈透明的”（Clear,Transparent），可以看到很多“⽓泡”（Bubbles）和“⻜溅物”（Splashes），⾯料的纹理感和肌理感
26Q2 功能类 41	nano pro	功能类	26Q2	主体(Subject):图像中⼼是⼀个⽔涡流在平静的海⾯上旋转和⻜溅，并且有⼤量⻜溅的⽔花和⽔滴。在⽔涡流中⼼，⼀条⽩⾊的⾯料带正呈螺旋状扭动，看起来像是被强劲的⽔流冲刷清洗。（⾯料整体褶皱没有那么多）环境(Environment):背景是浅蓝⾊的渐变⾊，左上⻆是太阳光斑，营造出整体防晒整洁的氛围⻛格(Style):图像⾮常清晰、真实，不像是⼿绘，更偏向于“3D渲染”（3DRender）或“⾼速摄影”细节(Details):⽔是“清澈透明的”（Clear,Transparent），可以看到很多“⽓泡”（Bubbles）和“⻜溅物”（Splashes），太阳光斑
`;

const promptRows = promptLibrarySeed
  .trim()
  .split(String.fromCharCode(10))
  .map((line) => line.split(String.fromCharCode(9)));

const prompts = promptRows.map(([title, model, category, rawQuarter, prompt], index) => {
  const imageNumber = String(index + 1).padStart(3, "0");
  const quarter = rawQuarter.match(/Q[1-4]/)?.[0] || rawQuarter;
  return {
    id: `prompt-${imageNumber}`,
    title,
    model,
    category,
    quarter,
    rawQuarter,
    scene: "Prompt 素材",
    prompt,
    image: `/aigc-assets/prompt/prompt-${imageNumber}.webp`,
  };
});

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

if (typeof console !== "undefined") {
  console.assert(promptRows.length === 41, `Expected 41 prompt rows, got ${promptRows.length}`);
  console.assert(prompts[0]?.image === "/aigc-assets/prompt/prompt-001.webp", "First prompt image path is incorrect");
  console.assert(prompts[40]?.image === "/aigc-assets/prompt/prompt-041.webp", "Last prompt image path is incorrect");
  console.assert(prompts.every((item) => item.title && item.model && item.category && item.quarter && item.prompt), "Every prompt should have complete metadata");
}

const spring = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getPromptPanelState(pointerRatioY) {
  if (pointerRatioY < 0.18 || pointerRatioY > 0.98) {
    return { visible: false, depth: 0, interactive: false };
  }

  const depth = clamp((pointerRatioY - 0.42) / 0.32);
  return {
    visible: true,
    depth,
    interactive: depth > 0.52,
  };
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 14.7 9l6 .9-4.3 4.2 1 5.9-5.4-2.8L6.6 20l1-5.9L3.3 9.9l6-.9L12 3.5Z" />
    </svg>
  );
}

function VisualCard({ image, title }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={spring}
      className="relative h-full min-h-[320px] overflow-hidden rounded-[34px] bg-[#eef2f7]"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.16),transparent_42%)]" />
    </motion.div>
  );
}

function PromptAssetCard({ item, index, totalCount, hoveredPromptId, onHoverPrompt, onLeavePrompt, onCopyPrompt }) {
  const [panelState, setPanelState] = useState({ visible: false, depth: 0, interactive: false });
  const [localCopied, setLocalCopied] = useState(false);
  const { visible, depth, interactive } = panelState;
  const isDimmed = Boolean(hoveredPromptId && hoveredPromptId !== item.id);
  const serialNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(totalCount).padStart(2, "0");

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    setPanelState(getPromptPanelState(ratioY));
  }

  async function handleCopyPrompt(event) {
    event.stopPropagation();
    await onCopyPrompt(item);
    setLocalCopied(true);
    window.setTimeout(() => setLocalCopied(false), 1200);
  }

  return (
    <article
      onMouseEnter={() => onHoverPrompt(item.id)}
      onMouseLeave={() => {
        onLeavePrompt();
        setPanelState({ visible: false, depth: 0, interactive: false });
        setLocalCopied(false);
      }}
      className="group cursor-pointer overflow-hidden rounded-[30px] border border-white/20 bg-white/40 shadow-[0_24px_70px_rgba(0,0,0,0.12)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_38px_110px_rgba(0,0,0,0.18)]"
      style={{
        opacity: isDimmed ? 0.44 : 1,
        filter: isDimmed ? "brightness(.55) saturate(.62)" : "brightness(1) saturate(1)",
        transform: isDimmed ? "scale(.985)" : undefined,
      }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-[30px] bg-gray-100"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          setPanelState({ visible: false, depth: 0, interactive: false });
          setLocalCopied(false);
        }}
      >
        <VisualCard image={item.image} title={item.title} />

        <div
          className="pointer-events-none absolute left-4 top-4 z-30 rounded-full bg-black/24 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/78 backdrop-blur-xl"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,.22)" }}
        >
          {serialNumber}/{totalNumber}
        </div>

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-end p-4">
          <button
            type="button"
            aria-label="收藏素材"
            onClick={(event) => event.stopPropagation()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/40 bg-white/88 text-black/56 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl transition hover:scale-105 hover:bg-white"
          >
            <StarIcon />
          </button>
        </div>

        <div
          className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 transition-opacity duration-300"
          style={{ opacity: visible ? 0 : 1 }}
        >
          <span className="rounded-md bg-black/62 px-3 py-1 text-xs font-medium text-white backdrop-blur-xl">
            {item.model}
          </span>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: visible ? 0.1 + depth * 0.25 : 0,
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,.54) 100%)",
          }}
        />

        <div
          className={cn(
            "absolute left-4 right-4 z-40 overflow-hidden rounded-2xl border text-white backdrop-blur-2xl transition-all duration-300",
            visible ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          style={{
            top: `${58 - depth * 28}%`,
            bottom: `${4 + depth * 0.8}%`,
            padding: `${16 + depth * 6}px 22px`,
            backgroundColor: `rgba(18,18,22,${0.42 + depth * 0.36})`,
            borderColor: `rgba(255,255,255,${0.38 - depth * 0.18})`,
            boxShadow: `0 ${18 + depth * 14}px ${52 + depth * 24}px rgba(0,0,0,${0.18 + depth * 0.24})`,
            transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(.985)",
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-white/74">
            <div className="flex min-w-0 items-center gap-2">
              <span>图片</span>
              <span>·</span>
              <span className="truncate">{item.model}</span>
              <span>·</span>
              <span>{item.category}</span>
            </div>
            <span className="shrink-0 rounded-full bg-white/12 px-2 py-0.5 text-[10px] text-white/80">
              {localCopied ? "已复制" : "点击复制"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyPrompt}
            title="点击复制 Prompt"
            className="block w-full cursor-copy text-left outline-none"
          >
            <p className={cn("text-sm font-medium leading-7 text-white transition-all duration-300", interactive ? "line-clamp-5" : "line-clamp-3")}>
              {item.prompt}
            </p>
          </button>

          <div
            className="pointer-events-none mt-3 flex items-center gap-2 text-xs text-white/70 transition-all duration-300"
            style={{ opacity: visible ? Math.max(0.45, clamp((depth - 0.3) / 0.32)) : 0 }}
          >
            <span className="inline-block h-3 w-3 rounded-[3px] border border-white/28" />
            点击文字复制 Prompt
          </div>
        </div>
      </div>
    </article>
  );
}

function AnimatedBackground({ scrollYProgress }) {
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.34, 0.18, 0.1]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ y: glowY, scale: glowScale }}
        animate={{ x: [0, 34, -28, 0], opacity: [0.86, 1, 0.9, 0.86] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.2),rgba(90,200,250,0.1)_38%,transparent_68%)] blur-2xl"
      />
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-45 [background-size:220%_220%] bg-[linear-gradient(120deg,rgba(255,255,255,0.5),transparent_28%,rgba(0,113,227,0.12)_46%,transparent_64%,rgba(175,82,222,0.1))]"
      />
      <motion.div
        animate={{ x: [0, 78, -42, 0], y: [0, -52, 64, 0], scale: [1, 1.14, 0.98, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -72, 44, 0], y: [0, 58, -36, 0], scale: [1, 0.94, 1.12, 1] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-indigo-300/18 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 48, -34, 0], y: [0, -38, 44, 0], opacity: [0.18, 0.32, 0.22, 0.18], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/3 h-80 w-80 rounded-full bg-cyan-200/24 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -36, 28, 0], y: [0, 30, -24, 0], opacity: [0.12, 0.22, 0.14, 0.12] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 right-[18%] h-72 w-72 rounded-full bg-orange-200/20 blur-3xl"
      />
      <motion.div
        style={{ opacity: gridOpacity }}
        animate={{ backgroundPosition: ["0px 0px", "64px 64px", "0px 0px"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.038)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_50%_12%,black,transparent_68%)]"
      />
      <motion.div
        animate={{ opacity: [0.35, 0.62, 0.38, 0.35] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.78),transparent_42%)]"
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
      <motion.div className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-[#0071e3]" style={{ scaleX: scrollYProgress }} />

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
            {["Prompts", "Visuals", "Motion", "About"].map((item) => (
              <motion.span key={item} whileHover={{ y: -1, color: "#1d1d1f" }} className="cursor-pointer">
                {item}
              </motion.span>
            ))}
          </nav>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
            Copy
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
          className="mx-auto max-w-6xl px-6 pb-16 pt-28 text-center md:pb-20 md:pt-32"
        >
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-6 inline-flex items-center rounded-full border border-black/8 bg-white/48 px-4 py-2 text-sm font-medium text-black/58 shadow-[0_8px_28px_rgba(0,0,0,0.04)] backdrop-blur-2xl"
          >
            AIGC Prompt Gallery
          </motion.div>

          <motion.h1
            initial={{ y: 24, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.14, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-5xl text-[4.4rem] font-semibold leading-[0.94] tracking-[-0.075em] text-[#1d1d1f] md:text-[7.2rem] lg:text-[8.4rem]"
          >
            <span className="block">Ideas.</span>
            <span className="block">Visuals.</span>
            <span className="block bg-gradient-to-r from-[#1d1d1f] via-[#3b3f46] to-[#8a8f98] bg-clip-text text-transparent">
              Ready to copy.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-3xl text-[1.35rem] font-medium leading-9 tracking-[-0.02em] text-black/58 md:text-[1.55rem]"
          >
            将 AI 视觉案例与对应 Prompt 整理成一个清晰、轻量、可复用的团队灵感库。
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
                      className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${activeCategory === item ? "text-white" : "text-black/56 hover:text-black"}`}
                    >
                      {activeCategory === item && <motion.span layoutId="activeCategoryPill" transition={spring} className="absolute inset-0 rounded-full bg-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.22)]" />}
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
                          className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${activeQuarter === item ? "text-white" : "text-black/52 hover:text-black"}`}
                        >
                          {activeQuarter === item && <motion.span layoutId="activeQuarterPill" transition={spring} className={`absolute inset-0 rounded-full ${theme.pill} ${theme.shadow}`} />}
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

              <motion.label whileFocusWithin={{ scale: 1.015 }} transition={spring} className="relative block w-full lg:max-w-[300px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/36">
                  <SearchIcon />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Prompts"
                  className="h-11 w-full rounded-full border border-white/70 bg-[#f1f2f4]/85 pl-11 pr-5 text-sm text-black/78 outline-none backdrop-blur-xl placeholder:text-black/35 transition focus:bg-white/80 focus:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                />
              </motion.label>
            </div>
          </div>
        </motion.section>

        <motion.section layout className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-14 px-5 pb-28 sm:grid-cols-2 lg:grid-cols-3 xl:gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 620, damping: 38, mass: 0.55 }}
              >
                <PromptAssetCard
                  item={item}
                  index={index}
                  totalCount={filteredPrompts.length}
                  hoveredPromptId={hoveredPrompt}
                  onHoverPrompt={setHoveredPrompt}
                  onLeavePrompt={() => setHoveredPrompt(null)}
                  onCopyPrompt={handleCopy}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}
