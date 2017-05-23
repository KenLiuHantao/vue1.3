<script type="text/javascript">
	import userManager from './userManager';
	import cfg from './cfg.js';
	export default {
		components: {
			userManager,
		},
		props: ['config'],
		data() {
			var _ = this;
			return {
				customerInfo: {
					"customerCode": "",
					"customerName": ""
				},
				customerCfg: {
					key: 'customerName',
					code: 'customerCode',
					refer: ['customerName', 'customerCode'],
					item: ['customerName', 'customerCode'],
					del: ['customerName', 'customerCode'],
				},
				startTimeCfg: {
					placeholder: '选择开始时间',
					format: 'YYYY-MM-DD HH'
				},
				endTimeCfg: {
					placeholder: '选择截止时间',
					format: 'YYYY-MM-DD HH'
				},
				fileConfig: {
					limit: 6,
				},
				affairInfo: {},
				userManagerConfig: { //角色用户管理
					show: false,
					checkboxChangeable: _.checkboxChangeable
				},
				userInfo: {},
				msgCfg: {
					show: false,
					type: 'success',
					content: ''
				},
				cfg
			}
		},
		methods: {
			checkboxChangeable: function (employee) {
				if (employee.employeeCode == this.affairInfo.createUser) {
					return false;
				}
				return true;
			},
			assign(base, target) {
				let tk = Object.keys(target)

				for (let i in base) {
					if (tk.indexOf(i) != -1) {
						target[i] = base[i]
					}
				}
			},
			memberSelect: function () {
				this.userManagerConfig.show = true;
			},
			removeMember: function (index) {
				this.affairInfo.affairMemberList.splice(index, 1);
				var memberCodes = this.affairInfo.affairMemberList.map(function (affairMember) {
					return affairMember.employeeCode;
				});
				this.affairInfo.subAffairList.forEach(function (subAffair) {
					if (memberCodes.indexOf(subAffair.affairSupervisor) == -1) {
						subAffair.affairSupervisor = "";
					}
				});
			},
			validateForm(affairInfo){
				var isEmpty = function (value) {
					if (value == null || value == undefined || value.trim() == "" || value.length == 0) {
						return true;
					}
					return false;
				}
				if (isEmpty(affairInfo.objectName)) {
					return "请输入事务名称";
				}
				if (isEmpty(affairInfo.affairPriority)) {
					return "请选择事务优先级";
				}
				if (isEmpty(affairInfo.startTime)) {
					return "请选择开始时间";
				}
				if (isEmpty(affairInfo.endTime)) {
					return "请选择结束时间";
				}
				if (affairInfo.subAffairList.length < 1) {
					return "至少有一个企划方案";
				}
				for (var i = 0; i < affairInfo.subAffairList.length; i++) {
					var subAffair = affairInfo.subAffairList[i];
					if (isEmpty(subAffair.description)) {
						return "必须填写企划方案";
					}
				}
				return null;
			},
			saveAffairInfo: function (released) {
				if (!released) {
					released = false;
				}
				var affairInfo = this.affairInfo;
				this.affairInfo.customerCode = this.customerInfo.customerCode;
				affairInfo.memberList = affairInfo.affairMemberList.map(function (m) {
					return m.employeeCode;
				});

				affairInfo.subAffairList.forEach(function (subAffair) {
					subAffair.attachments = subAffair.attachmentList.map(function (attachment) {
						return attachment.fileId;
					});
				});
				affairInfo.released = released;
				var _ = this;
				var validateResult = this.validateForm(affairInfo);
				if (validateResult != null) {
					this.msgCfg.type = 'failure'
					this.msgCfg.content = validateResult;
					this.msgCfg.show = true;
					return;
				}
				this.$http.post(__URL.crm + 'affair/save', affairInfo).then(
						(res) => {
							if (res.data.success) {
								this.config.show = false;
								_.$emit("saved");
							} else {
								this.msgCfg.type = 'failure'
								this.msgCfg.content = res.data.errMsg || "保存失败";
								this.msgCfg.show = true
							}
						}
				)
			},
			addNewSubAffair: function () {
				this.affairInfo.subAffairList.push({affairSupervisor: "", attachmentList: []});
			}
		},
		ready(){
			this.$http.post(__URL.hr + 'get/user').then(
					res => {
						if (res.data.success) {
							this.userInfo = res.data.data;
						}
					}
			)
		},
		computed: {
			constantMembers: function () {
				var constantEmployees = [
					{
						employeeCode: this.affairInfo.createUser,
						employeeName: this.affairInfo.createUserName
					}
				];
				return constantEmployees;
			}
		},
		watch: {
			config: {
				handler(curVal, oldVal){
					var _ = this;
					if (curVal.show) {
						if (curVal.selectedAffairCode) {
							this.$http.get(__URL.crm + 'affair/get', {params: {code: curVal.selectedAffairCode}}).then(
									(res) => {
										var affairInfo = res.data.data;
										affairInfo.subAffairList.forEach(function (subAffair) {
											subAffair.attachmentList.forEach(function (attachment) {
												attachment.fileName = attachment.attachmentName;
												attachment.fileId = attachment.attachmentCode;
											});
										});
										affairInfo.affairMemberList = affairInfo.memberList.map(function (m) {
											return {employeeCode: m.memberUser, employeeName: m.memberUserName};
										});
										affairInfo.affairMemberList.push({employeeCode: affairInfo.createUser, employeeName: affairInfo.createUserName});
										_.affairInfo = affairInfo;
										this.customerInfo.customerCode=affairInfo.customerCode;
										this.customerInfo.customerName=affairInfo.customerName;
									}
							)
						} else {
							_.affairInfo = {
								objectName: "",
								description: "",
								affairPriority: "",
								affairCategory: "",
								startTime: "",
								endTime: "",
								createUser: _.userInfo.userCode,
								createUserName: _.userInfo.userName,
								subAffairList: [{affairSupervisor: "", attachmentList: []}],
								affairMemberList: [
									{
										employeeCode: _.userInfo.userCode,
										employeeName: _.userInfo.userName
									}
								]
							}
						}
					}
				},
				deep: true
			}
		}
	}

