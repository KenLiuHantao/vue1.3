<script type="text/javascript">
	import role from 'nb/refer/role.vue'
	export default {
		components: {
			role
		},
		data() {
			return {
				roleSelectConfig: {
					departmentCode: null
				},
			}
		},
		methods: {
			selectRoles:function(){
				this.roleSelectConfig.departmentCode = "81602357";
				this.roleSelectConfig.show = true;
			},
			onSelected: function (departmentCode, selectedRoles) {
				//这里是选完了角色之后的回调函数
				//departmentCode 被操作的部门的CODE
				//selectedRoles 选中的角色的信息
				selectedRoles.forEach(function(role){
					window.alert(role.name);
				});
			}
		}
	}
</script>
<template>
	<button class="btn-lg-imp" @click='selectRoles'>岗位管理</button>
	<role :role.sync="roleSelectConfig" @cb="onSelected"></role>
</template>
