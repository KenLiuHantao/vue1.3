<script>
    /*
        @date:2017.01.16
        @author:skye
        @config {object}
                show:false       控制显示 | 必填
                title:''         模板名字 | 必填
                url:''           文件上传地址 | 必填
                tmpUrl:''        模板下载地址 | 必填
                type:''          文件类型(后台需要) | 选填
                extensions:''    可上传类型 | 选填
                page:'service'   使用地方 | 选填
                msg:''           自定义描述文字
    */
    import progress from 'nc/progress/app'
    export default {
        props:{
            config:{
                type:Object
            }
        },
        components:{
            progress
        },
        data(){
            return {
                //添加业务员弹框
                modalCfg:{
                    show: this.config.show || false,
                    width: '460px',
                    height: 'auto',
                    header: this.config.title || '',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    },{
                        name: '导入',
                        emit: 'sure'
                    }],
                },
                //文件名称
                filesName:'',
                //类型检测是否通过
                vaExtension:true,
                //是否为空检测通过，可以提交
                subOrNot:true,
                //是否上传失败过，防止失败重复提交
                upFail:false,
                //提交锁，在一次正常提交未结束不能再进行提交
                upLock:false,
                extensions:'.xls,.xlsx',
                tips:{
                    show:false,
                    words:'您导入的表格格式不符合规范，请下载正确的供应商导入模版'
                },
                //进度条比例
                barWidth:0,
            }
        },
        methods:{
            upfile(){
                document.getElementById('file').click()
                this.upFail = false
                //当不是提示格式错误时，重置提示语
                if(this.vaExtension){
                    this.tips.show = false
                }
            },
            //检测文件类型
            checkExt(val){
               this.vaExtension = true
               this.tips.show = false
               let ext= val.substr(val.lastIndexOf(".")).toLowerCase();
               let extArray = this.config.extensions != undefined ? this.config.extensions.split(',') : this.extensions.split(',')
               if(extArray.indexOf(ext) == -1){
                    this.vaExtension = false
                    this.tips.show = true
                    this.tips.words = '您选择的文件格式不正确，请选择.xls，.xlsx格式的文件'
               }
            },
            //检测是否为空
            isNull(val){
                this.subOrNot = true
                if(val == ''){
                    this.subOrNot = false
                    this.tips.show = true
                    this.tips.words = '请选择要导入的文件'
                }
            },
            //提交数据
            importData(){
                var vThis = this
                this.upLock = true
                let form = document.forms["importForm"];
                let oData = new FormData(document.forms.namedItem("importForm"))
                this.$http.post( this.config.url || __URL.arc+'inventory/upload',oData,
                    {
                        progress(e){
                            vThis.barWidth = parseInt((e.loaded/e.total)*100)
                        }
                    }
                ).
                then(
                    res=>{
                        if(res.data.success){
                            this.$emit('cb',res)
                            this.modalCfg.show  = false
                        }else{
                            this.upFail = true
                            this.tips.show = true
                            this.tips.words = res.data.errMsg
                        }
                        this.upLock = false
                    }
                )
            },
            quite(){
                this.modalCfg.show  = false
            },
            sure(){
                //检测是否为空
                this.isNull(this.filesName)
                if(this.vaExtension && this.subOrNot && !this.upFail && !this.upLock){
                    this.importData()
                }
            }
        },
        watch:{
            config:{
                handler(val){
                    this.modalCfg.show = val.show
                    //当关闭弹时，清掉弹框中的数据
                    if(!this.modalCfg.show ){
                        this.tips.show = false
                        this.filesName = ''
                    }
                },
                deep:true
            },
            modalCfg:{
                handler(val){
                    this.config.show = val.show
                },
                deep:true
            },
            filesName(val){
                //不为空，检测类型是否符合
                if(val != ''){
                     this.checkExt(val)
                }
            }
        }
    }
</script>

<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="i-wrap">
            <div class="title">操作说明：</div>
            <template v-if='config.page!="service"'>
                <p >1.下载<a class="download" :href="config.tmpUrl">《{{config.title}}导入模板》</a>;</p>
                <p >2.打开下载的表格，将对应字段信息输入或粘贴到表格内;(为了确保信息有</p>
                <p >效导入，请将表单格式设置为纯文本或数字);</p>
                <p >3.信息录入完毕后，点击“浏览”按钮，选择excel文档;</p>
                <p>4.点击“导入”执行操作。</p>
            </template>
            <template v-else>
                <p>1.点击 "浏览" 按钮，选择已准备好的《{{config.title}}导入模板.xls》</p>
                <p>2.点击“导入”执行操作。</p>
            </template>
            <p v-if="config.msg">{{config.msg}}</p>
            <div class="mt-20 tips" v-if='config.page!="service"'> <span class="light"></span>提示:导入的数据默认为您保留7天，请在导入后及时上传数据至{{config.title}}。 </div>
            <div class="up-file">
                <div class="up-wrap">
                    <input type='text' v-model="filesName" disabled name='fileName' id='fileName' class='txt' />
                    <a href="javascript:;" @click="upfile" v-if="!upLock" >浏览</a>
                    <a href="javascript:;" v-if="upLock" >浏览</a>
                </div>
                <form name="importForm" id="importForm" method="post" enctype="multipart/form-data">
                    <input type="file" id="file" name="file" class="file" v-model="filesName"/>
                </form>
                <div class="error" v-show="tips.show">{{tips.words}}</div>
                <progress :data="barWidth"></progress>
            </div>
        </div>
    </modal>
</template>

<style lang="less">
    @import '../../../public/css/variable.less';
    .progress{
        width: 100%;
        height: 10px;
        margin-top: 10px;
        border-radius: 10px;
        border: 1px solid @border-color;

        .progress-bar{
            width: 20px;
            height: 100%;
            border-radius: 10px;
            background-color: red;
            transition: width .5s;
        }
    }

    .i-wrap{
        padding: 15px;
        font-size: 12px;
        p{
            line-height: 22px;
            text-indent: 1em;
            color: @gray-sub;
        }
        .tips{
            color: #FF8C1F;

            .light{
                display: inline-block;
                width: 18px;
                height: 18px;
                background: url("../../../public/images/light.png") no-repeat center center;
                background-size: 100% 100%;
                vertical-align: middle;
                margin-right: 5px;
            }
        }
        .mt-20{
            margin-top: 20px;
        }
        .title{
            font-size: 14px;
            line-height: 24px;
        }
        .download {
            color: @link-hover;
        }
        .up-file{
            position:relative;
            width:100%;
            height: 100px;
            margin-top: 15px;
            font-size: 0;
            overflow: hidden;
            .up-wrap{
                position: relative;
                font-size: 12px;
                a{
                    position: absolute;
                    border-left: 1px solid @border-color;
                    padding-left: 10px;
                    right: 10px;
                    top: 0;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    color: @link-hover;
                }
                input{
                    vertical-align:middle;
                    width: 100%;
                    height: 38px;
                    margin:0;
                    padding:0
                }
            }

            .txt{
                height:28px;
                margin-right: 10px;
                border:1px solid @border-color;
                width:320px;
                padding-left: 5px;
            }
            .file{
                position:absolute;
                width:100px;
                height:28px;
                cursor: pointer;
                top:0;
                right:0px;
                opacity: 0;
                z-index: -1;
            }
            .error{
                font-size: 12px;
                color: #ff4e4d;
                margin-top: 5px;
            }
        }
    }
</style>