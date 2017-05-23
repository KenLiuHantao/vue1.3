<script>
    import cd from 'nb/refer/department.vue'
    export default {
        components:{
            cd
        },
        data(){
            return {
                oData:{
                    objects:{}
                },
                depCfg:{
                    show:false,
                    data:{}
                }
            }
        },
        methods:{
            check(){
                this.depCfg.show = true
                this.depCfg.data = this.oData.objects
            },
            sure(val){
                this.oData.objects = val
            }
        },

    }
</script>

<template>
    <button class="btn-xl-imp" @click="check">选择部门</button>
    <cd :config="depCfg" @cb="sure"></cd>
    <pre>
    config配置:
    {
        //弹框显示 true|false 必填
        show:false,

        //当前已选中的数据
        data:{}
    },

    methods方法:

        //点击确定按钮后返回选中的数据
        @cb(val)

    返回数据:
    {{oData.objects | json}}
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
