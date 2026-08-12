/**
 * compare.js —— 英雄对比工具页
 * 功能：双英雄选择器 + 关键数据并排 + 六维雷达叠加 + 对位提示。
 * 复用共享 hero-picker 与 ai-chat 的 analyzeMatchup。
 * 支持 ?a=英雄id&b=英雄id URL 直达对比。
 */
window.WQK = window.WQK || {};
window.WQK.compare = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;
  const ai = window.WQK.aiChat;
  const heroPicker = window.WQK.heroPicker;

  let a = null, b = null, chart = null;

  /* ---------------- 头部双卡 ---------------- */
  function heroHeader(h) {
    const badges = [
      utils.el('span', { class: 'badge badge-' + utils.roleClass(h.role), text: h.role }),
      utils.el('span', { class: 'badge badge-tier-' + (h.tier || 'T3').toLowerCase(), text: h.tier || 'T3' }),
      utils.el('span', { class: 'badge badge-tag', text: h.position })
    ];
    const cells = [
      { l: '胜率', v: utils.fmtNum(h.winrate) + '%', c: 'var(--green)' },
      { l: '出场率', v: utils.fmtNum(h.pickrate) + '%', c: 'var(--blue)' },
      { l: '难度', v: h.difficulty + '/10', c: 'var(--gold)' },
      { l: '热度', v: utils.fmtNum(h.hotness), c: 'var(--text-2)' }
    ].map(s => utils.el('div', { style: 'text-align:center;padding:10px 6px;border-radius:10px;background:var(--tint);border:1px solid var(--border)' }, [
      utils.el('div', { class: 'fw-800', style: 'color:' + s.c, text: s.v }),
      utils.el('div', { class: 'text-dim', style: 'font-size:11px', text: s.l })
    ]));
    return utils.el('div', { class: 'card card-pad' }, [
      utils.el('div', { class: 'flex items-center gap-3 flex-wrap' }, [
        utils.el('img', { src: utils.heroAvatar(h, 68), style: 'width:68px;height:68px;border-radius:16px;box-shadow:var(--glow-gold)', alt: h.name }),
        utils.el('div', { style: 'min-width:0' }, [
          utils.el('div', { class: 'fw-800', style: 'font-size:18px', html: h.name + ' <span class="text-dim" style="font-size:12px;font-weight:400">' + h.title + '</span>' }),
          utils.el('div', { class: 'flex gap-2 flex-wrap', style: 'margin-top:8px' }, badges)
        ])
      ]),
      utils.el('div', { class: 'grid g-4 gap-2', style: 'margin-top:14px' }, cells)
    ]);
  }

  /* ---------------- 雷达叠加对比 ---------------- */
  function radarCard(ha, hb) {
    const ga = data.guideFor(ha), gb = data.guideFor(hb);
    const card = utils.el('div', { class: 'card card-pad', style: 'margin-top:16px' }, [
      utils.el('div', { class: 'card-title', text: '六维能力对比' }),
      utils.el('div', { id: 'compare-radar', style: 'width:100%;height:min(90vh,860px);margin-top:10px' })
    ]);
    // 图表必须等元素挂载进 DOM 后再初始化，否则容器尺寸为 0、画布无法渲染
    setTimeout(() => {
      const el = document.getElementById('compare-radar');
      if (!el || typeof echarts === 'undefined') return;
      chart = echarts.init(el);
      const draw = () => {
        const u = window.WQK.utils;
        const gold = u.cssVar('--gold', '#f5b942');
        const blue = u.cssVar('--blue', '#4a9dff');
        const text2 = u.cssVar('--text-2', '#9aa5bd');
        const lineC = u.cssVar('--border-strong', 'rgba(255,255,255,.14)');
        const areaA = u.cssVar('--tint', 'rgba(255,255,255,.05)');
        const areaB = u.cssVar('--hover', 'rgba(255,255,255,.09)');
        const goldRgb = u.cssVar('--gold-rgb', '245,185,66');
        const blueRgb = u.cssVar('--blue-rgb', '74,157,255');
        const indicator = [
          { name: '输出', max: 100 }, { name: '生存', max: 100 }, { name: '控制', max: 100 },
          { name: '机动', max: 100 }, { name: '辅助', max: 100 }, { name: '难度', max: 100 }
        ];
        chart.setOption({
          // 图例置于底部，雷达本体真正上下左右居中并放大到容器内最大值
          legend: { data: [ha.name, hb.name], textStyle: { color: text2, fontSize: 14 }, bottom: 0, left: 'center', itemGap: 28, itemWidth: 16, itemHeight: 12 },
          tooltip: { trigger: 'item' },
          radar: { indicator, radius: '74%', center: ['50%', '50%'], splitArea: { areaStyle: { color: [areaA, areaB] } }, axisLine: { lineStyle: { color: lineC } }, splitLine: { lineStyle: { color: lineC } }, axisName: { color: text2, fontSize: 14 } },
          series: [{
            type: 'radar',
            data: [
              { value: [ga.stats.output, ga.stats.survive, ga.stats.control, ga.stats.mobility, ga.stats.support, ga.stats.difficulty], name: ha.name, areaStyle: { color: 'rgba(' + goldRgb + ',.28)' }, lineStyle: { color: gold, width: 2 }, itemStyle: { color: gold } },
              { value: [gb.stats.output, gb.stats.survive, gb.stats.control, gb.stats.mobility, gb.stats.support, gb.stats.difficulty], name: hb.name, areaStyle: { color: 'rgba(' + blueRgb + ',.28)' }, lineStyle: { color: blue, width: 2 }, itemStyle: { color: blue } }
            ]
          }]
        }, true);
      };
      draw();
      window.addEventListener('resize', () => chart && chart.resize());
      window.addEventListener('wqk-themechange', draw);
    }, 0);
    return card;
  }

  /* ---------------- 渲染结果 ---------------- */
  function run() {
    const root = document.getElementById('compare-result');
    const aId = a && a.selected, bId = b && b.selected;
    if (!aId || !bId) {
      root.innerHTML = '';
      root.appendChild(utils.el('div', { class: 'empty', style: 'padding:30px' }, [
        utils.el('div', { class: 'ico', text: '👆' }),
        utils.el('p', { text: '请先选择两位英雄再对比～' })
      ]));
      return;
    }
    const ha = data.getHero(aId), hb = data.getHero(bId);
    if (!ha || !hb) return;
    root.innerHTML = '';

    // 双卡并排
    root.appendChild(utils.el('div', { class: 'grid g-2 gap-4' }, [heroHeader(ha), heroHeader(hb)]));

    // 雷达对比
    root.appendChild(radarCard(ha, hb));

    // 对位提示
    const m = ai.analyzeMatchup(ha, hb);
    root.appendChild(utils.el('div', { class: 'card card-pad', style: 'margin-top:16px' }, [
      utils.el('div', { class: 'card-title', text: '⚔️ 对位提示' }),
      utils.el('p', { class: 'text-sub', style: 'margin-top:8px;font-weight:700', html: m.verdictEmoji + ' ' + m.verdict + '（' + m.aRole + ' vs ' + m.bRole + '）' }),
      utils.el('p', { class: 'text-sub', style: 'margin-top:6px;line-height:1.75', text: m.fight })
    ]));

    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    a = heroPicker.create(document.getElementById('picker-a'), '英雄 A', () => {});
    b = heroPicker.create(document.getElementById('picker-b'), '英雄 B', () => {});
    document.getElementById('compare-btn').addEventListener('click', run);

    // ?a=&b= URL 直达对比（详情页/搜索联动）
    const pa = utils.getParam('a'), pb = utils.getParam('b');
    if (pa) a.select(pa);
    if (pb) b.select(pb);
    if (pa && pb) setTimeout(run, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
