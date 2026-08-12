/**
 * theme.js —— 主题切换（深色 / 浅色 / 护眼绿 / 跟随系统）
 * ------------------------------------------------------------------
 * 主题通过 <html data-theme="dark|light|green|system"> 控制：
 *   - 深色：默认（CSS :root 基础变量）
 *   - 浅色 / 护眼绿：显式覆盖变量
 *   - 跟随系统：data-theme="system"，由 CSS 的 prefers-color-scheme 媒体查询自动适配
 * 持久化：localStorage['wqk-theme']；页面 <head> 内联脚本在样式前应用，
 *         避免刷新闪变（FOUC）。
 * 挂载：自动将「主题切换按钮 + 下拉菜单」插入导航栏右侧（汉堡按钮之前）。
 */
window.WQK = window.WQK || {};
window.WQK.theme = (function () {
  'use strict';

  const KEY = 'wqk-theme';
  const OPTIONS = [
    { v: 'system', label: '跟随系统', ico: '🌓' },
    { v: 'light',  label: '浅色模式', ico: '☀️' },
    { v: 'dark',   label: '深色模式', ico: '🌙' },
    { v: 'green',  label: '护眼绿模式', ico: '🌿' }
  ];

  let btn = null, drop = null, iconEl = null;

  /* 读取当前主题（默认 system） */
  function current() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }

  /* 应用主题：写 localStorage + 设置 html[data-theme] */
  function apply(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* 隐私模式忽略 */ }
    document.documentElement.setAttribute('data-theme', v);
    if (iconEl) iconEl.textContent = (OPTIONS.find(o => o.v === v) || OPTIONS[0]).ico;
    markActive(v);
    // 广播主题变更，供 ECharts 等需要重绘的模块监听
    try { window.dispatchEvent(new CustomEvent('wqk-themechange', { detail: v })); } catch (e) { /* 忽略 */ }
  }

  /* 下拉菜单中勾选当前项 */
  function markActive(v) {
    if (!drop) return;
    drop.querySelectorAll('.theme-opt').forEach(o => o.classList.toggle('active', o.dataset.v === v));
  }

  function close() { if (drop) drop.classList.remove('show'); }

  /* 构建按钮 + 下拉菜单 */
  function mount() {
    const nav = document.querySelector('.nav-inner');
    if (!nav) return;

    const host = document.createElement('div');
    host.className = 'theme-switch';

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    btn.id = 'theme-btn';
    btn.setAttribute('aria-label', '切换主题');
    iconEl = document.createElement('span');
    iconEl.textContent = (OPTIONS.find(o => o.v === current()) || OPTIONS[0]).ico;
    btn.appendChild(iconEl);

    drop = document.createElement('div');
    drop.className = 'theme-drop';
    drop.id = 'theme-drop';
    OPTIONS.forEach(o => {
      const opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'theme-opt';
      opt.dataset.v = o.v;
      const i = document.createElement('span'); i.textContent = o.ico;
      const t = document.createElement('span'); t.textContent = o.label;
      const ck = document.createElement('span'); ck.className = 'theme-check'; ck.textContent = '✓';
      opt.appendChild(i); opt.appendChild(t); opt.appendChild(ck);
      opt.addEventListener('click', () => { apply(o.v); close(); });
      drop.appendChild(opt);
    });
    markActive(current());

    host.appendChild(btn);
    host.appendChild(drop);

    // 插入到汉堡按钮之前（右上角）
    const burger = document.getElementById('nav-burger');
    if (burger) nav.insertBefore(host, burger);
    else nav.appendChild(host);

    // 交互
    btn.addEventListener('click', (e) => { e.stopPropagation(); drop.classList.toggle('show'); });
    document.addEventListener('click', close);

    // 跟随系统时，系统深浅变化后刷新图标（CSS 已自动换肤，这里仅同步图标）
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
    if (mq) {
      const refresh = () => { if (current() === 'system') iconEl.textContent = '🌓'; };
      if (mq.addEventListener) mq.addEventListener('change', refresh);
      else if (mq.addListener) mq.addListener(refresh);
    }
  }

  function init() {
    apply(current()); // 确保已应用持久化主题（内联脚本已提前应用，此处兜底）
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { init, apply, current };
})();
