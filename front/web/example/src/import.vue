<script>
    import imp from 'nb/import/app'
    export default {
        components: {
            imp
        },
        ready(){
        },
        data(){
            return {
                importCfg:{
                    show:false,
                    title:'货品档案',
                    url: __URL.osiu + 'import/initInventory',
                    tmpUrl:__URL.arc+'inventory/download',
                },
            }
        },
        methods:{
            ip(){
                this.importCfg.show = true
            },
            cb(val){
                console.log('上传成功后勾子函数,以及返回值',val)
            }
        }
    }
</script>
<template>
    <button @click="ip" class="btn-xl-icimp">导入</button>
    <imp :config="importCfg" @cb="cb"></imp>
    <pre>
    config参数:

    {
        //显示与否 | 必选
        show:false,

        //要导入title | 必选
        title:'货品档案',

        //文件导入接口地址 | 必选
        url:__URL.arc +'inventory/upload',

        //文件下载接口地址 | 必选
        tmpUrl:__URL.arc+'inventory/download',

        //文件属于哪一类，后台需要 | 选填
        type:'file',

        //可以上传的文件类型后辍定义 | 选填
        extensions:'.doc,,pdf,.xls'
    }

    methods方法:

        上传成功后勾子函数，以及返回值
        @cb
    </pre>
</template>
<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
    }
</style>

