<script type="text/javascript">
	export default {
		props: ['config', 'members'],
		data() {
			var _ = this;
			return {
				departmentList: [],
				userList: [],
				keyword: '',
				departmentCode: ''
			}
		},
		ready() {
			this.getDepartmentList();
		},
		computed: {
			tableCfg(){
				var checkboxChangeable= this.config.checkboxChangeable;
				return {
					checkbox: [true, 'employeeCode'],
					width: [4, 4, 5, 5, 5], //排除序号，多选，单选，操作栏
					match: [
						'jobNumber',
						'employeeName',
						'departmentName',
						'roleName',
						'phone'
					],
					checkboxChangeable: checkboxChangeable,
					head: ['工号', '姓名', '部门', '职务', '联系电话'],
				}
			}
		},
		methods: {
			checkboxChangeable: function (employee) {
				return this.config.checkboxChangeable(employee);
			},
			getDepartmentList() {
				let param = {
					keyword: ''
				}
				this.$http.post(__URL.hr + 'employee/department/list/ref', param).then(
						(res) => {
							this.departmentList = res.data.data.dataList;
						}
				)
			},
			getUserList(departmentCode) {
				this.departmentCode = departmentCode;
				let par = {
					"departmentCode": departmentCode,
					"keyword": this.keyword
				};
				this.$http.post(__URL.hr + 'employee/list/ref', par).then(
						(res) => {
							if (res.data.success) {
								this.userList = res.data.data.dataList;
							} else {
								window.alert(res.data.errMsg)
							}
						}
				);
			},
			cb() {
				this.reset();
			},
			reset() {
				this.config.show = false;
				this.userList.length = 0;
				this.keyword = '';
			},
			removeSelectedUser(selectedUser){
				this.members = this.members.filter(t => t.employeeCode != selectedUser.employeeCode);
			}
		}

	}
</script>
<template>
	<div class="modal-mask modal-transition" v-if="config.show" transition="modal">
		<div class="modal-area">
			<div class="modal-header">
				人员
				<i @click='config.show = false' class="icon-modal__close"></i>
			</div>
			<div class="modal-content">
				<div class="left">
					<div class="head flex-bet">
						<div class="searchBox">
							<input placeholder="姓名" type="text" v-model="keyword">
							<i class="icon-teamwork" @click="getUserList(departmentCode)"></i>
						</div>
					</div>
					<div class="ctn">
						<ul>
							<li v-for='department in departmentList' @click='getUserList(department.departmentCode)'>{{department.departmentName}}</li>
						</ul>
					</div>
				</div>
				<div class="middle">
					<div class="head flex-bet">
						人员名单
					</div>
					<div class="ctn">
						<vtable :checkbox.sync='members' :data='userList' :config='tableCfg'></vtable>
					</div>
				</div>
				<div class="right">
					<div class="head flex-bet">
						事务成员
					</div>
					<div class="ctn">
						<ul>
							<li v-for="selectedUser in members">
								{{selectedUser.memberUserName ||selectedUser.employeeName}}
								<i class="icon-modal__close" @click="removeSelectedUser(selectedUser)" v-if="checkboxChangeable(selectedUser)"></i>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="modal-foot">
				<button class="btn-xl-def" @click='reset'>取消</button>
				<button class="btn-xl-imp" @click="cb">确定</button>
			</div>
		</div>
	</div>
</template>
<style lang='less' scoped>
	@import '../../../../../public/css/variable.less';

	.mgr10 {
		margin-right: 10px;
	}

	.icon-teamwork {
		cursor: pointer;
	}

	.flex-bet {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.searchBox {
		position: relative;
		input[type='text'] {
			width: 164px;
			height: 24px;
			padding-right: 30px;
			border-radius: 50px;
			font-size: 12px;
		}
		[class^='icon-'] {
			position: absolute;
			right: 5px;
			top: 0;
			width: 24px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 0;
		}
	}

	.modal-content {
		display: flex;
		flex-wrap: nowrap;
		width: 100%;
		height: 410px;
		border-top: 1px solid @border-color;
		border-bottom: 1px solid @border-color;
		> div {
			height: 100%;
		}
		.ctn {
			position: relative;
			height: 365px;
			overflow-y: scroll;
			overflow-x: hidden;
			li {
				display: flex;
				height: 42px;
				width: 100%;
				font-size: 12px;
				padding: 0 14px;
				align-items: center;
				cursor: pointer;
				border-bottom: 1px solid @border-color;
				&:hover {
					background-color: @list-hover;
				}
			;
				i {
					position: absolute;
					right: 10px;
					transform: scale(0.8);
				}
			}
		}
		.head {
			width: 100%;
			height: 42px;
			padding: 0 10px;
			font-size: 12px;
			border-bottom: 1px solid @border-color;
			color: @gray-sub;
		}
		.left {
			width: 180px;
			border-right: 1px solid @border-color;
		}
		.right {
			width: 180px;
			border-left: 1px solid @border-color;
		}
		.middle {
			width: 500px;
		}
	}

	/* 弹框样式 */

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		height: 46px;
		padding: 0 20px;
		background: #F4F7FD;
		color: #6c7a95;
		font-size: 16px;
		line-height: 46px;
		border-radius: 5px 5px 0 0;
	}

	.text {
		text-align: right;
	}

	.left {
		float: left
	}

	.mgr-0 {
		margin-right: 0 !important
	}

	.text-right {
		text-align: right;
	}

	.modal-mask,
	.moimg-mask {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.55);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: opacity .3s ease;
	}

	.modal-area {
		position: relative;
		margin: 0 auto;
		background-color: @body-bg;
		width: 860px;
		height: 520px;
		border-radius: 8px;
		transition: all .3s ease;
		box-shadow: 0 0 3px rgba(0, 0, 0, .25);
		&.mb-58 {
			padding-bottom: 58px;
		}
		.pointer {
			cursor: pointer;
		}
	}

	.modal-head {
		position: relative;
		border-bottom: 1px solid #e8e8e8;
		margin-bottom: 20px;
	}

	.modal-foot {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 15px;
		left: 0;
		bottom: 0;
		right: 0;
		[class^="btn-"] {
			margin-left: 10px;
		}
	}

	.dialog-btn {
		height: 28px;
		line-height: 26px;
		margin-right: 6px;
		padding: 0 15px;
		border: 1px solid #becfe4;
		background-color: transparent;
		color: #333;
		border-radius: 2px;
		font-weight: 400;
		cursor: pointer;
		text-decoration: none;
		&:hover {
			opacity: .9;
			text-decoration: none;
			border-color: #017aff;
			color: #017aff;
		}
	}

	.mgl-10 {
		margin-left: 10px;
	}

	.mgr-10 {
		margin-right: 10px;
	}

	.mgr-40 {
		margin-right: 40px;
	}

	.modal-enter,
	.modal-leave,
	.moimg-enter,
	.moimg-leave {
		opacity: 0;
	}

	.modal-enter .modal-area,
	.modal-leave .modal-area,
	.moimg-enter .moimg-area,
	.moimg-leave .moimg-area {
		-webkit-transform: scale(1.1);
		transform: scale(1.1);
	}
</style>
