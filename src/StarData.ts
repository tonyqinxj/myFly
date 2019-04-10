class StarData {
	public constructor() {
	}


	public static CAN_ATTACK=		Math.pow(2,11);// 可被攻击
	public static CAN_CO=		Math.pow(2,12);// 可以被碰
	public static StarConfig = {
		'101': {
			id: 101,
			model: '1_png',		// 模型名称
			speed: 0.1,			// 移动速度
			attack_speed: 0.3,	// 收到攻击之后的移动速度， 那减速的时间段呢（减速多久）
			snow_time:200,		// 减速的持续时长
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			// 引力属性，包含参数（）
		},	// 小陨石101
		'102': {
			id:102,
			model:'2_png',
			speed:0.2,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
		}, // 冲击陨石 102
		'103':{
			id:103,
			model:'3_png',
			speed:0.1,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,

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
			model:'4_png',
			speed:0,
			attack_speed:0,
			group:0,
		}, // 岩浆（特殊）		104
		'105':{
			id:105,
			model:'4_png',
			speed:0.1,
			attack_speed:0.5,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			follow:{		// todo, need test
				scope:100,// 警戒范围,
				add_speed:0.003,// 每ms加速
			}
		}, // 磁铁陨石		105, 跟踪怪
		'106':{
			id:106,
			model:'4_png',
			speed:0.1,
			attack_speed:0.5,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
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
			model:'4_png',
			speed:0,
			attack_speed:0,
			group:0
		},// 慧尾

		'108':{
			id:108,
			model:'4_png',
			speed:0.1,
			attack_speed:0.5,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			create_new_star:{ // 生成新的怪
				time:0, // 每移动time的时间，就产生一个新的怪物, 0表示死亡产生
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
			model:'4_png',
			speed:0,
			attack_speed:0,
			group:0
		},// 碎冰（特殊）

		'110':{
			id:110,
			model:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			rebound:true,	// 反弹属性，碰到其他怪之后，会反弹 // todo need test
		},

		'111':{
			id:111,
			model:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			scale_info:[// 缩放规则，time是生存周期时间区间，wait为true，表示这个阶段不变化，否则，在time之间范围内变更为scaleX和scaleY 的缩放比例, 此过程会循环进行
				{time:1000, wait:true, scaleX:1, scaleY:1},
				{time:1000, wait:false, scaleX:2, scaleY:2},
				{time:1000, wait:true, scaleX:2, scaleY:2},
				{time:1000, wait:false, scaleX:1, scaleY:1},
			],
			add_blood:{	// todo, need test, and need fx
				times:10,	// 加多少秒
				speed:0.1, // 每秒增加的比例，按照初始血量来增加
			}
		},	// 星际尘埃
		'112':{
			id:112,
			model:'8_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK,
			eat:{
				blood:1,	// 增加当前血量的比例
				scale:0.15, // 增加体型的比例, 针对原始尺寸
			}, 	// 是否具有吞噬属性
		}, // 微型黑洞
		'113':{
			id:113,
			model:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			add_speed:[
				{time:2000,wait:false,add:0.0001}, // 每ms增加的速度
				{time:1000,wait:false,add:-0.0002},
				{time:2000,wait:true, add:0}		// wait为true表示等待
				], // 加速度配置
		}, // 风暴球团

		'114':{
			id:114,
			model:'4_png',
			speed:0.15,
			attack_speed:0.3,
			group:StarData.CAN_ATTACK|StarData.CAN_CO,
			create_new_star:{ // 生成新的怪，移动一定时间产生
				time:0, // 每移动time的时间，就产生一个新的怪物 , 如果配置为0， 表示死亡才生存新怪
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
			model:'4_png',
			speed:0,
			attack_speed:0,
			group:0,
			bomb:{	// todo need test
				scope:100,			// 伤害范围
				type:1, // 1 表示摧毁所有物体
			}
		}, // 卫星碎片
	}
}