<script>
import sinput from 'nc/input/sInput'
import blurry from 'nc/blurry/app'
import referCustomer from 'nb/refer/customer'
import mix from '../referCommon/fuzzy.js'
import _ from 'lodash'
export default {
    mixins:[mix],
    components:{
        sinput,blurry,referCustomer
    },
    props: {
        data:Object,
        config:{
            type:Object,
            default(){
                return {
                    key:'customerName',
                    code:'customerCode',
                    refer:['customerName','customerCode'],
                    item:['customerName','customerCode'],
                    del:['customerName','customerCode'],
                }
            }
        }
    },
    data(){
        return {
            param: {
                "industryCode": "",
                "customerName": this.data[this.config.key],
                "keyWord": "",
                "pageIndex": 0,
                "pageSize": 0
            },
        }
    }
    ,
    methods: {
        //获取模糊查询数据的列表
        getList() {
            this.$http.post(__URL.crm + 'customer/ref', this.param).then(
                (res) => {
                    if(res.data.success){
                        this.blurData = res.data.data.dataList
                        if(this.blurData.length) this.findItem(this.blurData,this.param[this.config.key])
                    }
                }
            )
        },
        addnew(){
            this.referCfg.show=false
            this.$emit('addnew')
        }
    }
}
</script>
<template>
    <sinput :config="iCfg" :data="data[config.key]" @clear="clearData" @cb="dataChanged" @modal="checkModal" @foc="inFocus" @blu='outBlur'>
        <blurry :data='blurData' :config='bCfg' @cb="getItem"></blurry>
    </sinput>
    <refer-customer :config="referCfg" @cb="getData" @addnew='addnew'></refer-customer>
</template>
<style lang='less' scoped>
</style>