</script>
<template>
	<inner :config='config'>
		<div class="inner-wrapper">
			<div class="inner-content">
				<h2 class="tag">事务信息</h2>
				<div class="ct-info">
					<div class="grid-ct">
						<input type="hidden" v-model="config.selectedAffairCode">
						<div class="sinput-w320">
							<label>
								<span>*</span>
								客户名称:
							</label>
							<fuzzy-customer :config="customerCfg" :data='customerInfo'></fuzzy-customer>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								事务名称:
							</label>
							<input type="text" placeholder="输入事务名称，20字以内" v-model="affairInfo.objectName" maxlength="20">
						</div>
						<div class="mg10">
							<label>
								拓展目的简介:
							</label>
							<textarea placeholder="输入拓展目的简介，200字以内" style="width:320px;height:104px;" v-model="affairInfo.description" maxlength="200"></textarea>
						</div>
						<div class="mg10 mgb20">
							<label>
								事务发起人:
							</label>
							<input type="text" disabled class="disable-input" :value="affairInfo.createUserName">
						</div>
					</div>
					<div class="grid-ct">
						<div>
							<label>
								<span>*</span>
								事务类别:
							</label>
							<select v-model="affairInfo.affairCategory">
								<option value="" style="color: #c3c3c3;">选择优先级</option>
								<option v-for="(key, value) in cfg.categoryObject" :value="key">{{value}}</option>
							</select>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								优先级:
							</label>
							<select v-model="affairInfo.affairPriority">
								<option value="" style="color: #c3c3c3;">选择优先级</option>
								<option v-for="(key, value) in cfg.priorityObject" :value="key">{{value}}</option>
							</select>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								开始时间:
							</label>
							<date-picker :config="startTimeCfg" :date.sync='affairInfo.startTime'></date-picker>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								截止时间:
							</label>
							<date-picker :config="endTimeCfg" :date.sync='affairInfo.endTime'></date-picker>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								事务成员:
							</label>
							<div class="prj-member">
								<div class="person-checked">
									<div class="person-del" v-for="(index,member) in affairInfo.affairMemberList">
										{{member.employeeName}}
										<i class="icon-delete" @click="removeMember($index)" v-show="checkboxChangeable(member)"></i>
									</div>
								</div>
								<div class="person-add" @click="memberSelect">
									<i class="icon-add"></i>
								</div>

							</div>
						</div>
					</div>
				</div>
				<div class="sperator"></div>
				<div class="kr" v-for="(subAffairIndex,subAffairInfo) in affairInfo.subAffairList">
					<div class="kr-header">
						<span>KR-{{subAffairIndex+1}}</span>
					</div>
					<div class="ct-info">
						<div class="grid-ct">
							<div class="mg10">
								<label>
									<span>*</span>
									企划方案:
								</label>
								<textarea style="width:320px;height:66px;" v-model="subAffairInfo.description"></textarea>
							</div>
							<div>
								<label>
									费用预算:
								</label>
								<input type="text" v-model="subAffairInfo.budget" maxlength="20">
							</div>
						</div>
					</div>
					<div class="up-file">
						<label>
							附件:
						</label>
						<div class="up-wrap">
							<upfile-group :config='fileConfig' :edit="true" :data.sync="subAffairInfo.attachmentList"></upfile-group>
						</div>
					</div>
				</div>
				<div class="kr-add">
					<button class="btn-xl-imp" type="button" @click="addNewSubAffair">
						<i class="icon-add-component"></i>
						添加企划方案
					</button>
				</div>
			</div>
		</div>
		<div class="inner-footer">
			<button type="button" class="btn-xl-def" @click="saveAffairInfo(false)">保存草稿</button>
			<button type="button" class="btn-xl-imp" @click="saveAffairInfo(true)">发布任务</button>
		</div>

		<user-manager :config="userManagerConfig" :members.sync="affairInfo.affairMemberList" @cb="getTable"></user-manager>
		<warning :config='msgCfg'></warning>
	</inner>
