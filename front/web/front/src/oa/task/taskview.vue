<script type="text/javascript">
	import cfg from './cfg.js'

	export default {
		props: ['config'],
		data() {
			return {
				fileConfig: {
					limit: 6,
				},
				commentContent: "",
				taskInfo: {},
			}
		},
		methods: {
			comment (subTask) {
				if (!this.commentContent) {
				    this.$warning({type: 'failure', message: '评论内容不能为空'})
					return
				}
				this.$http.post(__URL.task + 'task/comment', null, {params: {taskCode: subTask.code, content: this.commentContent}}).then(
					res => {
						const newComment = res.data.data
						subTask.comments.push(newComment)
						this.exitComment(subTask)
					}
				)
			},
			exitComment (subTask) {
				subTask.commenting = false
				this.commentContent = ""
			},
			intoComment (subTask) {
				subTask.commenting = true
			},
			confirm () {
				this.$http.get(__URL.task + 'task/confirm', {params: {code: this.config.selectedTaskCode}}).then(
                    res => {
						this.config.show = false
						this.$emit("confirmed")
					}
				)
			},
			done () {
				this.$http.get(__URL.task + 'task/done', {params: {code: this.config.selectedTaskCode}}).then(
                    res => {
						this.config.show = false
						this.$emit("done")
					}
				)
			}
		},
		watch: {
			config: {
				handler(curVal, oldVal){
					if (curVal.show) {
						this.$http.get(__URL.task + 'task/get', {params: {code: curVal.selectedTaskCode}}).then(
							res => {
								const taskInfo = res.data.data
								taskInfo.subTaskList.forEach(subTask => {
									subTask.attachmentList.forEach(attachment => {
										attachment.fileName = attachment.attachmentName
									})
									subTask.commenting = false;
								})
								taskInfo.taskMemberList = taskInfo.memberList.map(m => {
									return {employeeCode: m.memberUser, employeeName: m.memberUserName}
								})
								this.taskInfo = taskInfo
							}
						)
					}
				},
				deep: true
			}
		},
		filters: {
			priorityText (priority) {
				return cfg.priorityObject[priority]
			},
			downloadLink (subTask) {
				return subTask.attachmentList.map(x => {
					return {fileId:x.attachmentCode, fileName:x.attachmentName}
				})
			}
		}
	}

