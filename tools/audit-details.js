/**
 * audit-details.js —— 全站详情巡检 + 查重
 * 用法：node tools/audit-details.js
 *   1) 覆盖巡检：标记仍缺详情的模板英雄
 *   2) 字段巡检：字段缺失 / 克制不足 3+3
 *   3) 引用巡检：出装装备 id、克制英雄 id 是否真实存在
 *   4) 全局查重：跨英雄重复句（≥10字，去空白后完全相同）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['heroes', 'items', 'details']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'json', f + '.js'), 'utf8'), ctx);
}
const W = ctx.window.WQK;
const heroes = W.heroes, items = W.items, details = W.details;
const hids = new Set(heroes.map(h => h.id));
const iids = new Set(items.map(i => i.id));

console.log('==== 覆盖巡检 ====');
const missing = heroes.filter(h => !details[h.id]);
console.log(`英雄总数 ${heroes.length} | 已有详情 ${Object.keys(details).length} | 模板英雄 ${missing.length}`);
if (missing.length) console.log('模板英雄: ' + missing.map(h => h.id).join(', '));

console.log('\n==== 字段巡检 ====');
const incomplete = [];
for (const h of heroes) {
  const d = details[h.id];
  if (!d) continue;
  const missField = ['stats', 'passive', 'skills', 'builds', 'runes', 'combos', 'counterGood', 'counterBad', 'strategy', 'rank']
    .filter(k => !d[k] || (Array.isArray(d[k]) && d[k].length === 0));
  if (missField.length) incomplete.push(`${h.id}: 缺字段 ${missField.join(',')}`);
  if (!d.passive || !d.passive.name) incomplete.push(`${h.id}: passive.name 空`);
  if (d.skills && d.skills.length < 3) incomplete.push(`${h.id}: skills ${d.skills.length}个`);
  if (d.builds && d.builds.length < 3) incomplete.push(`${h.id}: builds ${d.builds.length}套`);
  if (d.counterGood && d.counterGood.length < 3) incomplete.push(`${h.id}: 克制 ${d.counterGood.length}个(<3)`);
  if (d.counterBad && d.counterBad.length < 3) incomplete.push(`${h.id}: 被克 ${d.counterBad.length}个(<3)`);
}
console.log(incomplete.length ? incomplete.join('\n') : '全部字段完整');

console.log('\n==== 引用巡检 ====');
const refErr = [];
for (const [hid, d] of Object.entries(details)) {
  (d.builds || []).forEach(b => (b.items || []).forEach(i => { if (!iids.has(i)) refErr.push(`${hid} 出装缺 ${i}`); }));
  (d.counterGood || []).concat(d.counterBad || []).forEach(c => { if (!hids.has(c.id)) refErr.push(`${hid} 克制缺 ${c.id}`); });
}
console.log(refErr.length ? refErr.join('\n') : '无引用错误');

console.log('\n==== 全局查重 ====');
function sentences(text) {
  return String(text || '').split(/[。！？\n]/)
    .map(s => s.replace(/[\s·—,，、;；:：()（）"'“”]/g, ''))
    .filter(s => s.length >= 10);
}
const seen = {};
for (const [hid, d] of Object.entries(details)) {
  const texts = [
    d.passive ? [d.passive.desc, d.passive.mechanic, d.passive.tips, d.passive.mistake] : [],
    ...(d.skills || []).flatMap(s => [s.desc, s.mechanic, s.tips, s.mistake]),
    ...(d.builds || []).flatMap(b => [b.core, b.when, b.tips]),
    // runes 的 effect 是「同一套铭文的属性公式」，属事实数据而非话术，不参与查重
    ...(d.runes || []).flatMap(r => [r.when]),
    ...(d.combos || []).flatMap(c => [c.tips]),
    ...(d.strategy ? Object.values(d.strategy) : []),
    ...(d.counterGood || []).flatMap(c => [c.why, c.how]),
    ...(d.counterBad || []).flatMap(c => [c.why, c.avoid])
  ];
  for (const t of texts) for (const s of sentences(t)) {
    (seen[s] = seen[s] || []).push(hid);
  }
}
const dups = Object.entries(seen).filter(([s, hs]) => new Set(hs).size > 1);
console.log(`重复句数量: ${dups.length}`);
dups.slice(0, 30).forEach(([s, hs]) => console.log(`  ${[...new Set(hs)].join('/')}: ${s}`));

const exit = (missing.length || incomplete.length || refErr.length || dups.length) ? 1 : 0;
process.exitCode = exit;
