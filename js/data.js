/**
 * data.js —— 数据访问层
 * 统一提供：英雄/装备/梯度/赛季数据的读取、按 id 查找、模糊搜索。
 * 依赖：json/*.js 已通过 <script> 注入 window.WQK
 */
window.WQK = window.WQK || {};
window.WQK.data = (function () {
  'use strict';

  /* ---------------- 基础读取 ---------------- */
  const store = () => window.WQK;
  const heroes = () => store().heroes || [];
  const details = () => store().details || {};
  const items = () => store().items || [];
  const tiers = () => store().tiers || {};
  const season = () => store().season || {};

  // 常用索引
  const heroMap = {};         // id -> hero
  const itemMap = {};         // id -> item
  heroes().forEach(h => { heroMap[h.id] = h; });
  items().forEach(i => { itemMap[i.id] = i; });

  function getHero(id) { return heroMap[id] || null; }
  function getItem(id) { return itemMap[id] || null; }
  function getDetail(id) { return details()[id] || null; }

  // 位置 -> 英雄列表
  function heroesByPosition(pos) {
    return heroes().filter(h => h.position === pos);
  }
  // 定位 -> 英雄列表
  function heroesByRole(role) {
    return role === '全部' ? heroes() : heroes().filter(h => h.role === role);
  }
  // 排序
  function sortHeroes(list, by) {
    const key = { 热度: 'hotness', 胜率: 'winrate', 出场率: 'pickrate' }[by] || 'hotness';
    return [...list].sort((a, b) => b[key] - a[key]);
  }

  /* ---------------- 模糊搜索 ---------------- */
  // 子序列匹配打分：query 中每个字符需按顺序出现在 text 中，越靠前、越连续得分越高
  function fuzzyScore(query, text) {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    if (q === t) return 1000;
    let score = 0, ti = 0, matched = 0, last = -2;
    for (let i = 0; i < q.length; i++) {
      const idx = t.indexOf(q[i], ti);
      if (idx === -1) return -1;               // 匹配失败
      score += 100 - idx * 2;
      if (idx === last + 1) score += 30;       // 连续命中加分
      last = idx; ti = idx + 1; matched++;
    }
    return score + (matched / t.length) * 50;
  }

  /**
   * 全站搜索（英雄 + 装备）
   * @param {string} q 关键字
   * @returns {{heroes:Array, items:Array}} 按相关度排序的结果
   */
  function globalSearch(q) {
    q = (q || '').trim();
    if (!q) return { heroes: [], items: [] };
    const resH = [];
    heroes().forEach(h => {
      const s = Math.max(fuzzyScore(q, h.name), fuzzyScore(q, h.title));
      if (s >= 40) resH.push({ score: s, item: h });
    });
    const resI = [];
    items().forEach(i => {
      const s = fuzzyScore(q, i.name);
      if (s >= 40) resI.push({ score: s, item: i });
    });
    resH.sort((a, b) => b.score - a.score);
    resI.sort((a, b) => b.score - a.score);
    return { heroes: resH.slice(0, 6).map(r => r.item), items: resI.slice(0, 5).map(r => r.item) };
  }

  // 装备分类名 -> 该分类装备
  function itemsByCategory(cat) {
    return cat === '全部' ? items() : items().filter(i => i.category === cat);
  }

  /* ---------------- 定位模板攻略（无完整详情英雄的兜底） ---------------- */
  // 六维默认值（输出/生存/控制/机动/辅助/难度）
  const ROLE_STATS = {
    坦克: [45, 95, 75, 40, 60, 40], 战士: [80, 70, 50, 60, 30, 55],
    法师: [88, 45, 70, 45, 45, 55], 射手: [92, 40, 40, 55, 25, 45],
    刺客: [90, 50, 45, 90, 25, 80], 辅助: [50, 75, 65, 55, 92, 45]
  };
  // 定位 -> 通用出装/铭文/连招/思路
  const ROLE_TEMPLATE = {
    坦克: {
      items: ["dikangzhixue", "hongliandoupeng", "jihanfengbao", "monvdoupeng", "bazhezhongzhuang", "xianzhedebi"],
      rune: { red: "宿命×10", blue: "调和×10", green: "虚空×10", effect: "生命、回血、冷却兼备" },
      combo: ["进场吸收伤害", "技能控制留人", "保护队友撤退", "残血利用免伤拉扯"],
      tips: "坦克核心是吸收伤害与开团，团战走在最前，用控制打断敌方突进，保 C 位是首要任务。"
    },
    战士: {
      items: ["dikangzhixue", "anyingzhanshou", "baoliezhiyi", "pojun", "mingdaosiming", "xianzhedebi"],
      rune: { red: "异变×10", blue: "隐匿×10", green: "鹰眼×10", effect: "物攻、物穿兼备" },
      combo: ["技能突进切C", "强化普攻爆发", "技能拉扯换血", "劣势脱战回血"],
      tips: "战士要把握切入时机，半肉出装保证进场后能站住，切 C 与抗伤兼顾。"
    },
    法师: {
      items: ["lengjingzhixue", "huixiangzhizhang", "boxuezhenu", "xuwufazhang", "xianzheshushu", "huiyue"],
      rune: { red: "梦魇×10", blue: "狩猎×10", green: "献祭×10", effect: "法强、冷却兼备" },
      combo: ["控制技能命中", "爆发技能连招", "走位拉开", "被切辉月保命"],
      tips: "法师核心是技能命中率，蹲草与预判是灵魂，团战站后排，被刺客切入用辉月保命。"
    },
    射手: {
      items: ["jisuzhanxue", "moshou", "wujinzhanren", "yingren", "poxiao", "xianzhedebi"],
      rune: { red: "红月×10", blue: "夺萃×10", green: "鹰眼×10", effect: "攻速、吸血、物穿" },
      combo: ["射程风筝消耗", "被动叠满输出", "被切交保命", "持续走A拉扯"],
      tips: "射手是团队输出核心，走A风筝与站位是生命线，永远站坦克身后，被切优先保命。"
    },
    刺客: {
      items: ["dikangzhixue", "tanlanzhishi", "anyingzhanshou", "pojun", "suixingchui", "mingdaosiming"],
      rune: { red: "异变×10", blue: "隐匿×10", green: "鹰眼×10", effect: "物攻、物穿兼备" },
      combo: ["找机会切入", "爆发技能连招", "秒掉脆皮", "技能离场"],
      tips: "刺客打的是节奏与切入时机，团战边缘等待，进场目标锁定敌方脆皮，打完果断离场。"
    },
    辅助: {
      items: ["lengjingzhixue", "jiyin", "shengbei", "shizhiyuyan", "monvdoupeng", "bazhezhongzhuang"],
      rune: { red: "梦魇×10", blue: "调和×10", green: "怜悯×10", effect: "法强、生命、冷却" },
      combo: ["视野探草", "控制/奶量保护", "团战保C", "撤退拉扯"],
      tips: "辅助是团队的视野与保护核心，探视野、保 C 位、控节奏，控制与奶量要看准时机。"
    }
  };

  /**
   * 获取英雄攻略（含模板兜底）
   * 有完整详情则返回详情数据；否则用定位模板生成通用攻略。
   */
  function guideFor(hero) {
    const d = getDetail(hero.id);
    if (d) return { ...d, _template: false };
    const t = ROLE_TEMPLATE[hero.role] || ROLE_TEMPLATE.战士;
    const [output, survive, control, mobility, support, difficulty] = ROLE_STATS[hero.role] || ROLE_STATS.战士;
    return {
      _template: true,
      stats: { output, survive, control, mobility, support, difficulty },
      builds: [{
        name: "模板通用出装", tag: "定位通用",
        items: t.items.slice(0, 6),
        core: "根据英雄定位生成的通用出装，保证基础属性均衡。",
        when: "通用对局，若已有详细数据请以英雄详情页为准。",
        tips: t.tips
      }],
      runes: [{ name: "模板通用铭文", tag: "定位通用", red: t.rune.red, blue: t.rune.blue, green: t.rune.green, effect: t.rune.effect, when: "通用对局。" }],
      combos: [{ name: "定位基础连招", tag: "模板", steps: t.combo, tips: t.tips, when: "通用对局。" }],
      strategy: {
        opening: t.tips,
        laning: t.tips,
        teamfight: t.tips,
        comeback: t.tips
      },
      counterGood: [], counterBad: [],
      rank: { tier: hero.tier, winrate: hero.winrate, pickrate: hero.pickrate, bestRanks: [] }
    };
  }

  /* ---------------- 位置 / 定位常量 ---------------- */
  const POSITIONS = ['对抗路', '中路', '发育路', '游走', '打野'];
  const ROLES = ['全部', '坦克', '战士', '法师', '射手', '刺客', '辅助'];

  return {
    heroes, details, items, tiers, season,
    getHero, getItem, getDetail,
    heroesByPosition, heroesByRole, sortHeroes,
    globalSearch, fuzzyScore,
    itemsByCategory, guideFor,
    POSITIONS, ROLES
  };
})();
