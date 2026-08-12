/**
 * components.js —— 全局共享组件
 * 负责渲染：导航栏、页脚、AI 聊天悬浮入口，并触发搜索模块初始化。
 *
 * 约定：每个页面在加载本文件前定义
 *   window.PAGE       当前页标识（home / hero / hero-detail / items / tier / counter）
 *   window.BASE_PATH  相对根目录路径（首页为 ''，pages 下为 '../'）
 */
window.WQK = window.WQK || {};
window.WQK.components = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const BASE = window.BASE_PATH || '';
  const PAGE = window.PAGE || 'home';

  // 导航菜单配置
  const MENU = [
    { id: 'home',         label: '首页',     href: BASE + 'index.html' },
    { id: 'hero',         label: '英雄百科', href: BASE + 'pages/hero.html' },
    { id: 'items',        label: '装备百科', href: BASE + 'pages/items.html' },
    { id: 'tier',         label: '英雄梯度', href: BASE + 'pages/tier.html' },
    { id: 'counter',      label: '克制查询', href: BASE + 'pages/counter.html' },
    { id: 'compare',      label: '英雄对比', href: BASE + 'pages/compare.html' }
  ];

  /* ---------------- 导航栏 ---------------- */
  function renderNav() {
    const host = document.getElementById('navbar');
    if (!host) return;

    const links = MENU.map(m =>
      utils.el('a', { class: 'nav-link' + (m.id === PAGE ? ' active' : ''), href: m.href, text: m.label })
    );
    const searchBox = utils.el('div', { class: 'nav-search' }, [
      utils.el('span', { class: 'search-ico', html: '🔍' }),
      utils.el('input', { class: 'search-input', id: 'global-search', type: 'text', placeholder: '搜索英雄 / 装备…', autocomplete: 'off' }),
      utils.el('div', { class: 'search-drop', id: 'search-drop' })
    ]);

    const nav = utils.el('header', { class: 'nav' }, [
      utils.el('div', { class: 'container nav-inner' }, [
        utils.el('a', { class: 'nav-logo', href: BASE + 'index.html' }, [
          utils.el('span', { class: 'brand-tag', text: '抖音：呃呃呃不知道叫什么' }),
          utils.el('img', { src: BASE + 'images/logo.svg', alt: 'logo' }),
          utils.el('span', { html: '王者<b>百科</b><span class="hide-sm" style="font-size:11px;color:var(--text-3);margin-left:6px;font-weight:400">S36</span>' })
        ]),
        utils.el('nav', { class: 'nav-links' }, links),
        searchBox,
        utils.el('button', { class: 'nav-burger', id: 'nav-burger', text: '☰' })
      ])
    ]);

    // 移动端抽屉
    const drawer = utils.el('div', { class: 'nav-drawer', id: 'nav-drawer' }, [
      utils.el('div', { class: 'nav-drawer-box' }, [
        utils.el('span', { class: 'brand-tag', style: 'align-self:flex-start;margin:0 10px 12px', text: '抖音：呃呃呃不知道叫什么' }),
        utils.el('div', { style: 'display:flex;align-items:center;gap:10px;padding:6px 10px 18px;font-weight:800;font-size:17px', html: '王者<b style="color:var(--gold)">百科</b>' }),
        ...MENU.map(m => utils.el('a', { class: m.id === PAGE ? 'active' : '', href: m.href, text: m.label })),
        utils.el('div', { style: 'margin-top:auto;color:var(--text-3);font-size:12px;padding:10px', text: '纯前端离线百科 · 一键上分' })
      ])
    ]);

    host.appendChild(nav);
    host.appendChild(drawer);

    // 抽屉开关
    const burger = document.getElementById('nav-burger');
    const dd = document.getElementById('nav-drawer');
    burger.addEventListener('click', () => dd.classList.add('show'));
    dd.addEventListener('click', (e) => { if (e.target === dd) dd.classList.remove('show'); });

    // 初始化全局搜索
    if (window.WQK.search) window.WQK.search.init();
  }

  /* ---------------- 页脚 ---------------- */
  function renderFooter() {
    const host = document.getElementById('footer');
    if (!host) return;
    const year = new Date().getFullYear();
    host.appendChild(utils.el('footer', { class: 'footer' }, [
      utils.el('div', { class: 'container' }, [
        utils.el('div', { html: '王者<b class="text-gold">百科</b> · 纯前端离线教学网站' }),
        utils.el('div', { text: `© ${year} 王者百科 · 数据仅供学习参考 · 英雄与装备数据以游戏内为准` })
      ])
    ]));
  }

  /* ---------------- 页面入口 ---------------- */
  function init() {
    renderNav();
    renderFooter();
    if (window.WQK.aiChat) window.WQK.aiChat.init();
  }

  // DOM ready 后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { renderNav, renderFooter, init };
})();
