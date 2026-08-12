# 英雄详情生成规范（内容代理必读）

## 任务
为指定英雄编写「专属、差异化、可渲染」的完整详情数据，写入 `json/staging/<英雄id>.js`。
内容基于王者荣耀 S42 版本环境 + 该英雄真实技能机制原创撰写。

## 必读文件（先 Read）
- `json/heroes.js`：英雄基础信息（name/role/position/desc/tags/difficulty/hotness/winrate/pickrate/tier）
- `json/items.js`：装备 id 清单（出装 items 数组只能引用这里存在的 id）
- `json/details.js`：仅参考 `houyi` 的字段结构（禁止复制任何句子/措辞）

## 输出文件格式（每个英雄一个文件）
`json/staging/<id>.js`：
```js
window.WQK_STAGE = window.WQK_STAGE || {};
window.WQK_STAGE["<id>"] = {
  stats: { output:0, survive:0, control:0, mobility:0, support:0, difficulty:0 },
  passive: { name, desc, mechanic, tips, mistake },
  skills: [
    { key:"1", name, cd:"..秒", cost:"..法力", type, desc, mechanic, tips, mistake },
    { key:"2", ... }, { key:"3", ... }
  ],
  builds: [
    { name, tag:"容错新手|高分输出|特化针对", items:[...6个装备id], core, when, tips }, ×3
  ],
  runes: [
    { name, tag, red:"..×10", blue:"..×10", green:"..×10", effect, when }, ×3
  ],
  combos: [
    { name, tag:"入门对线|进阶Gank|团战拉扯", steps:[...3~6步中文短语], tips, when }, ×3
  ],
  counterGood: [ { id, why, how }, ×3 ],
  counterBad:  [ { id, why, avoid }, ×3 ],
  strategy: { opening, laning, teamfight, comeback },
  rank: { tier:"T1", winrate:50.0, pickrate:10.0, bestRanks:["星耀","王者"] }
};
```

## 差异化硬性要求（最重要）
1. **禁止**复制 `json/details.js` 中任何已有英雄（后羿/铠/张飞等）的句子、段落、连招步骤。
2. **禁止**使用角色通用句。以下句子及同义变体一律禁用：
   - 射手类：「站坦克身后走A风筝」「无位移怕刺客」「后期大核」
   - 坦克类：「吸收伤害保护队友」「开团抗伤」
   - 法师类：「技能预判打爆发」「蹲草一套秒」
   - 刺客类：「找准时机切入」「打完离场」
   - 辅助类：「做好视野保护C位」
   必须围绕该英雄**独有的技能机制**撰写（如百里守约的狙击充能、露娜的月下连招、梦奇的胖瘦能量、大禹的水墙分割）。
3. **技能解析**：每个技能的 desc/mechanic/tips/mistake 全部按该技能真实效果写，cd/cost/type 合理。
4. **出装**：按英雄定位差异化。射手之间装备顺序、铭文配比不得相同；战士/坦克/法师同理。items 引用 `json/items.js` 真实 id（注意：装备已改名「黄金圣剑」=id huangjinshengjian，没有 jinseshengjian）。
5. **连招**：按技能逻辑定制步骤，不套站桩射手模板。特殊机制英雄（百里守约/露娜/元歌等）连招独立设计。
6. **克制**：counterGood/counterBad 各 3 个，id 必须存在于 heroes.js，克制关系要符合机制（如射手天敌选刺客，别乱配）。
7. **雷达六维** stats：按英雄特性差异化赋值，同职业不同英雄数值分布不同。
8. **rank**：winrate/pickrate/tier 结合该英雄当前强度合理赋值（tier 参考 heroes.js 里的 tier，可微调），bestRanks 写适配段位。
9. **策略**：opening/laning/teamfight/comeback 四段各自独立成文，贴合该英雄。

## 自查清单（写完必须执行）
1. `node --check json/staging/<id>.js` 语法通过。
2. items 数组里每个 id 都在 `json/items.js` 中存在（用 grep 或读文件核对）。
3. counterGood/counterBad 里每个 id 都在 `json/heroes.js` 中存在。
4. skills 恰好 3 个，builds/runes/combos 恰好 3 个，counter 各 3 个。
5. 每个字段都填了，无空字符串。

## 完成后
输出一行总结：写了哪些英雄、每个文件语法/引用自查结果。
