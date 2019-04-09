class StarData {
	public constructor() {
	}

	public static CAN_ATTACK=		Math.pow(2,11);// 可被攻击
	public static CAN_NEED_CO=		Math.pow(2,12);// 跟其他怪物产生碰撞，速度受影响

	public static StarConfig = {
		'101': {
			id: 101,
			modle: '1_png',		// 模型名称
			speed: 0.1,			// 移动速度
			attack_speed: 0.3,	// 收到攻击之后的移动速度， 那减速的时间段呢（减速多久）
			snow_time:200,		// 减速的持续时长
			group:StarData.CAN_ATTACK,
			// 引力属性，包含参数（）
		},	// 小陨石101
		'102': {
			id:102,
			modle:'2_png',
			speed:0.2,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK,
		}, // 冲击陨石 102
		'103':{
			id:103,
			modle:'3_png',
			speed:0.1,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK,

			create_new_star:{ // 生成新的怪，移动一定时间产生
				time:1000, // 每移动time的时间，就产生一个新的怪物
				id:'104',	// 怪物id
				level:1,	// 怪物等级
				life:5000,	// 怪物的生存时间，ms

				scaleX:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scaleY:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scale:{time:1000, scaleX:1.4, scaleY:1}	// 怪物随时间的缩放，相对于原始尺寸
			}
		},//熔岩陨石 103
		'104':{
			id:104,
			modle:'4_png',
			speed:0,
			attack_speed:0,
			group:StarData.CAN_ATTACK,
		}, // 岩浆（特殊）		104
		'105':{
			id:105,
			modle:'4_png',
			speed:0.1,
			attack_speed:0.5,
			group:StarData.CAN_ATTACK,
			follow:{
				scope:100,// 警戒范围,
				add_speed:3,// 每秒加速
			}
		}, // 磁铁陨石		105, 跟踪怪
		'106':{
			id:106,
			modle:'4_png',
			speed:0.1,
			attack_speed:0.5,
			group:StarData.CAN_ATTACK,
			create_new_star:{ // 生成新的怪，移动一定时间产生
				time:1000, // 每移动time的时间，就产生一个新的怪物
				id:'107',	// 怪物id
				level:1,	// 怪物等级
				life:5000,	// 怪物的生存时间，ms

				scaleX:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scaleY:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scale:{time:1000, scaleX:1.4, scaleY:1}	// 怪物随时间的缩放，相对于原始尺寸
			}
		},//彗星
		'107':{
			id:107,
			modle:'4_png',
			speed:0,
			attack_speed:0,
			group:StarData.CAN_ATTACK
		},// 慧尾

		'108':{
			id:108,
			modle:'4_png',
			speed:0.1,
			attack_speed:0.5,
			group:StarData.CAN_ATTACK,
			create_new_star:{ // 生成新的怪，移动一定时间产生
				time:1000, // 每移动time的时间，就产生一个新的怪物
				id:'109',	// 怪物id
				level:1,	// 怪物等级
				life:5000,	// 怪物的生存时间，ms

				scaleX:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scaleY:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scale:{time:1000, scaleX:1.4, scaleY:1}	// 怪物随时间的缩放，相对于原始尺寸
			}
		},//冰块陨石
		'109':{
			id:109,
			modle:'4_png',
			speed:0,
			attack_speed:0,
			group:StarData.CAN_ATTACK
		},// 碎冰（特殊）

		'110':{
			id:110,
			modle:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_NEED_CO,
			rebound:true,	// 反弹属性，碰到其他怪之后，会反弹
		},

		'111':{
			id:111,
			modle:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK,
			scale_info:[// 缩放规则，time是生存周期时间区间，wait为true，表示这个阶段不变化，否则，在time之间范围内变更为scaleX和scaleY 的缩放比例, 此过程会循环进行
				{time:1000, wait:false, scaleX:2, scaleY:2},
				{time:1000, wait:true, scaleX:2, scaleY:2},
				{time:1000, wait:false, scaleX:1, scaleY:1},
			],
			add_blood:{
				total:2,	// 最大增加的比例，按照初始血量作为参考
				speed:0.1, // 每秒增加的比例，按照初始血量来增加
			}
		},	// 星际尘埃
		'112':{
			id:112,
			modle:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_NEED_CO,
			eat:{
				bloods:1,	// 增加当前血量的比例
				scale:0.15, // 增加体型的比例, 针对原始尺寸
			}, 	// 是否具有吞噬属性
		}, // 微型黑洞
		'113':{
			id:113,
			modle:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK,
			add_speed:[
				{time:2000,wait:false,add:0.0001}, // 每ms增加的速度
				{time:1000,wait:false,add:-0.0002},
				{time:2000,wait:true, add:0}		// wait为true表示等待
				], // 加速度配置
		}, // 风暴球团

		'114':{
			id:114,
			modle:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK,
			create_new_star:{ // 生成新的怪，移动一定时间产生
				time:1000, // 每移动time的时间，就产生一个新的怪物
				id:'115',	// 怪物id
				level:1,	// 怪物等级
				life:5000,	// 怪物的生存时间，ms

				scaleX:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scaleY:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
				scale:{time:1000, scaleX:1.4, scaleY:1}	// 怪物随时间的缩放，相对于原始尺寸
			}
		}, // 爆炸卫星
		'115':{
			id:107,
			modle:'4_png',
			speed:0,
			attack_speed:0,
			group:StarData.CAN_ATTACK
		}, // 卫星碎片
	}
}