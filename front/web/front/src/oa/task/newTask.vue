<script type="text/javascript">
	import userManager from './userManager'

	export default {
		components: {
			userManager
		},
		props: ['config'],
		data () {
			return {
				startTimeCfg: {
					placeholder: '选择开始时间',
					format: 'YYYY-MM-DD HH',
				},
				endTimeCfg: {
					placeholder: '选择截止时间',
					format: 'YYYY-MM-DD HH',
				},
				fileConfig: {
					limit: 6,
				},
				taskInfo: {},
				// 角色用户管理
				userManagerConfig: {
					show: false,
					checkboxChangeable: this.checkboxChangeableFunc,
				},
				userInfo: {},
				// 增加项目子任务的按钮
                addSubTaskShow: true,
			}
		},
		methods: {
			checkboxChangeableFunc (employee) {
				if (employee.employeeCode === this.taskInfo.createUser) {
					return false
				} else {
                    return true
				}
			},
			memberSelect () {
				this.userManagerConfig.show = true
			},
			removeMember (index) {
				this.taskInfo.taskMemberList.splice(index, 1)
				const memberCodes = this.taskInfo.taskMemberList.map(taskMember => {
					return taskMember.employeeCode
				})
				this.taskInfo.subTaskList.forEach(subTask => {
					if (memberCodes.indexOf(subTask.taskSupervisor) === -1) {
						subTask.taskSupervisor = ''
					}
				})
			},
			validateForm (taskInfo) {
				const isEmpty = (value) => {
					if (value === null || value === undefined || value.trim() === '' || value.length === 0) {
						return true
					} else {
                        return false
					}
				}
				if (isEmpty(taskInfo.objectName)) return "请输入项目名称"
				if (isEmpty(taskInfo.taskPriority)) return "请选择项目优先级"
				if (isEmpty(taskInfo.startTime)) return "请选择开始时间"
				if (isEmpty(taskInfo.endTime)) return "请选择结束时间"
				if (taskInfo.subTaskList.length < 1) return "至少有一个子任务"

				for (let i = 0; i < taskInfo.subTaskList.length; i++) {
					const subTask = taskInfo.subTaskList[i]
					if (isEmpty(subTask.objectName)) return "子任务的名称必须填写"
					if (isEmpty(subTask.taskSupervisor)) return "子任务的负责人必须填写"
					if (isEmpty(subTask.startTime)) return "子任务的开始时间必须填写"
					if (isEmpty(subTask.endTime)) return "子任务的结束时间必须填写"
				}
				return null
			},
			saveTaskInfo (released) {
				if (!released) released = false
				const taskInfo = this.taskInfo
				taskInfo.memberList = taskInfo.taskMemberList.map(m => {
					return m.employeeCode
				})
				taskInfo.subTaskList.forEach(subTask => {
					subTask.attachments = subTask.attachmentList.map(attachment => {
						return attachment.fileId
					})
				})
				taskInfo.released = released
				const validateResult = this.validateForm(taskInfo)
				if (validateResult) this.$warning({type: 'failure', massage: validateResult})
				this.$http.post(__URL.task + 'task/save', taskInfo).then(
					res => {
						if (res.data.success) {
							this.config.show = false
							this.$emit('saved', 1)
						} else {
							this.$warning({type: 'failure', massage: res.data.errMsg || '保存失败'})
						}
					}
				)
			},
			// 新增项目子任务
			addNewSubTask () {
			    const arr = this.taskInfo.subTaskList
                arr.push({taskSupervisor: '', attachmentList: []})
                if (arr.length === 10) this.addSubTaskShow = false
			},
			// 删除项目子任务
            deleteSubTask (index) {
                const arr = this.taskInfo.subTaskList
                arr.splice(index, 1)
                if (arr.length <= 10) this.addSubTaskShow = true
			},
		},
		ready () {
			this.$http.post(__URL.hr + 'get/user').then(
				res => {
					if (res.data.success) {
						this.userInfo = res.data.data
					}
				}
			)
		},
		watch: {
			config: {
				handler(curVal, oldVal){
					if (curVal.show) {
						if (curVal.selectedTaskCode) {
							this.$http.get(__URL.task + 'task/get', {params: {code: curVal.selectedTaskCode}}).then(
								res => {
									const taskInfo = res.data.data
									taskInfo.subTaskList.forEach(subTask => {
										subTask.attachmentList.forEach(attachment => {
											attachment.fileName = attachment.attachmentName
											attachment.fileId = attachment.attachmentCode
										})
									})
									taskInfo.taskMemberList = taskInfo.memberList.map(m => {
										return {employeeCode: m.memberUser, employeeName: m.memberUserName}
									})
									taskInfo.taskMemberList.push({employeeCode: taskInfo.createUser, employeeName: taskInfo.createUserName})
									this.taskInfo = taskInfo
								}
							)
						} else {
							this.taskInfo = {
								objectName: '',
								description: '',
								taskPriority: '',
								startTime: '',
								endTime: '',
								createUser: this.userInfo.userCode,
								createUserName: this.userInfo.userName,
								subTaskList: [],
								taskMemberList: [{
									employeeCode: this.userInfo.userCode,
									employeeName: this.userInfo.userName
								}],
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
				<h2 class="tag">项目信息</h2>
				<div class="ct-info">
					<div class="grid-ct">
						<input v-model="config.selectedTaskCode" hidden>
						<div>
							<label>
								<span>*</span>
								项目名称:
							</label>
							<input type="text" placeholder="输入项目名称，20字以内" v-model="taskInfo.objectName" maxlength="20">
						</div>
						<div class="mg10">
							<label style="align-self: flex-start">
								立项目标简介:
							</label>
							<textarea placeholder="输入立项目标简介，200字以内" style="width:320px;height:104px;" v-model="taskInfo.description" maxlength="200"></textarea>
						</div>
						<div class="mg10 mgb20">
							<label>
								项目发起人:
							</label>
							<input type="text" disabled class="disable-input" :value="taskInfo.createUserName">
						</div>
					</div>
					<div class="grid-ct">
						<div>
							<label>
								<span>*</span>
								优先级:
							</label>
							<select v-model="taskInfo.taskPriority">
								<option value="" hidden>选择优先级</option>
								<option value="IMPORTANT_AND_URGENT">重要且紧急</option>
								<option value="IMPORTANT_BUT_NOT_URGENT">重要但不紧急</option>
								<option value="NOT_IMPORTANT_BUT_URGENT">紧急但不重要</option>
								<option value="NOT_IMPORTANT_AND_NOT_URGENT">不紧急不重要</option>
							</select>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								开始时间:
							</label>
							<date-picker :config="startTimeCfg" :date.sync='taskInfo.startTime'></date-picker>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								截止时间:
							</label>
							<date-picker :config="endTimeCfg" :date.sync='taskInfo.endTime'></date-picker>
						</div>
						<div class="mg10">
							<label>
								<span>*</span>
								项目成员:
							</label>
							<div class="prj-member">
								<div class="person-checked">
									<div v-for="(index, member) in taskInfo.taskMemberList" class="person-del">
										{{member.employeeName}}
										<i v-if="checkboxChangeableFunc(member)" @click="removeMember($index)" class="icon-close__round"></i>
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
				<div v-for="(subTaskIndex, subTaskInfo) in taskInfo.subTaskList" class="kr">
					<div class="kr-header">
						<span>KR-{{subTaskIndex + 1}}</span>
						<a @click="deleteSubTask(subTaskIndex)" href="javascript:;">删除</a>
					</div>
					<div class="ct-info">
						<div class="grid-ct">
							<div>
								<label>
									<span>*</span>
									项目子任务名称:
								</label>
								<input type="text" name="goods" placeholder="输入项目子任务名称，20字以内" v-model="subTaskInfo.objectName" maxlength="20">
							</div>
							<div class="mg10">
								<label style="align-self: flex-start">
									子任务目标描述:
								</label>
								<textarea placeholder="输入子任务目标描述，200字以内" style="width:320px;height:66px;" v-model="subTaskInfo.description" maxlength="200"></textarea>
							</div>
						</div>
						<div class="grid-ct" style='padding-right: 60px;'>
							<div>
								<label>
									<span>*</span>
									KR-{{subTaskIndex + 1}}任务负责人:
								</label>
								<select v-model="subTaskInfo.taskSupervisor">
									<option value="" hidden>选择任务负责人</option>
									<option v-for="(index, member) in taskInfo.taskMemberList" :value="member.employeeCode">{{member.employeeName}}</option>
								</select>
							</div>
							<div class="mg10">
								<label>
									<span>*</span>
									开始时间:
								</label>
								<date-picker :config="startTimeCfg" :date.sync='subTaskInfo.startTime'></date-picker>
							</div>
							<div class="mg10">
								<label>
									<span>*</span>
									截止时间:
								</label>
								<date-picker :config="endTimeCfg" :date.sync='subTaskInfo.endTime'></date-picker>
							</div>
						</div>
					</div>
					<div class="up-file">
						<label>
							附件:
						</label>
						<div class="up-wrap">
							<upfile-group :config='fileConfig' :edit="true" :data.sync="subTaskInfo.attachmentList"></upfile-group>
						</div>
					</div>
				</div>
				<div class="kr-add">
					<button v-if="addSubTaskShow" @click="addNewSubTask" class="btn-xl-imp" type="button">
						<i class="icon-add-component"></i>
						添加项目子任务
					</button>
				</div>
			</div>
		</div>
		<div class="inner-footer">
			<button type="button" class="btn-xl-def" @click="config.show = false">取消</button>
			<button type="button" class="btn-xl-imp" @click="saveTaskInfo(false)">保存草稿</button>
			<button type="button" class="btn-xl-imp" @click="saveTaskInfo(true)">发布</button>
		</div>

		<user-manager :config="userManagerConfig" :members.sync="taskInfo.taskMemberList" @cb=""></user-manager>
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
			justify-content: space-between;
			span {
				padding-left: 20px;
			}
			a {
				padding-right: 20px;
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