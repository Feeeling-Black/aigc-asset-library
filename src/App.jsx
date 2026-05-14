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
const categories = ["模型类", "功能类", "服装单品", "功能面料", "科技视觉", "电商KV"];
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
  const hasPrompt = false;
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
    prompt: "",
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

const promptLibrarySeed = [["25Q3 模型类 01","Seedream 3.0","模型类","25Q3","男⼠灰⾊休闲裤，版型宽松，全⻓的轮廓，采⽤柔软的纯棉⾯料，⼀只腿呈现夸张弯曲的姿势。单品独⽴拍摄，纯⽩⾊背景，专业的影棚灯光，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现"],["25Q3 模型类 02","Seedream 3.0","模型类","25Q3","⼥防晒外套，在空中飘动，形态⾃然平整，展现整个⾐服版型，⽆明显褶皱，背景蓝天⼾外，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现，"],["25Q3 模型类 03","Seedream 3.0","模型类","25Q3","男⼠休闲⽜仔裤，版型宽松，全⻓的轮廓，采⽤柔软的⽜仔⾯料，⼀只腿呈弯曲的姿势。单品独⽴拍摄，纯⽩⾊背景，专业的影棚灯光，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现"],["25Q3 模型类 04","Seedream 3.0","模型类","25Q3","男⼠冲锋⾐外套，采⽤三防的特氟⻰⾯料，在空中飘动，背景是灰⽩⾊渐变，专业的影棚灯光，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现"],["25Q3 模型类 05","Seedream 3.0","模型类","25Q3","男⼠休闲⽜仔裤，版型宽松，全⻓的轮廓，采⽤柔软的⽜仔⾯料，⼀只腿呈弯曲的姿势。单品独⽴拍摄，背景是⼾外雪⼭的场景，裤⼦上覆盖了⼀层冰霜，⽆模特，画⾯中⽆⼈出现"],["25Q3 模型类 06","Seedream 3.0","模型类","25Q3","男⼠冲锋⾐外套，采⽤三防的特氟⻰⾯料，在空中飘动，⾯料平整⽆褶皱，背景⼾外的森林场景，⾯料纹理清晰，⽆模特，画⾯中⽆⼈出现"],["25Q3 模型类 07","Seedream 3.0","模型类","25Q3","四件⼥⼠短袖T恤从左到右依次悬挂，颜⾊分别是粉⾊、⽩⾊、⻩⾊、卡其⾊。版型很⼩巧，⽆褶皱，圆领设计。⾐物通过⽊夹悬挂在细绳上，展现出轻盈的垂坠感，突显其轻薄的⾯料特性。单品独⽴拍摄，背景是⼾外的蓝天。⽆模特穿着，正视视⻆"],["25Q3 模型类 08","Seedream 3.0","模型类","25Q3","四件⼥⼠短袖T恤从左到右依次悬挂，颜⾊分别是粉⾊、⽩⾊、⻩⾊、卡其⾊。版型⼩巧⽆褶皱，圆领设计。⾐物通过⽊夹悬挂在细绳上，展现出轻盈的垂坠感，突显其轻薄的⾯料特性。单品独⽴拍摄，背景为纯净的⽩⾊，专业摄影棚灯光下，纯⾊的背景，⾯料的细腻质感得到清晰展现。⽆模特穿着，正视视⻆"],["25Q3 功能类 09","Seedream 3.0","功能类","25Q3","正视图视角，灰色的面料，倾斜45度，水、油、可乐，三种不同流体从上到下流动在面料表面，体现三防科技。"],["25Q3 功能类 10","Seedream 3.0","功能类","25Q3","蓝色的面料，白色蒸汽从下而上喷出，灰色的背景，摄影灯光照明，平视视角，表现透气面料的空气流动感。"],["25Q3 功能类 11","Seedream 3.0","功能类","25Q3","浅灰渐变背景下的蓬松棉花，柔和光线，下方是满一层丝状的棉絮，虚幻5引擎，表现纯棉面料的天然柔软质感。"],["25Q3 功能类 12","Seedream 3.0","功能类","25Q3","灰色的平整面料上，泼撒水，形态优美，水在接触面料后自然滑落，体现防泼水科技。"],["25Q3 功能类 13","Seedream 3.0","功能类","25Q3","浅咖色面料，雨水击打的面料上，灰色背景，视角旋转45度，雨水击打在面料上发生轻微形变，表现防雨科技。"],["25Q3 功能类 14","Seedream 3.0","功能类","25Q3","灰色的面料上，放着一个圆形刷子，刷子背面朝向面料放置，体现面料的耐磨性。"],["25Q3 功能类 15","Seedream 3.0","功能类","25Q3","一层浅蓝色的面料侧面展示，面料下方有圆形水珠，面料上方有水蒸气冒起，表现透湿排湿科技。"],["25Q3 功能类 16","Seedream 3.0","功能类","25Q3","灰白渐变背景在同一个面料上呈现对比形式，左侧面料呈现褶皱纹理，右侧展现顺滑平整效果，柔光精准区分两种状态纤维细节，虚幻5引擎渲染超写实织物动态，飘动轨迹中保持面料形态稳定。"],["25Q3 功能类 17","Seedream 3.0","功能类","25Q3","C4D白色极其纤细编织面料肌理，景深透视，有两个不规则的圆形细菌，大小不一，浅绿色玻璃材质，超远摄像机视角，表现抑菌科技。"],["25Q4 模型类 18","Midjourney 7","模型类","25Q4","⼀件简洁⼲净的连帽灰⾊⽻绒服在空中飘浮，⽻绒服⾮常饱满。⽻绒服侧⾯45度呈现。形态⾃在;没有明显的褶皱。纹理清晰可⻅。拉链是处于敞开状态。⽻绒服内部照射着橙红⾊的光。背景为蓝天雪⼭场景。"],["25Q4 模型类 19","Midjourney 7","模型类","25Q4","⼀件简洁⼲净的连帽浅咖⾊外套在空中飘浮。⾐服⾮常饱满侧⾯45度呈现。形态⾃在;没有明显的褶皱,纹理清断可⻅。背景为蓝天。"],["25Q4 模型类 20","Midjourney 7","模型类","25Q4","⼀件简洁⼲净的灰⾊⽻绒服在空中飘浮。两个袖⼝向上抬起。⽻绒服⾮常饱满。⽻绒服朝向左侧45度。形态⾃在；没有明显的褶皱。纹理清晰可⻅。⽻绒服内部是⽆缝合的⾯料。背景为灰⾊场景。"],["25Q4 功能类 21","Midjourney 7","功能类","25Q4","Thesurrealist artstyle centerson \"soft\" elements, presenting softand rounded whitefluffyspheres.Their tinyhairs naturally extendand floatintheair. Thegentle lightand shadowblend gentlyonthe surface, enhancingthe three- dimensionality .The backgroundis agradientof orange, creatinga warmand peaceful spatialsense. Itpresentsa serene, dreamlikeand textured aesthetic atmosphere..- -ar4:3--style raw--stylize 300"],["25Q4 功能类 22","Midjourney 7","功能类","25Q4","Aclose-upofa small,round, fluffywhite materialfloating intheair againstan orange background withwhitesilkfloss,soft lighting,macro photography, withafew strandsoffluff aroundawhite square device,blurred background, highresolution, hyper-realistic."],["25Q4 功能类 23","Midjourney 7","功能类","25Q4","Thesurreal naturalart style showcases thefine textureofa layerof textile, enhancingthe overall delicacyand luster.The fibersare arrangednaturallyand vertically, withasoft andfluffy texture,asif expressingthe visualeffectof the combination ofnatural fibersand modern technology. The backgroundis warmand soft.Thepale lightpasses throughthe fibersto createa gentleand beautifullight andshadow effect, creatinga warm, comfortable andtextured atmosphere, showcasing thetouchof natural materialsand apoeticvisual effect.--ar4:3- -raw"],["25Q4 功能类 24","Seedream 3.0","功能类","25Q4","正视图视⻆，以红橙⾊渐变⾊为背景，⽻绒纤维堆积在画⾯的下半部分整体材质呈现半透明，前景景深，空中还有零星的圆形绒丝缓缓飘落，超细腻⽻丝，漂浮状态，轻盈蓬松，⽩⾊半透明结构，逼真质感，微距摄影，⾼清细节，边缘的绒感；"],["25Q4 功能类 25","Seedream 3.0","功能类","25Q4","⼀朵⽻绒簇，超细腻⽻丝，漂浮状态，轻盈蓬松，⽩⾊半透明结构，逼真质感，微距摄影，⾼清细节，逆光光线照亮⽻绒每⼀跟绒⽑，背景呈红橙⾊的渐变⾊，在它围绕三个很⼤的不规则的⽔珠，⽻绒簇与⽔珠相互挤压进⾏交互。呈现灵动的画⾯⻛格"],["26Q2 模型类 26","nano pro","模型类","26Q2","⼀件带有兜帽的轻盈⽩⾊浮空夹克，⾥⾯⽆⼈，⾯料柔软透⽓，纯⽩⾊织物，质地细腻，夹克悬于半空，拉链敞开，袖⼦轻轻展开，超轻超透⽓的感觉，流动的⽓流中带有明显的渐隐彩虹光效沿着夹克整体轮廓（光效要远离夹克），清新洁净的氛围，淡蓝⾊渐变的天空背景，⾼端服装商业⻛格，极简构图，柔和的漫射光，没有刺眼的阴影，超⾼端的CG⻛格，优质品质，8K细节。需后期微调"],["26Q2 模型类 27","nano pro","模型类","26Q2","⼀件轻薄的凉感连帽外套被封存在巨⼤的透明冰块中，外套呈柔和的浅粉⾊，并带有淡⻩⾊的⾛线，⾯料轻透、褶皱⾃然，悬浮在冰块内部。冰块边缘清晰透明，内部充满冰裂纹、凝霜纹理与被折射的冷⾊光线，呈现⾼亮的冰晶质感。冰块四周散发淡淡的冷⽓前景为柔和的雪地起伏，背景为⼲净的天空蓝渐变。整体光线明亮冷感，带有强烈的冰⾯反射，使画⾯显得清爽、极寒、纯净。整体氛围：极致降温、冰封般的冷感科技⼴告视觉。冰块必须保持透明+冰裂纹+折射光，不能变成玻璃外套的颜⾊必须保持浅粉+淡⻩⾊⾛线雪地应为柔软曲线形状，不是硬质冰⾯整体饱和度不应过⾼背景为天空蓝渐变，不可出现杂⾊"],["26Q2 模型类 28","nano pro","模型类","26Q2","商业级别CG渲染，悬浮的⽩⾊连帽防晒，具备防晒阻隔技术，⾐服四周有透明的六边形蜂窝结构，形成弧形穹顶，先进⾯料防护可视化表现，⼲净的蓝⾊天空渐变背景;8K;需后期微调"],["26Q2 模型类 29","nano pro","模型类","26Q2","⼀件由透明流体组成的裤⼦悬浮在空中。外套整体为流体材质，线条柔和流畅，边缘带有轻微折射与⾼光，表⾯带有⾃然透亮的冷感质地。裤⼦内部有极轻微的光散射，传递清凉触感。背景为从浅天蓝到⽩⾊的柔和纵向渐变，营造⼭泉般的清爽感。整体光源明亮柔和，极简清新。整体构图轻盈、空灵。透明材质要保持柔和⽔感，不能变成玻璃或冰块；材质折射的颜⾊需要是⽩⾊背景必须保留淡蓝→⽩的竖向渐变裤⼦形态需呈轻盈漂浮、⽆实体模特"],["26Q2 模型类 30","Seedream 4.5","模型类","26Q2","⾼端功能性CG渲染⻛格。漂浮的⽩⾊织物T恤，轻盈透⽓的⾯料，⽔蒸⽓从⾯料表⾯向外散发，背景是蓝⾊到⽩⾊渐变（⽆杂⾊）；⾯料质地⼲爽顺滑，内部不吸⽔，洁净清新的清凉肤感，影棚级布光，柔和⾼光，极简⼲净的构图，8K画质"],["26Q2 模型类 31","nano pro","模型类","26Q2","⾼端功能性CG渲染⻛格。漂浮的⽩⾊织物T恤，轻盈透⽓的⾯料，⽔蒸⽓从⾯料⾯向外散发，背景是蓝⾊到⽩⾊渐变（⽆杂⾊）；⾯料质地⼲爽顺滑，内部不吸⽔，洁净清新的清凉肤感，影棚级布光，柔和⾼光，极简⼲净的构图，8K画质"],["26Q2 模型类 32","nano pro","模型类","26Q2","夏季凉感服装产品视觉，⼀条悬浮展示的⽩⾊T恤漂浮在空中，视觉轻盈，不透明⾯料。⾐服表⾯附着细腻冰霜颗粒质感与冷凝质感，周围散发出很淡的⽩⾊凉雾，表现持续降温与透⽓凉感功能。背景从上到下是蓝⾊到⽩⾊的渐变⾊，空⽓中带有⼤⼩不⼀的冰感粒⼦，整体⻛格清爽、理性、⾼端电商产品KV，⽆⼈物，⽆光效，⾐服上⽆⽔滴，⽆夸张变形。"],["26Q2 功能类 33","nano pro","功能类","26Q2","⼀张超写实的微距照⽚，⼀块晶莹剔透的冰块飘在空中，下⽅是柔软的浅蓝⾊布料。冰块⼀⻆轻轻触碰到⾯料，⾯料被接触的局部表⾯增加⽔晶形态凸起表层（呈现透明冰霜颗粒纹理）；背景从上到下是蓝⾊到浅蓝⾊的渐变⾊（⽆其他杂⾊）；布料具有细腻的⾯料纹理，⾯料⾃然摆动。冰块向下散发出柔和的冷雾。⾼调照明。景深效果，焦点在冰块上，边缘模糊。3D产品渲染⻛格，Octane渲染，8k分辨率，构图⼲净，极简美学。"],["26Q2 功能类 34","nano pro","功能类","26Q2","超微距特写镜头，抽象纤维结构，柔软的⽩⾊编织纤维以流畅重复的纹理相互交织，中⼼是冰蓝⾊半透明凝胶材质与⽩⾊纤维相互交织，呈现冰冻质感；表⾯嵌有冰晶与精致雪花，点缀着霜粒与微⽔滴，视觉效果极致洁净清新。整体为⾼端商业CG⻛格，材质渲染超精细，质感丝滑柔顺，⾊彩过渡柔和渐变，冷⾊调配⾊，以⽩⾊与冰蓝⾊为主；采⽤⾼调打光、柔和影棚灯光，⽆⽣硬阴影，浅景深效果，电影感微距构图，营造未来感护肤或⾯料科技概念，画⾯超写实，8K超清画质，焦点清晰锐利，背景极简"],["26Q2 功能类 35","nano pro","功能类","26Q2","柔软的⽩⾊编织纤维以流畅重复的纹理相互紧密交织⽆缝隙（处于画⾯下半部分）；视⻆处于画⾯中⼼位置；背景从上到下是淡蓝⾊到⽩⾊渐变，⼀个不规则的圆形⽔滴从织物上⽅向下飘动，四周有很⼩的⽔珠；⽔滴跟纤维有交互；飘动过程中细微⽔汽与雾⽓向上扩散；整体画⾯⼲净；⾼端CG⻛格；强对⽐，⾼质感需后期微调"],["26Q2 功能类 36","nano pro","功能类","26Q2","⾼端功能⾯料科技CG可视化；COOLMAX⻛格功能性⾯料微距特写，浅蓝⾊冷⾊调，⾼密度、规则排列的织物纹理清晰可⻅，⾯料中央区域呈现吸湿微微凹陷结构，形成深浅渐变的湿润区域，⽔分被迅速吸⼊纤维内部的可视化效果，湿润区域向上飘动烟雾，湿⽓向内集中并向外扩散的排湿表现，整体画⾯⼲净、轻盈、清爽，写实⻛格，"],["26Q2 功能类 37","nano pro","功能类","26Q2","⾼端CG渲染⻛格；特写侧拍⼀条动感的⽩⾊⾯料扭曲横跨画⾯。⼀束带有彩虹折射效果的光束击中表层，光线完全被反射并产⽣多⾊偏折；光线照射在⽩⾊表层上的点呈现出温暖的橙⾊扩散，表明有热阻隔效果。织物背⾯是浅蓝⾊，⾯料下⽅伴有淡淡的冷⽓和冰碴，象征着有效的隔热。背景是天空⾊；⾼对⽐度、图表⻛格、光线追踪、8K分辨率、构图简洁。"],["26Q2 功能类 38","nano pro","功能类","26Q2","抗菌防护科技可视化，透明实体⽔泡悬浮在画⾯中⼼，⽔泡包裹着零星绿⾊杆状微⽣物，⽔泡边缘呈不规则形态，内部还有零星的⼀些细⼩的⽔泡，表⾯具有流动性和厚重感；（避免出现玻璃质感，要是流体质感）下⽅为⽩⾊动态⾯料，背景从上到下是蓝⾊到⽩⾊渐变，⾊阶过渡极其平滑⾃然，背景中带有⼏乎不可察觉的细腻纹理与轻微空⽓感，避免任何⾊带或渐变断层，整体⼲净统⼀。画⾯清洁、轻盈；⾼端商业CG渲染⻛格；需后期微调"],["26Q2 功能类 39","nano pro","功能类","26Q2","⽣成⾼科技隔热织物的特写宏观横截展示（两层），⾯料呈弧形层状结构。表⾯呈现淡蓝⾊并具有清晰的织物纹理⼀束带彩虹折射效果的光束击中材料表层，全部被反射并产⽣光线偏折。材料下⽅散发轻柔冷雾，突出其凉感与散热效果。背景为⼲净的蓝⾊渐变，整体呈现现代科技产品⼴告视觉。整体⻛格：未来感材料科技展示、纹理写实、结构清晰、突出产品功能特性。光束必须保留彩虹折射效果，避免变成单⾊激光六边形纹理要保持“织物/涂层”质感，⽽不是⾦属⽹冷雾不能过浓，应为轻微科技雾⽓"],["26Q2 功能类 40","nano pro","功能类","26Q2","主体(Subject):图像中⼼是⼀个由⽔构成的漩涡（Vortex），并且有⼤量⻜溅的⽔花和⽔滴。在⽔漩涡的中空，⼀条⽩⾊的⾯料带正呈螺旋状扭动，看起来像是被强劲的⽔流冲刷清洗。（⾯料整体褶皱没有那么多）环境(Environment):漩涡悬浮在⼀个平静的⽔⾯上⽅，背景是浅蓝⾊的渐变⾊，营造出⼲净清爽的氛围⻛格(Style):图像⾮常清晰、真实，不像是⼿绘，更偏向于“3D渲染”（3DRender）或“⾼速摄影”（High-speedphotography）。细节(Details):⽔是“清澈透明的”（Clear,Transparent），可以看到很多“⽓泡”（Bubbles）和“⻜溅物”（Splashes），⾯料的纹理感和肌理感@"],["26Q2 功能类 41","nano pro","功能类","26Q2","主体(Subject):图像中⼼是⼀个⽔涡流在平静的海⾯上旋转和⻜溅，并且有⼤量⻜溅的⽔花和⽔滴。在⽔涡流中⼼，⼀条⽩⾊的⾯料带正呈螺旋状扭动，看起来像是被强劲的⽔流冲刷清洗。（⾯料整体褶皱没有那么多）环境(Environment):背景是浅蓝⾊的渐变⾊，左上⻆是太阳光斑，营造出整体防晒整洁的氛围⻛格(Style):图像⾮常清晰、真实，不像是⼿绘，更偏向于“3D渲染”（3DRender）或“⾼速摄影”细节(Details):⽔是“清澈透明的”（Clear,Transparent），可以看到很多“⽓泡”（Bubbles）和“⻜溅物”（Splashes），太阳光斑"]];

