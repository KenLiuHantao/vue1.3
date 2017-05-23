<script>
import blurry from 'nc/blurry/app'
import referEmployee from 'nb/refer/employee.vue'
import mix from '../referCommon/fuzzy.js'
import _ from 'lodash'

export default {
    mixins:[mix],
    components:{
        blurry,referEmployee
    },
    props: {
        data:Object,
        config:{
            type:Object,
            default(){
                return {
                    key:'employeeName',
                    code:'employeeCode',
                    refer:['employeeName','employeeCode'],
                    item:['employeeName','employeeCode'],
                    del:['employeeName','employeeCode'],
                    init:false
                }
            }
        }
    },
    data() {
        return {
            //请求参数
            param: {
                "departmentCode": "",
                "keyWord": this.data[this.config.key]
            },
        }
    },
    methods: {
        //获取模糊查询数据的列表
        getList() {
            if(this.config.init==true){
                this.param.initStatus=true;
            }else{
                this.param.initStatus=false;
            }
            this.$http.post(__URL.hr + 'employee/list/ref', this.param).then(
                (res) => {
                    if(res.data.success){
                        this.blurData = res.data.data.dataList
                        if(this.blurData.length) this.findItem(this.blurData,this.param[this.config.key])
                    }
                }
            )
        },
    }
}
</script>
<template>
    <input-group :config="iCfg" :data="data[config.key]" @clear="clearData" @cb="dataChanged" @modal="checkModal" @foc="inFocus" @blu='outBlur'>
        <blurry :data='blurData' :config='bCfg' @cb="getItem"></blurry>
    </input-group>
    <refer-employee :config="referCfg" :init="config.init" @cb="getData"></refer-employee>
</template>
<style lang='less' scoped>
</style>
