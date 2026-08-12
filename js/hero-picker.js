/**
 * hero-picker.js —— 可搜索英雄选择器（共享组件）
 * 克制查询页与英雄对比页复用。返回 picker 对象：{ selected, select(id) }。
 * 依赖：utils、data。需先于使用它的页面脚本加载。
 */
window.WQK = window.WQK || {};
window.WQK.heroPicker = (function () {
  'use strict';

  const utils = window.WQK.utils;
  const data = window.WQK.data;

  /* 创建选择器并挂载到 host（不存在时静默降级） */
  function create(host, placeholder, onChange) {
    const self = { selected: null };
    if (!host) return self; // 防御：宿主不存在时静默降级
    const box = utils.el('div', { style: 'position:relative' }, [
      utils.el('label', { class: 'text-dim', style: 'font-size:12px;display:block;margin-bottom:6px', text: placeholder }),
      utils.el('div', {
        class: 'row', style: 'cursor:pointer;padding:10px 14px',
        onclick: () => toggle(true)
      }, [
        utils.el('img', { id: 'sel-img', class: 's-ico', style: 'width:34px;height:34px;border-radius:10px;background:var(--tint)', src: utils.charIcon('?') }),
        utils.el('div', { style: 'flex:1' }, [
          utils.el('div', { id: 'sel-name', class: 'text-sm', style: 'color:var(--text-3)', text: '点击选择英雄' }),
          utils.el('div', { id: 'sel-sub', class: 'text-dim', style: 'font-size:11px', text: '' })
        ]),
        utils.el('span', { style: 'color:var(--text-3)', text: '▾' })
      ]),
      utils.el('div', { id: 'drop', class: 'search-drop', style: 'left:0;right:0;top:calc(100% + 6px)' })
    ]);
    host.appendChild(box);

    const drop = box.querySelector('#drop');
    const img = box.querySelector('#sel-img');
    const nm = box.querySelector('#sel-name');
    const sub = box.querySelector('#sel-sub');
    // 输入框作为 drop 的持久子节点，只在初始化时插入一次；重渲染只更新列表区，
    // 避免「输入框被 innerHTML 清掉再插回导致失焦、只能敲一个字符」的问题。
    const input = utils.el('input', { class: 'input', style: 'border-radius:10px;margin:10px 12px 4px;width:calc(100% - 24px)', type: 'text', placeholder: '搜索英雄名…', autocomplete: 'off' });
    const listBox = utils.el('div', { style: 'max-height:320px;overflow-y:auto' });
    drop.appendChild(input);
    drop.appendChild(listBox);

    function toggle(show) {
      if (show) {
        drop.classList.add('show');
        input.value = '';            // 每次打开清空搜索词，展示完整热门列表
        renderList('');
        setTimeout(() => input.focus(), 30);
      } else {
        drop.classList.remove('show');
      }
    }

    function renderList(kw) {
      listBox.innerHTML = '';        // 只清列表区，输入框不受影响、焦点不丢失
      const kwl = kw.toLowerCase();
      const list = data.heroes()
        .filter(h => !kwl || h.name.toLowerCase().includes(kwl) || h.title.toLowerCase().includes(kwl))
        .sort((x, y) => y.hotness - x.hotness)
        .slice(0, 12);
      list.forEach(h => {
        listBox.appendChild(utils.el('div', { class: 'search-item', onclick: () => {
          self.selected = h.id;
          img.src = utils.heroAvatar(h, 34);
          nm.textContent = h.name;
          nm.style.color = 'var(--text)';
          sub.textContent = h.title + ' · ' + h.role + ' · ' + h.position;
          toggle(false);
          if (onChange) onChange(h.id);
        } }, [
          utils.el('img', { src: utils.heroAvatar(h, 30), alt: h.name }),
          utils.el('div', {}, [
            utils.el('div', { class: 'nm', text: h.name }),
            utils.el('div', { class: 'tl', text: h.title + ' · ' + h.role })
          ])
        ]));
      });
      if (!list.length) listBox.appendChild(utils.el('div', { class: 'search-empty', text: '未找到「' + kw + '」' }));
    }

    input.addEventListener('input', () => renderList(input.value));
    document.addEventListener('click', (e) => { if (!box.contains(e.target)) toggle(false); });

    // 预设选择
    self.select = function (id) {
      const h = data.getHero(id);
      if (h) { self.selected = id; img.src = utils.heroAvatar(h, 34); nm.textContent = h.name; nm.style.color = 'var(--text)'; sub.textContent = h.title + ' · ' + h.role + ' · ' + h.position; }
    };
    return self;
  }

  return { create };
})();
