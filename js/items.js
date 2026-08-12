/**
 * items.js —— 装备百科页逻辑
 * 功能：分类筛选、名称搜索、卡片网格、详情弹窗（属性/被动/主动/合成路径/适配英雄）。
 * 支持 ?item=装备id 直达弹窗（全局搜索联动）。
 * 注意：模块挂载于 WQK.itemPage，避免与数据层 WQK.items 命名冲突。
 */
window.WQK = window.WQK || {};
window.WQK.itemPage = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;

  const state = { cat: '全部', kw: '' };
  const CATS = ['全部', '物理', '法术', '防御', '游走', '打野', '攻速暴击'];

  /* ---------------- 分类筛选条 ---------------- */
  function renderCatFilter() {
    const host = document.getElementById('cat-filter');
    host.appendChild(utils.el('span', { class: 'text-dim', style: 'font-size:13px;margin-right:4px', text: '分类' }));
    CATS.forEach(c => {
      const chip = utils.el('button', { class: 'chip' + (state.cat === c ? ' active' : ''), text: c, onclick: () => {
        state.cat = c;
        host.querySelectorAll('.chip').forEach((x, i) => x.classList.toggle('active', i === CATS.indexOf(c)));
        render();
      }});
      host.appendChild(chip);
    });
  }

  /* ---------------- 主渲染 ---------------- */
  function render() {
    const grid = document.getElementById('item-grid');
    const empty = document.getElementById('item-empty');
    const count = document.getElementById('item-count');

    let list = data.itemsByCategory(state.cat);
    if (state.kw) {
      const kw = state.kw.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(kw));
    }

    grid.innerHTML = '';
    list.forEach(i => grid.appendChild(itemCard(i)));
    empty.classList.toggle('hidden', list.length > 0);
    count.textContent = '共 ' + list.length + ' 件装备';
  }

  /* ---------------- 卡片 ---------------- */
  function itemCard(it) {
    const passives = (it.passives || []).map(p => utils.el('div', { class: 'text-sm', style: 'margin-top:4px', html: '<b class="text-gold">' + p.name + '</b>：' + p.desc }));
    return utils.el('div', { class: 'card card-hover item-card', onclick: () => openModal(it.id) }, [
      utils.el('div', { class: 'flex items-center gap-3' }, [
        utils.el('img', { src: utils.itemIcon(it, 52), style: 'width:52px;height:52px;border-radius:14px', alt: it.name }),
        utils.el('div', { style: 'min-width:0' }, [
          utils.el('div', { class: 'nm ellipsis', text: it.name }),
          utils.el('div', { class: 'flex gap-2', style: 'margin-top:4px' }, [
            utils.el('span', { class: 'badge badge-tag', text: it.category }),
            utils.el('span', { class: 'item-price', text: it.price + ' 金' })
          ])
        ])
      ]),
      utils.el('div', { class: 'attr' }, (it.stats || []).slice(0, 3).map(s => utils.el('div', { text: s }))),
      ...passives
    ]);
  }

  /* ---------------- 详情弹窗 ---------------- */
  function openModal(id) {
    const it = data.getItem(id);
    if (!it) return;
    const BASE = window.BASE_PATH || '';

    // 合成路径
    const compose = (it.compose || []).map(c => utils.el('span', { class: 'badge badge-tag', text: c }));

    // 适配英雄
    const heroChips = (it.heroes || []).map(hid => {
      const h = data.getHero(hid);
      return h ? utils.el('a', {
        class: 'badge badge-tag',
        style: 'padding:6px 12px;cursor:pointer',
        text: h.name,
        href: BASE + 'pages/hero-detail.html?id=' + hid
      }) : null;
    });

    const body = utils.el('div', { class: 'card card-pad', style: 'max-width:640px;width:100%;max-height:82vh;overflow-y:auto;border-radius:18px;position:relative' }, [
      utils.el('button', { class: 'ai-close', style: 'position:absolute;top:14px;right:14px', text: '✕', onclick: closeModal }),
      utils.el('div', { class: 'flex items-center gap-4 flex-wrap' }, [
        utils.el('img', { src: utils.itemIcon(it, 84), style: 'width:84px;height:84px;border-radius:20px', alt: it.name }),
        utils.el('div', {}, [
          utils.el('div', { class: 'fw-800', style: 'font-size:22px', text: it.name }),
          utils.el('div', { class: 'flex gap-2', style: 'margin-top:8px' }, [
            utils.el('span', { class: 'badge badge-blue', text: it.category }),
            utils.el('span', { class: 'badge badge-gold', text: it.price + ' 金币' }),
            it.tag ? utils.el('span', { class: 'badge badge-tag', text: it.tag }) : null
          ])
        ])
      ]),

      it.stats && it.stats.length ? utils.el('div', { style: 'margin-top:18px' }, [
        utils.el('div', { class: 'card-title', text: '基础属性' }),
        utils.el('div', { style: 'margin-top:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px' },
          it.stats.map(s => utils.el('div', { class: 'skill-kv', style: 'font-size:13px;padding:8px 12px', text: s })))
      ]) : null,

      it.passives && it.passives.length ? utils.el('div', { style: 'margin-top:16px' }, [
        utils.el('div', { class: 'card-title', text: '被动效果' }),
        ...it.passives.map(p => utils.el('div', { class: 'skill-block', style: 'margin-top:8px' }, [
          utils.el('b', { text: p.name }), utils.el('p', { text: p.desc })
        ]))
      ]) : null,

      it.active ? utils.el('div', { style: 'margin-top:16px' }, [
        utils.el('div', { class: 'card-title', text: '主动效果' }),
        utils.el('div', { class: 'skill-block', style: 'margin-top:8px' }, [
          utils.el('b', { text: it.active.name }), utils.el('p', { text: it.active.desc })
        ])
      ]) : null,

      utils.el('div', { style: 'margin-top:16px' }, [
        utils.el('div', { class: 'card-title', text: '合成路径' }),
        utils.el('div', { class: 'flex gap-2 flex-wrap', style: 'margin-top:10px' }, compose)
      ]),

      utils.el('div', { style: 'margin-top:16px' }, [
        utils.el('div', { class: 'card-title', text: '适配英雄' }),
        utils.el('div', { class: 'flex gap-2 flex-wrap', style: 'margin-top:10px' }, heroChips)
      ]),

      utils.el('div', { style: 'margin-top:16px' }, [
        utils.el('div', { class: 'card-title', text: '适用场景' }),
        utils.el('p', { class: 'text-sub', style: 'margin-top:8px;line-height:1.8', text: it.when || '—' })
      ])
    ]);

    const mask = utils.el('div', {
      style: 'position:fixed;inset:0;z-index:200;background:rgba(5,8,14,.72);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);animation:fadeIn .18s ease',
      onclick: (e) => { if (e.target === mask) closeModal(); }
    }, [body]);

    document.getElementById('modal-root').appendChild(mask);
  }

  function closeModal() {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    renderCatFilter();
    const total = document.getElementById('item-total');
    if (total) total.textContent = data.items().length;
    document.getElementById('kw-input').addEventListener('input', (e) => { state.kw = e.target.value; render(); });

    // ?item=xxx 直达弹窗
    const itemParam = utils.getParam('item');
    if (itemParam) {
      const t = setInterval(() => {
        if (document.getElementById('item-grid').children.length) {
          clearInterval(t);
          openModal(itemParam);
        }
      }, 60);
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, openModal, closeModal };
})();
