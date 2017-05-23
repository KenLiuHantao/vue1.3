<script>
import blurry from 'nc/blurry/app'
import sInput from 'nc/input/sInput'
import _ from 'lodash'

export default {
    components: {
        blurry,
        's-input': sInput
    },
    props: ['data'],
    data() {
        return {
            wareData: [],
            blurryCfg: {
                show: false,
                key: 'warehouseName'
            },
            clickEvent: false
        }
    },
    methods: {
        reset() {
            this.data.warehouseName = ''
            this.data.warehouseCode = ''
        },
        setItem(obj) {
            this.data.warehouseName = obj.warehouseName
            this.data.warehouseCode = obj.warehouseCode
        },
        matchItemCode(arr, keyWords) {
            let code = _.result(_.find(arr, (chr) => {
                return chr.warehouseName == keyWords;
            }), 'warehouseCode')
            if (!arr) this.data.warehouseCode == '';

            code == undefined ? this.data.warehouseCode = '' : this.data.warehouseCode = code
        },
        inFoces() {
            this.clickEvent = false
        },
        flitWare(val) {
            this.reset();

            this.clickEvent ? this.blurryCfg.show = false : this.blurryCfg.show = true
            this.data.warehouseName = val

            this.getWare()
        },
        getItem(obj) {
            this.setItem(obj)
            this.clickEvent = true
            this.blurryCfg.show = false
        },
        outBlur() {
            if (!this.data.warehouseCode) this.reset()
        },
        clearWare() {
            this.reset()
            this.getWare()
        },
        getWare() {
            this.$http.post(__URL.arc + 'warehouse/find/ref', this.data).then(
                (res) => {
                    this.wareData = res.data.data.dataList
                    if (this.wareData.length) this.matchItemCode(this.wareData, this.data.warehouseName)
                }
            )
        }
    }
}
</script>
<template>
    <s-input :data='data.warehouseName' @cb='flitWare' @clear='clearWare' @modal='getWare' @foc='inFoces' @blu='outBlur'>
        <blurry :data='wareData' :config='blurryCfg' @cb='getItem'></blurry>
    </s-input>
</template>
