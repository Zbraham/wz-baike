/**
 * tiers.js —— 英雄梯度数据（按位置）
 * 每个条目字段：
 *   id        英雄 id
 *   reason    强势原因
 *   advantage 版本优势
 *   flaw      短板缺陷
 *   ranks     适配段位
 */
window.WQK = window.WQK || {};

window.WQK.tiers = {
  "对抗路": [
    { tier:"T0", heroes:[
      { id:"kai", reason:"开大变身伤害恐怖，一打五的砍王", advantage:"版本爆发与吸血装备强化，铠的成型收益拉满", flaw:"大招冷却较长，变身结束后的真空期较虚", ranks:"全部段位" },
      { id:"laofuzi", reason:"单挑王+大招捆人免伤，四一分带核心", advantage:"装备成型后可一打二，单带牵扯敌方双人", flaw:"团战切入时机难把握，进场容易被集火", ranks:"星耀以上" }
    ]},
    { tier:"T1", heroes:[
      { id:"lvbu", reason:"附魔后刀刀真实伤害，打肉打脆都疼", advantage:"针对版本肉坦联盟，真伤无视护甲", flaw:"腿短怕拉扯，2技能没叠好易被风筝", ranks:"全部段位" },
      { id:"huamulan", reason:"轻重剑双形态，光速沉默压制力强", advantage:"高端局对线压制任何战士", flaw:"操作门槛极高，需要熟练度支撑", ranks:"王者以上" },
      { id:"guanyu", reason:"冲锋劈砍支援快，团战推人搅乱阵型", advantage:"版本节奏快，关羽的支援能力吃香", flaw:"怕减速控制，操作难度高", ranks:"王者以上" },
      { id:"lixin", reason:"光暗双形态，爆发与防守自由切换", advantage:"线上换血能力强，能抗能打", flaw:"切形态需要节奏，新手容易卡手", ranks:"星耀以上" },
      { id:"baiqi", reason:"嘲讽团控+高回复，团战先手能力顶级", advantage:"版本坦辅强化，白起开团收益大", flaw:"一技能命中率决定上限，空嘲讽约等于白给", ranks:"星耀以上" },
      { id:"xiahoudun", reason:"技能全面无短板，能抗能打能控制", advantage:"万金油适应性，任何阵容都能掏", flaw:"各方面都不突出，大后期输出乏力", ranks:"全部段位" },
      { id:"nezha", reason:"全图锁定支援，大招进场切C", advantage:"版本节奏快，哪吒全图开团收益大", flaw:"依赖大招进场，空大较伤", ranks:"星耀以上" },
      { id:"juyoujing", reason:"居合晕眩+大招斩杀，对线压制强", advantage:"技能远程消耗，能抗能打", flaw:"二技能命中率决定上限", ranks:"星耀以上" },
      { id:"yalian", reason:"双形态灵活切换，远近兼备", advantage:"版本新贵，对线万金油", flaw:"需要熟练度", ranks:"星耀以上" }
    ]},
    { tier:"T2", heroes:[
      { id:"chengyaojin", reason:"高回复单带骚扰，逆风也能拖死对面", ranks:"星耀以下" },
      { id:"caocao", reason:"三段位移+普攻回血，逆风翻盘型", ranks:"星耀以上" },
      { id:"xialuote", reason:"七层剑气突进连击，附带斩杀", ranks:"王者以上" },
      { id:"sunce", reason:"开船全图支援，撞船击飞开团", ranks:"星耀以上" },
      { id:"kuangtie", reason:"能量强化技能，对线压制力强", ranks:"星耀以上" },
      { id:"zhubajie", reason:"血牛回复坦克，赖线能力极强", ranks:"星耀以下" },
      { id:"zhongwuyan", reason:"石化团控，大招范围回旋", ranks:"星耀以上" },
      { id:"mengqi", reason:"物法双修，单挑能力出色", ranks:"星耀以上" },
      { id:"dayu", reason:"水墙分割战场，阵地战", ranks:"星耀以上" },
      { id:"chizha", reason:"重装突进，正面压制", ranks:"绝活专用" }
    ]},
    { tier:"T3", heroes:[
      { id:"damo", reason:"上墙机制难打全，操作性价比低", ranks:"高段位绝活哥" },
      { id:"pangu", reason:"缴械克制普攻流，但自身笨重", ranks:"绝活专用" },
      { id:"mengtian", reason:"列阵阵地战，但灵活性差", ranks:"冷门" }
    ]}
  ],

  "中路": [
    { tier:"T0", heroes:[
      { id:"zhouyu", reason:"铺火推进+野区阵地战统治力", advantage:"版本推塔节奏加快，周瑜的推进价值凸显", flaw:"怕强开团阵容，自己较脆", ranks:"王者以上" },
      { id:"yixing", reason:"棋盘分割战场+团队运营核心", advantage:"版本抱团运营，弈星大招团战无解", flaw:"操作门槛高，极度依赖团队配合", ranks:"巅峰赛" }
    ]},
    { tier:"T1", heroes:[
      { id:"wangzhaojun", reason:"范围冰冻团控，大招守塔分割战场", advantage:"版本团战频率高，王昭君控制收益大", flaw:"技能需要预判，贴脸输出时较危险", ranks:"全部段位" },
      { id:"xiaoqiao", reason:"装备成型后一扇子毁天灭地", advantage:"后期大核，翻盘能力极强", flaw:"前期较弱，发育周期长", ranks:"星耀以上" },
      { id:"zhugeliang", reason:"被动法球+大招斩杀收割", advantage:"版本节奏快，诸葛亮收割滚雪球能力强", flaw:"依赖装备与收割时机，逆风乏力", ranks:"星耀以上" },
      { id:"diaochan", reason:"法阵无敌帧跳舞，真伤回血秀全场", advantage:"克制笨重坦克联盟", flaw:"操作要求极高，二技能断放即死", ranks:"王者以上" },
      { id:"shenmengxi", reason:"手长支援快，滚雪球爆发法师", advantage:"版本支援节奏快，猫的推塔与游走价值高", flaw:"后期爆发一般，依赖前中期滚雪球", ranks:"星耀以上" },
      { id:"shangguanwaner", reason:"大招五段上天不可选中", advantage:"切C能力顶级，克制无位移射手", flaw:"操作门槛极高，断大直接蒸发", ranks:"王者以上" },
      { id:"hainuo", reason:"大招回溯，时间系运营控制", advantage:"版本运营节奏，海诺控场价值高", flaw:"操作门槛高，依赖配合", ranks:"王者以上" },
      { id:"yuanliuzhizi", reason:"万剑远程压制，中单战士摇摆位", advantage:"版本新贵，对线压制法师", flaw:"需要熟练度", ranks:"星耀以上" },
      { id:"buzhuohuowu", reason:"翻滚位移法刺，连招爆发", advantage:"克制无位移脆皮", flaw:"操作要求极高", ranks:"王者以上" }
    ]},
    { tier:"T2", heroes:[
      { id:"daji", reason:"231一套秒人，新手神器", ranks:"低分段" },
      { id:"anqila", reason:"清线快爆发高，但二技能需预判", ranks:"低分段" },
      { id:"zhenji", reason:"弹射团控，大招压制力强", ranks:"全部段位" },
      { id:"ganjiangmoye", reason:"超远双剑齐发，命中即秒", ranks:"王者以上" },
      { id:"change", reason:"法力护盾+贴脸爆发，对线一霸", ranks:"星耀以上" },
      { id:"xishi", reason:"牵线拉C位，团战胜负手", ranks:"王者以上" },
      { id:"haiyue", reason:"大招拉人进月宫单挑", ranks:"星耀以上" },
      { id:"milaidi", reason:"召唤机械仆从拆塔流", ranks:"低分段" },
      { id:"luyana", reason:"超远程消耗与范围爆发", ranks:"王者以上" }
    ]},
    { tier:"T3", heroes:[
      { id:"bianque", reason:"叠毒机制拖节奏，版本收益一般", ranks:"冷门" },
      { id:"gaojianli", reason:"贴脸弹琴需要进场，容错低", ranks:"绝活专用" },
      { id:"yangyuhuan", reason:"奶妈法师功能性强但输出软", ranks:"冷门" }
    ]}
  ],

  "发育路": [
    { tier:"T0", heroes:[
      { id:"houyi", reason:"分裂箭后期输出恐怖，站桩射手回归", advantage:"版本射手装备成型快，后羿团战伤害无解", flaw:"无位移，怕刺客切入", ranks:"全部段位" },
      { id:"direnje", reason:"自带解控+减双抗，全能稳健", advantage:"版本坦辅多，狄仁杰打坦快还解控", flaw:"输出依赖装备，前中期伤害一般", ranks:"星耀以上" }
    ]},
    { tier:"T1", heroes:[
      { id:"luban7", reason:"被动百分比伤害打肉极快，推塔机器", advantage:"版本肉装流行，鲁班百分比伤害吃香", flaw:"扫射需要站桩，无位移怕突脸", ranks:"全部段位" },
      { id:"sunshangxiang", reason:"翻滚强化普攻，一套秒脆皮", advantage:"机动性与爆发兼具，容错高", flaw:"前期伤害依赖装备，对线偏弱", ranks:"星耀以上" },
      { id:"marke", reason:"位移灵活叠真伤，后期进场收割", advantage:"版本射手需要自保，马克机动性占优", flaw:"操作要求高，真伤叠层需要贴脸", ranks:"王者以上" },
      { id:"yuji", reason:"二技能免疫物理伤害，专克物理刺客", advantage:"版本刺客多是物理爆发，虞姬自保能力强", flaw:"法术伤害后期难以应对", ranks:"全部段位" },
      { id:"gongsunli", reason:"伞位移秀操作天花板，对线压制", advantage:"前中期压制力极强，滚雪球快", flaw:"操作门槛极高，后期怕AOE", ranks:"王者以上" },
      { id:"laixiao", reason:"滞空输出+范围爆炸，机动射手", advantage:"版本新贵，生存与输出兼备", flaw:"需要熟练度，技能真空期弱", ranks:"星耀以上" }
    ]},
    { tier:"T2", heroes:[
      { id:"jialuo", reason:"超远射程，暴击减速+真伤破盾", ranks:"星耀以上" },
      { id:"huangzhong", reason:"架炮守塔进攻两相宜", ranks:"全部段位" },
      { id:"bailishouyue", reason:"狙击与视野，两极分化严重", ranks:"绝活专用" },
      { id:"ailin", reason:"法术伤害射手，灵活风筝", ranks:"星耀以上" },
      { id:"liyuanfang", reason:"标记爆发+探视野，可打野", ranks:"星耀以上" },
      { id:"mengya", reason:"扫射消耗，大招远程支援", ranks:"星耀以上" },
      { id:"geya", reason:"漂移风筝拉扯，消耗型", ranks:"王者以上" }
    ]},
    { tier:"T3", heroes:[
      { id:"chengjisihan", reason:"草丛作战依赖环境，泛用性一般", ranks:"冷门" }
    ]}
  ],

  "游走": [
    { tier:"T0", heroes:[
      { id:"daqiao", reason:"传送体系战术核心，运营第一辅助", advantage:"版本节奏加快，大乔联动队友价值极高", flaw:"操作门槛高，低分段打不出效果", ranks:"王者以上" },
      { id:"sunbin", reason:"加速+沉默+抬血，拉扯体系无敌", advantage:"版本坦克联盟，孙膑拉扯克制笨重阵容", flaw:"前期较软，需要队友配合", ranks:"星耀以上" }
    ]},
    { tier:"T1", heroes:[
      { id:"zhangfei", reason:"套盾保C+大招变身反打", advantage:"版本保射手体系，张飞保护能力顶级", flaw:"大招需要怒气积累，前期较弱", ranks:"全部段位" },
      { id:"niumo", reason:"双段控制+减伤，保护体系完整", advantage:"版本肉辅流行，牛魔抗伤能力出色", flaw:"二技能需要预判，空击退会脱节", ranks:"星耀以上" },
      { id:"caiwenji", reason:"移动泉水，群体回血+眩晕弹射", advantage:"版本持续作战频繁，奶量收益高", flaw:"自身脆，怕强开团", ranks:"全部段位" },
      { id:"guiguzi", reason:"隐身拉人开团，节奏型辅助", advantage:"版本抓节奏，鬼谷子配合打野无解", flaw:"操作要求高，拉空直接崩盘", ranks:"王者以上" },
      { id:"lubanmaster", reason:"拉队友位移，极致保C与先手", advantage:"高分段保护射手体系核心", flaw:"操作门槛极高，容易拉错队友", ranks:"巅峰赛" },
      { id:"donghuangtaiyi", reason:"大招压制无可化解，专克突进", advantage:"克制版本强势刺客战士", flaw:"一换一机制，自身容易白给", ranks:"星耀以上" },
      { id:"shaosiyuan", reason:"飞燕击退保C，先手反打都强", advantage:"版本新贵，功能全面", flaw:"新英雄需要熟练度", ranks:"星耀以上" },
      { id:"sunquan", reason:"指挥增益，团队运营核心", advantage:"版本团队节奏，孙权增益价值高", flaw:"需要配合", ranks:"星耀以上" }
    ]},
    { tier:"T2", heroes:[
      { id:"zhuangzhou", reason:"群体解控，专治强控阵容", ranks:"星耀以上" },
      { id:"zhongkui", reason:"钩子开团，一钩定乾坤", ranks:"全部段位" },
      { id:"mingshiyin", reason:"连线加成，简单带飞", ranks:"低分段" },
      { id:"yaoling", reason:"附身保C，操作简单人气高", ranks:"全部段位" },
      { id:"sangqi", reason:"萤火虫回血，团队回复辅助", ranks:"星耀以上" },
      { id:"duoliya", reason:"刷新队友大招，机制独特", ranks:"王者以上" },
      { id:"dunshan", reason:"举盾挡飞行物，专克射手", ranks:"王者以上" }
    ]},
    { tier:"T3", heroes:[
      { id:"taiyizhenren", reason:"复活机制吃队友，单排难以发挥", ranks:"绝活专用" },
      { id:"sulie", reason:"开团腿短，容易被风筝", ranks:"星耀以下" }
    ]}
  ],

  "打野": [
    { tier:"T0", heroes:[
      { id:"dianwei", reason:"叠被动后期无敌站撸", advantage:"版本肉装与红刀强化，典韦成型快", flaw:"前期较弱怕反野，发育周期长", ranks:"星耀以上" },
      { id:"lan", reason:"半血以下收割，团战绞肉机", advantage:"版本节奏快，澜收割收益大", flaw:"操作与进场时机要求高", ranks:"王者以上" }
    ]},
    { tier:"T1", heroes:[
      { id:"sunwukong", reason:"暴击猴一棍秒人，人气之王", advantage:"简单暴力的爆发打野，全段位通吃", flaw:"前期刷野慢，怕被反野", ranks:"全部段位" },
      { id:"hanxin", reason:"三段位移带线偷塔牵制", advantage:"节奏型打野，带线偷塔价值高", flaw:"操作要求高，后期身板脆", ranks:"星耀以上" },
      { id:"libai", reason:"神来之笔不可选中，操作华丽", advantage:"人气高，切C能力强", flaw:"前期弱势，需要发育", ranks:"王者以上" },
      { id:"lanlingwang", reason:"隐身切C节奏王，前期压制", advantage:"版本前中期节奏重要，兰陵王优势明显", flaw:"后期乏力，逆风隐身如同透明", ranks:"星耀以上" },
      { id:"nakelulu", reason:"一屁股坐死C位，简单爆发", advantage:"抓人效率高，配合辅助开团无解", flaw:"怕控制，进场时机关键", ranks:"全部段位" },
      { id:"gongbenwuzang", reason:"大招锁定脆皮，版本强势切C", advantage:"版本强势，锁定机制克制灵活英雄", flaw:"一技能需要格挡准，操作要求高", ranks:"星耀以上" },
      { id:"jing", reason:"镜影分身，操作华丽上限极高", advantage:"版本爆发高，收割能力强", flaw:"操作门槛极高", ranks:"巅峰赛" },
      { id:"peiqinhu", reason:"人虎双形态，前期反野节奏王者", advantage:"版本前中期反野价值高", flaw:"后期乏力，逆风极难翻盘", ranks:"王者以上" },
      { id:"ying", reason:"双身位灵活突进，版本新贵", advantage:"新英雄机制全面，可边可野", flaw:"需要熟练度", ranks:"星耀以上" },
      { id:"bailixuance", reason:"钩镰远程收割，击杀刷新", advantage:"版本节奏快，玄策收割滚雪球", flaw:"操作门槛极高", ranks:"王者以上" },
      { id:"zhaohuaizhen", reason:"太极格挡反制，能抗能打", advantage:"版本反制流强势", flaw:"需要熟练度", ranks:"星耀以上" },
      { id:"cang", reason:"狼爪标记斩杀，版本强势", advantage:"新英雄机制全面", flaw:"需要熟练度", ranks:"星耀以上" },
      { id:"kongkonger", reason:"分身灵动，来去无踪", advantage:"版本操作流上限高", flaw:"操作门槛极高", ranks:"王者以上" }
    ]},
    { tier:"T2", heroes:[
      { id:"ake", reason:"背刺必暴击，残局收割无敌", ranks:"星耀以上" },
      { id:"zhaoyun", reason:"半肉战士打野，均衡万金油", ranks:"全部段位" },
      { id:"luna", reason:"月下无限连，操作天花板", ranks:"王者以上" },
      { id:"yadina", reason:"死后可移动，反野带线节奏强", ranks:"绝活专用" },
      { id:"yunying", reason:"三段枪意，远近攻守兼备", ranks:"星耀以上" },
      { id:"liubei", reason:"贴脸散弹爆发，野区主场", ranks:"星耀以上" },
      { id:"yunzhongjun", reason:"飞行穿墙，无视地形Gank", ranks:"星耀以上" },
      { id:"aguduo", reason:"放生野怪快速刷野，功能型", ranks:"星耀以上" }
    ]},
    { tier:"T3", heroes:[
      { id:"pangu", reason:"缴械机制克制普攻，但灵活性差", ranks:"绝活专用" },
      { id:"simayi", reason:"突进沉默切后排，节奏波动大", ranks:"星耀以上" }
    ]}
  ]
};