const promptImageOrder = Array.from({ length: 41 }, (_, index) => index + 1);

const promptLibraryAssets = promptLibrarySeed.map(([title, model, category, quarter, prompt], index) => {
  const imageNumber = promptImageOrder[index] ?? index + 1;
  return {
  id: `prompt-${String(index + 1).padStart(3, "0")}`,
  title,
  mediaType: "image",
  mediaUrl: `/aigc-assets/prompt/prompt-${String(imageNumber).padStart(3, "0")}.webp`,
  model,
  category,
  scene: "Prompt 素材",
  quarter,
  favorite: false,
  hasPrompt: true,
  prompt,
  tags: [quarter, category, model, "Prompt"],
  gradient: "linear-gradient(135deg, #eef6fc 0%, #c7e0f4 48%, #8abde6 100%)",
  accent: "#0078d4",
};
});

const initialAssets = [...placeholderAssets, ...motionAssets, ...promptLibraryAssets];

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
  const thumbnailItems = Array.from({ length: thumbCount }, (_, index) => promptLibraryAssets[index % promptLibraryAssets.length]);

  function getThumbStyle(index) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const edgeDistanceX = Math.min(col, cols - 1 - col) / (cols / 2);
    const edgeFade = clamp(edgeDistanceX * 1.85, 0.08, 1);

    if (hoveredThumb === null) {
      return {
        transform: "translate3d(0,0,0) scale(1)",
        zIndex: 1,
        opacity: 0.22 + edgeFade * 0.5,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.32)",
      };
    }

    const hoverRow = Math.floor(hoveredThumb / cols);
    const hoverCol = hoveredThumb % cols;
    const dx = col - hoverCol;
    const dy = row - hoverRow;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const safeDistance = Math.max(distance, 0.001);
    const influence = Math.max(0, 1 - distance / 6.4);
    const magnetic = influence * influence * (3 - 2 * influence);

    if (index === hoveredThumb) {
      return {
        transform: "translate3d(0,-10px,0) scale(3.55)",
        zIndex: 220,
        opacity: 1,
        filter: "saturate(1.08) brightness(1.04)",
        boxShadow: "0 28px 64px rgba(0,0,0,.22), 0 0 0 1px rgba(255,255,255,.32), 0 0 52px rgba(74,168,255,.14)",
      };
    }

    const directionX = dx / safeDistance;
    const directionY = dy / safeDistance;
    return {
      transform: `translate3d(${directionX * magnetic * 24}px, ${directionY * magnetic * 24}px, 0) scale(${0.94 + (1 - magnetic) * 0.06})`,
      zIndex: Math.max(1, Math.round(magnetic * 64)),
      opacity: 0.14 + edgeFade * 0.24 + magnetic * 0.36,
      filter: magnetic > 0.12 ? "saturate(.95) brightness(.94)" : "saturate(.72) brightness(.88)",
      boxShadow: magnetic > 0.48 ? "0 8px 18px rgba(31,38,135,.08)" : "none",
    };
  }

  return (
    <section className="thumbnail-inline-stage relative mb-6 overflow-hidden rounded-[28px] px-5 py-6 md:px-8">
      <div className="thumbnail-wall-shell relative z-10">
        <div className="grid gap-1.5 md:gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} onMouseLeave={() => setHoveredThumb(null)}>
          {thumbnailItems.map((item, index) => {
            const isActive = hoveredThumb === index;
            return (
              <button
                key={`${item.id}-thumb-${index}`}
                type="button"
                onMouseEnter={() => setHoveredThumb(index)}
                className={cn("thumbnail-tile relative aspect-[3/4] overflow-hidden outline-none", isActive ? "thumbnail-tile-active" : "")}
                style={{ ...getThumbStyle(index), borderRadius: "9px", background: "rgba(255,255,255,.28)" }}
                aria-label={`Prompt 缩略图 ${index + 1}`}
              >
                <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" draggable={false} loading="lazy" />
                <span
                  className="thumbnail-frost absolute inset-0"
                  style={{
                    background: isActive
                      ? "linear-gradient(to bottom right, rgba(255,255,255,.02), rgba(255,255,255,.01), rgba(0,0,0,.04))"
                      : "linear-gradient(to bottom right, rgba(255,255,255,.50), rgba(255,255,255,.26), rgba(255,255,255,.10))",
                  }}
                />
                <span className="thumbnail-glint pointer-events-none absolute inset-y-0 -left-[120%] w-[80%] rotate-12 bg-gradient-to-r from-transparent via-white/44 to-transparent" />
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
    { id: "model-03", title: "模型类主展示图 03", mediaType: "image", mediaUrl: "/aigc-assets/model/model-03.webp", model: "Model Preview", category: "模型类", scene: "主展示图", hasPrompt: false, prompt: "", tags: ["模型类", "主展示"], gradient: "linear-gradient(135deg, #eef6fc 0%, #c7e0f4 48%, #8abde6 100%)", accent: "#00a2ed" },
    { id: "model-04", title: "模型类主展示图 04", mediaType: "image", mediaUrl: "/aigc-assets/model/model-04.webp", model: "Model Preview", category: "模型类", scene: "主展示图", hasPrompt: false, prompt: "", tags: ["模型类", "主展示"], gradient: "linear-gradient(135deg, #e5f5ec 0%, #c7ebd1 48%, #8fd19e 100%)", accent: "#107c10" },
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
            <div className="grid gap-5 sm:grid-cols-2">{[...modelPreviewAssets, ...showcaseAssets.slice(6, 8)].map((item, index) => renderAssetCard(item, index + 2, "aspect-[3/4]"))}</div>
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

function PromptAssetCard({ item, index, onToggleFavorite, hoveredPromptId, onHoverPrompt, onLeavePrompt }) {
  const [panelState, setPanelState] = useState({ visible: false, depth: 0, interactive: false });
  const [copied, setCopied] = useState(false);
  const { visible, depth, interactive } = panelState;
  const isDimmed = Boolean(hoveredPromptId && hoveredPromptId !== item.id);

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    setPanelState(getPromptPanelState(ratioY));
  }

  async function handleCopyPrompt(event) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.prompt || "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = item.prompt || "";
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <article
      onMouseEnter={() => onHoverPrompt(item.id)}
      onMouseLeave={() => onLeavePrompt()}
      className="group cursor-pointer overflow-hidden rounded-2xl border bg-white transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        borderColor: theme.border,
        animationDelay: `${index * 45}ms`,
        boxShadow: isDimmed ? "0 4px 16px rgba(0,0,0,.04)" : "0 8px 26px rgba(0,0,0,.06)",
        opacity: isDimmed ? 0.42 : 1,
        filter: isDimmed ? "brightness(.58) saturate(.62)" : "brightness(1) saturate(1)",
        transform: isDimmed ? "scale(.985)" : undefined,
      }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden bg-gray-100"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          setPanelState({ visible: false, depth: 0, interactive: false });
          setCopied(false);
        }}
      >
        <AssetPreview item={item} />

        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-end p-4">
          <button
            type="button"
            aria-label={item.favorite ? "取消收藏" : "收藏素材"}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-white bg-opacity-90 backdrop-blur transition hover:scale-105"
            style={{ color: item.favorite ? "#ffb900" : theme.subText }}
          >
            <Icon name="star" size={17} filled={item.favorite} />
          </button>
        </div>

        <div
          className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 transition-opacity duration-300"
          style={{ opacity: visible ? 0 : 1 }}
        >
          <span className="rounded-md px-3 py-1 text-xs font-medium text-white backdrop-blur" style={{ background: "rgba(50,49,48,.72)" }}>{item.model}</span>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: visible ? 0.1 + depth * 0.25 : 0,
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,.54) 100%)",
          }}
        />

        <div
          className={cn("absolute left-4 right-4 z-40 overflow-hidden rounded-2xl border text-white backdrop-blur-2xl transition-all duration-300", visible ? "opacity-100" : "pointer-events-none opacity-0")}
          style={{
            top: `${58 - depth * 28}%`,
            bottom: `${4 + depth * 0.8}%`,
            padding: `${16 + depth * 6}px 22px`,
            backgroundColor: `rgba(42,38,50,${0.18 + depth * 0.48})`,
            borderColor: `rgba(255,255,255,${0.44 - depth * 0.22})`,
            boxShadow: `0 ${18 + depth * 14}px ${52 + depth * 24}px rgba(0,0,0,${0.12 + depth * 0.22})`,
            transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(.985)",
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-white/72">
            <div className="flex items-center gap-2">
              <span>图片</span>
              <span>·</span>
              <span>{item.model}</span>
              <span>·</span>
              <span>{item.category}</span>
            </div>
            <span className="rounded-full bg-white/12 px-2 py-0.5 text-[10px] text-white/80">{copied ? "已复制" : "点击复制"}</span>
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
            <Icon name="copy" size={14} />
            点击文字复制 Prompt
          </div>
        </div>
      </div>
    </article>
  );
}

