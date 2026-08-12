/**
 * hero-list.js —— 英雄百科总页逻辑
 * 功能：定位/位置筛选、热度/胜率/出场率排序、页内搜索、URL 参数联动。
 * 支持 ?pos=对抗路 从首页位置入口直达。
 */
window.WQK = window.WQK || {};
window.WQK.heroList = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;

  // 当前筛选状态
  const state = {
    role: '全部',
    pos: '全部位置',
    sort: '热度',
    kw: ''
  };

  /* ---------------- 筛选条渲染 ---------------- */
  function renderRoleFilter() {
    const host = document.getElementById('role-filter');
    host.appendChild(utils.el('span', { class: 'text-dim', style: 'font-size:13px;margin-right:4px', text: '定位' }));
    data.ROLES.forEach(r => {
      const chip = utils.el('button', { class: 'chip' + (state.role === r ? ' active' : ''), text: r, onclick: () => setRole(r) });
      host.appendChild(chip);
    });
  }

  function renderPosFilter() {
    const host = document.getElementById('pos-filter');
    host.appendChild(utils.el('span', { class: 'text-dim', style: 'font-size:13px;margin-right:4px', text: '位置' }));
    ['全部位置'].concat(data.POSITIONS).forEach(p => {
      const chip = utils.el('button', { class: 'chip' + (state.pos === p ? ' active' : ''), text: p, onclick: () => setPos(p) });
      host.appendChild(chip);
    });
  }

  function setRole(r) {
    state.role = r;
    document.querySelectorAll('#role-filter .chip').forEach((c, i) => c.classList.toggle('active', i === data.ROLES.indexOf(r)));
    render();
  }
  function setPos(p) {
    state.pos = p;
    document.querySelectorAll('#pos-filter .chip').forEach((c, i) => c.classList.toggle('active', i === ['全部位置'].concat(data.POSITIONS).indexOf(p)));
    render();
  }

  /* ---------------- 主渲染 ---------------- */
  function render() {
    const grid = document.getElementById('hero-grid');
    const empty = document.getElementById('hero-empty');
    const count = document.getElementById('hero-count');

    let list = data.heroesByRole(state.role);
    if (state.pos !== '全部位置') list = list.filter(h => h.position === state.pos);
    if (state.kw) {
      const kw = state.kw.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(kw) || h.title.toLowerCase().includes(kw));
    }
    list = data.sortHeroes(list, state.sort);

    grid.innerHTML = '';
    list.forEach(h => grid.appendChild(utils.heroCard(h)));
    empty.classList.toggle('hidden', list.length > 0);
    count.textContent = '共 ' + list.length + ' 位英雄';
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    renderRoleFilter();
    renderPosFilter();

    // URL 参数：?pos= 位置 直达
    const posParam = utils.getParam('pos');
    if (posParam && data.POSITIONS.includes(posParam)) setPos(posParam);

    const total = document.getElementById('hero-total');
    if (total) total.textContent = data.heroes().length;

    document.getElementById('sort-select').addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });
    document.getElementById('kw-input').addEventListener('input', (e) => {
      state.kw = e.target.value;
      render();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
