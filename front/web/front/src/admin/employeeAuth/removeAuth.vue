<script>
export default{
    props:['config','data'],
    data(){
        return {

        }
    },
    methods:{
        quite(){
            this.config.show =false
        },
        sure(){
            this.config.show =false
            this.$emit('cb',this.data)
        },
        close(){
            this.config.show = false
        }
    },
    computed:{
        modalCfg(){
            let c = {
                show: this.config.show,
                header: '权限管理',
                width: '400px',
                btn: [{
                    name: '取消',
                    emit: 'quite'
                }, {
                    name: '移除权限',
                    emit: 'sure',
                    className:['btn-lg-danger']
                }]
            }
            return c
        }
    }
}
</script>

<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure" @close="close">
        <div class="auth-wrap bottom-line ">
            <div class="list-wrap">
                <div class="auth-title bottom-line">待移除岗位职能权限</div>
                <ul>
                    <li class="container-list">
                        <div class="list list-left">
                            <span class="role-title">
                                {{data.waitEmployeeRoleVo.roleName}}
                            </span>
                        </div>
                        <div class="list list-right">
                            <ul>
                                <li v-for="item in data.waitEmployeeRoleVo.employeePostVos">
                                    {{item.postName}}

                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </modal>
</template>
<style lang="less">
    @import './employee.less';
</style>