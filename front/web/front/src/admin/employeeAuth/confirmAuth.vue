<script>
    export default{
        props: ['config', 'data'],
        data(){
            return {
                showHadAuth: false
            }
        },
        methods: {
            quite(){
                this.config.show = false
            },
            sure(){
                this.config.show = false
                this.$emit('cb',this.data)
            },
            close(){
                this.config.show =false
            }
        },
        computed: {
            modalCfg(){
                let c = {
                    show: this.config.show,
                    header: '授权确认',
                    width: '400px',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确认',
                        emit: 'sure'
                    }]
                }
                return c
            },
            hadAuthed(){
                return this.data.employeeRoleVoList.length > 0
            },
        }
    }
</script>

<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure" @close="close">
        <div class="auth-wrap bottom-line " :class="{'pd-42':hadAuthed}">
            <div class="banner open" @click="showHadAuth=true" v-if="hadAuthed && !showHadAuth">查看已授权的岗位 <i class="icon-down"></i></div>
            <div class="banner close" @click="showHadAuth=false" v-if="hadAuthed && showHadAuth">收起 <i class="icon-up"></i></div>
            <div class="list-wrap">
                <div class="auth-title bottom-line">待授权岗位职能权限</div>
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
                <div class="auth-title back-gray" v-show="showHadAuth">已授权岗位职能权限</div>
                <ul v-show="showHadAuth">
                    <li class="container-list had" v-for="item in data.employeeRoleVoList">
                        <div class="list list-left">
                            <span class="role-title">{{item.roleName}}</span>
                        </div>
                        <div class="list list-right">
                            <ul>
                                <li v-for="info in item.employeePostVos">
                                    {{info.postName}}

                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </modal>
</template>

<style lang="less" scoped>
    @import './employee.less';
</style>