</template>
<style lang='less' scoped>
	@import '../../../../../public/css/variable.less';

	.inner-content {
		width: 1140px;

		.up-file {
			margin: 10px 80px 15px 20px;
			display: flex;
			align-items: center;
			font-size: 12px;
		}

		select, input, .date-container {
			width: 320px;
		}

		label {
			margin-right: 20px;
			width: 115px;
			text-align: right;
		}

		.disable-input {
			background-color: #F5F5F5 !important;
			border: 1px solid @border-color !important;
			padding-left: 10px !important;
		}

		.f-color {
			color: @gray-sub;
		}
	}

	.kr-add {
		margin: 20px;
		button {
			width: 100%;
			height: 46px;
		}
	}

	.kr {
		border: 1px solid @border-color;
		margin: 20px;
		border-top: none;

		.kr-header {
			background-color: #FAFAFA;
			border: 1px solid @border-color;
			border-left: 2px solid #03A9F4;
			border-right: none;
			height: 46px;
			display: flex;
			align-items: center;
			span {
				padding-left: 20px;

			}
		}
	}

	.comment-detail {
		height: 231px;
		font-size: 12px;
		margin: 15px 20px 0 20px;
		.comment-header {
			border: 1px solid @border-color;
			display: flex;
			height: 40px;
			align-items: center;
		}
		.comment-content {
			overflow-y: auto;
			border: 1px solid @border-color;
			border-top: none;
			/*border-bottom: none;*/
			margin-bottom: 25px;
			width: 100%;
			height: 191px;
			.comment-item {
				padding: 20px 0;
				height: auto;
				align-items: flex-start;
				border: none;
				border-bottom: 1px solid @border-color;
				display: flex;
				position: relative;

				&:last-child {
					border-bottom: none;
				}
			}
		}

		.flex-7 {
			padding-left: 50px;
			flex: 7;
		}

		.point-dis:after {
			content: '';
			display: flex;
			position: absolute;
			top: 23px;
			left: 40px;
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background-color: black;
		}

		.flex-1 {
			flex: 1;
		}
		.flex-2 {
			flex: 2;
		}
	}

	.comment {
		padding-left: 20px;
		padding-right: 80px;

		button {
			margin: 15px 0;
			width: 104px;
			height: 34px;
			display: inline-block;
		}

		textarea {
			font-size: 12px;
		}

		.comment-btn {
			margin-right: 80px;
			width: 100%;
			display: flex;
			justify-content: flex-end;
		}
	}

	.ct-info {
		display: flex;
		margin-top: 20px;
		font-size: 12px;

		.grid-ct {
			display: flex;
			flex-direction: column;
			padding-left: 20px;
			padding-right: 80px;
			width: 50%;

			span {
				color: red;
			}

			div {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}

			.prj-member {
				width: 320px;
				height: 28px;
				justify-content: flex-start;
				margin-top: 10px;

				.person-checked {
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;

					.person-del {
						background-color: #F5F5F5;
						position: relative;
						margin-right: 10px;
						padding: 4px 8px;
						border-radius: 2px;
						margin-bottom: 5px;

						i {
							position: absolute;
							top: -5px;
							right: -10px;
							transform: scale(0.8);
							cursor: pointer;
						}
					}
				}

				.person-add {
					width: 28px;
					height: 28px;
					line-height: 20px;
					border: 1px solid @border-color;
					font-size: 18px;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					i {
						margin-right: 0;
						transform: scale(0.6);
					}
				}
			}

		}
	}

	.sperator {
		height: 1px;
		border-bottom: 1px solid @border-color;
	}

	.mg10 {
		margin-top: 10px;
	}

	.mgb20 {
		margin-bottom: 20px;
	}

</style>