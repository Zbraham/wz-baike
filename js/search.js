/**
 * search.js —— 全局模糊搜索
 * 功能：输入实时联想（英雄 + 装备分组展示），回车跳转首个英雄，
 *       点击结果跳转到对应详情页（跨页可带 ?search= 参数）。
 */
window.WQK = window.WQK || {};
window.WQK.search = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;
  const BASE = window.BASE_PATH || '';

  function heroUrl(id) { return BASE + 'pages/hero-detail.html?id=' + encodeURIComponent(id); }

  /* 渲染下拉列表 */
  function renderDrop(input, box, q) {
    const res = data.globalSearch(q);
    box.innerHTML = '';
    if (!res.heroes.length && !res.items.length) {
      box.appendChild(utils.el('div', { class: 'search-empty', text: '没有找到「' + q + '」相关结果' }));
      box.classList.add('show');
      return;
    }
    if (res.heroes.length) {
      const g = utils.el('div', { class: 'search-group' }, [utils.el('div', { class: 'search-group-h', text: '英雄' })]);
      res.heroes.forEach(h => {
        g.appendChild(utils.el('div', { class: 'search-item', 'data-url': heroUrl(h.id) }, [
          utils.el('img', { src: utils.heroAvatar(h, 30), alt: h.name }),
          utils.el('div', {}, [
            utils.el('div', { class: 'nm', text: h.name }),
            utils.el('div', { class: 'tl', text: `${h.title} · ${h.role}` })
          ])
        ]));
      });
      box.appendChild(g);
    }
    if (res.items.length) {
      const g = utils.el('div', { class: 'search-group' }, [utils.el('div', { class: 'search-group-h', text: '装备' })]);
      res.items.forEach(i => {
        g.appendChild(utils.el('div', { class: 'search-item', 'data-url': BASE + 'pages/items.html?item=' + encodeURIComponent(i.id) }, [
          utils.el('img', { src: utils.itemIcon(i, 30), alt: i.name }),
          utils.el('div', {}, [
            utils.el('div', { class: 'nm', text: i.name }),
            utils.el('div', { class: 'tl', text: `${i.category} · ${i.price} 金币` })
          ])
        ]));
      });
      box.appendChild(g);
    }
    box.classList.add('show');

    // 点击跳转
    box.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', () => { window.location.href = item.dataset.url; });
    });
  }

  function init() {
    const input = document.getElementById('global-search');
    const box = document.getElementById('search-drop');
    if (!input || !box) return;

    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim();
      timer = setTimeout(() => {
        if (!q) { box.classList.remove('show'); return; }
        renderDrop(input, box, q);
      }, 120);
    });

    // 回车跳转首个英雄结果
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        const res = data.globalSearch(q);
        if (res.heroes.length) window.location.href = heroUrl(res.heroes[0].id);
        else if (res.items.length) window.location.href = BASE + 'pages/items.html?item=' + encodeURIComponent(res.items[0].id);
      }
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search')) box.classList.remove('show');
    });
    input.addEventListener('focus', () => {
      if (input.value.trim()) renderDrop(input, box, input.value.trim());
    });
  }

  return { init };
})();
