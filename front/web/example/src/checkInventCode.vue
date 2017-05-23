<script>
    import sc from 'nb/refer/inventory'
    export default {
        components:{
            sc
        },
        data(){
            return {
                sCfg:{
                    show:false,
                },
                checkData:''
            }
        },
        methods:{
            sure(val){
                this.checkData = val
            },
            check(){
                this.sCfg.show = true
            }
        }
    }
</script>
<template>
    <button class="btn-xl-imp" @click="check">货品编码</button>
    <sc :config="sCfg" @cb="sure"></sc>
    <pre>
    config配置:
    {
        //弹框显示 true|false 必填
        show:false,
    },

    methods方法:

        //点击确定按钮后返回选中的数据
        @cb(val)

    返回数据:
    {{checkData | json}}
    </pre>
</template>
<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        height: auto;
        max-height: 500px;
        border-left: 2px solid cadetblue;
        overflow: auto;
    }
</style>