</script>
<template>
	<inner :config='config'>
		<div class="inner-wrapper">
			<div class="inner-content">
				<h2 class="tag">项目详情</h2>
				<div class="ct-info">
					<div class="grid-ct">
						<input v-model="config.selectedTaskCode" hidden>
						<div>
							<label>
								项目名称:
							</label>
							<span class="value_area">{{taskInfo.objectName}}</span>

						</div>
						<div class="mg10">
							<label style="align-self: flex-start">
								立项目标简介:
							</label>
							<pre style="width:320px;max-height:104px;">{{taskInfo.description}}</pre>
						</div>
						<div class="mg10 mgb20">
							<label>
								项目发起人:
							</label>
							<span class="value_area">{{taskInfo.createUserName}}</span>
						</div>
					</div>
					<div class="grid-ct">
						<div>
							<label>
								优先级:
							</label>
							<span class="value_area">{{taskInfo.taskPriority|priorityText}}</span>
						</div>
						<div class="mg10 h28">
							<label>
								开始时间:
							</label>
							<span class="value_area">{{taskInfo.startTime}}</span>
						</div>
						<div class="mg10">
							<label>
								截止时间:
							</label>
							<span class="value_area">{{taskInfo.endTime}}</span>
						</div>
						<div class="mg10">
							<label>
								项目成员:
							</label>
							<div class="prj-member">
								<div class="person-checked">
									<div class="person-del">
										{{taskInfo.createUserName}}
									</div>
									<div class="person-del" v-for="(index,member) in taskInfo.taskMemberList">
										{{member.employeeName}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="sperator"></div>
				<div class="kr" v-for="(subTaskIndex,subTaskInfo) in taskInfo.subTaskList">
					<div class="kr-header">
						<span>KR-{{subTaskIndex+1}}</span>
						<a @click="deleteSubTask(subTaskIndex)" href="javascript:;">删除</a>
					</div>
					<div class="ct-info">
						<div class="grid-ct">
							<div>
								<label>
									项目子任务名称:
								</label>
								<span class="value_area">{{subTaskInfo.objectName}}</span>
							</div>
							<div class="mg10">
								<label style="align-self: flex-start">
									子任务目标描述:
								</label>
								<pre style="width:320px;max-height:66px;">{{subTaskInfo.description}}</pre>
							</div>
						</div>
						<div class="grid-ct" style='padding-right: 60px;'>
							<div>
								<label>
									KR-{{subTaskIndex+1}}任务负责人:
								</label>
								<span class="value_area">{{subTaskInfo.taskSupervisorName}}</span>
							</div>
							<div class="mg10 h28">
								<label>
									开始时间:
								</label>
								<span class="value_area">{{subTaskInfo.startTime}}</span>
							</div>
							<div class="mg10">
								<label>
									截止时间:
								</label>
								<span class="value_area">{{subTaskInfo.endTime}}</span>
							</div>
						</div>
					</div>
					<div class="up-file">
						<label>
							附件:
						</label>
						<div class="up-wrap">
							<upfile-group :config='fileConfig' :edit="false" :data="subTaskInfo | downloadLink"></upfile-group>
						</div>
					</div>
					<div class="sperator">

					</div>
					<div class="comment-detail">
						<div class="comment-header">
							<div class="flex-7">
								评论详情
							</div>
							<div class="flex-1">
								评论人
							</div>
							<div class="flex-2">
								评论时间
							</div>
						</div>
						<div class="comment-content">
							<ul>
								<li class="comment-item" v-for="comment in subTaskInfo.comments">
									<div class="flex-7 point-dis">
										{{comment.commentContent}}
									</div>
									<div class="flex-1 f-color">
										{{comment.commentUserName}}
									</div>
									<div class="flex-2 f-color">
										{{comment.commentTime}}
									</div>
								</li>

							</ul>
						</div>
					</div>
					<div class="comment" v-if="config.status != 'PROTOCOL'">
						<template v-if="subTaskInfo.commenting">
							<button class="btn-xx-light" type="button" @click="exitComment(subTaskInfo)">
								<i class="icon-minus__sign"></i>
								取消评论
							</button>
							<textarea style="width:100%;height:60px" placeholder="添加评论" v-model="commentContent"></textarea>
							<div class="comment-btn">
								<ajax-button class="btn-xl-imp" type="button" @click="comment(subTaskInfo)">
									保存
								</ajax-button>
							</div>
						</template>
						<template v-else>
							<button class="btn-xx-light" type="button" @click="intoComment(subTaskInfo)">
								<i class="icon-add"></i>
								添加评论
							</button>
						</template>
					</div>
				</div>
			</div>
		</div>
		<div class="inner-footer">
			<template v-if="config.allowConfirm || config.allowDone">
				<button type="button" v-if="config.allowConfirm" class="btn-xl-def" @click="config.show = false">关闭</button>
				<button type="button" v-if="config.allowDone" class="btn-xl-def" @click="config.show = false">取消</button>
				<button type="button" v-if="" class="btn-xl-def" @click="config.show = false">删除项目</button>
				<button type="button" v-if="" class="btn-xl-def" @click="config.show = false">编辑草稿</button>
				<button type="button" v-if="" class="btn-xl-def" @click="confirm()">确认执行</button>
				<button type="button" v-if="config.allowDone" class="btn-xl-imp" @click="done()">确认完成</button>
			</template>
			<template v-else>
				<button type="button" class="btn-xl-def" @click="config.show = false">关闭</button>
			</template>
		</div>
	</inner>
</template>

<style lang='less' scoped>
	@import '../../../../../public/css/variable.less';

	pre {
		font-family: 'Ping Fang SC,Microsoft YaHei';
		font-size: 12px;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.value_area {
		display: inline-block;
		width: 320px;
		color: black !important;
	}

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

	.h28{
		height: 28px;
	}

</style>