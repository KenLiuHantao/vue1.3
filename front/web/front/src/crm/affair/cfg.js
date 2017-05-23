const affairStatusList = [
	{
		status: "PROTOCOL",
		text: "草稿",
		tableConfig: {
			serial: true,
			operating: [true, 'config-operate', [
				{
					type: 0, btn: 0,
					text: '发布',
					show: function (affair) {
						return affair.status == 'PROTOCOL';
					}
				},
				{type: 0, btn: 1, text: '编辑'},
				{type: 0, btn: 2, text: '删除'}
			]],
			match: [
				'objectName',
				'customerName',
				'createTime',
				'createUserName'
			],
			width: [3, 3, 3, 3],
			head: ['事务名称', '客户名称', '创建时间', '事务发起人']
		}
	},
	{
		status: "TODO",
		text: "待确认",
		tableConfig: {
			serial: true,
			operating: [true, 'configOperateLink', [
				{
					type: 0, btn: 3,
					text: '确认执行',
					show: function (affair) {
						return affair.member;
					}
				},
				{
					type: 0, btn: 4,
					text: '事务动态',
					show: function (affair) {
						return !affair.member;
					}
				}
			]],
			match: [
				'objectName',
				'customerName',
				'endTime',
				'createUserName'
			],
			width: [3, 3, 3, 3],
			head: ['事务名称', '客户名称', '截止时间', '事务发起人']
		}
	},
	{
		status: "DOING",
		text: "执行中",
		tableConfig: {
			serial: true,
			operating: [true, 'configOperateLink', [
				{
					type: 0, btn: 5,
					text: '确认完成',
					show: function (affair) {
						return !affair.member;
					}
				},
				{
					type: 0, btn: 3,
					text: '查看详情',
					show: function (affair) {
						return affair.member;
					}
				}
			]],
			match: [
				'objectName',
				'customerName',
				(obj) => {
					return obj.delayed ? ("<span style='color: red;'>" + obj.startTime + "</span><br/><span style='color: red;'>" + obj.endTime + "</span>") : (obj.startTime + '<br/>' + obj.endTime)
				},
				'createUserName'
			],
			width: [3, 3, 3, 3],
			head: ['事务名称', '客户名称', '起止时间', '事务发起人']
		}
	},
	{
		status: "DONE",
		text: "已完成",
		tableConfig: {
			serial: true,
			operating: [true, 'configOperateLink', [
				{
					type: 0, btn: 3,
					text: '查看详情'
				}
			]],
			match: [
				'objectName',
				'customerName',
				(obj) => {
					return obj.delayed ? ("<span style='color: red;'>" + obj.startTime + "</span><br/><span style='color: red;'>" + obj.endTime + "</span>") : (obj.startTime + '<br/>' + obj.endTime)
				},
				'createUserName'
			],
			width: [3, 3, 3, 3],
			head: ['事务名称', '客户名称', '起止时间', '事务发起人']
		}
	}
];

var priorityObject = {
	"IMPORTANT_AND_URGENT": "重要且紧急",
	"IMPORTANT_BUT_NOT_URGENT": "重要但不紧急",
	"NOT_IMPORTANT_BUT_URGENT": "紧急但不重要",
	"NOT_IMPORTANT_AND_NOT_URGENT": "不紧急不重要"
};

var categoryObject = {
	"VISIT": "拜访",
	"INVITATION": "邀请",
	"FETE": "宴请",
	"OTHERS": "其他"
};


var dateFmt = function (date) {
	return date.split("-").splice(1).join(".");
};

var tabList = affairStatusList.map(function (status) {
	var tabConfig = {
		id: status.status,
		name: status.text,
		params: {
			main: {
				key: 'affairCategory',
				url: __URL.crm + 'affair/summary',
				dataListHandler: function (res) {
					var list = res.data.data;
					return list;
				},
				words: {
					title: function (val) {
						return categoryObject[val.affairCategory];
					},
					right: 'count'
				},
				method: "get",
				param: {
					"affairStatus": status.status
				}
			},
			sub: {
				key: 'startTime',
				url: __URL.crm + 'affair/summary/weeks',
				method: "get",
				dataListHandler: function (res) {
					var list = res.data.data;
					return list;
				},
				words: {
					title: function (val) {
						return val.endTime.split("-")[0] + "年第" + val.indexOfWeek + "周(" + dateFmt(val.startTime) + "~" + dateFmt(val.endTime) + ")";
					},
					right: 'count'
				},
				param: {
					"affairStatus": status.status,
					"affairCategory": "",
					"startTime": "",
					"endTime": ""
				}
			}
		}
	};
	return tabConfig;
});
export default {
	affairStatusList: affairStatusList,
	priorityObject: priorityObject,
	categoryObject: categoryObject,
	leftItemCfg: {
		headCfg: {
			add: true,
			filter: false
		},
		tabCfg: {
			select: '',
			tabBarData: tabList
		},
		listCfg: {
			hasNub: false,
			hasChild: true,
		}
	}
}
