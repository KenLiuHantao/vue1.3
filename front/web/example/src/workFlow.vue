<script>
    import wf from 'nc/workFlow/app'
    export default {
        components:{
            wf
        },
        data(){
            return {
                flowCfg:{
                    data:[{
                    no:'1',
                    name:'新增BOM',
                    time:'2016.10.12 22:12:22',
                    filed:'制单人',
                    user:'smith',
                    flag:true,
                    },{
                    no:'2',
                    name:'审核BOM',
                    time:'2017.11.11 09:02:23',
                    filed:'审核人',
                    user:'skye',
                    flag:true,
                    },{
                    no:'3',
                    name:'终极审核',
                    time:'2017.11.11 23:12:11',
                    filed:'审核人',
                    user:'skye',
                    flag:true,
                    },{
                    no:'4',
                    name:'完成',
                    time:'',
                    filed:'终审',
                    user:'',
                    flag:false,
                    }]
                }
            }
        }
    }
</script>
<template>
    <wf :config="flowCfg"></wf>
    <pre>
    config参数:
    {
        //是否显示时间 | 选填
        showTime:true,

        //完成后显示的状态图标 | 选填
        mark:'&radic;',

        //渲染数据 | 必填
        data:[{
            no:'1',             //状态步骤
            name:'新增BOM',      //状态名称
            time:'2016.10.12',  //时间
            filed:'制单人',      //完成人字段名
            user:'skye',        //完成人名称
            flag:true,          //当前状态
            }]
    }
    </pre>
</template>
<style lang="less">
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
    }
</style>

