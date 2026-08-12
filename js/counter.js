/**
 * counter.js —— 克制查询工具页
 * 功能：两个可搜索的英雄选择器 + 一键生成对位分析。
 * 分析逻辑复用 ai-chat.js 的 analyzeMatchup（单一知识源）。
 * 支持 ?hero=英雄id 预选「我的英雄」（详情页/搜索跳转联动）。
 */
window.WQK = window.WQK || {};
window.WQK.counter = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;
  const ai = window.WQK.aiChat;

  const pickers = { a: null, b: null };
  const heroPicker = window.WQK.heroPicker; // 共享可搜索英雄选择器

  /* ---------------- 结果渲染 ---------------- */
  function renderResult(aId, bId) {
    const a = data.getHero(aId), b = data.getHero(bId);
    const root = document.getElementById('counter-result');
    if (!a || !b) return;
    const m = ai.analyzeMatchup(a, b);

    const scoreCls = m.score >= 1 ? 'win' : (m.score === 0 ? 'even' : 'lose');
    const verdictBlock = utils.el('div', { class: 'result-verdict animate-in' }, [
      utils.el('div', { style: 'text-align:center' }, [
        utils.el('img', { src: utils.heroAvatar(a, 76), style: 'width:76px;height:76px;border-radius:20px', alt: a.name }),
        utils.el('div', { class: 'fw-700', style: 'margin-top:8px', text: a.name })
      ]),
      utils.el('div', { class: 'flex-center flex-col', style: 'flex:1;text-align:center' }, [
        utils.el('div', { class: 'verdict-score ' + scoreCls, text: m.verdictEmoji + ' ' + m.verdict }),
        utils.el('div', { class: 'text-dim', style: 'font-size:13px;margin-top:4px', text: a.name + '（' + m.aRole + '） vs ' + b.name + '（' + m.bRole + '）' }),
        utils.el('div', { class: 'flex gap-2 flex-wrap', style: 'justify-content:center;margin-top:10px' },
          (a.tags || []).slice(0, 2).map(t => utils.el('span', { class: 'badge badge-tag', text: a.name + '·' + t }))
          .concat((b.tags || []).slice(0, 2).map(t => utils.el('span', { class: 'badge badge-tag', text: b.name + '·' + t })))
        )
      ]),
      utils.el('div', { style: 'text-align:center' }, [
        utils.el('img', { src: utils.heroAvatar(b, 76), style: 'width:76px;height:76px;border-radius:20px', alt: b.name }),
        utils.el('div', { class: 'fw-700', style: 'margin-top:8px', text: b.name })
      ])
    ]);
    root.appendChild(verdictBlock);

    // 克制理由
    if (m.reasons.length) {
      const rWrap = utils.el('div', { style: 'margin-top:16px' });
      m.reasons.forEach(r => {
        rWrap.appendChild(utils.el('div', { class: 'card card-pad ' + (r.type === 'good' ? 'vs-good' : 'vs-bad'), style: 'margin-bottom:10px' }, [
          utils.el('div', { class: 'card-title', text: (r.type === 'good' ? '✅ ' : '⚠️ ') + r.title }),
          utils.el('p', { class: 'text-sub', style: 'margin-top:8px;white-space:pre-line', text: r.text })
        ]));
      });
      root.appendChild(rWrap);
    }

    // 四大板块
    const blocks = [
      { ico: '🎮', t: '打法建议', v: m.fight, c: '#4a9dff' },
      { ico: '🧰', t: '出装调整', v: m.build, c: '#f5b942' },
      { ico: '🛡', t: '对线注意事项', v: m.lane, c: '#2fd48b' },
      { ico: '🏰', t: '团战要点', v: m.team, c: '#ff6b5e' }
    ];
    const grid = utils.el('div', { class: 'grid g-2 gap-4', style: 'margin-top:16px' });
    blocks.forEach(bl => {
      grid.appendChild(utils.el('div', { class: 'card card-hover card-pad' }, [
        utils.el('div', { class: 'card-title', html: bl.ico + ' ' + bl.t }),
        utils.el('p', { class: 'text-sub', style: 'margin-top:10px;line-height:1.75', text: bl.v })
      ]));
    });
    root.appendChild(grid);

    // AI 深入分析入口
    root.appendChild(utils.el('div', { style: 'margin-top:18px;text-align:center' }, [
      utils.el('button', { class: 'btn btn-primary', onclick: () => ai.openAndAsk(a.name + '怎么打' + b.name), html: '🤖 用 AI 深入分析这组对位' }),
      utils.el('button', { class: 'btn btn-ghost', style: 'margin-left:10px', onclick: () => { window.location.href = 'hero-detail.html?id=' + a.id; }, text: '查看 ' + a.name + ' 详情 →' })
    ]));

    // 滚到结果
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    pickers.a = heroPicker.create(document.getElementById('picker-a'), '我的英雄', () => {});
    pickers.b = heroPicker.create(document.getElementById('picker-b'), '对面英雄', () => {});

    // 交换按钮
    const swap = utils.el('div', { style: 'display:flex;justify-content:center;margin-top:14px' }, [
      utils.el('button', { class: 'btn btn-ghost btn-sm', text: '⇄ 交换双方', onclick: () => {
        const aId = pickers.a.selected, bId = pickers.b.selected;
        pickers.a.select(bId); pickers.b.select(aId);
      }})
    ]);
    const swapHost = document.querySelector('.card-pad');
    if (swapHost) swapHost.appendChild(swap);

    document.getElementById('counter-btn').addEventListener('click', () => {
      if (!pickers.a.selected || !pickers.b.selected) {
        const root = document.getElementById('counter-result');
        root.innerHTML = '';
        root.appendChild(utils.el('div', { class: 'empty', style: 'padding:30px' }, [
          utils.el('div', { class: 'ico', text: '👆' }),
          utils.el('p', { text: '请先在两侧选择英雄再查询～' })
        ]));
        return;
      }
      document.getElementById('counter-result').innerHTML = '';
      renderResult(pickers.a.selected, pickers.b.selected);
    });

    // ?hero=xxx 预选
    const heroParam = utils.getParam('hero');
    if (heroParam) pickers.a.select(heroParam);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
