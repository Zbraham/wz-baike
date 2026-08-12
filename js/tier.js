/**
 * tier.js —— 英雄梯度页逻辑
 * 功能：图例 / 位置切换 / 按 T0-T3 分组展示梯度榜单（强势原因·版本优势·短板·适配段位）。
 */
window.WQK = window.WQK || {};
window.WQK.tier = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;
  const BASE = window.BASE_PATH || '';

  let activePos = data.POSITIONS[0];

  const TIER_META = [
    { t: 'T0', name: '版本霸主', desc: '当前版本最强，上分首选', cls: 'badge-tier-t0' },
    { t: 'T1', name: '强势上分', desc: '版本强势，稳定性高', cls: 'badge-tier-t1' },
    { t: 'T2', name: '常规可玩', desc: '有强度但需要熟练度', cls: 'badge-tier-t2' },
    { t: 'T3', name: '冷门/绝活', desc: '特定阵容或绝活哥专属', cls: 'badge-tier-t3' }
  ];

  /* ---------------- 图例 ---------------- */
  function renderLegend() {
    const host = document.getElementById('tier-legend');
    TIER_META.forEach(m => {
      host.appendChild(utils.el('div', { class: 'flex items-center gap-3', style: 'padding:10px 14px;border-radius:12px;background:var(--tint);border:1px solid var(--border)' }, [
        utils.el('span', { class: 'badge ' + m.cls, style: 'font-size:14px;padding:5px 14px', text: m.t }),
        utils.el('div', {}, [
          utils.el('div', { class: 'fw-600 text-sm', text: m.name }),
          utils.el('div', { class: 'text-dim', style: 'font-size:11.5px', text: m.desc })
        ])
      ]));
    });
  }

  /* ---------------- 位置切换 ---------------- */
  function renderPosTabs() {
    const host = document.getElementById('pos-tabs');
    data.POSITIONS.forEach(p => {
      const chip = utils.el('button', { class: 'chip' + (p === activePos ? ' active' : ''), text: p, onclick: () => {
        activePos = p;
        host.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('active', i === data.POSITIONS.indexOf(p)));
        renderTiers();
      }});
      host.appendChild(chip);
    });
  }

  /* ---------------- 梯度列表 ---------------- */
  function renderTiers() {
    const root = document.getElementById('tier-root');
    root.innerHTML = '';
    const posData = data.tiers()[activePos] || [];

    if (!posData.length) {
      root.appendChild(utils.el('div', { class: 'empty', html: '<div class="ico">🏆</div><p>该位置梯度数据整理中</p>' }));
      return;
    }

    posData.forEach(group => {
      const tier = group.tier;
      const meta = TIER_META.find(m => m.t === tier) || TIER_META[2];
      const heroes = group.heroes || [];

      const sec = utils.el('div', { style: 'margin-bottom:18px' }, [
        // 分组标题
        utils.el('div', { class: 'flex items-center gap-3', style: 'margin:0 0 10px' }, [
          utils.el('span', { class: 'badge ' + meta.cls, style: 'font-size:15px;padding:5px 16px', text: tier + '  ' + meta.name }),
          utils.el('span', { class: 'text-dim', style: 'font-size:12.5px', text: heroes.length + ' 位英雄 · ' + meta.desc })
        ]),
        // 英雄行
        utils.el('div', {}, heroes.map(h => tierRow(tier, h)))
      ]);
      root.appendChild(sec);
    });
  }

  function tierRow(tier, entry) {
    const h = data.getHero(entry.id);
    if (!h) return utils.el('div', {});
    const cls = 'tier-' + tier.toLowerCase();
    return utils.el('div', { class: 'tier-row card-hover', onclick: () => { window.location.href = BASE + 'pages/hero-detail.html?id=' + h.id; } }, [
      utils.el('div', { class: 'tier-badge ' + cls, text: tier }),
      utils.el('div', { class: 'tier-card' }, [
        utils.el('div', { class: 'flex items-center gap-3 flex-wrap' }, [
          utils.el('img', { src: utils.heroAvatar(h, 40), style: 'width:40px;height:40px;border-radius:10px', alt: h.name }),
          utils.el('div', {}, [
            utils.el('div', { class: 'nm', text: h.name }),
            utils.el('div', { class: 'tl', text: h.title + ' · ' + h.role + ' · ' + h.position })
          ]),
          utils.el('div', { style: 'margin-left:auto' }, (h.tags || []).slice(0, 2).map(t => utils.el('span', { class: 'badge badge-tag', text: t })))
        ]),
        utils.el('div', { class: 'tier-tags' }, [
          entry.reason ? utils.el('span', { class: 'badge badge-tag', html: '🔥 强势原因：' + entry.reason }) : null,
          entry.advantage ? utils.el('span', { class: 'badge badge-tag', html: '⚡ 版本优势：' + entry.advantage }) : null,
          entry.flaw ? utils.el('span', { class: 'badge badge-tag', html: '⚠️ 短板：' + entry.flaw }) : null,
          entry.ranks ? utils.el('span', { class: 'badge badge-gold', html: '🏅 适配：' + entry.ranks }) : null
        ])
      ])
    ]);
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    renderLegend();
    renderPosTabs();
    renderTiers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
