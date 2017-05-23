var taskStatusList = [
	{
		status: "PROTOCOL",
		text: "草稿箱",
		tableConfig: {
			serial: true,
			// operating: [true, 'config-operate', [
			// 	{
			// 		type: 0, btn: 0,
			// 		text: '发布',
			// 		show: function (task) {
			// 			return task.status == 'PROTOCOL';
			// 		}
			// 	},
			// 	{type: 0, btn: 1, text: '编辑'},
			// 	{type: 0, btn: 2, text: '删除'}
			// ]],
			match: [
				'',
				[{ key: 'objectName', href: true }],
				'',
				'createTime'
			],
			width: [3, 3, 3, 6],
			head: ['事物名称', '客户名称', '合作状态', '创建时间']
		}
	},
	{
		status: "TODO",
		text: "待确认",
		tableConfig: {
			serial: true,
			// operating: [true, 'configOperateLink', [
			// 	{
			// 		type: 0, btn: 3,
			// 		text: '确认执行',
			// 		show: function (task) {
			// 			return task.member;
			// 		}
			// 	},
			// 	{
			// 		type: 0, btn: 4,
			// 		text: '项目动态',
			// 		show: function (task) {
			// 			return !task.member;
			// 		}
			// 	}
			// ]],
			match: [
				'',
				[{ key: 'objectName', href: true }],
				'',
				'endTime',
			],
			width: [3, 3, 3, 6],
			head: ['事物名称', '客户名称', '合作状态', '起止时间']
		}
	},
	{
		status: "DOING",
		text: "执行中",
		tableConfig: {
			serial: true,
			// operating: [true, 'configOperateLink', [
			// 	{
			// 		type: 0, btn: 5,
			// 		text: '确认完成',
			// 		show: function (task) {
			// 			return !task.member;
			// 		}
			// 	},
			// 	{
			// 		type: 0, btn: 3,
			// 		text: '查看详情',
			// 		show: function (task) {
			// 			return task.member;
			// 		}
			// 	}
			// ]],
			match: [
				'',
				[{ key: 'objectName', href: true }],
				(obj) => {
					return obj.delayed ? ("<span style='color: red;'>" + obj.startTime + "</span><br/><span style='color: red;'>" + obj.endTime + "</span>") : (obj.startTime + '<br/>' + obj.endTime)
				},
				'createUserName'
			],
			width: [3, 3, 3, 6],
			head: ['事物名称', '客户名称', '合作状态', '起止时间']
		}
	},
	{
		status: "DONE",
		text: "已完成",
		tableConfig: {
			serial: true,
			// operating: [true, 'configOperateLink', [
			// 	{
			// 		type: 0, btn: 3,
			// 		text: '查看详情'
			// 	}
			// ]],
			match: [
				'',
				[{ key: 'objectName', href: true }],
				(obj) => {
					return obj.delayed ? ("<span style='color: red;'>" + obj.startTime + "</span><br/><span style='color: red;'>" + obj.endTime + "</span>") : (obj.startTime + '<br/>' + obj.endTime)
				},
				'createUserName',
			],
			width: [3, 3, 3, 6],
			head: ['事物名称', '客户名称', '合作状态', '起止时间']
		}
	}
];

var priorityObject = {
	"IMPORTANT_AND_URGENT": "重要且紧急",
	"IMPORTANT_BUT_NOT_URGENT": "重要但不紧急",
	"NOT_IMPORTANT_BUT_URGENT": "紧急但不重要",
	"NOT_IMPORTANT_AND_NOT_URGENT": "不紧急不重要"
};

var dateFmt = function (date) {
	return date.split("-").splice(1).join(".");
};

var tabList = taskStatusList.map(function (status) {
	var tabConfig = {
		id: status.status,
		name: status.text,
		params: {
			main: {
				key: 'taskPriority',
				url: __URL.task + 'task/summary',
				dataListHandler: function (res) {
					var list = res.data.data;
					return list;
				},
				words: {
					title: function (val) {
						return priorityObject[val.taskPriority];
					},
					right: 'count'
				},
				method: "get",
				param: {
					"taskStatus": status.status
				}
			},
			sub: {
				key: 'startTime',
				url: __URL.task + 'task/summary/weeks',
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
					"taskStatus": status.status,
					"taskPriority": "",
					"startTime": "",
					"endTime": ""
				}
			}
		}
	};
	return tabConfig;
});
export default {
	taskStatusList: taskStatusList,
	priorityObject: priorityObject,
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