function PromptLibraryView({ assets, viewMode, onToggleFavorite }) {
  const [hoveredPromptId, setHoveredPromptId] = useState(null);
  const promptAssets = assets.filter((asset) => asset.id?.startsWith("prompt-") && asset.hasPrompt);

  if (promptAssets.length === 0) return <EmptyState />;

  if (viewMode === "list") {
    return <AssetListView assets={promptAssets} onToggleFavorite={onToggleFavorite} />;
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" onMouseLeave={() => setHoveredPromptId(null)}>
      {promptAssets.map((item, index) => (
        <PromptAssetCard
          key={item.id}
          item={item}
          index={index}
          onToggleFavorite={onToggleFavorite}
          hoveredPromptId={hoveredPromptId}
          onHoverPrompt={setHoveredPromptId}
          onLeavePrompt={() => setHoveredPromptId(null)}
        />
      ))}
    </section>
  );
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
  console.assert(counts.all === 67, "expected 67 total assets");
  console.assert(counts.motion === 14, "expected 14 motion assets");
  console.assert(counts.prompt === 41, "expected 41 prompt assets");
  console.assert(getFilteredAssets(initialAssets, "motion", "all", null, "").length === 14, "motion filter should return 14 assets");
  console.assert(getFilteredAssets(initialAssets, "prompt", "all", null, "").filter((item) => item.id.startsWith("prompt-")).length === 41, "prompt section should return 41 real prompt assets");
  console.assert(promptLibraryAssets[8].mediaUrl.endsWith("prompt-009.webp"), "25Q3 功能类 09 should use prompt-009.webp");
  console.assert(promptLibraryAssets[16].mediaUrl.endsWith("prompt-017.webp"), "25Q3 功能类 17 should use prompt-017.webp");
  console.assert(promptLibraryAssets[8].prompt.includes("三种不同流体"), "25Q3 功能类 09 prompt should describe three fluid streams");
  console.assert(promptLibraryAssets[16].prompt.includes("抑菌科技"), "25Q3 功能类 17 prompt should describe antibacterial visual");
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
        .prompt-hover-panel:hover { transform: translateY(0) scale(1.015); }
        @media (prefers-reduced-motion: reduce) { .ambient-orb, .ambient-wash, .ambient-sheen, .animated-page-bg::before, .motion-orb, .motion-block, .motion-line, .marquee-track { animation: none !important; } }
      `}</style>
    </div>
  );
}
