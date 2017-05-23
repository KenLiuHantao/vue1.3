<script>
    import currency from 'nb/refer/currency.vue'
    export default {
        components:{
            currency
        },
        data(){
            return {
                cfg:{
                    show: false,
                    width: '700px',
                    height: '500px',
                    header: '币种设置',
                    btn: [{
                        name: '关闭',
                        emit: 'codeclose'
                    }, {
                        name: '确认',
                        emit: 'codesure'
                    }]
                },
                cbobj:{}
            }
        },
        methods:{
            check(){
                this.cfg.show = true
            },
            cb(obj){
                this.cbobj=obj
            }
        }
    }
</script>
<template>
    <button class="btn-xl-imp" @click="check">币种设置</button>
    <currency :config='cfg'  @cb='cb'></currency>
    <pre>

    methods方法:

        //点击确定按钮后返回选中的数据
        @cb(val)

    返回数据:
    {{cbobj | json}}
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

