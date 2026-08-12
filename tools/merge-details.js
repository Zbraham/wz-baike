/**
 * merge-details.js —— 合并详情暂存数据到 details.js
 * 用法：node tools/merge-details.js [--force]
 *   - 读取 json/staging/*.js 中 window.WQK_STAGE 的内容，合并进现有 details
 *   - 默认跳过已存在英雄（--force 才覆盖）
 *   - 合并后统一序列化为 window.WQK.details = {...}
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);

// 加载现有数据
for (const f of ['heroes', 'items', 'details']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'json', f + '.js'), 'utf8'), ctx);
}
const W = ctx.window.WQK;
const details = W.details || {};
const hids = new Set(W.heroes.map(h => h.id));
const iids = new Set(W.items.map(i => i.id));

const force = process.argv.includes('--force');
const stagingDir = path.join(ROOT, 'json', 'staging');
const files = fs.existsSync(stagingDir) ? fs.readdirSync(stagingDir).filter(f => f.endsWith('.js')) : [];

let added = 0, skipped = 0, errors = 0;
for (const f of files) {
  const fctx = { window: {} };
  vm.createContext(fctx);
  try {
    vm.runInContext(fs.readFileSync(path.join(stagingDir, f), 'utf8'), fctx);
  } catch (e) {
    console.error(`❌ 语法错误 ${f}: ${e.message}`);
    errors++;
    continue;
  }
  const stage = fctx.window.WQK_STAGE || {};
  for (const [hid, d] of Object.entries(stage)) {
    if (!hids.has(hid)) { console.warn(`⚠️ ${hid} 不在英雄库中，跳过`); continue; }
    if (details[hid] && !force) { skipped++; continue; }
    // 基础结构校验
    const ok = d && typeof d === 'object' && d.stats && d.passive && Array.isArray(d.skills) && d.skills.length >= 3
      && Array.isArray(d.builds) && d.builds.length >= 3 && Array.isArray(d.runes) && d.runes.length >= 3
      && Array.isArray(d.combos) && d.combos.length >= 3 && Array.isArray(d.counterGood) && Array.isArray(d.counterBad)
      && d.strategy && d.rank;
    if (!ok) { console.error(`❌ ${hid} 结构不完整，跳过`); errors++; continue; }
    // 引用校验
    let refErr = [];
    d.builds.forEach(b => (b.items || []).forEach(i => { if (!iids.has(i)) refErr.push('装备:' + i); }));
    d.counterGood.concat(d.counterBad).forEach(c => { if (!hids.has(c.id)) refErr.push('英雄:' + c.id); });
    if (refErr.length) { console.error(`❌ ${hid} 引用错误: ${refErr.join(', ')}`); errors++; continue; }
    details[hid] = d;
    added++;
  }
}

// 序列化写入
const out = `/**
 * details.js —— 英雄完整详情数据（自动合并生成，勿手改结构）
 * 生成：node tools/merge-details.js
 */
window.WQK = window.WQK || {};
window.WQK.details = ${JSON.stringify(details, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'json', 'details.js'), out, 'utf8');
console.log(`\n合并完成：新增 ${added}，跳过 ${skipped}，错误 ${errors}`);
console.log(`当前详情英雄总数：${Object.keys(details).length} / ${W.heroes.length}`);
