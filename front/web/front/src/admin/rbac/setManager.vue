<script>
    export default{
        props:{
            config:{
                type:Object,
                require:true
            },
            data:'',
            init:{
                default:false
            }
        },
        data(){
            return{
                employCfg:{
                    show:false
                },
                dataBak:Object.assign({},this.data),
            }
        },
        methods:{
            /*
            * 从参照拿到选择人员的数据
            * */
            getEmployee(val){
                this.dataBak.manager = val.employeeCode
                this.dataBak.managerName = val.employeeName
            },
            /*
            * 发送数据，完成部门负责人更新
            * */
            sure(){
                if(this.dataBak.managerName == null){
                    this.$warning({'message':'部门负责人不能为空！','type':'failure'})
                    return false
                }
                this.$http.post(__URL.service+'department/update-for-manager',this.dataBak).then(
                    res=>{
                        if(res.data.success){
                            this.config.show = false
                            this.$emit('cb')
                            this.$warning({'message':'设置成功！','type':'success'})
                        }else{
                            this.$warning({'message':res.data.errMsg,'type':'failure'})
                        }
                    }
                )
            },
            /*
            * 退出操作
            * */
            close(){
                this.dataBak = Object.assign({},this.data)
                this.config.show = false
            }
        },
        watch:{
            data:{
                handler(val){
                    this.dataBak = Object.assign({},this.data)
                },
                deep:true
            }
        },
        computed: {
            modalConfig(){
                let varPatam = {
                    show: this.config.show,
                    width: '400px',
                    height: 'auto',
                    header: '设置部门负责人',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                };
                return varPatam;
            }
        }
    }
</script>
<template>
    <modal :config="modalConfig" @sure='sure' @quite="close" @close="close">
        <div class="modal-content">
            <div class="form-group">
                <label>部门负责人:</label>
                <div class="s-input ic2">
                    <input v-model="dataBak.managerName" placeholder="添加负责人" readonly type="text">
                    <i @click='employCfg.show=true' class="icon-search r1"></i>
                </div>
            </div>
            <div v-show="dataBak.parentCode == ''" class="form-group">
                <label></label>
                <div class="tips-wrap">
                    <input type="checkbox" v-model="dataBak.supremacy">&nbsp;设为最高行政管理部门
                    <div class="tips-container">
                        <span class="tips"><i class="icon icon-light"></i></span>
                        <div class="tips-content">
                            <span class="arrow"></span>
                            注:最高行政管理部门的负责人将拥有系统所有部门负责人的汇报审批权限
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <refer-employee :config="employCfg" @cb="getEmployee" :init="init"></refer-employee>
    </modal>
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .tips-wrap{
        display: flex;

        .tips-container{
            position: relative;
            cursor: pointer;
            .icon{
                color: #FF8C22;
                margin-left: 5px;
            }
            &:hover .tips-content{
                display: flex;
            }
            .tips-content{
                display: none;
                color:#ff8c1f;
                position: absolute;
                width: 240px;
                height: 50px;
                padding: 10px;
                background-color: white;
                align-items: center;
                justify-content: center;
                line-height: 1.3;
                top:-60px;
                left:-110px;
                border-radius: 5px;
                box-shadow: 0 1px 4px 2px rgba(0,0,0,.1);

                .arrow {
                    width: 6px;
                    height: 6px;
                    background-color: white;
                    left: 50%;
                    bottom: -6px;
                    position: absolute;
                    transform: translateY(-50%) translateX(-50%) rotate(-45deg);
                }
            }
        }
    }
</style>