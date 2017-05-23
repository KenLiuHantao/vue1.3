<script type="text/javascript">



	import cfg from './cfg.js'
	import newTask from './newTask'
	import taskView from './taskview'
	import switchList from './switchList'

	export default {
		components: {
			taskView,
			newTask,
            switchList,
		},
		ready() {
		},
		data() {
			return {
				delCfg: {
					show: false,
				},
				editTaskConfig: {
					show: false,
					title: "修改项目",
					selectedTaskCode: ""
				},
				viewTaskConfig: {
					show: false,
					title: "项目详情",
					selectedTaskCode: "",
					allowConfirm: false,
					allowDone: false,
					status: '',
				},
				leftItemCfg: cfg.leftItemCfg,
				listObj: cfg.listParam,
				tableData: [],
				radioObj: {},
				memberList: [],
				memberStatusModalConfig: {
					show: false,
					width: '600px',
					height: '500px',
					header: '查看项目动态',
					btn: [{
						name: '关闭',
						emit: 'close'
					}]
				},
                switchListCfg: {
                    switchCfg: [{
                        state: false,
                        text: '待确认',
                        klass: {
                            active: true,
                        },
                    }, {
                        state: true,
                        text: '已确认',
                        klass: {
                            active: false,
                        },
                    }],
                    listCfg: {
                        data: [],
						match: [
                            "memberUserName",
							{
                                confirmed: (item) => {
                                    return item.confirmed ? "已确认执行" : "待确认执行";
								}
							},
                            "confirmTime",
                        ],
					},
				},
			}
		},
		methods: {
			href(item, type) {
				this.viewTask(item.code,false,false);
			},
			taskSaved: function () {
				this.$broadcast('_RESETLIST', 1);
				this.tableData = [];
			},
			confirmed: function () {
				this.taskSaved();
			},
			done: function () {
				this.taskSaved();
			},
			openNewTask(code){
				if (code) {
					this.editTaskConfig.title = "修改项目";
				} else {
					this.editTaskConfig.title = "新增项目";
				}
				this.editTaskConfig.selectedTaskCode = code;
				this.editTaskConfig.show = true;
			},
			viewTask(code, allowConfirm, allowDone){
				this.viewTaskConfig.selectedTaskCode = code;
				this.viewTaskConfig.allowConfirm = allowConfirm ? allowConfirm : false;
				this.viewTaskConfig.allowDone = allowDone ? allowDone : false;
				this.viewTaskConfig.show = true;
			},
			assign(base, target) {
				let tk = Object.keys(target);
				for (let i in base) {
					if (tk.indexOf(i) != -1) {
						target[i] = base[i];
					}
				}
			},
			memberStatusModalConfigClose: function () {
				this.memberStatusModalConfig.show = false;
			},
			deleteTaskConfirm: function (code) {
				this.delCfg.code = code;
				this.delCfg.show = true;
			},
			deleteTask: function () {
				this.delCfg.show = false;
				var _ = this;
				_.$http.post(__URL.task + 'task/delete', null, {params: {code: this.delCfg.code}}).then(
						(res) => {
							_.reloadFunction(res);
						}
				)
			},
			reloadFunction: function (res) {
				var _ = this;
				if ((res && res.data.success) || (!res)) {
					_.$broadcast("_RESETLIST");
					_.tableData = [];
				}
			},
			getTaskList(item, obj) {
				obj = obj || {};
				this.$http.get(__URL.task + 'task/search', {params: {startTime: obj.startTime, endTime: obj.endTime, taskPriority: item.taskPriority, taskStatus: item.taskStatus}}).then(
						(res) => {
							this.tableData = res.data.data;
						}
				)
			},
			taskMenuClicked: function (type, item) {
				var _ = this;
				if (type == 0) {
					//发布
					var _ = this;
					this.$http.get(__URL.task + 'task/release', {params: {code: item.code}}).then(
							(res) => {
								_.reloadFunction(res);
							}
					)
				}
				if (type == 1) {
					//编辑
					this.openNewTask(item.code);
				}
				if (type == 2) {
					//删除
					this.deleteTaskConfirm(item.code);
				}
				if (type == 3) {
					//确认执行
					this.viewTask(item.code, true, false);
				}
				if (type == 4) {
					//项目动态
					this.memberStatusModalConfig.show = true;
					var _ = this;
					this.$http.get(__URL.task + 'task/members', {params: {code: item.code}}).then(
							(res) => {
								_.memberList = res.data.data;
								_.selectConfirmedMemberList(_.switchListCfg.switchCfg[0].state)
							}
					)
				}
				if (type == 5) {
					//确认完成
					this.viewTask(item.code, false, true);
				}
				if (type == 6) {
					//查看详情
					this.viewTask(item.code, false, false);
				}
			},
			clearTable(uid,obj){
                this.tableData = []
            },
            selectConfirmedMemberList (state) {
			    let arr
                if (state === true) {
                    arr = this.memberList.filter(value => value.confirmed === true)
                } else {
                    arr = this.memberList.filter(value => value.confirmed === false)
                }
                this.switchListCfg.listCfg.data = arr
            },
		},
		computed: {
			selectedTableConfig(){
				this.tableData = []
				const selectedStatusString = cfg.leftItemCfg.tabCfg.select
				let selectedItem
				if (selectedStatusString === null || selectedStatusString.length === 0) {
					selectedItem = cfg.taskStatusList[0]
				} else {
					cfg.taskStatusList.forEach((t) => {
						if (t.status === selectedStatusString) {
							selectedItem = t
						}
					})
				}
				this.viewTaskConfig.status = selectedItem.status
				return selectedItem.tableConfig
			},
		},
	}
</script>
<template>
	<container>
		<div class="body_item">
			<div class="left_item">
				<new-app :config='leftItemCfg' @tab='clearTable' @cb='getTaskList' @add="openNewTask"></new-app>
			</div>
			<div class="right_item">
				<div class="item_head btn-ic"></div>
				<div class="item_body">
					<vtable :radio.sync='radioObj' :config='selectedTableConfig' :data='tableData'
							@op='taskMenuClicked' @link='href'></vtable>
				</div>
			</div>
		</div>
	</container>

	<new-task :config.sync="editTaskConfig" @saved="taskSaved"></new-task>

	<task-view :config.sync="viewTaskConfig" @confirmed="confirmed" @done="done"></task-view>

	<modal :config.sync='memberStatusModalConfig' @sure='leaveConfirmed' @close='memberStatusModalConfigClose'>
		<switch-list :cfg="switchListCfg" @cb="selectConfirmedMemberList"></switch-list>
	</modal>

	<alert :config="delCfg" @cb="deleteTask">是否删除此项目？</alert>

</template>

<style lang="less">
	.table-wrap {
		position: relative;
		padding-bottom: 50px;
	}
</style>
