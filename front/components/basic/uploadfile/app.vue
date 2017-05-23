<script>
    export default {
        props:['config'],
        data(){
            return {
                cfg: {
                    size: 1024 * 1024 * 10,
                    extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
                    url: __URL.v1 + 'file/upload',
                },
                fileData:'',

                //类型错误
                extCfg:{
                    show:false,
                    type: 'warning',
                    msg:'文件格式不支持',
                    subMsg:'',
                    quite: false,
                },

                //大小类型
                sizeCfg:{
                    show:false,
                    type: 'warning',
                    msg:'超出大小限制',
                    subMsg:''
                },

                uploading:false,
            }
        },
        ready(){
            this.copyCfg()
        },
        methods:{
            //合并props传入的参数与默认data
            copyCfg(){
                if (this.config != undefined && this.config != null && this.config) {
                    Object.keys(this.config).forEach((key) => {
                        this.cfg[key] = this.config[key]
                    })
                }
            },
            //提交数据
            importData(t){
                let reader = new FileReader()
                let base = ''
                let _ = this
                this.uploading = true
                reader.onload = function(e) {
                    base = this.result
                    let oData = new FormData()
                    oData.append('file',t)

                    _.$http.post( _.cfg.url,oData).then(
                        res=>{
                            _.uploading = false
                            _.fileData = ''
                            if(res.data.success){
                                let r = res.data.data
                                r.fileName = t.name
                                r.baseUrl = base
                                _.$emit('cb',r)
                            }else{

                            }
                        }
                    )
                }
                reader.readAsDataURL(t);
            },
            //检测文件是否超出限制 true | false
            checkSize(fsize,limit){
                return fsize > limit
            },
            //检测文件类型
            checkExt(filename,extarr){
               let ext= filename.substr(filename.lastIndexOf(".")+1).toLowerCase();
               let b = true
               if(extarr.indexOf(ext) == -1){
                    b = false
               }
               return b
            },
            change(e){
                let t = e.target.files[0]
                if(t == undefined) return

                if(this.checkSize(t.size,this.cfg.size)){
                    this.sizeCfg.show = true
                    this.sizeCfg.subMsg = '文件支持最大上传：'+ this.bytesToSize(this.cfg.size)
                    this.fileData = ''
                    return
                }

                if(!this.checkExt(t.name,this.cfg.extensions)){
                    this.extCfg.show  = true
                    this.extCfg.subMsg = '支持的附件格式：'+this.cfg.extensions
                    this.fileData = ''
                    return
                }

                this.importData(t)

            },
            bytesToSize(bytes) {
                if (bytes === 0) return '0 B';
                var k = 1024, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) +''+ sizes[i];
            },
        },
        watch:{
            config:{
                handler(){
                    this.copyCfg()
                },
                deep:true
            }
        }
    }
</script>
<template>
    <div class="up-wrap">
        <div class="opt" >
            <slot>
                <div class="def-opt">+</div>
            </slot>
            <input type="file"  name="file" @change="change" v-model="fileData"  class="file" />
        </div>
        <div class="progress-gif" v-show="uploading"></div>
    </div>
    <alert :config="extCfg"></alert>
    <alert :config="sizeCfg"></alert>
</template>
<style lang="less" scoped>
    @import '../../../public/css/variable.less';
    .up-wrap{
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;

        .opt{
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;

            .def-opt{
                width: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #f2f3f3;
                font-size: 18px;
                line-height: normal;

                &:hover{
                    border-color: @link-color;
                    color: @link-color
                }
            }

            input{
                position: absolute;
                width: 100%;
                height: 100%;
                right: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
            }

        }

        .progress-gif {
            display: flex;
            width: 26px;
            height: 28px;
            background: url("../../../public/images/processing.gif") no-repeat center center;
            margin-left: 10px;
        }
    }
    .tips{
        color: @gray-sub;
        margin-top: 30px;
        line-height: 1.3;
    }

    // 账号注册中，absolute 化
    .input_group .progress-gif {
        position: absolute;
        right: -32px;
        bottom: 0px;
    }
</style>

