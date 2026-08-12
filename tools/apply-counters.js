/**
 * apply-counters.js —— 为已有详情英雄补全第3个克制/被克制条目
 * 读取 json/staging/_counters.js 的 window.WQK_COUNTERS = { id: { good:{id,why,how}, bad:{id,why,avoid} } }
 * 仅在该英雄 counterGood/counterBad 少于 3 个、且不重复已有 id 时追加。
 * 用法：node tools/apply-counters.js （在 merge-details.js 之后运行）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['heroes', 'details']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'json', f + '.js'), 'utf8'), ctx);
}
const W = ctx.window.WQK;
const details = W.details;
const hids = new Set(W.heroes.map(h => h.id));

const file = path.join(ROOT, 'json', 'staging', '_counters.js');
let counters = {};
if (fs.existsSync(file)) {
  const fctx = { window: {} };
  vm.createContext(fctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), fctx);
  counters = fctx.window.WQK_COUNTERS || {};
}

let added = 0;
for (const [hid, c] of Object.entries(counters)) {
  const d = details[hid];
  if (!d) { console.warn(`⚠️ ${hid} 无详情，跳过`); continue; }
  const push = (arr, obj) => {
    if (!obj || !obj.id) return false;
    if (!hids.has(obj.id)) { console.warn(`⚠️ ${hid} 追加英雄 ${obj.id} 不存在`); return false; }
    if (arr.length >= 3 || arr.some(x => x.id === obj.id)) return false;
    arr.push(obj); return true;
  };
  if (push(d.counterGood, c.good)) added++;
  if (push(d.counterBad, c.bad)) added++;
}

const out = `/**
 * details.js —— 英雄完整详情数据（自动合并生成，勿手改结构）
 * 生成：node tools/merge-details.js && node tools/apply-counters.js
 */
window.WQK = window.WQK || {};
window.WQK.details = ${JSON.stringify(details, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'json', 'details.js'), out, 'utf8');
console.log(`克制补全完成：追加 ${added} 条`);
