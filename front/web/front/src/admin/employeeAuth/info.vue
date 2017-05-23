<script>
export default{
    props:{
        'config':{
            type:Object
        },
        'data':{
            type:Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return {
            //备份数据
            bakData:''
        }
    },
    methods:{
        quite(){
            this.config.show = false
        },
        sure(){
            if(this.bakData.phone == this.data.phone){
                this.config.show = false
                return
            }else{
                this.$http.get(__URL.service +'user/mobile/exist',{params:{mobile:this.bakData.phone}}).then(
                    res=>{
                        if(res.data.success){
                            this.config.show = false
                            this.$emit('cb',this.bakData)
                        }else{
                            this.$warning({'message':'保存失败,号码不能重复！','type':'failure'})
                            return
                        }
                    }
                )
            }
        },
        close(){
            this.config.show = false
        }
    },
    watch:{
        data:{
            handler(val){
                this.bakData = Object.assign({},val)
            },
            deep:true
        },
    },
    computed:{
        modalCfg(){
            let c = {
                show: this.config.show,
                header: '员工信息',
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
        }
    }
}
</script>

<template>
    <modal :config="modalCfg" @sure="sure" @quite="quite" @close="close">
        <ul class="info-list">
            <li>
                <div class="title">工号:</div>
                <div>{{bakData.jobNumber}}</div>
            </li>
            <li>
                <div class="title">姓名:</div>
                <div>{{bakData.employeeName}}</div>
            </li>
            <li>
                <div class="title">部门:</div>
                <div>{{bakData.postDeptName}}</div>
            </li>
            <li>
                <div class="title">岗位:</div>
                <div>{{bakData.postRoleName}}</div>
            </li>
            <li>
                <div class="title">手机号码 :</div>
                <div><input type="text" v-model="bakData.phone"></div>
            </li>
        </ul>
    </modal>
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .info-list{
        padding: 15px 15px 25px 15px;
        border-bottom: 1px solid @border-color;
        margin-bottom: 10px;
        font-size: 12px;
        li{
            display: flex;
            height: 32px;
            align-items: center;
            flex-direction: row;
            justify-content: flex-start;

            .title{
                color: @gray-sub;
                width: 80px;
            }
        }
    }
</style>