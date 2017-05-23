<script type="text/javascript">
    import upfile from 'nc/uploadfile/app'
    export default {
        components:{
            upfile
        },
        data(){
            return {
                config:{
                },
                fileData:''
            }
        },
        methods:{
            file(val){
                this.fileData = val
            }
        }
    }
</script>
<template>
    <upfile :config="config" @cb="file">
    </upfile>
    <pre>
    config配置:
    {
        //文件上传限制 | 选填
        size: 1024 * 1024 * 10,

        //方件上传类型 | 选填
        extensions: 'txt, doc,',

        //文件上传地址 | 选填
        url: 'v1/file/upload',
    },

    methods方法:

        //上传成功后勾子函数，可用一个参数接收返回值
        @cb(val)

    返回数据格式:
    {{fileData | json}}
    </pre>
</template>

<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
    }
</style>

