/**
 * heroes.js —— 英雄基础数据（全量英雄清单）
 * ------------------------------------------------------------------
 * 【离线策略说明】本文件为 .js 形式而非 .json，是因为浏览器在 file:// 协议下
 * 禁止 fetch() 读取本地 .json（CORS 限制）。以 <script> 方式引入的 .js 数据
 * 可保证「双击 index.html 直接运行」完全离线可用。
 *
 * 字段说明：
 *   id          英雄唯一标识（用于页面跳转 / 数据关联）
 *   name        英雄名
 *   title       称号
 *   role        定位：坦克 / 战士 / 法师 / 射手 / 刺客 / 辅助
 *   position    位置：对抗路 / 中路 / 发育路 / 游走 / 打野
 *   difficulty  操作难度 1-10
 *   hotness     热度 0-100（用于排序）
 *   winrate     胜率 %（用于排序）
 *   pickrate    出场率 %（用于排序）
 *   tier        当前版本梯度 T0-T3
 *   tags        标签（版本T0 / 强势 / 冷门 / 新手友好 / 高操作 …）
 *   desc        一句话简介
 */
window.WQK = window.WQK || {};

window.WQK.heroes = [
  /* =============== 坦克（16） =============== */
  { id:"baiqi", name:"白起", title:"不败战神", role:"坦克", position:"对抗路", difficulty:6, hotness:82, winrate:51.0, pickrate:10.1, tier:"T1", tags:["版本T1","团战"], desc:"嘲讽控制型坦克，团战先手能力极强，回复与团控兼备。" },
  { id:"chengyaojin", name:"程咬金", title:"热烈之斧", role:"坦克", position:"对抗路", difficulty:4, hotness:80, winrate:50.6, pickrate:9.8, tier:"T2", tags:["单带","回复"], desc:"高回复战士型坦克，越塔单带骚扰能力一流，残血反杀是他的招牌。" },
  { id:"lianpo", name:"廉颇", title:"正义爆轰", role:"坦克", position:"对抗路", difficulty:5, hotness:78, winrate:50.9, pickrate:8.3, tier:"T1", tags:["团控","霸体"], desc:"霸体进场型坦克，技能范围大控制足，配合打野节奏能力出色。" },
  { id:"liubang", name:"刘邦", title:"双面君主", role:"坦克", position:"对抗路", difficulty:6, hotness:76, winrate:50.7, pickrate:7.1, tier:"T2", tags:["全图支援"], desc:"全图传送型坦克，保后排与带线运营两不误，四一分带核心。" },
  { id:"xiangyu", name:"项羽", title:"霸王", role:"坦克", position:"对抗路", difficulty:3, hotness:89, winrate:50.5, pickrate:15.1, tier:"T1", tags:["新手友好","控制"], desc:"攻防兼备的霸王，一技能推人开团，被动残血免伤十分能抗。" },
  { id:"zhubajie", name:"猪八戒", title:"逍遥剑仙", role:"坦克", position:"对抗路", difficulty:6, hotness:79, winrate:50.4, pickrate:8.6, tier:"T2", tags:["回复"], desc:"血牛级回复坦克，一技能跳砸减速，赖线能力极强。" },
  { id:"zhangfei", name:"张飞", title:"万古不变", role:"坦克", position:"游走", difficulty:4, hotness:87, winrate:50.3, pickrate:14.7, tier:"T1", tags:["开团","保护"], desc:"保护型坦克辅助，二技能套盾保C，大招变身反打开团。" },
  { id:"niumo", name:"牛魔", title:"烈焰守卫", role:"坦克", position:"游走", difficulty:5, hotness:83, winrate:50.8, pickrate:12.2, tier:"T1", tags:["团控","保护"], desc:"双段控制坦克，击飞+减伤体系完整，保护射手效果极佳。" },
  { id:"donghuangtaiyi", name:"东皇太一", title:"日蚀", role:"坦克", position:"游走", difficulty:5, hotness:86, winrate:49.8, pickrate:13.5, tier:"T1", tags:["硬控","克制"], desc:"大招压制无可化解，专克一切突进秀操作英雄。" },
  { id:"dunshan", name:"盾山", title:"万里长城", role:"坦克", position:"游走", difficulty:7, hotness:75, winrate:49.5, pickrate:6.2, tier:"T2", tags:["挡飞行物"], desc:"举盾格挡飞行物，专克射手与飞行弹道，团战分割战场。" },
  { id:"sulie", name:"苏烈", title:"长城守卫军", role:"坦克", position:"对抗路", difficulty:6, hotness:77, winrate:50.2, pickrate:7.4, tier:"T2", tags:["复活","开团"], desc:"自带复活甲的男人，大招大范围击飞，先手开团能力强。" },
  { id:"xiahoudun", name:"夏侯惇", title:"不羁之风", role:"坦克", position:"对抗路", difficulty:4, hotness:85, winrate:50.7, pickrate:13.8, tier:"T1", tags:["全面","新手友好"], desc:"技能全面无短板的万金油坦克，能抗能打能控制。" },
  { id:"liuchan", name:"刘禅", title:"暴走机关", role:"坦克", position:"游走", difficulty:3, hotness:80, winrate:50.1, pickrate:9.2, tier:"T2", tags:["推塔","控制"], desc:"拆塔快、控制足的开团型辅助，配合打野越塔能力突出。" },
  { id:"zhuangzhou", name:"庄周", title:"逍遥幻梦", role:"坦克", position:"游走", difficulty:3, hotness:84, winrate:50.6, pickrate:11.5, tier:"T1", tags:["解控","免疫"], desc:"群体解控辅助，专治强控阵容，被动自带免伤。" },
  { id:"zhongkui", name:"钟馗", title:"吞天玄钩", role:"坦克", position:"游走", difficulty:6, hotness:85, winrate:49.7, pickrate:13.1, tier:"T2", tags:["钩子","开团"], desc:"一钩定乾坤的钩子英雄，钩到C位就是一场团战胜利。" },
  { id:"taiyizhenren", name:"太乙真人", title:"炼金大师", role:"坦克", position:"游走", difficulty:6, hotness:76, winrate:50.5, pickrate:5.8, tier:"T2", tags:["复活","加钱"], desc:"自带复活与金币加成的炼金辅助，逆风翻盘利器。" },

  /* =============== 战士（25） =============== */
  { id:"lvbu", name:"吕布", title:"无双之魔", role:"战士", position:"对抗路", difficulty:5, hotness:94, winrate:49.9, pickrate:19.7, tier:"T1", tags:["人气高","真实伤害"], desc:"真实伤害的代言人，附魔后刀刀真伤，打肉打脆都无解。" },
  { id:"guanyu", name:"关羽", title:"一骑当千", role:"战士", position:"对抗路", difficulty:8, hotness:89, winrate:50.4, pickrate:15.6, tier:"T1", tags:["高操作","支援"], desc:"冲锋加速型战士，劈砍推人支援快，玩得好的关羽是团战噩梦。" },
  { id:"huamulan", name:"花木兰", title:"传说之刃", role:"战士", position:"对抗路", difficulty:9, hotness:86, winrate:50.1, pickrate:13.2, tier:"T1", tags:["高操作"], desc:"轻重剑双形态，光速沉默与霸体重剑，操作上限极高。" },
  { id:"kai", name:"铠", title:"破灭刀锋", role:"战士", position:"对抗路", difficulty:4, hotness:92, winrate:50.3, pickrate:17.8, tier:"T1", tags:["新手友好","爆发"], desc:"开大变身一打五的砍王，单挑增伤，操作简单粗暴。" },
  { id:"yase", name:"亚瑟", title:"圣骑之力", role:"战士", position:"对抗路", difficulty:2, hotness:90, winrate:50.0, pickrate:16.5, tier:"T1", tags:["新手入门","沉默"], desc:"新手必玩第一英雄，技能简单全面，沉默打乱一切节奏。" },
  { id:"dianwei", name:"典韦", title:"狂战士", role:"战士", position:"打野", difficulty:3, hotness:91, winrate:50.2, pickrate:16.8, tier:"T1", tags:["打野","收割"], desc:"叠被动滚雪球的后期爸爸，站撸不虚任何近战。" },
  { id:"zhaoyun", name:"赵云", title:"苍天翔龙", role:"战士", position:"打野", difficulty:4, hotness:84, winrate:49.8, pickrate:12.5, tier:"T2", tags:["全面"], desc:"半肉战士型打野，能抗能打能突进，均衡万金油。" },
  { id:"caocao", name:"曹操", title:"鲜血枭雄", role:"战士", position:"对抗路", difficulty:5, hotness:80, winrate:50.5, pickrate:9.3, tier:"T2", tags:["回复","单带"], desc:"一技能三段位移，普攻回血，逆风翻盘型的法伤战士。" },
  { id:"liubei", name:"刘备", title:"仁德义枪", role:"战士", position:"打野", difficulty:5, hotness:79, winrate:49.7, pickrate:8.4, tier:"T2", tags:["近战爆发"], desc:"贴脸散弹战士，爆发高但手短，野区才是他的主场。" },
  { id:"gongbenwuzang", name:"宫本武藏", title:"剑圣", role:"战士", position:"打野", difficulty:6, hotness:83, winrate:50.2, pickrate:10.9, tier:"T1", tags:["版本T1","大招锁定"], desc:"大招锁定脆皮，一技能格挡弹道，版本强势的切C机器。" },
  { id:"yangjian", name:"杨戬", title:"仁者之威", role:"战士", position:"对抗路", difficulty:6, hotness:78, winrate:49.6, pickrate:7.5, tier:"T2", tags:["斩杀","真实伤害"], desc:"收割型战士，大招回血，一技能斩杀标记机制独特。" },
  { id:"damo", name:"达摩", title:"拳僧", role:"战士", position:"对抗路", difficulty:7, hotness:76, winrate:50.0, pickrate:6.8, tier:"T2", tags:["上墙"], desc:"一脚上墙定乾坤，回旋踢是高端局的艺术。" },
  { id:"laofuzi", name:"老夫子", title:"万古之尊", role:"战士", position:"对抗路", difficulty:5, hotness:82, winrate:50.6, pickrate:9.7, tier:"T1", tags:["单带","免伤"], desc:"单挑王，大招捆人免伤，拆塔带线牵制一绝。" },
  { id:"sunce", name:"孙策", title:"江东小霸王", role:"战士", position:"对抗路", difficulty:7, hotness:81, winrate:49.9, pickrate:9.9, tier:"T2", tags:["开团","支援"], desc:"开船全图支援，撞船击飞，团战开团先锋。" },
  { id:"lixin", name:"李信", title:"破灭刀锋", role:"战士", position:"对抗路", difficulty:7, hotness:85, winrate:50.1, pickrate:11.8, tier:"T1", tags:["双形态"], desc:"光暗双形态自由切换，爆发与防守两种玩法。" },
  { id:"xialuote", name:"夏洛特", title:"玫瑰剑士", role:"战士", position:"对抗路", difficulty:8, hotness:80, winrate:50.3, pickrate:8.8, tier:"T2", tags:["连续打击","斩杀"], desc:"叠被动七层剑气，突进连击越打越痛，附带斩杀。" },
  { id:"kuangtie", name:"狂铁", title:"钢铁猛兽", role:"战士", position:"对抗路", difficulty:5, hotness:79, winrate:50.4, pickrate:8.2, tier:"T2", tags:["回复","爆发"], desc:"能量机制强化技能，爆发回复兼备，对线压制力强。" },
  { id:"yao", name:"曜", title:"黎明之刃", role:"战士", position:"打野", difficulty:8, hotness:87, winrate:50.0, pickrate:13.9, tier:"T1", tags:["人气高","高操作"], desc:"星辰之力三连突进，连招华丽能秀能打。" },
  { id:"sikongzhen", name:"司空震", title:"破天战雷", role:"战士", position:"中路", difficulty:7, hotness:83, winrate:50.2, pickrate:10.3, tier:"T1", tags:["版本T1","法术"], desc:"法术战士，远程拉扯近战爆发，双形态摇摆位。" },
  { id:"ying", name:"影", title:"冥界之影", role:"战士", position:"打野", difficulty:6, hotness:88, winrate:50.6, pickrate:12.6, tier:"T1", tags:["新英雄","强势"], desc:"双身位灵活突进的版本新贵，可边可野。" },
  { id:"yunying", name:"云缨", title:"破阵枪", role:"战士", position:"打野", difficulty:8, hotness:81, winrate:49.9, pickrate:9.5, tier:"T2", tags:["三段枪意"], desc:"枪意三段体系，远近攻守兼备，操作多样。" },
  { id:"yadina", name:"雅典娜", title:"圣域余晖", role:"战士", position:"打野", difficulty:8, hotness:74, winrate:50.4, pickrate:4.9, tier:"T2", tags:["复活","突进"], desc:"死后可移动的复活机制，反野带线节奏强势。" },
  { id:"mengtian", name:"蒙恬", title:"重装战士", role:"战士", position:"对抗路", difficulty:7, hotness:73, winrate:49.9, pickrate:4.6, tier:"T3", tags:["冷门","列阵"], desc:"列阵正面免伤，推塔打架阵地战之王。" },
  { id:"machao", name:"马超", title:"铁骑突袭", role:"战士", position:"打野", difficulty:9, hotness:82, winrate:49.5, pickrate:10.1, tier:"T1", tags:["高操作"], desc:"突刺型战士，玩好马超就是移动的矛，操作门槛极高。" },
  { id:"pangu", name:"盘古", title:"开天辟地", role:"战士", position:"打野", difficulty:7, hotness:72, winrate:49.6, pickrate:4.4, tier:"T3", tags:["冷门","缴械"], desc:"缴械普攻英雄的机制怪，专克射手平A流。" },

  /* =============== 法师（28） =============== */
  { id:"daji", name:"妲己", title:"魅惑之狐", role:"法师", position:"中路", difficulty:2, hotness:96, winrate:49.0, pickrate:21.0, tier:"T2", tags:["新手友好","爆发"], desc:"新手第一法师，231一套秒人，简单粗暴。" },
  { id:"anqila", name:"安琪拉", title:"暗夜萝莉", role:"法师", position:"中路", difficulty:3, hotness:95, winrate:48.9, pickrate:20.5, tier:"T2", tags:["新手友好","范围爆发"], desc:"清线快爆发高，2技能命中一套带走。" },
  { id:"wangzhaojun", name:"王昭君", title:"凛冬之女", role:"法师", position:"中路", difficulty:4, hotness:89, winrate:50.3, pickrate:15.8, tier:"T1", tags:["团控","防守"], desc:"范围冰冻团控，大招守塔分割战场一流。" },
  { id:"zhenji", name:"甄姬", title:"洛神", role:"法师", position:"中路", difficulty:3, hotness:90, winrate:49.7, pickrate:17.6, tier:"T2", tags:["新手友好","团控"], desc:"弹射控制法师，团战大招压制力极强。" },
  { id:"xiaoqiao", name:"小乔", title:"小魔女", role:"法师", position:"中路", difficulty:4, hotness:92, winrate:50.6, pickrate:16.9, tier:"T1", tags:["强势","爆发"], desc:"装备成型后一扇子毁天灭地，后期大核。" },
  { id:"zhugeliang", name:"诸葛亮", title:"卧龙先生", role:"法师", position:"中路", difficulty:7, hotness:93, winrate:50.1, pickrate:18.3, tier:"T1", tags:["人气高","收割"], desc:"被动法球+大招斩杀收割，团战连滚雪球。" },
  { id:"diaochan", name:"貂蝉", title:"绝世舞姬", role:"法师", position:"中路", difficulty:8, hotness:91, winrate:50.9, pickrate:14.6, tier:"T1", tags:["高操作","真伤"], desc:"法阵里二技能无敌帧跳舞，真伤回血秀全场。" },
  { id:"zhangliang", name:"张良", title:"言灵之书", role:"法师", position:"中路", difficulty:5, hotness:84, winrate:50.4, pickrate:12.9, tier:"T1", tags:["硬控","压制"], desc:"大招压制无法解除，专治一切花里胡哨。" },
  { id:"zhouyu", name:"周瑜", title:"纵火者", role:"法师", position:"中路", difficulty:6, hotness:83, winrate:50.8, pickrate:11.4, tier:"T1", tags:["版本T1","推进"], desc:"铺火推塔型法师，野区阵地战统治力强。" },
  { id:"mozi", name:"墨子", title:"机关大师", role:"法师", position:"中路", difficulty:6, hotness:82, winrate:50.2, pickrate:10.7, tier:"T2", tags:["远程控制"], desc:"超远炮台+大招范围控制，辅助流玩法也很常见。" },
  { id:"jiangziya", name:"姜子牙", title:"救世主", role:"法师", position:"中路", difficulty:5, hotness:81, winrate:50.5, pickrate:9.8, tier:"T2", tags:["封神","经验"], desc:"封神机制给队友加成，大招超远距离开团。" },
  { id:"wuzetian", name:"武则天", title:"女帝", role:"法师", position:"中路", difficulty:7, hotness:88, winrate:51.1, pickrate:7.6, tier:"T1", tags:["稀有","团控"], desc:"全图大招控制，贵族专属，团战先手能力顶级。" },
  { id:"yingzheng", name:"嬴政", title:"王者", role:"法师", position:"中路", difficulty:7, hotness:85, winrate:50.9, pickrate:8.9, tier:"T1", tags:["远程炮台"], desc:"飞剑穿透全屏，手长风筝无解，后期炮台核心。" },
  { id:"bianque", name:"扁鹊", title:"毒医", role:"法师", position:"中路", difficulty:5, hotness:79, winrate:49.8, pickrate:7.2, tier:"T2", tags:["回复","消耗"], desc:"叠毒机制，团战奶量惊人，持续输出型法师。" },
  { id:"gaojianli", name:"高渐离", title:"重金属", role:"法师", position:"中路", difficulty:6, hotness:80, winrate:50.0, pickrate:8.1, tier:"T2", tags:["范围爆发","免伤"], desc:"大招冲进人群弹琴，范围爆发+免伤，贴脸之王。" },
  { id:"yixing", name:"弈星", title:"天元棋圣", role:"法师", position:"中路", difficulty:8, hotness:77, winrate:51.3, pickrate:6.5, tier:"T1", tags:["版本T1","运营"], desc:"棋子布局控场，大招棋盘分割战场，团队运营核心。" },
  { id:"ganjiangmoye", name:"干将莫邪", title:"铸剑师", role:"法师", position:"中路", difficulty:8, hotness:83, winrate:50.3, pickrate:9.4, tier:"T2", tags:["超远程"], desc:"超远距离双剑齐发，命中即是秒杀，操作要求高。" },
  { id:"nvwa", name:"女娲", title:"创世之神", role:"法师", position:"中路", difficulty:8, hotness:76, winrate:51.0, pickrate:5.9, tier:"T2", tags:["超远程","阵地"], desc:"超远程法阵+传送技能，防守反击型阵地法师。" },
  { id:"shenmengxi", name:"沈梦溪", title:"爆弹怪猫", role:"法师", position:"中路", difficulty:7, hotness:84, winrate:50.6, pickrate:10.2, tier:"T1", tags:["版本T1","支援"], desc:"手长支援快，滚雪球型爆发法师，大招范围轰炸。" },
  { id:"shangguanwaner", name:"上官婉儿", title:"墨仙", role:"法师", position:"中路", difficulty:9, hotness:87, winrate:49.5, pickrate:11.6, tier:"T1", tags:["高操作","无敌"], desc:"大招五段上天不可选中，操作起来就是收割机。" },
  { id:"change", name:"嫦娥", title:"广寒仙子", role:"法师", position:"中路", difficulty:6, hotness:78, winrate:50.8, pickrate:7.8, tier:"T1", tags:["对线强"], desc:"法力护盾+贴脸爆发，中路一霸，反打能力强。" },
  { id:"xishi", name:"西施", title:"沉鱼", role:"法师", position:"中路", difficulty:9, hotness:75, winrate:51.2, pickrate:5.2, tier:"T2", tags:["拉人"], desc:"一技能牵线拉扯控制，团战拉C位就是胜负手。" },
  { id:"yangyuhuan", name:"杨玉环", title:"霓裳羽衣", role:"法师", position:"中路", difficulty:8, hotness:74, winrate:51.5, pickrate:4.8, tier:"T2", tags:["冷门","回血"], desc:"奶妈型法师，技能既能输出也能治疗，功能性强。" },
  { id:"milaidi", name:"米莱狄", title:"机械造物主", role:"法师", position:"中路", difficulty:4, hotness:82, winrate:49.3, pickrate:12.4, tier:"T2", tags:["推塔","召唤"], desc:"召唤机械仆从拆塔一流，推塔流核心，团战稍弱。" },
  { id:"haiyue", name:"海月", title:"幻海梦客", role:"法师", position:"中路", difficulty:7, hotness:79, winrate:50.7, pickrate:8.7, tier:"T2", tags:["大招单挑"], desc:"大招拉人进月宫单挑，出装成型后1v1无敌。" },
  { id:"miyue", name:"芈月", title:"永恒之月", role:"法师", position:"对抗路", difficulty:7, hotness:77, winrate:51.6, pickrate:6.9, tier:"T1", tags:["对线强","单带"], desc:"吸血续航法师，一技能位移，边路压制力极强。" },
  { id:"jinchan", name:"金蝉", title:"渡世之佛", role:"法师", position:"中路", difficulty:6, hotness:78, winrate:50.1, pickrate:7.3, tier:"T2", tags:["减伤","克制"], desc:"紧箍咒克制突进英雄，被动减伤克制爆发。" },
  { id:"dasiming", name:"大司命", title:"司命之神", role:"法师", position:"游走", difficulty:7, hotness:80, winrate:50.5, pickrate:8.2, tier:"T1", tags:["新英雄","强势"], desc:"召唤灵体作战的版本新法师，能辅助能中单。" },

  /* =============== 射手（17） =============== */
  { id:"houyi", name:"后羿", title:"半神之弓", role:"射手", position:"发育路", difficulty:3, hotness:98, winrate:50.8, pickrate:24.2, tier:"T1", tags:["新手友好","版本T1"], desc:"站桩射手代表，分裂箭后期输出恐怖，但无位移。" },
  { id:"luban7", name:"鲁班七号", title:"机关造物", role:"射手", position:"发育路", difficulty:3, hotness:97, winrate:49.6, pickrate:25.5, tier:"T1", tags:["新手友好","推塔"], desc:"扫射型射手，被动百分比伤害打肉极快，推塔机器。" },
  { id:"huangzhong", name:"黄忠", title:"燃魂重炮", role:"射手", position:"发育路", difficulty:4, hotness:85, winrate:49.3, pickrate:12.1, tier:"T2", tags:["炮台","推塔"], desc:"架炮守塔进攻两相宜，后期炮台范围输出爆炸。" },
  { id:"jialuo", name:"伽罗", title:"破魔之箭", role:"射手", position:"发育路", difficulty:4, hotness:90, winrate:50.1, pickrate:16.4, tier:"T2", tags:["后期强","手长"], desc:"超远射程，暴击减速+真伤破盾，后期大核。" },
  { id:"sunshangxiang", name:"孙尚香", title:"千金重弩", role:"射手", position:"发育路", difficulty:6, hotness:95, winrate:50.5, pickrate:20.1, tier:"T1", tags:["爆发","机动"], desc:"翻滚强化普攻，一套翻滚接一炮秒脆皮，灵活爆发。" },
  { id:"direnje", name:"狄仁杰", title:"断案大师", role:"射手", position:"发育路", difficulty:4, hotness:88, winrate:51.8, pickrate:15.2, tier:"T1", tags:["版本T1","解控"], desc:"自带解控与减双抗，全能稳健的射手天花板。" },
  { id:"marke", name:"马可波罗", title:"自由猎手", role:"射手", position:"发育路", difficulty:8, hotness:93, winrate:49.2, pickrate:19.8, tier:"T1", tags:["高机动","真伤"], desc:"位移灵活叠真伤，后期进场收割，操作要求高。" },
  { id:"bailishouyue", name:"百里守约", title:"射神", role:"射手", position:"发育路", difficulty:7, hotness:91, winrate:48.5, pickrate:17.9, tier:"T2", tags:["狙击","视野"], desc:"狙击型射手，视野压制与超远击杀，两极分化严重。" },
  { id:"yuji", name:"虞姬", title:"森之风灵", role:"射手", position:"发育路", difficulty:5, hotness:87, winrate:50.9, pickrate:14.5, tier:"T1", tags:["免疫物理","机动"], desc:"二技能免疫物理伤害，专克物理刺客，输出稳定。" },
  { id:"gongsunli", name:"公孙离", title:"幻舞之心", role:"射手", position:"发育路", difficulty:9, hotness:92, winrate:49.8, pickrate:13.7, tier:"T1", tags:["高操作"], desc:"伞位移秀操作天花板，会玩的阿离对线无敌。" },
  { id:"ailin", name:"艾琳", title:"精灵之舞", role:"射手", position:"发育路", difficulty:5, hotness:80, winrate:50.2, pickrate:9.6, tier:"T2", tags:["法术伤害"], desc:"法术伤害射手，灵活风筝，坦射都可出装。" },
  { id:"chengjisihan", name:"成吉思汗", title:"苍狼末裔", role:"射手", position:"发育路", difficulty:6, hotness:78, winrate:50.6, pickrate:6.8, tier:"T2", tags:["草丛","侦查"], desc:"草丛作战+全图视野侦查，单挑持续输出优秀。" },
  { id:"liyuanfang", name:"李元芳", title:"王都密探", role:"射手", position:"发育路", difficulty:5, hotness:82, winrate:49.9, pickrate:11.3, tier:"T2", tags:["打野","爆发"], desc:"标记爆发+探视野，也可打野，位移灵活。" },
  { id:"mengya", name:"蒙犽", title:"烈炮将", role:"射手", position:"发育路", difficulty:6, hotness:79, winrate:49.4, pickrate:8.5, tier:"T2", tags:["扫射","支援"], desc:"机关炮扫射消耗，大招远程支援，团战AOE强势。" },
  { id:"laixiao", name:"莱西奥", title:"破晓之翼", role:"射手", position:"发育路", difficulty:5, hotness:83, winrate:50.4, pickrate:10.8, tier:"T1", tags:["版本T1"], desc:"滞空输出+范围爆炸，版本热门的机动射手。" },
  { id:"geya", name:"戈娅", title:"沙海飞舟", role:"射手", position:"发育路", difficulty:6, hotness:81, winrate:50.0, pickrate:9.9, tier:"T2", tags:["拉扯"], desc:"漂移机制机动风筝，消耗型射手，团战拉扯强。" },
  { id:"aoyin", name:"敖隐", title:"龙之子", role:"射手", position:"发育路", difficulty:7, hotness:86, winrate:50.7, pickrate:11.7, tier:"T1", tags:["新英雄","强势"], desc:"水龙弹机制技能型射手，全能爆发，版本新贵。" },

  /* =============== 刺客（12） =============== */
  { id:"hanxin", name:"韩信", title:"国士无双", role:"刺客", position:"打野", difficulty:8, hotness:90, winrate:49.6, pickrate:16.3, tier:"T2", tags:["人气高","高机动"], desc:"三段位移节奏打野，带线偷塔牵制，手速决定上限。" },
  { id:"lanlingwang", name:"兰陵王", title:"暗影猎手", role:"刺客", position:"打野", difficulty:6, hotness:88, winrate:50.2, pickrate:14.9, tier:"T1", tags:["隐身","节奏"], desc:"隐身切C节奏王，前期带节奏压制，后期乏力。" },
  { id:"ake", name:"阿轲", title:"影之刃", role:"刺客", position:"打野", difficulty:7, hotness:84, winrate:49.8, pickrate:12.8, tier:"T2", tags:["收割","暴击"], desc:"背刺必暴击，收割型刺客，残局收割无敌。" },
  { id:"libai", name:"李白", title:"青莲剑仙", role:"刺客", position:"打野", difficulty:9, hotness:92, winrate:49.4, pickrate:15.4, tier:"T1", tags:["人气高","高操作"], desc:"神来之笔不可选中，十步杀一人，操作华丽。" },
  { id:"luna", name:"露娜", title:"月光之女", role:"刺客", position:"打野", difficulty:10, hotness:86, winrate:49.7, pickrate:10.6, tier:"T1", tags:["天花板操作"], desc:"月下无限连，操作上限最高的英雄，会玩即乱杀。" },
  { id:"nakelulu", name:"娜可露露", title:"鹰之守望", role:"刺客", position:"打野", difficulty:5, hotness:85, winrate:50.3, pickrate:13.4, tier:"T1", tags:["打野","爆发"], desc:"一屁股坐死C位的爆发打野，简单直接。" },
  { id:"simayi", name:"司马懿", title:"暗影诗人", role:"刺客", position:"打野", difficulty:7, hotness:80, winrate:50.0, pickrate:8.9, tier:"T2", tags:["突进","沉默"], desc:"突进沉默法师刺客，切后排一套带走，节奏快。" },
  { id:"yuange", name:"元歌", title:"无间傀儡", role:"刺客", position:"中路", difficulty:10, hotness:77, winrate:49.9, pickrate:6.4, tier:"T2", tags:["傀儡","操作"], desc:"本体+傀儡双操，变化莫测，操作难度天花板。" },
  { id:"peiqinhu", name:"裴擒虎", title:"虎啸龙吟", role:"刺客", position:"打野", difficulty:9, hotness:78, winrate:50.1, pickrate:7.7, tier:"T1", tags:["前期节奏"], desc:"人虎双形态，前期反野节奏王者，后期乏力。" },
  { id:"jing", name:"镜", title:"破镜之刃", role:"刺客", position:"打野", difficulty:9, hotness:81, winrate:50.4, pickrate:9.0, tier:"T1", tags:["高操作","镜影"], desc:"镜影分身机制，操作华丽上限极高，打野新贵。" },
  { id:"lan", name:"澜", title:"沧之浪客", role:"刺客", position:"打野", difficulty:8, hotness:83, winrate:50.2, pickrate:10.5, tier:"T1", tags:["版本T1","收割"], desc:"连招收割型刺客，半血以下见人就咬，团战绞肉机。" },
  { id:"sunwukong", name:"孙悟空", title:"齐天大圣", role:"刺客", position:"打野", difficulty:5, hotness:94, winrate:49.9, pickrate:20.3, tier:"T1", tags:["人气高","爆发"], desc:"暴击猴一棍秒人，跳棍身法操作简单暴力，人气之王。" },

  /* =============== 辅助（10） =============== */
  { id:"caiwenji", name:"蔡文姬", title:"忘忧的琴师", role:"辅助", position:"游走", difficulty:3, hotness:88, winrate:50.4, pickrate:15.7, tier:"T1", tags:["奶妈","新手友好"], desc:"移动泉水，群体回血+眩晕弹射，保人能力一流。" },
  { id:"sunbin", name:"孙膑", title:"变声少女", role:"辅助", position:"游走", difficulty:5, hotness:84, winrate:50.7, pickrate:12.6, tier:"T1", tags:["版本T1","拉扯"], desc:"加速沉默体系，团战拉扯顶级，运营核心辅助。" },
  { id:"mingshiyin", name:"明世隐", title:"逍遥卦师", role:"辅助", position:"游走", difficulty:3, hotness:81, winrate:49.6, pickrate:11.3, tier:"T2", tags:["新手友好","连线"], desc:"一条链子加攻击或生命，简单无脑的带飞辅助。" },
  { id:"guiguzi", name:"鬼谷子", title:"虚灵道长", role:"辅助", position:"游走", difficulty:8, hotness:79, winrate:50.6, pickrate:8.1, tier:"T1", tags:["开团","隐身"], desc:"隐身拉人开团，节奏型辅助，配合打野抓人无解。" },
  { id:"lubanmaster", name:"鲁班大师", title:"创造者", role:"辅助", position:"游走", difficulty:9, hotness:82, winrate:50.5, pickrate:9.4, tier:"T1", tags:["高操作","保护"], desc:"二技能拉队友位移，极致保C与先手，操作要求高。" },
  { id:"daqiao", name:"大乔", title:"沧海明珠", role:"辅助", position:"游走", difficulty:8, hotness:85, winrate:51.2, pickrate:10.8, tier:"T1", tags:["运营","版本T1"], desc:"传送体系核心，带线运营战术大师，召唤队友群殴。" },
  { id:"yaoling", name:"瑶", title:"鹿灵少女", role:"辅助", position:"游走", difficulty:3, hotness:93, winrate:49.9, pickrate:18.9, tier:"T2", tags:["人气高","附身"], desc:"上身保C的挂件辅助，操作简单上手快，人气极高。" },
  { id:"sangqi", name:"桑启", title:"萤火虫", role:"辅助", position:"游走", difficulty:5, hotness:76, winrate:50.8, pickrate:6.5, tier:"T2", tags:["回复","草丛"], desc:"草丛召唤萤火虫回血，团队回复辅助，功能新颖。" },
  { id:"shaosiyuan", name:"少司缘", title:"衔红雀", role:"辅助", position:"游走", difficulty:7, hotness:80, winrate:50.9, pickrate:8.7, tier:"T1", tags:["新英雄","强势"], desc:"飞燕击退保C的版本强势辅助，先手反打都强。" },
  { id:"duoliya", name:"朵莉亚", title:"蝶恋花", role:"辅助", position:"游走", difficulty:6, hotness:79, winrate:50.7, pickrate:7.9, tier:"T2", tags:["大招刷新","回血"], desc:"给队友刷新大招的机制辅助，团队增益独特。" },

  /* =============== 新增英雄（数据库同步 2026.08） =============== */
  { id:"zhongwuyan", name:"钟无艳", title:"破岩狂斧", role:"战士", position:"对抗路", difficulty:6, hotness:82, winrate:50.3, pickrate:10.4, tier:"T2", tags:["石化","团控"], desc:"石化控制型战士，大招范围回旋，团战搅局能力一流。" },
  { id:"buzhuohuowu", name:"不知火舞", title:"焰之舞姬", role:"法师", position:"中路", difficulty:9, hotness:90, winrate:49.9, pickrate:14.2, tier:"T1", tags:["高操作","灵活"], desc:"翻滚位移型法刺，被动风筝与连招爆发，操作上限极高。" },
  { id:"juyoujing", name:"橘右京", title:"居合剑圣", role:"战士", position:"对抗路", difficulty:7, hotness:84, winrate:50.4, pickrate:11.6, tier:"T1", tags:["远程消耗","斩杀"], desc:"居合剑术战士，二技能晕眩接大招收割，对线压制力强。" },
  { id:"nezha", name:"哪吒", title:"魔童降世", role:"战士", position:"对抗路", difficulty:5, hotness:83, winrate:50.6, pickrate:11.2, tier:"T1", tags:["全图支援","开团"], desc:"全图锁定支援，大招冲入战场切C，团战搅乱阵型。" },
  { id:"bailixuance", name:"百里玄策", title:"秩序猎手", role:"刺客", position:"打野", difficulty:9, hotness:85, winrate:49.7, pickrate:12.7, tier:"T1", tags:["高操作","钩镰"], desc:"钩镰远程收割，击杀刷新被动，秀操作的天花板打野。" },
  { id:"mengqi", name:"梦奇", title:"食梦兽", role:"坦克", position:"对抗路", difficulty:5, hotness:78, winrate:50.2, pickrate:7.6, tier:"T2", tags:["双修","单挑"], desc:"物法双修坦克，胖瘦形态切换，对线单挑能力出色。" },
  { id:"yunzhongjun", name:"云中君", title:"掠云之翼", role:"刺客", position:"打野", difficulty:7, hotness:81, winrate:50.0, pickrate:9.1, tier:"T2", tags:["飞行","穿墙"], desc:"飞行穿墙机制，无视地形 Gank，游走节奏型刺客。" },
  { id:"aguduo", name:"阿古朵", title:"放牧少女", role:"辅助", position:"打野", difficulty:6, hotness:79, winrate:50.7, pickrate:7.8, tier:"T2", tags:["放生野怪","回复"], desc:"放生野怪快速刷野，大招召唤球球，功能型打野。" },
  { id:"zhaohuaizhen", name:"赵怀真", title:"太极真意", role:"战士", position:"打野", difficulty:7, hotness:82, winrate:50.3, pickrate:9.6, tier:"T1", tags:["招式","格挡"], desc:"太极招法战士，格挡反制，能抗能打能控场。" },
  { id:"yalian", name:"亚连", title:"星之祈愿", role:"战士", position:"对抗路", difficulty:6, hotness:84, winrate:50.5, pickrate:10.9, tier:"T1", tags:["新英雄","双形态"], desc:"星能双形态战士，远程消耗近战爆发，版本新贵。" },
  { id:"cang", name:"苍", title:"苍狼之爪", role:"刺客", position:"打野", difficulty:7, hotness:87, winrate:50.4, pickrate:12.3, tier:"T1", tags:["新英雄","强势"], desc:"狼爪突进型刺客，标记斩杀，版本强势打野。" },
  { id:"kongkonger", name:"空空儿", title:"幻影侠盗", role:"刺客", position:"打野", difficulty:8, hotness:86, winrate:50.1, pickrate:11.8, tier:"T1", tags:["分身","灵动"], desc:"分身机制刺客，来去无踪，操作上限极高。" },
  { id:"dayu", name:"大禹", title:"治水圣人", role:"战士", position:"对抗路", difficulty:6, hotness:80, winrate:50.6, pickrate:8.4, tier:"T2", tags:["水墙","阵地"], desc:"治水之神，水墙分割战场，阵地战战士。" },
  { id:"sunquan", name:"孙权", title:"江东霸主", role:"坦克", position:"游走", difficulty:5, hotness:81, winrate:50.5, pickrate:9.2, tier:"T1", tags:["指挥","团队"], desc:"江东霸主，指挥增益型坦克，团队运营核心。" },
  { id:"chizha", name:"蚩奼", title:"上古战神", role:"战士", position:"对抗路", difficulty:7, hotness:79, winrate:50.2, pickrate:8.0, tier:"T2", tags:["重装","突进"], desc:"上古战神，重装突进，正面战场压制力强。" },
  { id:"luyana", name:"卢雅那", title:"秘术圣女", role:"法师", position:"中路", difficulty:8, hotness:80, winrate:50.3, pickrate:8.6, tier:"T2", tags:["远程","爆发"], desc:"秘术法师，超远程消耗与范围爆发兼备。" },
  { id:"hainuo", name:"海诺", title:"时间旅者", role:"法师", position:"中路", difficulty:8, hotness:83, winrate:50.7, pickrate:9.8, tier:"T1", tags:["时间","控制"], desc:"时间系法师，大招回溯战场，运营控制核心。" },
  { id:"yuanliuzhizi", name:"元流之子", title:"万剑之主", role:"战士", position:"中路", difficulty:8, hotness:85, winrate:50.2, pickrate:11.4, tier:"T1", tags:["新英雄","万剑"], desc:"万剑归一，中单战士，远近兼备的摇摆位。" }
];
