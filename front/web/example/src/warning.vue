<script>
    import warning from 'nc/modal/warning'
    export default {
        components:{
            warning
        },
        data(){
            return {
                wCfg:{
                    show:false,
                    content:'创建成功创建成功',
                    type:'success',
                    showTime:1000000
                }
            }
        },
        methods:{
            s(){
                this.wCfg.show = true
                this.wCfg.type="success"
            },
            f(){
                this.wCfg.show = true
                this.wCfg.type="failure"
            },
            w(){
                this.wCfg.show = true
                this.wCfg.type="warning"
            }
        }
    }
</script>
<template>
    <button class="btn-xl-imp" @click="s">成功</button>
    <button class="btn-xl-imp" @click="f">失败</button>
    <button class="btn-xl-imp" @click="w">警告提示</button>
    <warning :config="wCfg"></warning>
    <pre>
    config配置:
    {
       //false|true   二选一必填
       show:true,

       //success|failure|warning   三选一必填
       type:'success',

       //根据内容自定   必填
       content:'提示消息的具体内容',

       //显示时间，以毫秒为单位 选填
       showTime:''
   }
    </pre>
</template>
<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
        overflow: auto;
    }
</style>

