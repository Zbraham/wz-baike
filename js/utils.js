/**
 * utils.js —— 全局工具库
 * 提供：SVG 头像/装备图标生成、DOM 快捷操作、格式化、颜色映射。
 * 全站共享，先于其他脚本加载。
 */
window.WQK = window.WQK || {};
window.WQK.utils = (function () {
  'use strict';

  /* ---------------- 角色配色 ---------------- */
  // 每个定位的主/辅色，用于头像渐变与全局强调色
  const ROLE_COLORS = {
    坦克:   { a: '#8fa3bd', b: '#4a5a75', glow: '#8fa3bd' },
    战士:   { a: '#ff7a5e', b: '#c23a4e', glow: '#ff6b5e' },
    法师:   { a: '#7aa2ff', b: '#5a4fd8', glow: '#5a9dff' },
    射手:   { a: '#ffd06e', b: '#e08a2e', glow: '#f5b942' },
    刺客:   { a: '#c79bff', b: '#6a4bbf', glow: '#a86bff' },
    辅助:   { a: '#58e0a4', b: '#1f9e7a', glow: '#2fd48b' }
  };
  // 装备分类配色
  const ITEM_COLORS = {
    物理:     { a: '#ff8a7a', b: '#b0413e' },
    法术:     { a: '#8aa6ff', b: '#4a52c8' },
    防御:     { a: '#aab8c8', b: '#5a6a80' },
    游走:     { a: '#58e0a4', b: '#1f9e7a' },
    打野:     { a: '#ffb44d', b: '#b0692e' },
    攻速暴击: { a: '#ff6b5e', b: '#d04a3a' }
  };
  /* ---------------- 简易字符串哈希（为颜色微调提供确定性差异） ---------------- */
  function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return h;
  }

  /* ---------------- 英雄头像 SVG ---------------- */
  // 生成圆形渐变头像，中央为英雄名首字
  function heroAvatar(hero, size) {
    const c = ROLE_COLORS[hero.role] || ROLE_COLORS.战士;
    const ch = hero.name.charAt(0);
    const hueShift = hashStr(hero.id) % 14 - 7; // 同定位内微调色相，避免千篇一律
    const a = shade(c.a, hueShift), b = shade(c.b, hueShift);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>` +
      `</linearGradient></defs>` +
      `<rect width="100" height="100" rx="26" fill="url(#g)"/>` +
      `<circle cx="78" cy="20" r="26" fill="#ffffff" opacity="0.10"/>` +
      `<text x="50" y="50" dy="14" font-size="52" font-weight="800" fill="#fff" text-anchor="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">${ch}</text>` +
      `<rect x="8" y="88" width="84" height="5" rx="2.5" fill="#000" opacity="0.18"/>` +
      `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // 装备小图标（方块 + 分类色 + 名称首字）
  function itemIcon(item, size) {
    const c = ITEM_COLORS[item.category] || ITEM_COLORS.防御;
    const ch = item.name.charAt(0);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
      `<defs><linearGradient id="i" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/>` +
      `</linearGradient></defs>` +
      `<rect width="100" height="100" rx="24" fill="url(#i)"/>` +
      `<circle cx="80" cy="18" r="24" fill="#fff" opacity="0.12"/>` +
      `<text x="50" y="50" dy="15" font-size="54" font-weight="800" fill="#fff" text-anchor="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">${ch}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // 技能图标（圆形，蓝渐变 + 技能键名）
  function skillIcon(key) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 100 100">` +
      `<defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#5aa6ff"/><stop offset="1" stop-color="#2f6cf5"/>` +
      `</linearGradient></defs>` +
      `<circle cx="50" cy="50" r="46" fill="url(#s)"/>` +
      `<circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="3"/>` +
      `<text x="50" y="50" dy="16" font-size="46" font-weight="800" fill="#fff" text-anchor="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">${key}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // 通用字符图标（用于未匹配英雄/装备）
  function charIcon(text, a, b) {
    const ch = (text || '?').charAt(0);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">` +
      `<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${a||'#5aa6ff'}"/><stop offset="1" stop-color="${b||'#2f6cf5'}"/>` +
      `</linearGradient></defs>` +
      `<rect width="100" height="100" rx="24" fill="url(#c)"/>` +
      `<text x="50" y="50" dy="15" font-size="50" font-weight="800" fill="#fff" text-anchor="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">${ch}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------------- 颜色微调工具 ---------------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  /* ---------------- DOM 快捷工具 ---------------- */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      });
    }
    // children 兼容：单个节点 / 字符串 / 数组，并自动展平一层嵌套数组
    const list = [];
    const flat = (x) => {
      if (x == null) return;
      if (Array.isArray(x)) { x.forEach(flat); return; }
      list.push(x);
    };
    flat(children);
    list.forEach(c => { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  /* ---------------- 格式化 ---------------- */
  function fmtNum(n) { return (n == null ? '--' : (Number(n) % 1 === 0 ? n : n.toFixed(1))); }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // 获取 URL 查询参数（页面间传英雄 id 用）
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  // 读取 CSS 变量当前值（主题感知，供 ECharts 等 canvas 图表使用）
  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback || '';
    } catch (e) { return fallback || ''; }
  }

  /* ---------------- 共享英雄卡片 ---------------- */
  // 首页「本周强势」与英雄百科网格复用。返回 DOM 元素，点击跳转详情页。
  function heroCard(hero, opts) {
    opts = opts || {};
    const BASE = window.BASE_PATH || '';
    const roleColor = (ROLE_COLORS[hero.role] || ROLE_COLORS.战士).glow;

    const badges = [
      el('span', { class: 'badge badge-' + roleClass(hero.role), text: hero.role }),
      el('span', { class: 'badge badge-tier-' + (hero.tier || 'T3').toLowerCase(), text: hero.tier || 'T3' })
    ];
    (hero.tags || []).slice(0, opts.maxTags || 2).forEach(t => {
      badges.push(el('span', { class: 'badge badge-tag', text: t }));
    });

    const wr = Number(hero.winrate) || 0;
    const wrClass = wr >= 50.5 ? 'gold' : (wr >= 49 ? 'blue' : '');
    const card = el('div', {
      class: 'card hero-card' + (opts.plain ? '' : ' card-hover'),
      style: '--hc:' + roleColor,
      onclick: () => { window.location.href = BASE + 'pages/hero-detail.html?id=' + encodeURIComponent(hero.id); }
    }, [
      el('div', { class: 'flex', style: 'align-items:flex-start;gap:12px' }, [
        el('img', { class: 'hero-avatar', src: heroAvatar(hero, 64), alt: hero.name }),
        el('div', { style: 'min-width:0' }, [
          el('div', { class: 'nm ellipsis', text: hero.name }),
          el('div', { class: 'tl ellipsis', text: hero.title })
        ])
      ]),
      el('div', { class: 'meta' }, badges),
      el('div', { class: 'wr-line' }, [
        el('span', { text: '胜率' }),
        el('div', { class: 'wr-bar' }, [el('div', { class: 'wr-fill ' + wrClass, style: 'width:' + Math.min(100, wr) + '%' })]),
        el('span', { class: 'text-gold fw-600', text: wr.toFixed(1) + '%' })
      ])
    ]);
    return card;
  }

  // 定位 -> CSS 徽章 class
  function roleClass(role) {
    const map = { 坦克: 'tank', 战士: 'warrior', 法师: 'mage', 射手: 'marksman', 刺客: 'assassin', 辅助: 'support' };
    return map[role] || 'tank';
  }

  return {
    heroAvatar, itemIcon, skillIcon, charIcon,
    el, fmtNum, escapeHtml, getParam, heroCard, roleClass, cssVar
  };
})();
