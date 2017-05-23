<script>
import sup from 'nb/fuzzy/supplier'

export default {
    components: {
        sup
    },
    data() {
        return {
            init: {
                supplierName: '',
                supplierCode: ''
            },
            config:{
                key:'supplierName',
                code:'supplierCode',
                refer:['supplierName','supplierCode'],
                item:['supplierName','supplierCode'],
                del:['supplierName','supplierCode'],
            }
        }
    },
    methods:{
        c(val){
            this.c.supplierCode = ''
        }
    }
}
</script>
<template>
    <div class="box">
        <sup  :data='init' @cb="c"></sup>
    </div>
    <pre>
    config配置:
    {
        //展示的名字字段
        key:'supplierName',

        //检验的字段
        code:'supplierCode',

        //参照字段
        refer:['supplierName','supplierCode'],

        //想要改变的值的字段名，顺序与【参照字段】一一对应
        item:['supplierName','supplierCode'],

        //删除时要清除的字段名
        del:['supplierName','supplierCode'],
    },

    methods方法:

        //点击清除按钮后的回调方法
        @clear(val)

    返回数据:
    {{init | json}}
    </pre>
</template>
<style lang='less' scoped>
.box {
    width: 210px;
}
pre{
    margin: 10px;
    padding: 10px;
    height: 500px;
    border-left: 2px solid cadetblue;
    overflow: auto;
}
</style>
