<script>
/**
 * 上传图片组件
 * @param {function} cb - 上传成功后的回调函数，接收[data,fileName]两个参数
 * @param {Object} config - 上传文件组件的基本配置
 *  config:{
 *       'accetp': String 接收的文件类型
 *       'title': String 上传时的按钮名称
 *       'size': Number 限制最大文件大小
 *       'extensions':String 扩展文件类型
 *       'url':string 上传图片的接口地址
 *       'max':Number 限制上传文件数量
 *  }
 * @return {
 *      data:{       服务器传回数据
 *           fileId:xxx
 *           eTag:xxxx
 *      },
 *      name:xxx   图片名称
 *      url:xxx   图片baseUrl
 *  }
 *
 */
import FileUpload from './upload-basic'
export default {
    components: {
        FileUpload
    },
    props: {
        config: Object,
        allow: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        show: {
            type: Boolean,
            default: () => {
                return true
            }
        }

    },
    data() {
        return {
            cfg: {
                accept: '',
                title: '+',
                size: 1024 * 1024 * 10,
                extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
                url: __URL.public + '/upload',
                uploadType: 'file'
            },
            multiple: false,
            drop: true,
            auto: true,
            //state
            progressShow: false,

            //alert
            alertCfg:{
                show:false
            }

        }
    },
    ready() {
        //合并props传入的参数与默认data
        if (this.config != undefined && this.config != null) {
            let vThis = this
            Object.keys(this.config).forEach((key) => {
                vThis.cfg[key] = vThis.config[key]
            })
        }

    },
    methods: {
        quitTips() {
            this.progressShow = false
        },
        bytesToSize(bytes) {
            if (bytes === 0) return '0 B';
            var k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
        }
    },
    events: {
        /**
         * 添加文件后是否自动上传
         */
        addFileUpload(file, component) {
            if (this.auto) {
                component.active = true
            }
        },

        //组件上传过程中
        fileUploadProgress(file, component) {},

        //当文件上传完成后，触发success函数
        afterFileUpload(file, component) {
            let url = ''
            let vThis = this
            this.allow = true
            this.progressShow = false
            if (file.success) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    vThis.$emit('cb', file.data, file.name, this.result)
                }
                reader.readAsDataURL(component._files[file.id].file);
            } else {
                console.log('上传失败--' + file.error)
            }
        },
        //在文件上传前
        beforeFileUpload(file, component) {
            this.progressShow = true
            this.allow = false
        }
    },
    filters: {
        extensions(val) {
            return val.toLowerCase()
        }
    }
}
</script>
<template>
    <div class="up-wrap" v-show="show">
        <div class="add-file" v-show='allow'>
            <file-upload @click="quitTips" :title="cfg.title" :upload-type="cfg.uploadType" class="file-upload" name="file" :post-action="cfg.url" :extensions="cfg.extensions | extensions" :accept="cfg.accept" :multiple="multiple" :size="cfg.size" v-ref:upload :drop="drop">
            </file-upload>
        </div>
        <div class="add-file" v-show="!allow">
            <div class="up-text">{{cfg.title}}</div>
        </div>
        <div class="progress-gif" v-show="progressShow"></div>
    </div>
</template>
<style lang="less">
@import '../../../public/css/variable.less';
.up-wrap {
    display: flex;
    flex-direction: row;
}

.add-file {
    border: 1px dashed @border-color;
    height: 28px;
    font-size: @font-size-base;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    label {
        padding: 0 8px;
        cursor: pointer;
    }
    .up-text {
        padding: 0 8px;
        cursor: pointer;
    }
    &:hover {
        border-color: @base-light;
        span {
            color: @base-light!important;
        }
    }
}

.progress-num {
    display: flex;
    height: 26px;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
}

.progress-gif {
    display: flex;
    width: 26px;
    height: 28px;
    background: url("../../../public/images/processing.gif") no-repeat center center;
    margin-left: 10px;
}
</style>
