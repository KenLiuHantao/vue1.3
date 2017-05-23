<script type="text/javascript">
	import cfg from './cfg.js'
	import newAffair from './newAffair'
	import affairview from './affairView'

	export default {
		components: {
			affairview,
			'new-affair': newAffair,
		},
		ready() {
		},
		data() {
			return {
				delCfg: {
					show: false,
				},
				editAffairConfig: {
					show: false,
					title: "修改事务",
					selectedAffairCode: ""
				},
				viewAffairConfig: {
					show: false,
					title: "事务详情",
					selectedAffairCode: "",
					allowConfirm: false,
					allowDone: false
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
					header: '查看事务动态',
					btn: [{
						name: '关闭',
						emit: 'close'
					}]
				},
				memberStatusTableConfig1: {
					serial: false,
					width: [4, 4, 4],
					match: [
						"memberUserName",
						function (m) {
							return m.confirmed ? "已确认执行" : "待确认执行";
						},
						"confirmTime",
					],
					head: ['待确认', ''],
				},
				memberStatusTableConfig2: {
					serial: false,
					width: [4, 4, 4],
					match: [
						"memberUserName",
						function (m) {
							return m.confirmed ? "已确认执行" : "待确认执行";
						},
						"confirmTime",
					],
					head: ['已确认', ''],
				},
			}
		},
		methods: {
			affairSaved: function () {
				this.$broadcast("_RESETLIST");
				this.tableData = [];
			},
			confirmed: function () {
				this.affairSaved();
			},
			done: function () {
				this.affairSaved();
			},
			openNewAffair(code){
				if (code) {
					this.editAffairConfig.title = "修改事务";
				} else {
					this.editAffairConfig.title = "新增事务";
				}
				this.editAffairConfig.selectedAffairCode = code;
				this.editAffairConfig.show = true;
			},
			viewAffair(code, allowConfirm, allowDone){
				this.viewAffairConfig.selectedAffairCode = code;
				this.viewAffairConfig.allowConfirm = allowConfirm ? allowConfirm : false;
				this.viewAffairConfig.allowDone = allowDone ? allowDone : false;
				this.viewAffairConfig.show = true;
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
			deleteAffairConfirm: function (code) {
				this.delCfg.code = code;
				this.delCfg.show = true;
			},
			deleteAffair: function () {
				this.delCfg.show = false;
				var _ = this;
				_.$http.post(__URL.crm + 'affair/delete', null, {params: {code: this.delCfg.code}}).then(
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
			href(item, type) {
			},
			getAffairList(item, obj) {
				obj = obj || {};
				this.$http.post(__URL.crm + 'affair/search', {startTime: obj.startTime, endTime: obj.endTime,affairCategory:item.affairCategory,affairPriority: item.affairPriority, affairStatus: item.affairStatus}).then(
						(res) => {
							this.tableData = res.data.data;
						}
				)
			},
			affairMenuClicked: function (type, item) {
				var _ = this;
				if (type == 0) {
					//发布
					var _ = this;
					this.$http.get(__URL.crm + 'affair/release', {params: {code: item.code}}).then(
							(res) => {
								_.reloadFunction(res);
							}
					)
				}
				if (type == 1) {
					//编辑
					this.openNewAffair(item.code);
				}
				if (type == 2) {
					//删除
					this.deleteAffairConfirm(item.code);
				}
				if (type == 3) {
					//确认执行
					this.viewAffair(item.code, true, false);
				}
				if (type == 4) {
					//事务动态
					this.memberStatusModalConfig.show = true;
					var _ = this;
					this.$http.get(__URL.crm + 'affair/members', {params: {code: item.code}}).then(
							(res) => {
								_.memberList = res.data.data;
							}
					)
				}
				if (type == 5) {
					//确认完成
					this.viewAffair(item.code, false, true);
				}
				if (type == 6) {
					//查看详情
					this.viewAffair(item.code, false, false);
				}
			},
			clearTable(uid, obj){
				this.tableData = []
			}
		},
		computed: {
			selectedTableConfig(){
				this.tableData = [];
				var selectedStatusString = cfg.leftItemCfg.tabCfg.select;
				var selectedItem;
				if (selectedStatusString == null || selectedStatusString.length == 0) {
					selectedItem = cfg.affairStatusList[0];
				} else {
					var _ = this;
					cfg.affairStatusList.forEach(function (t) {
						if (t.status == selectedStatusString) {
							selectedItem = t;
						}
					});
				}
				return selectedItem.tableConfig;
			},
			confirmedMemberList(){
				var list = this.memberList.filter(m => {
					return m.confirmed === true;
				});
				return list;
			},
			notConfirmedMemberList(){
				return this.memberList.filter(m => {
					return m.confirmed === false;
				});
			}
		}
	}
</script>
<template>
	<container>
		<div class="body_item">
			<div class="left_item">
				<new-app :config='leftItemCfg' @tab='clearTable' @cb='getAffairList' @add="openNewAffair"></new-app>
			</div>
			<div class="right_item">
				<div class="item_head btn-ic"></div>
				<div class="item_body">
					<vtable :radio.sync='radioObj' :config='selectedTableConfig' :data='tableData' @op='affairMenuClicked' @link='href'>
					</vtable>
				</div>
			</div>
		</div>
	</container>
	<new-affair :config.sync="editAffairConfig" @saved="affairSaved"></new-affair>
	<affairview :config.sync="viewAffairConfig" @confirmed="confirmed" @done="done"></affairview>
	<modal :config.sync='memberStatusModalConfig' @sure='leaveConfirmed' @close='memberStatusModalConfigClose'>
		<div class="table-wrap">
			<vtable :config='memberStatusTableConfig1' :data='notConfirmedMemberList'></vtable>
		</div>
		<div class="table-wrap">
			<vtable :config='memberStatusTableConfig2' :data='confirmedMemberList'></vtable>
		</div>
	</modal>
	<alert :config="delCfg" @cb="deleteAffair">是否删除此事务？</alert>

</template>
<style lang="less">
	.table-wrap {
		position: relative;
		height: 220px;
		overflow: hidden;
	}
</style>
