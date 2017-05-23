<script>
import inputGroup from 'nc/input/sInput'
import blurry from 'nc/blurry/app'
import referSupplier from 'nb/refer/supplier'
import mix from '../referCommon/fuzzy.js'
import _ from 'lodash'

export default {
    mixins:[mix],
    components: {
        inputGroup,
        blurry,
        referSupplier
    },
    props: {
        data: Object,
        config: {
            type: Object,
            default () {
                return {
                    key: 'supplierName',
                    code: 'supplierCode',
                    refer: ['supplierName', 'supplierCode'],
                    item: ['supplierName', 'supplierCode'],
                    del: ['supplierName', 'supplierCode'],
                    //是否显示【冻结】供应商的查询参数
                    supplierStatus:'1'
                }
            }
        }
    },
    data() {
        return {
            //请求参数
            param: {
                "employeeName": "",
                "keyWord": this.data[this.config.key],
                "pageIndex": 0,
                "pageSize": 0,
                "refDocDate": "",
                "supplierCategoryCode": '',
                "supplierName": "",
                "supplierStatus":this.config.supplierStatus || '1'
            },
            //客户参照config
            referCfg:{
                show:false,
                supplierStatus:this.config.supplierStatus || '1'
            },
        }
    },
    methods: {
        getList() {
            this.$http.post(__URL.arc + 'supplier/ref', this.param).then(
                (res) => {
                    if (res.data.success) {
                        this.blurData = res.data.data.dataList
                        if (this.blurData.length) this.findItem(this.blurData, this.param[this.config.key])
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
    <refer-supplier :config="referCfg" @cb="getData"></refer-supplier>
</template>
<style lang='less' scoped>
</style>
