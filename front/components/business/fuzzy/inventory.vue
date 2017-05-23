<script>
import sinput from 'nc/input/sInput'
import blurry from 'nc/blurry/app'
import referInventory from 'nb/refer/inventory.vue'
import mix from '../referCommon/fuzzy.js'
import _ from 'lodash'

export default {
    mixins:[mix],
    components:{
        sinput,blurry,referInventory
    },
    props: {
        data:Object,
        config:{
            type:Object,
            default(){
                return {
                    key:'keyword',
                    code:'inventoryCode',
                    refer:['inventoryName','inventoryCode'],
                    item:['inventoryName','inventoryCode'],
                    del:['inventoryName','inventoryCode'],
                }
            }
        }
    },
    data() {
        return {
            //请求参数
            param: {
                  "attributeCode": 0,
                  "inventoryCategoryCode": "",
                  "inventoryCategoryName": "",
                  "inventoryCode": "",
                  "inventoryName": '',
                  "inventorySpec": "",
                  "keyword": this.data[this.config.key],
                  "pageIndex": 0,
                  "pageSize": 0,
                  "tabIndex": 0
                },
        }
    },
    methods: {
        //获取模糊查询数据的列表
        getList() {
            this.$http.post(__URL.dev + 'inventory/ref', this.param).then(
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
    <refer-inventory :config="referCfg" @cb="getData" @addnew='addnew'></refer-inventory>
</template>
<style lang='less' scoped>
</style>
