<script type="text/javascript">
	import message from 'nc/modal/msg'
	export default{
	    components:{
	        message
		},
		props: ["role", "datalist", "deptCode"],
		data(){
			return {
				availableRoles: {},
				isEdit: false,
				msgconfig: {
					show: '',
					content: ''
				}
			}
		},
		ready(){
			this.getAvailableRoles();
		},
		methods: {
			getAvailableRoles: function () {
				this.$http.get(__URL.service + 'role/search/department/name/like','').then(
						(res) => {
							this.availableRoles = res.data.data;
							this.availableRoles.roleCode=this.availableRoles.code;
							this.availableRoles.roleName=this.availableRoles.name;
						}
				)
			},
			joinPostNames(postNames) {
				return postNames.map(function (postName) {
					return postName.name;
				}).join(' / ');
			},
			changeChk() {
				this.datalist = [];
				for (var i = 0, size = this.role.selectedRoles.length; i < size; i++) {
					let code = this.role.selectedRoles[i];
					for (var j = 0, jsize = this.availableRoles.length; j < jsize; j++) {
						let item = this.availableRoles[j];
						if (code == item.code) {
							this.datalist.push(item);
						}
					}
				}
			},
			close(){
				this.getAvailableRoles()
				this.role.show = false
				this.$emit("close",)
			},
			submit(){
				this.$http.post(__URL.hr + 'department/role/save', {departmentCode: this.deptCode, roles: this.role.selectedRoles}).then(
						(res) => {
							console.log(res.data)
							if (res.data.success) {
								this.close()
							}
						}
				);
			},
			preUpdateRoleItem(item){
				this.isEdit = item.code
			},
			updateRoleItem(item){
				this.isEdit = ''
				this.$http.post(__URL.service + "role/modify/name", '', {params:{roleCode: item.code, name: item.name}}).then(
					(res) => {
						if (res.data.success) {
							this.msgconfig.show = true
							this.msgconfig.content = "修改成功"
						} else {
							this.msgconfig.show = true
							this.msgconfig.content = res.data.errMsg
						}
					}
				)
			}
		},
		filters: {
			checkboxDisabled: function (code) {
				if(this.role.permanentRoles){
					if(this.role.permanentRoles.indexOf(code)!=-1){
						return true;
					}
				}
				return false;
			}
		}
	}


</script>
<template>
	<div class="modal-mask modal-transition" v-if="role.show" transition="modal">
		<div class="modal-area">
			<div class="modal-header">
				岗位管理
				<i @click='close' class="icon-modal__close"></i>
			</div>
			<div class="modal-content">
				<div class="left">
					<div class='head flex-bet'>
						<a href="javascript:;">系统岗位列表</a>
					</div>
					<div class="ctn">
						<ul>
							<li v-for='item in availableRoles'>
								<input type="checkbox" v-model="role.selectedRoles" @change="changeChk" :value="item.code" :disabled="item.code | checkboxDisabled">
								<template v-if="isEdit != item.code">
									{{item.name}}
									<i @click='preUpdateRoleItem(item)' class="icon-documentary"></i>
								</template>
								<template v-else>
									<input type="text" v-model="item.name">
									<i @click='updateRoleItem(item)' class="icon-checkbox-checked"></i>
								</template>
							</li>
						</ul>
					</div>
				</div>
				<div class="right">
					<div class="head flex-bet" v-else>
						岗位职能权限
					</div>
					<div class="ctn">
						<table class="table-list">
							<tbody>
							<tr v-for="data in datalist">
								<td class="td-left">{{data.name}}</td>
								<td>{{joinPostNames(data.relatedPostList)}}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="modal-foot">
				<button class="btn-xl-def" @click='close'>取消</button>
				<button class="btn-xl-imp" @click="submit">确定</button>
			</div>
		</div>
	</div>

	<message :config="msgconfig"></message>

</template>
<style lang='less' scoped>
	@import '../../../public/css/variable.less';

	.mgr10 {
		margin-right: 10px;
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

	.table-list {
		font-size: @font-size-base;
		width: 100%;
		table-layout: fixed;

		thead tr th,
		tbody tr td {
			text-overflow: ellipsis;
			/*overflow: hidden;*/
			padding: 5px 7px;
			text-align: left;
			line-height: 1.5;
			font-size: 12px;
			&.td-left {
				width: 20%;
				padding-left: 15px;
				white-space: nowrap;
			}
		}

		tbody tr {
			&:nth-of-type(2n-1) {
				background-color: #FAFAFA;
			}
			&:hover {
				background-color: #EBF7FD;
				.icon {
					display: table-cell;
					align-items: center;
				}
			}
			height: 42px;
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
					i {
						display: inline-block;
						color: #008af5;
						position: absolute;
						right: 20px;
					}
				}
			;
				i {
					display: none;
				}
				> input[type = 'checkbox'] {
					margin-right: 18px !important;
				}
			}
		}
		.head {
			width: 100%;
			height: 42px;
			padding: 0 16px;
			font-size: 12px;
			border-bottom: 1px solid @border-color;
			color: @gray-sub;
		}
		.left {
			width: 280px;
			border-right: 1px solid @border-color;
		}
		.right {
			width: 580px;
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
