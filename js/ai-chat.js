/**
 * ai-chat.js —— AI 智能问答（前端框架）
 * ------------------------------------------------------------------
 * 本模块已完成前端 UI 与交互框架，内置「本地知识引擎」可离线回答常见问题：
 *   「X 怎么打 Y」→ 对位分析（克制关系 / 打法 / 出装调整 / 对线注意）
 *   「X 新手怎么玩」→ 新手攻略（定位 / 出装 / 铭文 / 连招 / 要点）
 *   「这套出装适合什么对局」→ 出装解析
 *
 * 【DeepSeek 一键接入】在下方 DEEPSEEK 配置中填入 apiKey 并设 enabled = true，
 * 本地引擎将自动切换为调用 DeepSeek API（联网需后端代理防泄漏，见交付文档）。
 */
window.WQK = window.WQK || {};
window.WQK.aiChat = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;

  /* ================= DeepSeek 接入配置（预留） ================= */
  const DEEPSEEK = {
    enabled: false,                                   // 置为 true 启用真实 AI
    apiKey: '',                                       // 填入你的 DeepSeek API Key
    endpoint: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    system: '你是「王者百科」内置的王者荣耀资深教练，回答简洁专业、给出可操作建议。'
  };

  /* ================= 对位判断矩阵（经验启发式） ================= */
  // A(rows) 打 B(cols)：+2 大优 / +1 小优 / 0 均势 / -1 小劣 / -2 大劣
  const MATRIX = {
    '坦克>战士':1,'坦克>法师':0,'坦克>射手':-1,'坦克>刺客':1,'坦克>辅助':0,'坦克>坦克':0,
    '战士>坦克':-1,'战士>法师':1,'战士>射手':0,'战士>刺客':0,'战士>辅助':1,'战士>战士':0,
    '法师>坦克':0,'法师>战士':-1,'法师>射手':0,'法师>刺客':-1,'法师>辅助':0,'法师>法师':0,
    '射手>坦克':1,'射手>战士':0,'射手>法师':0,'射手>刺客':-2,'射手>辅助':1,'射手>射手':0,
    '刺客>坦克':-1,'刺客>战士':0,'刺客>法师':1,'刺客>射手':2,'刺客>辅助':1,'刺客>刺客':0,
    '辅助>坦克':0,'辅助>战士':-1,'辅助>法师':0,'辅助>射手':-1,'辅助>刺客':-1,'辅助>辅助':0
  };
  function matchupScore(a, b) { return MATRIX[a.role + '>' + b.role] || 0; }

  /* ================= 工具：从问题中提取英雄 ================= */
  function findHeroes(q) {
    const hits = data.heroes().filter(h => q.includes(h.name) || q.includes(h.title));
    return hits;
  }

  /* ================= 本地知识引擎 ================= */
  function localAnswer(question) {
    const q = question.trim();
    const heroes = findHeroes(q);

    // —— 情况一：对位问题（识别到两个英雄 / 或带「怎么打」「克制」的单英雄对位）——
    if (heroes.length >= 2) return matchupAnswer(heroes[0], heroes[1]);
    if (heroes.length === 1 && /(怎么打|怎么对|对位|克制|打不过|打谁)/.test(q)) {
      // 问该英雄克制谁或怕谁
      return singleMatchupHelp(heroes[0], q);
    }

    // —— 情况二：单英雄攻略 ——
    if (heroes.length === 1) {
      const h = heroes[0];
      if (/(新手|怎么玩|怎么练|上分|教学|攻略)/.test(q)) return guideAnswer(h);
      if (/(出装|铭文|连招|装备)/.test(q)) return buildAnswer(h);
      return introAnswer(h);
    }

    // —— 情况三：通用问题 ——
    if (/(出装|装备)/.test(q)) return '🧰 通用出装思路\n\n' +
      '· 射手/刺客：优先攻速暴击/穿透，站位安全前提下拉满输出。\n' +
      '· 法师：回响→帽子→法穿（虚无法杖），被切入补辉月。\n' +
      '· 战士/坦克：半肉或纯肉，先暗影战斧/红莲，再补魔女/不祥针对对面阵容。\n' +
      '· 万能原则：对面回复强→制裁/梦魇；对面法伤高→魔女斗篷；对面刺客多→复活甲/名刀/苍穹。\n\n' +
      '💡 想查具体英雄出装，直接问我「XXX 怎么出装」即可。';
    if (/(对线|线上)/.test(q)) return '🛡 通用对线思路\n\n' +
      '· 一级抢线：优先清线到 2 级，掌握技能数量优势再换血。\n' +
      '· 换血规则：技能命中再打，空了就撤退，别硬拼。\n' +
      '· 视野优先：清完线看小地图，防 Gank 比贪伤害更重要。\n' +
      '· 克制认知：远程风筝近战、刺客别和坦克站撸、法师注意拉距离。\n\n' +
      '💡 告诉我具体英雄，我能给出针对性对线思路。';

    // 默认回答
    return '🤖 我是「王者百科」内置的 AI 教练助手。可以问我：\n\n' +
      '🎯 对位查询：「后羿怎么打兰陵王」\n' +
      '📖 新手攻略：「妲己新手怎么玩」\n' +
      '🧰 出装铭文：「铠怎么出装」\n' +
      '🧠 阵容分析：「这套阵容怎么配合」\n\n' +
      '（当前为离线本地引擎；配置 DeepSeek API Key 后可解锁更强大的智能对话。）';
  }

  /* ---------- 对位分析（结构化，供 AI 与克制查询页共用） ---------- */
  function analyzeMatchup(a, b) {
    const dA = data.getDetail(a.id);
    const dB = data.getDetail(b.id);
    let score = matchupScore(a, b);
    const reasons = [];

    // 数据驱动的克制关系优先
    const goodOnB = dA && dA.counterGood.find(x => x.id === b.id);
    const badOnA = dA && dA.counterBad.find(x => x.id === b.id);
    const badOnB = dB && dB.counterBad.find(x => x.id === a.id);
    if (goodOnB) { score = Math.max(score, 2); reasons.push({ type: 'good', title: '为什么好打', text: goodOnB.why + '\n打法要点：' + goodOnB.how }); }
    if (badOnB) { score = Math.max(score, 2); reasons.push({ type: 'good', title: '对方天敌', text: badOnB.why }); }
    if (badOnA) { score = Math.min(score, -2); reasons.push({ type: 'bad', title: '为什么难打', text: badOnA.why + '\n规避思路：' + badOnA.avoid }); }

    const verdict = score >= 2 ? '对位大优' : score === 1 ? '对位小优' : score === 0 ? '对位均势' : score === -1 ? '对位小劣' : '对位大劣';
    const verdictEmoji = score >= 1 ? '✅' : score === 0 ? '⚖️' : '⚠️';

    return {
      aName: a.name, bName: b.name, aRole: a.role, bRole: b.role,
      score, verdict, verdictEmoji, reasons,
      fight: roleAdvice(a, b),
      build: buildAdvice(a, b),
      lane: laningAdvice(a, b),
      team: teamfightAdvice(a, b)
    };
  }

  function matchupAnswer(a, b) {
    const m = analyzeMatchup(a, b);
    const lines = [];
    lines.push(`🎯 对位分析：${m.aName} vs ${m.bName}`);
    lines.push(`${m.verdictEmoji} 判定：${m.verdict}（${m.aRole} vs ${m.bRole}）\n`);
    m.reasons.forEach(r => lines.push(`📌 ${r.title}\n${r.text}\n`));
    lines.push('【打法建议】\n· ' + m.fight + '\n');
    lines.push('【出装调整】\n· ' + m.build + '\n');
    lines.push('【对线注意】\n· ' + m.lane + '\n');
    lines.push('【团战要点】\n· ' + m.team);
    return lines.join('\n');
  }

  /* 单英雄对位（问克制谁 / 怕谁） */
  function singleMatchupHelp(h, q) {
    const d = data.getDetail(h.id);
    const out = [];
    out.push(`🎯 ${h.name}（${h.role}·${h.position}）对位情报\n`);
    if (d && d.counterGood.length) {
      out.push('✅ 克制（好打）:');
      d.counterGood.forEach(c => {
        const h2 = data.getHero(c.id);
        out.push(`· ${h2 ? h2.name : c.id} — ${c.why}`);
      });
    }
    if (d && d.counterBad.length) {
      out.push('\n⚠️ 被克制（难打）:');
      d.counterBad.forEach(c => {
        const h2 = data.getHero(c.id);
        out.push(`· ${h2 ? h2.name : c.id} — ${c.why}`);
      });
    }
    if (!d || (!d.counterGood.length && !d.counterBad.length)) {
      out.push(`该英雄暂无详细克制数据，可用模板经验判断：\n· 对位 ${h.role} 克制情况可参考定位模板。\n· 建议查看英雄详情页的「对位克制」板块。`);
    }
    return out.join('\n');
  }

  function roleAdvice(a, b) {
    const table = {
      '射手': `保持安全距离风筝，利用射程优势消耗${b.name}，注意他${b.role === '刺客' ? '切入瞬间交保命技能' : '的突进技能前摇'}`,
      '刺客': `找准${b.name}的技能真空期切入，目标锁定脆皮，打完一套果断离场`,
      '法师': `用预判技能消耗，避免贴脸，被${b.role === '刺客' ? '刺客切入' : '突脸'}时果断金身/位移拉开`,
      '战士': `半肉出装保证进场能站住，找机会贴脸打一套，劣势别硬拼`,
      '坦克': `承担开团与抗伤，用控制打断${b.name}的输出节奏，保护后排`,
      '辅助': `做好视野与保护，用控制/奶量限制${b.name}，团战盯紧敌方核心`
    };
    return table[a.role] || '多看小地图，利用视野与站位优势拉扯';
  }
  function buildAdvice(a, b) {
    if (b.role === '法师') return `${a.name} 优先补充魔抗（魔女斗篷）与韧性（抵抗之靴），避免被法爆一套带走`;
    if (b.role === '刺客') return `${a.name} 出保命装（名刀/复活甲/纯净苍穹），被切入时有反制手段`;
    if (b.role === '坦克') return `${a.name} 补穿透/真伤类装备（碎星锤/末世/梦魇），打前排效率更高`;
    if (/(回复|吸血|奶)/.test(b.name + b.role)) return `${a.name} 出制裁之刃/梦魇之牙克制敌方回复`;
    return `${a.name} 按常规定位出装即可，根据对面阵容灵活调整防御/输出件`;
  }
  function laningAdvice(a, b) {
    if (matchupScore(a, b) <= -1) return `对线 ${b.name} 尽量猥琐发育，清线后缩塔，等打野支援，避免换血`;
    if (matchupScore(a, b) >= 1) return `对线 ${b.name} 主动压制，利用优势换血滚雪球，注意防 Gank 视野`;
    return `对线 ${b.name} 均势为主，注意技能命中率，不贪残血，多观察小地图`;
  }
  function teamfightAdvice(a, b) {
    if (b.role === '刺客') return `团战盯紧 ${b.name} 的进场时机，他一进场就交控制/保命技能反打`;
    if (b.role === '射手' || b.role === '法师') return `团战优先处理敌方核心 ${b.name}，能切则切，切不掉就躲开其输出范围`;
    return `团战注意和 ${b.name} 保持合理距离，利用自己的定位优势完成职责（输出/抗伤/保护）`;
  }

  /* ---------- 新手攻略 ---------- */
  function guideAnswer(h) {
    const g = data.guideFor(h);
    const d = g._template ? null : g;
    const r = g.rank;
    const out = [];
    out.push(`📖 ${h.name}「${h.title}」新手攻略`);
    out.push(`【基础】${h.role} · ${h.position} · 难度 ${h.difficulty}/10 · ${h.tier} 梯度`);
    out.push(`【强度】胜率 ${utils.fmtNum(r.winrate)}% · 出场率 ${utils.fmtNum(r.pickrate)}%${r.bestRanks.length ? ' · 适配 ' + r.bestRanks.join(' / ') : ''}\n`);
    out.push('【一句话理解】' + h.desc + '\n');

    const b = g.builds[0];
    const bNames = b.items.map(id => { const it = data.getItem(id); return it ? it.name : id; });
    out.push('【推荐出装】' + b.name + '：' + bNames.join(' → '));
    if (b.tips) out.push('  小技巧：' + b.tips);

    const rn = g.runes[0];
    out.push(`【推荐铭文】${rn.red} / ${rn.blue} / ${rn.green}（${rn.effect}）`);
    if (d) {
      out.push('【三套出装】');
      g.builds.forEach((bb, i) => out.push(`  ${i + 1}. ${bb.name}（${bb.tag}）`));
    }
    const c = g.combos[0];
    out.push(`【基础连招】${c.steps.join(' → ')}`);
    out.push('\n💡 建议先看英雄详情页的「技能解析」与「连招教学」，实战中多练几把就有感觉了。');
    return out.join('\n');
  }

  /* ---------- 出装/铭文问答 ---------- */
  function buildAnswer(h) {
    const g = data.guideFor(h);
    const out = [];
    out.push(`🧰 ${h.name} 出装 · 铭文推荐（${h.tier} 梯度 · ${h.role}）\n`);
    out.push('【三套出装方案】');
    g.builds.forEach((b, i) => {
      const bNames = b.items.map(id => { const it = data.getItem(id); return it ? it.name : id; });
      out.push(`\n${i + 1}. ${b.name}（${b.tag}）`);
      out.push(`   路线：${bNames.join(' → ')}`);
      if (b.when) out.push(`   适用：${b.when}`);
    });
    out.push('\n【铭文搭配】');
    g.runes.forEach(rn => out.push(`· ${rn.name}（${rn.tag}）：${rn.red} / ${rn.blue} / ${rn.green} —— ${rn.effect}`));
    return out.join('\n');
  }

  /* ---------- 英雄简介 ---------- */
  function introAnswer(h) {
    const d = data.getDetail(h.id);
    const out = [];
    out.push(`🔎 ${h.name}「${h.title}」`);
    out.push(`【定位】${h.role} · ${h.position} · 难度 ${h.difficulty}/10`);
    out.push(`【梯度】${h.tier} | 胜率 ${utils.fmtNum(h.winrate)}% | 出场率 ${utils.fmtNum(h.pickrate)}%`);
    out.push(`【简介】${h.desc}\n`);
    out.push('可以继续问我：');
    out.push(`· 「${h.name} 新手怎么玩」—— 新手攻略`);
    out.push(`· 「${h.name} 怎么出装」—— 出装铭文`);
    out.push(`· 「${h.name} 怎么打 XXX」—— 对位分析`);
    if (d) out.push(`· 或打开「${h.name}」详情页查看完整技能/连招/克制攻略`);
    return out.join('\n');
  }

  /* ================= DeepSeek API（预留接入） ================= */
  function callDeepSeek(messages) {
    return fetch(DEEPSEEK.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK.apiKey },
      body: JSON.stringify({ model: DEEPSEEK.model, messages: [{ role: 'system', content: DEEPSEEK.system }, ...messages] })
    }).then(res => res.json()).then(data => data.choices && data.choices[0] && data.choices[0].message.content || '（AI 未返回有效内容）');
  }

  /* ================= 面板渲染与交互 ================= */
  let history = [];

  function render() {
    const root = utils.el('div', { id: 'ai-root' }, [
      utils.el('button', { class: 'ai-fab', id: 'ai-fab', 'aria-label': 'AI助手' }, [
        utils.el('span', { class: 'dot' }), utils.el('span', { text: '🤖' })
      ]),
      utils.el('div', { class: 'ai-panel', id: 'ai-panel' }, [
        utils.el('div', { class: 'ai-head' }, [
          utils.el('div', { class: 'avatar', text: '🤖' }),
          utils.el('div', {}, [
            utils.el('b', { text: '王者 AI 教练' }),
            utils.el('small', { text: DEEPSEEK.enabled ? 'DeepSeek 已连接' : '离线本地引擎 · 可接入 DeepSeek' })
          ]),
          utils.el('button', { class: 'ai-close', id: 'ai-close', text: '✕' })
        ]),
        utils.el('div', { class: 'ai-body', id: 'ai-body' }),
        utils.el('div', { class: 'ai-foot' }, [
          utils.el('input', { id: 'ai-input', type: 'text', placeholder: '问我关于英雄的一切…', autocomplete: 'off' }),
          utils.el('button', { class: 'ai-send', id: 'ai-send', text: '➤' })
        ])
      ])
    ]);
    document.body.appendChild(root);

    const fab = document.getElementById('ai-fab');
    const panel = document.getElementById('ai-panel');
    const body = document.getElementById('ai-body');
    const input = document.getElementById('ai-input');
    const close = document.getElementById('ai-close');
    const send = document.getElementById('ai-send');

    fab.addEventListener('click', () => { panel.classList.toggle('show'); if (panel.classList.contains('show') && !body.children.length) welcome(); });
    close.addEventListener('click', () => panel.classList.remove('show'));
    send.addEventListener('click', () => handleSend(input, body));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(input, body); });
  }

  function welcome() {
    const body = document.getElementById('ai-body');
    pushMsg('bot',
      '你好！我是王者百科 AI 教练 🤖\n\n可以这样问我：\n🎯「后羿怎么打兰陵王」对位分析\n📖「妲己新手怎么玩」新手攻略\n🧰「铠怎么出装」出装铭文',
      ['后羿怎么打兰陵王', '妲己新手怎么玩', '铠怎么出装', '这套阵容怎么打']);
  }

  function pushMsg(role, text, quickQ) {
    const body = document.getElementById('ai-body');
    const box = utils.el('div', { class: 'ai-msg ' + role, html: utils.escapeHtml(text).replace(/\n/g, '<br>') });
    if (quickQ && quickQ.length) {
      box.appendChild(utils.el('div', { class: 'ai-quick' }, quickQ.map(q =>
        utils.el('span', { class: 'ai-q', text: q, onclick: () => { document.getElementById('ai-input').value = q; handleSend(document.getElementById('ai-input'), body); } })
      )));
    }
    body.appendChild(box);
    body.scrollTop = body.scrollHeight;
  }

  // 打字机效果
  function pushTyping(role, fullText, cb) {
    const body = document.getElementById('ai-body');
    const box = utils.el('div', { class: 'ai-msg ' + role });
    body.appendChild(box);
    let i = 0;
    const timer = setInterval(() => {
      i += 2;
      box.innerHTML = utils.escapeHtml(fullText.slice(0, i)).replace(/\n/g, '<br>') + '<span style="opacity:.5">▍</span>';
      body.scrollTop = body.scrollHeight;
      if (i >= fullText.length) { clearInterval(timer); box.innerHTML = utils.escapeHtml(fullText).replace(/\n/g, '<br>'); if (cb) cb(); }
    }, 18);
  }

  function handleSend(input, body) {
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    history.push({ role: 'user', content: q });
    pushMsg('user', q);

    // 发送中占位
    const typing = utils.el('div', { class: 'ai-msg bot', text: '正在思考…' });
    body.appendChild(typing); body.scrollTop = body.scrollHeight;

    const finish = (text) => {
      typing.remove();
      pushTyping('bot', text);
      history.push({ role: 'assistant', content: text });
    };

    if (DEEPSEEK.enabled && DEEPSEEK.apiKey) {
      callDeepSeek(history).then(finish).catch(() => finish(localAnswer(q)));
    } else {
      setTimeout(() => finish(localAnswer(q)), 350); // 模拟思考延迟
    }
  }

  function init() {
    render();
  }

  // 供其他页面调用的快捷提问：打开面板并发送问题
  function openAndAsk(question) {
    const panel = document.getElementById('ai-panel');
    const input = document.getElementById('ai-input');
    const body = document.getElementById('ai-body');
    if (!panel || !input || !body) { init(); return setTimeout(() => openAndAsk(question), 50); }
    if (!panel.classList.contains('show')) panel.classList.add('show');
    if (!body.children.length) welcome();
    input.value = question;
    handleSend(input, body);
  }

  return { init, localAnswer, openAndAsk, analyzeMatchup };
})();
