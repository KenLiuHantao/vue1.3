<script>
    import alert from 'nc/modal/alert'
    export default {
        components:{
            alert
        },
        data(){
            return {
                sCfg:{
                    show:false,
                    msg:'创建成功创建成功创建成功创建成功创建成功创建成功创建成功',
                },
                fCfg:{
                    show:false,
                    msg:'创建成功创建成功创建成功创建成功创建成功创建成功创建成功',
                    subMsg:'创建成功创建成功创建成功创建成功创建成功创建成功创建成功',
                    type:'failure'
                },
                oCfg:{
                    show:false,
                    msg:'创建成功创建成功创建成功创建成功创建成功创建成功创建成功',
                    quite:false,
                    type:'warning'
                }
            }
        },
        methods:{
            s(){
                this.sCfg.show = true
            },
            f(){
                this.fCfg.show = true
            },
            o(){
                this.oCfg.show = true
            }
        }
    }
</script>
<template>
    <button class="btn-xl-imp" @click="s">成功</button>
    <button class="btn-xl-imp" @click="f">失败</button>
    <button class="btn-xl-imp" @click="o">只保留一个按钮</button>
    <alert :config="sCfg"></alert>
    <alert :config="fCfg"></alert>
    <alert :config="oCfg"></alert>
    <pre>
    config配置:
    {
       //false|true   必填
       show:true,

       //failure|warning   必填，默认warning
       type:'success',

       //根据内容自定        必填
       msg:'提示消息',

       //根据内容自定        选填
       subMsg:'第二级提',

       //取消按钮是否显示     选填
       quite:false,

       //确认按钮是否显示     选填
       sure:false,

       //取消按钮名称   选填
       qname:'取消',

       //确认按钮名称   选填
       sname:'确认',

        //确认按键是否自动关闭，默认true  选填
        sAutoClose:'false',

        //按取消后弹框是否自动关闭  默认true 选填
        qAutoClose:'false',

        //标题
        title:'提示',

       //执行确认操作所需要的某数据，在cb方法中能够取到  选填
       item:'0002'
    }

    methods方法:

    点击确认后执行的回调方法
    @cb(val)

    点击取消后可以执行的回调
    @quite(val)
    </pre>
</template>
<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        height: 400px;
        border-left: 2px solid cadetblue;
        overflow: auto;
    }
</style>

