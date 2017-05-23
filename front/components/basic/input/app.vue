<script>
/*
    输入框，可限制位数
*/
export default {
    props: ['code', 'key'],
    data() {
        return {
            allList: [],
            length: 9,
            decimal: 5,
            lastlength: 0,
            beforeData: ''
        }
    },
    filters: {
        empty: {
            twoWay: true,
            read(val) {
                return val ? val : ''
            },
            write(val) {
                return val ? val : ''
            }
        }
    },
    methods: {
        limit() {
            let rule = new RegExp("^\\d{0," + this.length + "}(\\.{1,1}\\d{0," + this.decimal + "})?$")

            if (this.code == '' || this.code < 0) {
                this.beforeData = this.code = 0
            }
            if (rule.test(this.code)) {
                this.beforeData = this.code
            } else {
                this.code = this.beforeData
            }
        },
        set(){
            this.beforeData = this.code
        },
        get() {
            this.beforeData = this.code;
        }
    }
}
</script>
<template>
    <input v-model='code | empty' @focus='get' @keyup="limit" :maxlength="length+decimal+1"  type="text">
</template>
<style lang='less'>
</style>
