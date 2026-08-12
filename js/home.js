/**
 * home.js —— 首页逻辑
 * 渲染：赛季简介横幅 / 位置入口 / 本周强势英雄 / 功能简介 / 版本胜率图表
 */
window.WQK = window.WQK || {};
window.WQK.home = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;
  const BASE = window.BASE_PATH || '';

  /* ---------------- ① 赛季简介横幅 ---------------- */
  function renderSeason() {
    const host = document.getElementById('season-hero');
    if (!host) return;
    const s = data.season();
    const mvp = data.getHero(s.mvp && s.mvp.id);

    const sec = utils.el('section', { class: 'season-hero' }, [
      utils.el('span', { class: 'tag', html: '⚡ ' + s.version + ' · ' + (s.duration || '') }),
      utils.el('h2', { text: s.name }),
      utils.el('p', { text: s.intro }),
      utils.el('ul', { class: 'season-points' }, (s.highlights || []).map(h => utils.el('li', { text: h })))
    ]);

    // MVP 英雄卡
    if (mvp) {
      const mvpCard = utils.el('div', { class: 'card card-pad', style: 'margin-top:16px;display:flex;gap:18px;align-items:center;flex-wrap:wrap' }, [
        utils.el('img', { src: utils.heroAvatar(mvp, 72), alt: mvp.name, style: 'width:72px;height:72px;border-radius:18px;box-shadow:var(--glow-gold)' }),
        utils.el('div', { style: 'flex:1;min-width:220px' }, [
          utils.el('div', { class: 'flex-between' }, [
            utils.el('div', { class: 'fw-700', html: '本版本答案：' + mvp.name + ' <span class="text-gold" style="font-size:12px">' + mvp.tier + '</span>' }),
            utils.el('a', { class: 'btn btn-gold btn-sm', href: BASE + 'pages/hero-detail.html?id=' + mvp.id, text: '查看详情 →' })
          ]),
          utils.el('p', { class: 'text-dim', style: 'margin-top:8px', text: mvp.desc }),
          utils.el('p', { class: 'text-dim', style: 'margin-top:6px', html: '胜率 <b class="text-gold">' + utils.fmtNum(mvp.winrate) + '%</b> · 出场率 <b class="text-gold">' + utils.fmtNum(mvp.pickrate) + '%</b> · ' + (s.mvp && s.mvp.note || '') })
        ])
      ]);
      host.appendChild(sec);
      host.appendChild(mvpCard);
    } else {
      host.appendChild(sec);
    }
  }

  /* ---------------- ② 位置快速入口 ---------------- */
  const POS_CFG = [
    { pos: '对抗路', ico: '⚔️', a: '#ff7a5e', b: '#c23a4e' },
    { pos: '中路',   ico: '🔮', a: '#7aa2ff', b: '#5a4fd8' },
    { pos: '发育路', ico: '🏹', a: '#ffd06e', b: '#e08a2e' },
    { pos: '游走',   ico: '🛡️', a: '#58e0a4', b: '#1f9e7a' },
    { pos: '打野',   ico: '⚡', a: '#c79bff', b: '#6a4bbf' }
  ];
  function renderPositions() {
    const host = document.getElementById('pos-grid');
    if (!host) return;
    POS_CFG.forEach(c => {
      const cnt = data.heroesByPosition(c.pos).length;
      const card = utils.el('div', {
        class: 'card card-hover pos-card',
        onclick: () => { window.location.href = BASE + 'pages/hero.html?pos=' + encodeURIComponent(c.pos); }
      }, [
        utils.el('div', { class: 'ico', style: 'background:linear-gradient(135deg,' + c.a + ',' + c.b + ');box-shadow:0 8px 20px ' + c.a + '44', text: c.ico }),
        utils.el('div', { class: 'nm', text: c.pos }),
        utils.el('div', { class: 'cnt', text: cnt + ' 位英雄 · 快速进入' })
      ]);
      host.appendChild(card);
    });
  }

  /* ---------------- ③ 本周强势英雄 ---------------- */
  function renderStrong() {
    const host = document.getElementById('strong-grid');
    if (!host) return;
    const s = data.season();
    let ids = (s.strongHeroes || []).slice(0, 8);
    // 补充热门英雄至 8 张
    const extra = data.sortHeroes(data.heroes(), '热度').filter(h => !ids.includes(h.id)).map(h => h.id);
    ids = ids.concat(extra).slice(0, 8);
    ids.forEach(id => {
      const h = data.getHero(id);
      if (h) host.appendChild(utils.heroCard(h));
    });
  }

  /* ---------------- ④ 功能简介 ---------------- */
  const FEATURES = [
    { ico: '📖', t: '英雄百科', d: '126 位英雄全量数据，热门英雄含完整技能、出装、铭文、连招详解', color: '#ff6b5e' },
    { ico: '🧰', t: '装备百科', d: '132 件主流装备分类查询，属性、被动、合成路径、适配英雄一目了然', color: '#4a9dff' },
    { ico: '🏆', t: '英雄梯度', d: '按位置展示 T0-T3 梯度榜单，标注强势原因与短板，上分选人不再迷茫', color: '#f5b942' },
    { ico: '⚔️', t: '克制查询', d: '一键生成对位打法、出装调整与对线注意事项，专治「不知道怎么打」', color: '#2fd48b' }
  ];
  function renderIntro() {
    const host = document.getElementById('intro-grid');
    if (!host) return;
    FEATURES.forEach(f => {
      const card = utils.el('div', { class: 'card card-hover card-pad' }, [
        utils.el('div', { style: 'font-size:30px;width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:' + f.color + '22;border:1px solid ' + f.color + '44', text: f.ico }),
        utils.el('div', { class: 'fw-700 text-lg', style: 'margin-top:14px', text: f.t }),
        utils.el('p', { class: 'text-sub', style: 'margin-top:6px', text: f.d })
      ]);
      host.appendChild(card);
    });
  }

  /* ---------------- ⑤ 版本胜率图表（ECharts，主题自适应） ---------------- */
  function renderChart() {
    const el = document.getElementById('meta-chart');
    if (!el || typeof echarts === 'undefined') return;
    const chart = echarts.init(el);

    function draw() {
      const u = window.WQK.utils;
      const axis = u.cssVar('--text-3', '#626d87');           // 刻度文字
      const axis2 = u.cssVar('--text-2', '#9aa5bd');          // 分类文字
      const border = u.cssVar('--border', 'rgba(255,255,255,.14)');
      const split = u.cssVar('--border', 'rgba(255,255,255,.05)');
      const card3 = u.cssVar('--card-3', '#182136');
      const text = u.cssVar('--text', '#e9edf5');
      const blue = u.cssVar('--blue', '#4a9dff');
      const blueRgb = u.cssVar('--blue-rgb', '74,157,255');
      const gold = u.cssVar('--gold', '#f5b942');
      const top = data.sortHeroes(data.heroes(), '热度').slice(0, 10).reverse();

      chart.setOption({
        backgroundColor: 'transparent',
        grid: { left: 58, right: 16, top: 10, bottom: 24 },
        tooltip: { trigger: 'axis', backgroundColor: card3, borderColor: border, textStyle: { color: text } },
        xAxis: {
          type: 'value', max: 56,
          axisLine: { lineStyle: { color: border } },
          axisLabel: { color: axis },
          splitLine: { lineStyle: { color: split } }
        },
        yAxis: {
          type: 'category', data: top.map(h => h.name),
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: axis2, fontSize: 12 }
        },
        series: [{
          type: 'bar', data: top.map(h => h.winrate),
          barWidth: 14, label: { show: true, position: 'right', color: gold, fontSize: 11, formatter: '{c}%' },
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(' + blueRgb + ',.40)' },
              { offset: 1, color: blue }
            ])
          }
        }]
      }, true);
    }

    draw();
    window.addEventListener('resize', () => chart.resize());
    // 主题切换时重绘图表颜色
    window.addEventListener('wqk-themechange', draw);
  }

  /* ---------------- 入口 ---------------- */
  function init() {
    renderSeason();
    renderPositions();
    renderStrong();
    renderIntro();
    renderChart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
