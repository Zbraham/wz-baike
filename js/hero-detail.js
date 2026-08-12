/**
 * hero-detail.js —— 英雄详情页（核心）
 * 渲染：头部信息 / 六维雷达图 / 标签页（技能解析·出装铭文·连招教学·对位克制·思路梯度）/ 相关英雄 / 上下位切换。
 * 无完整详情的英雄自动降级为「定位模板攻略」（guideFor），保证页面不空白。
 */
window.WQK = window.WQK || {};
window.WQK.heroDetail = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;
  const BASE = window.BASE_PATH || '';

  let hero = null, guide = null, radarChart = null;

  /* ================= 入口 ================= */
  function init() {
    const id = utils.getParam('id');
    hero = data.getHero(id);
    const root = document.getElementById('detail-root');
    if (!root) return;

    if (!hero) { renderNotFound(root); return; }

    document.title = hero.name + '「' + hero.title + '」攻略 · 王者百科';
    guide = data.guideFor(hero);

    renderCrumb();
    renderHeader();
    renderRadar();
    renderTabs();
    renderRelated();
    renderPrevNext();
  }

  /* ---------------- 面包屑 ---------------- */
  function renderCrumb() {
    const host = document.getElementById('crumb');
    host.innerHTML = '';
    host.appendChild(utils.el('div', { class: 'flex items-center gap-2 text-dim', style: 'font-size:13px' }, [
      utils.el('a', { href: BASE + 'index.html', text: '首页' }),
      utils.el('span', { text: '›' }),
      utils.el('a', { href: BASE + 'pages/hero.html', text: '英雄百科' }),
      utils.el('span', { text: '›' }),
      utils.el('span', { class: 'text-gold', text: hero.name })
    ]));
  }

  /* ---------------- 头部信息 ---------------- */
  function renderHeader() {
    const root = document.getElementById('detail-root');
    const isTemplate = guide._template;

    const badges = [
      utils.el('span', { class: 'badge badge-' + utils.roleClass(hero.role), text: hero.role }),
      utils.el('span', { class: 'badge badge-tier-' + (hero.tier || 'T3').toLowerCase(), text: hero.tier || 'T3' })
    ];
    (hero.tags || []).forEach(t => badges.push(utils.el('span', { class: 'badge badge-tag', text: t })));

    // 统计块：热度 / 胜率 / 出场率
    const stats = [
      { label: '热度', value: utils.fmtNum(hero.hotness), color: 'var(--gold)' },
      { label: '胜率', value: utils.fmtNum(hero.winrate) + '%', color: 'var(--green)' },
      { label: '出场率', value: utils.fmtNum(hero.pickrate) + '%', color: 'var(--blue)' }
    ].map(s => utils.el('div', { class: 'card-pad', style: 'text-align:center;flex:1;min-width:90px' }, [
      utils.el('div', { class: 'fw-800 text-lg', style: 'color:' + s.color, text: s.value }),
      utils.el('div', { class: 'text-dim', style: 'font-size:12px', text: s.label })
    ]));

    const header = utils.el('section', { class: 'card card-pad animate-in' }, [
      utils.el('div', { class: 'flex', style: 'gap:22px;align-items:flex-start;flex-wrap:wrap' }, [
        utils.el('img', {
          src: utils.heroAvatar(hero, 120), alt: hero.name,
          style: 'width:120px;height:120px;border-radius:26px;box-shadow:var(--glow-gold);flex-shrink:0'
        }),
        utils.el('div', { style: 'flex:1;min-width:260px' }, [
          utils.el('div', { class: 'flex items-center gap-3 flex-wrap' }, [
            utils.el('h1', { style: 'font-size:clamp(24px,3.2vw,34px);font-weight:800', text: hero.name }),
            utils.el('span', { class: 'text-dim', style: 'font-size:14px', text: hero.title })
          ]),
          utils.el('div', { class: 'flex gap-2 flex-wrap', style: 'margin-top:10px' }, badges),
          utils.el('div', { class: 'flex gap-3 flex-wrap', style: 'margin-top:12px' }, [
            utils.el('span', { class: 'text-dim', style: 'font-size:13px', html: '位置 <b class="text-blue">' + hero.position + '</b>' }),
            utils.el('span', { class: 'text-dim', style: 'font-size:13px', html: '难度 ' + difficultyStars(hero.difficulty) + ' <b class="text-gold">' + hero.difficulty + '/10</b>' })
          ]),
          utils.el('p', { class: 'text-sub', style: 'margin-top:12px', text: hero.desc })
        ]),
        utils.el('div', { class: 'flex', style: 'gap:10px;flex-wrap:wrap' }, stats)
      ]),
      // 模板兜底提示
      isTemplate ? utils.el('div', { style: 'margin-top:16px;padding:12px 16px;border-radius:12px;background:rgba(245,185,66,.08);border:1px solid rgba(245,185,66,.3);font-size:13px;color:var(--gold)' }, [
        utils.el('span', { text: '⚠️ 该英雄详细攻略数据整理中，当前展示「定位模板」通用攻略（仅供参考），基础信息完整。' })
      ]) : null
    ]);
    root.appendChild(header);
  }

  function difficultyStars(n) {
    let s = '';
    for (let i = 1; i <= 10; i++) s += (i <= n ? '★' : '☆');
    return s;
  }

  /* ---------------- 雷达图 + 快速行动 ---------------- */
  function renderRadar() {
    const root = document.getElementById('detail-root');
    const stats = guide.stats || {};

    const radarCard = utils.el('div', { class: 'card card-pad' }, [
      utils.el('div', { class: 'card-title', text: '能力六维' }),
      utils.el('div', { id: 'radar', style: 'width:100%;height:400px;margin-top:10px' })
    ]);

    const actions = utils.el('div', { class: 'card card-pad' }, [
      utils.el('div', { class: 'card-title', text: '快速行动' }),
      utils.el('div', { style: 'margin-top:14px' }, [
        utils.el('p', { class: 'text-sub', style: 'margin-bottom:12px', text: '想更深入了解这位英雄？试试 AI 教练：' }),
        utils.el('button', { class: 'btn btn-primary btn-sm', onclick: askAi, html: '🤖 问「' + hero.name + ' 新手怎么玩」' }),
        utils.el('button', { class: 'btn btn-blue btn-sm', style: 'margin-left:8px', onclick: () => { window.location.href = BASE + 'pages/counter.html?hero=' + encodeURIComponent(hero.id); }, html: '⚔️ 查 ' + hero.name + ' 克制关系' }),
        utils.el('button', { class: 'btn btn-ghost btn-sm', style: 'margin-left:8px', onclick: () => window.location.reload(), html: '🔄 刷新' })
      ])
    ]);

    root.appendChild(utils.el('div', { class: 'grid g-2 gap-4', style: 'margin-top:22px' }, [radarCard, actions]));

    // 绘制雷达图（主题自适应）
    const el = document.getElementById('radar');
    if (el && typeof echarts !== 'undefined') {
      radarChart = echarts.init(el);
      const draw = () => {
        const u = window.WQK.utils;
        const axisName = u.cssVar('--text-2', '#9aa5bd');
        const lineC = u.cssVar('--border-strong', 'rgba(255,255,255,.14)');
        const areaA = u.cssVar('--tint', 'rgba(255,255,255,.05)');
        const areaB = u.cssVar('--hover', 'rgba(255,255,255,.09)');
        const blue = u.cssVar('--blue', '#4a9dff');
        const blueRgb = u.cssVar('--blue-rgb', '74,157,255');
        radarChart.setOption({
          backgroundColor: 'transparent',
          radar: {
            indicator: [
              { name: '输出', max: 100 }, { name: '生存', max: 100 }, { name: '控制', max: 100 },
              { name: '机动', max: 100 }, { name: '辅助', max: 100 }, { name: '难度', max: 100 }
            ],
            radius: '62%', center: ['50%', '57%'],
            splitArea: { areaStyle: { color: [areaA, areaB] } },
            axisLine: { lineStyle: { color: lineC } },
            splitLine: { lineStyle: { color: lineC } },
            axisName: { color: axisName, fontSize: 12 }
          },
          series: [{
            type: 'radar',
            data: [{
              value: [stats.output, stats.survive, stats.control, stats.mobility, stats.support, stats.difficulty],
              name: hero.name,
              areaStyle: { color: 'rgba(' + blueRgb + ',.28)' },
              lineStyle: { color: blue, width: 2 },
              itemStyle: { color: blue }
            }]
          }]
        }, true);
      };
      draw();
      window.addEventListener('resize', () => radarChart && radarChart.resize());
      // 主题切换时重绘雷达图颜色
      window.addEventListener('wqk-themechange', draw);
    }
  }

  function askAi() {
    if (window.WQK.aiChat && window.WQK.aiChat.openAndAsk) {
      window.WQK.aiChat.openAndAsk(hero.name + '新手怎么玩');
    }
  }

  /* ---------------- 标签页 ---------------- */
  const TABS = [
    { id: 'skills', label: '技能解析' },
    { id: 'builds', label: '出装铭文' },
    { id: 'combos', label: '连招教学' },
    { id: 'counter', label: '对位克制' },
    { id: 'strategy', label: '思路与梯度' }
  ];

  function renderTabs() {
    const root = document.getElementById('detail-root');
    const tabs = utils.el('div', { class: 'tabs', style: 'margin-top:26px' });
    const panels = utils.el('div', { style: 'margin-top:18px' });

    TABS.forEach((t, i) => {
      const btn = utils.el('button', { class: 'tab' + (i === 0 ? ' active' : ''), text: t.label, onclick: () => {
        tabs.querySelectorAll('.tab').forEach((b, j) => b.classList.toggle('active', j === i));
        panels.querySelectorAll('.tab-panel').forEach((p, j) => p.classList.toggle('hidden', j !== i));
        // 隐藏面板中的 ECharts（如克制关系图）在显示时尺寸为 0，派发 resize 触发重新布局
        window.dispatchEvent(new Event('resize'));
      }});
      tabs.appendChild(btn);

      const panel = utils.el('div', { class: 'tab-panel' + (i === 0 ? '' : ' hidden') });
      panels.appendChild(panel);
    });

    // 填充各面板
    renderSkills(panels.querySelectorAll('.tab-panel')[0]);
    renderBuilds(panels.querySelectorAll('.tab-panel')[1]);
    renderCombos(panels.querySelectorAll('.tab-panel')[2]);
    renderCounter(panels.querySelectorAll('.tab-panel')[3]);
    renderStrategy(panels.querySelectorAll('.tab-panel')[4]);

    root.appendChild(tabs);
    root.appendChild(panels);
  }

  /* ---- 技能解析 ---- */
  function renderSkills(panel) {
    if (guide._template || !guide.passive) {
      panel.appendChild(utils.el('div', { class: 'empty' }, [
        utils.el('div', { class: 'ico', text: '📝' }),
        utils.el('p', { text: '该英雄的技能详细数据整理中，敬请期待。' }),
        utils.el('p', { class: 'text-dim', style: 'margin-top:6px', text: '可先用上方「定位模板」出装/连招进行练习。' })
      ]));
      return;
    }
    // 被动
    panel.appendChild(utils.el('div', { class: 'card skill-card', style: 'margin-bottom:14px' }, [
      skillHead('被动', guide.passive.name, '被动技能'),
      skillBody(guide.passive)
    ]));
    // 一二三技能
    (guide.skills || []).forEach(s => {
      panel.appendChild(utils.el('div', { class: 'card skill-card', style: 'margin-bottom:14px' }, [
        skillHead(s.key, s.name, '技能 ' + s.key, s),
        skillBody(s)
      ]));
    });
  }

  function skillHead(key, name, sub, skill) {
    const meta = [];
    if (skill && skill.cd) meta.push(utils.el('span', { class: 'skill-kv', text: '⏱ 冷却 ' + skill.cd }));
    if (skill && skill.cost) meta.push(utils.el('span', { class: 'skill-kv', text: '💧 蓝耗 ' + skill.cost }));
    if (skill && skill.type) meta.push(utils.el('span', { class: 'skill-kv', text: '⚡ ' + skill.type }));
    return utils.el('div', { class: 'flex items-center gap-3 flex-wrap' }, [
      utils.el('img', { src: utils.skillIcon(key), style: 'width:46px;height:46px;border-radius:12px', alt: name }),
      utils.el('div', {}, [
        utils.el('div', { class: 'fw-700 text-lg', html: name + ' <span class="text-dim" style="font-size:12px;font-weight:400">' + sub + '</span>' }),
        utils.el('div', { class: 'skill-meta' }, meta)
      ])
    ]);
  }

  function skillBody(s) {
    const blocks = [
      ['技能描述', s.desc], ['核心机制', s.mechanic], ['新手要点', s.tips], ['误区提醒', s.mistake]
    ];
    return utils.el('div', { class: 'skill-block' }, blocks.map(([t, v]) =>
      utils.el('div', {}, [utils.el('b', { text: t }), utils.el('p', { text: v })])
    ));
  }

  /* ---- 出装 + 铭文 ---- */
  function renderBuilds(panel) {
    // 出装
    panel.appendChild(utils.el('div', { class: 'card-title', style: 'margin-bottom:12px', text: '三套出装方案' }));
    const buildGrid = utils.el('div', { class: 'grid g-3 gap-4' });
    (guide.builds || []).forEach(b => buildGrid.appendChild(buildCard(b)));
    panel.appendChild(buildGrid);

    // 铭文
    panel.appendChild(utils.el('div', { class: 'card-title', style: 'margin:26px 0 12px', text: '铭文搭配' }));
    const runeGrid = utils.el('div', { class: 'grid g-3 gap-4' });
    (guide.runes || []).forEach(r => runeGrid.appendChild(runeCard(r)));
    panel.appendChild(runeGrid);
  }

  function buildCard(b) {
    const items = b.items.map(id => {
      const it = data.getItem(id);
      if (!it) return utils.el('span', { class: 'build-item', html: '<span class="s-ico" style="background:linear-gradient(135deg,#4a5a75,#2a3348);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:800">?</span> ' + id });
      return utils.el('span', { class: 'build-item' }, [
        utils.el('img', { src: utils.itemIcon(it, 34), style: 'width:34px;height:34px;border-radius:10px', alt: it.name }),
        utils.el('span', { text: it.name })
      ]);
    });
    // 用箭头串联
    const chain = [];
    items.forEach((it, i) => {
      if (i) chain.push(utils.el('span', { class: 'build-arrow', text: '→' }));
      chain.push(it);
    });
    return utils.el('div', { class: 'card card-hover build-card' }, [
      utils.el('span', { class: 'badge badge-gold build-tag', text: b.tag || '出装' }),
      utils.el('div', { class: 'card-title', text: b.name }),
      utils.el('div', { class: 'build-items' }, chain),
      utils.el('div', { class: 'build-core' }, [
        utils.el('div', { html: '<b class="text-gold">核心思路</b>：' + (b.core || '—') }),
        utils.el('div', { style: 'margin-top:6px', html: '<b class="text-blue">适用场景</b>：' + (b.when || '—') }),
        utils.el('div', { style: 'margin-top:6px', html: '<b class="text-green">小技巧</b>：' + (b.tips || '—') })
      ])
    ]);
  }

  function runeCard(r) {
    return utils.el('div', { class: 'card card-hover card-pad' }, [
      utils.el('div', { class: 'flex-between' }, [
        utils.el('div', { class: 'card-title', text: r.name }),
        utils.el('span', { class: 'badge badge-blue', text: r.tag || '铭文' })
      ]),
      utils.el('div', { class: 'runes-row' }, [
        utils.el('div', { class: 'rune-cell' }, [utils.el('b', { text: '红色' }), utils.el('span', { text: r.red })]),
        utils.el('div', { class: 'rune-cell' }, [utils.el('b', { text: '蓝色' }), utils.el('span', { text: r.blue })]),
        utils.el('div', { class: 'rune-cell' }, [utils.el('b', { text: '绿色' }), utils.el('span', { text: r.green })])
      ]),
      utils.el('div', { class: 'build-core' }, [
        utils.el('div', { html: '<b class="text-gold">效果</b>：' + (r.effect || '—') }),
        utils.el('div', { style: 'margin-top:6px', html: '<b class="text-blue">适用</b>：' + (r.when || '—') })
      ])
    ]);
  }

  /* ---- 连招教学 ---- */
  function renderCombos(panel) {
    (guide.combos || []).forEach((c, i) => {
      const steps = [];
      c.steps.forEach((s, j) => {
        if (j) steps.push(utils.el('span', { class: 'combo-arrow', text: '→' }));
        steps.push(utils.el('span', { class: 'combo-step', text: s }));
      });
      panel.appendChild(utils.el('div', { class: 'card card-hover card-pad', style: 'margin-bottom:14px' }, [
        utils.el('div', { class: 'flex-between flex-wrap gap-2' }, [
          utils.el('div', { class: 'card-title', text: (i + 1) + '. ' + c.name }),
          utils.el('span', { class: 'badge badge-red', text: c.tag || '连招' })
        ]),
        utils.el('div', { class: 'combo-steps' }, steps),
        utils.el('div', { class: 'build-core' }, [
          utils.el('div', { html: '<b class="text-gold">讲解</b>：' + (c.tips || '—') }),
          utils.el('div', { style: 'margin-top:6px', html: '<b class="text-blue">适用</b>：' + (c.when || '—') })
        ])
      ]));
    });
    if (!guide.combos || !guide.combos.length) {
      panel.appendChild(utils.el('div', { class: 'empty', html: '<div class="ico">🎮</div><p>连招数据整理中</p>' }));
    }
  }

  /* ---- 对位克制 ---- */
  function renderCounter(panel) {
    const good = guide.counterGood || [];
    const bad = guide.counterBad || [];
    // 克制关系图（可视化谁克制谁）
    if (good.length || bad.length) renderCounterGraph(panel, good, bad);
    if (!good.length && !bad.length) {
      panel.appendChild(utils.el('div', { class: 'empty' }, [
        utils.el('div', { class: 'ico', text: '⚔️' }),
        utils.el('p', { text: '该英雄的详细克制数据整理中。' }),
        utils.el('p', { class: 'text-dim', style: 'margin-top:6px', text: '可以在下方「克制查询」工具中输入英雄对位，或直接问 AI 教练。' }),
        utils.el('button', { class: 'btn btn-blue btn-sm', style: 'margin-top:12px', onclick: () => { window.location.href = BASE + 'pages/counter.html?hero=' + encodeURIComponent(hero.id); }, text: '去克制查询 →' })
      ]));
      return;
    }
    if (good.length) {
      panel.appendChild(utils.el('div', { class: 'card-title', style: 'margin-bottom:12px', html: '✅ 克制英雄 <span class="text-dim" style="font-weight:400">（' + hero.name + ' 好打他们）</span>' }));
      const grid = utils.el('div', { class: 'grid g-2 gap-4', style: 'margin-bottom:22px' });
      good.forEach(c => grid.appendChild(vsItem(c, true)));
      panel.appendChild(grid);
    }
    if (bad.length) {
      panel.appendChild(utils.el('div', { class: 'card-title', style: 'margin-bottom:12px', html: '⚠️ 被克制英雄 <span class="text-dim" style="font-weight:400">（' + hero.name + ' 的天敌）</span>' }));
      const grid = utils.el('div', { class: 'grid g-2 gap-4' });
      bad.forEach(c => grid.appendChild(vsItem(c, false)));
      panel.appendChild(grid);
    }
  }

  /* ---- 克制关系图（ECharts 有向图，主题自适应） ---- */
  function renderCounterGraph(panel, good, bad) {
    const box = utils.el('div', { id: 'counter-graph', style: 'width:100%;height:480px;margin:2px 0 20px' });
    panel.appendChild(utils.el('div', { class: 'card-title', style: 'margin:0 0 12px', html: '🕸️ 克制关系图 <span class="text-dim" style="font-weight:400;font-size:12px">（左：它克制 · 右：克制它）</span>' }));
    panel.appendChild(box);

    if (typeof echarts === 'undefined') { box.style.display = 'none'; return; }
    const chart = echarts.init(box);
    const draw = () => {
      const u = window.WQK.utils;
      const green = u.cssVar('--green', '#2fd48b');
      const red = u.cssVar('--red', '#ff4d5e');
      const gold = u.cssVar('--gold', '#f5b942');
      const text2 = u.cssVar('--text-2', '#9aa5bd');
      const cardBg = u.cssVar('--card', '#121827');
      // 节点样式：可靠的大号圆形 + 描边光晕，名字置于节点下方
      const nodeStyle = (color) => ({ color, borderColor: 'rgba(255,255,255,.5)', borderWidth: 3, shadowBlur: 12, shadowColor: 'rgba(0,0,0,.3)' });
      const nodes = [{ id: hero.id, name: hero.name, x: 0, y: 0, symbolSize: 76, symbol: 'circle', itemStyle: nodeStyle(gold) }];
      const links = [];
      good.forEach((c, i) => {
        const h = data.getHero(c.id); if (!h) return;
        nodes.push({ id: c.id, name: h.name, x: -2, y: (i - (good.length - 1) / 2) * 1.5, symbolSize: 54, symbol: 'circle', itemStyle: nodeStyle(green) });
        links.push({ source: hero.id, target: c.id, edgeSymbol: ['none', 'arrow'], edgeSymbolSize: 9, lineStyle: { color: green, width: 2.5, curveness: 0.12 }, edgeLabel: { show: true, formatter: '克制', color: '#fff', fontWeight: 700, fontSize: 12, backgroundColor: green, borderRadius: 8, padding: [2, 7] } });
      });
      bad.forEach((c, i) => {
        const h = data.getHero(c.id); if (!h) return;
        nodes.push({ id: c.id, name: h.name, x: 2, y: (i - (bad.length - 1) / 2) * 1.5, symbolSize: 54, symbol: 'circle', itemStyle: nodeStyle(red) });
        links.push({ source: c.id, target: hero.id, edgeSymbol: ['none', 'arrow'], edgeSymbolSize: 9, lineStyle: { color: red, width: 2.5, curveness: 0.12 }, edgeLabel: { show: true, formatter: '被克', color: '#fff', fontWeight: 700, fontSize: 12, backgroundColor: red, borderRadius: 8, padding: [2, 7] } });
      });
      chart.setOption({
        tooltip: {
          backgroundColor: cardBg,
          borderColor: u.cssVar('--border', 'rgba(255,255,255,.14)'),
          textStyle: { color: u.cssVar('--text', '#e9edf5') },
          formatter: (p) => (p.dataType === 'node' ? p.data.name : '')
        },
        series: [{
          type: 'graph', layout: 'none', roam: false,
          // 预留四周内边距：左右两侧留足节点名字标签的空间，避免文字被容器裁掉
          left: 80, right: 80, top: 40, bottom: 56,
          label: { show: true, position: 'bottom', distance: 8, fontSize: 14, fontWeight: 700, color: text2, formatter: (p) => p.data.name },
          lineStyle: { curveness: 0.1 },
          emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
          data: nodes, links
        }]
      }, true);
    };
    draw();
    window.addEventListener('resize', () => chart.resize());
    window.addEventListener('wqk-themechange', draw);
  }

  function vsItem(c, isGood) {
    const h2 = data.getHero(c.id);
    return utils.el('div', { class: 'vs-item ' + (isGood ? 'vs-good' : 'vs-bad'), onclick: () => { if (h2) window.location.href = BASE + 'pages/hero-detail.html?id=' + h2.id; } }, [
      utils.el('div', { class: 'flex items-center gap-3' }, [
        utils.el('img', { src: utils.heroAvatar(h2 || { name: c.id, role: '战士' }, 40), style: 'width:40px;height:40px;border-radius:10px', alt: h2 ? h2.name : c.id }),
        utils.el('div', {}, [
          utils.el('div', { class: 'nm', text: h2 ? h2.name : c.id }),
          utils.el('div', { class: 'tl', text: h2 ? h2.title + ' · ' + h2.role : '' })
        ])
      ]),
      utils.el('p', { class: 'why', html: '<b class="' + (isGood ? 'text-green' : 'text-red') + '">' + (isGood ? '为什么好打' : '为什么难打') + '：</b>' + (c.why || '—') }),
      utils.el('p', { class: 'why', html: '<b class="text-gold">' + (isGood ? '打法要点' : '规避思路') + '：</b>' + (isGood ? (c.how || '—') : (c.avoid || '—')) })
    ]);
  }

  /* ---- 思路与梯度 ---- */
  function renderStrategy(panel) {
    const st = guide.strategy || {};
    const rank = guide.rank || {};

    // 四块思路
    const items = [
      { t: '🛫 开局思路', v: st.opening },
      { t: '⚔️ 对线思路', v: st.laning },
      { t: '🏰 团战思路', v: st.teamfight },
      { t: '📉 逆风打法', v: st.comeback }
    ];
    const grid = utils.el('div', { class: 'grid g-2 gap-4' });
    items.forEach(it => {
      grid.appendChild(utils.el('div', { class: 'card card-hover card-pad' }, [
        utils.el('div', { class: 'card-title', text: it.t }),
        utils.el('p', { class: 'text-sub', style: 'margin-top:10px', text: it.v || '整理中…' })
      ]));
    });
    panel.appendChild(grid);

    // 梯度胜率
    const rankCard = utils.el('div', { class: 'card card-pad', style: 'margin-top:20px' }, [
      utils.el('div', { class: 'card-title', text: '梯度 · 胜率 · 适配段位' }),
      utils.el('div', { class: 'grid g-4 gap-4', style: 'margin-top:16px' }, [
        rankCell('当前梯度', '<span class="badge badge-tier-' + (rank.tier || 'T3').toLowerCase() + '" style="font-size:16px;padding:6px 16px">' + (rank.tier || 'T3') + '</span>'),
        rankCell('胜率', '<b class="text-green fw-800" style="font-size:20px">' + utils.fmtNum(rank.winrate != null ? rank.winrate : hero.winrate) + '%</b>'),
        rankCell('出场率', '<b class="text-blue fw-800" style="font-size:20px">' + utils.fmtNum(rank.pickrate != null ? rank.pickrate : hero.pickrate) + '%</b>'),
        rankCell('适配段位', (rank.bestRanks && rank.bestRanks.length ? rank.bestRanks.map(r => '<span class="badge badge-gold">' + r + '</span>').join(' ') : '<span class="badge badge-tag">待补充</span>'))
      ])
    ]);
    panel.appendChild(rankCard);
  }

  function rankCell(label, html) {
    return utils.el('div', { style: 'text-align:center;padding:14px 10px;border-radius:12px;background:var(--tint);border:1px solid var(--border)' }, [
      utils.el('div', { class: 'text-dim', style: 'font-size:12px;margin-bottom:8px', text: label }),
      utils.el('div', { html })
    ]);
  }

  /* ---------------- 相关英雄 ---------------- */
  function renderRelated() {
    const root = document.getElementById('detail-root');
    const same = data.heroesByPosition(hero.position)
      .filter(h => h.id !== hero.id)
      .sort((a, b) => b.hotness - a.hotness)
      .slice(0, 4);

    const sec = utils.el('div', { style: 'margin-top:34px' }, [
      utils.el('div', { class: 'sec-head', style: 'margin-bottom:14px' }, [
        utils.el('h2', { class: 'text-section', text: '同位置热门英雄' }),
        utils.el('a', { class: 'btn btn-ghost btn-sm', href: BASE + 'pages/hero.html?pos=' + encodeURIComponent(hero.position), text: '更多 ' + hero.position + ' 英雄 →' })
      ]),
      utils.el('div', { class: 'grid g-4 gap-4' }, same.map(h => utils.heroCard(h)))
    ]);
    root.appendChild(sec);
  }

  /* ---------------- 上一位 / 下一位 ---------------- */
  function renderPrevNext() {
    const root = document.getElementById('detail-root');
    const list = data.sortHeroes(data.heroesByPosition(hero.position), '热度');
    const idx = list.findIndex(h => h.id === hero.id);
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx < list.length - 1 ? list[idx + 1] : null;

    const box = utils.el('div', { class: 'flex-between flex-wrap gap-3', style: 'margin-top:18px' });
    if (prev) box.appendChild(navBtn(prev, '← 上一位'));
    if (next) box.appendChild(navBtn(next, '下一位 →'));
    if (!prev && next) { const sp = utils.el('span', {}); box.prepend(sp); }
    root.appendChild(box);
  }

  function navBtn(h, label) {
    return utils.el('a', { class: 'row', style: 'flex:1;max-width:340px;cursor:pointer', href: BASE + 'pages/hero-detail.html?id=' + h.id }, [
      utils.el('img', { src: utils.heroAvatar(h, 40), alt: h.name }),
      utils.el('div', { style: 'flex:1' }, [
        utils.el('div', { class: 'nm', text: h.name }),
        utils.el('div', { class: 'tl', text: h.title })
      ]),
      utils.el('span', { class: 'text-dim', style: 'font-size:12px', text: label })
    ]);
  }

  /* ---------------- 未找到 ---------------- */
  function renderNotFound(root) {
    document.title = '英雄未找到 · 王者百科';
    root.appendChild(utils.el('div', { class: 'empty', style: 'padding:80px 20px' }, [
      utils.el('div', { class: 'ico', text: '🕵️' }),
      utils.el('p', { class: 'fw-700 text-lg', text: '没有找到这位英雄' }),
      utils.el('p', { class: 'text-dim', style: 'margin-top:8px', text: '链接可能已失效，回到英雄百科重新选择吧。' }),
      utils.el('a', { class: 'btn btn-primary', style: 'margin-top:18px', href: BASE + 'pages/hero.html', text: '返回英雄百科 →' })
    ]));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
