<script>
export default {
    components:{
    },
    props: ['show', 'anid'],
    data() {
        return {
            //公告数据模板
            anCfg: {
                "attachments": [],
                "content": "",
                "pcContent": "",
                "name": "",
                "objects": [],
                "recordId": "",
                "announcementStatus": 0,
                "recordVersion": 0
            },
            content: '',
            editorCfg:{
                disabled: true
            },
            initEditorValue:'',
            //提示消息
            msgCfg: {
                show: true,
                showtime: 2000,
                content: '提示消息'
            },
             //类型图标
            extIcon:{
                'jpg':'icon-jpg',
                'jpeg':'icon-jpg',
                'png':'icon-png',
                'gif':'icon-jpg',
                'doc':'icon-word',
                'docx':'icon-word',
                'xls':'icon-excel',
                'xlsx':'icon-excel',
                'ppt':'icon-ppt',
                'pptx':'icon-ppt',
                'zip':'icon-zip',
                'txt':'icon-txt',
                'pdf':'icon-pdf',
            },
        }
    },
    ready() {
        this.getInfoFromId(this.anid)
    },
    methods: {
        getInfoFromId(val) {
            this.$http.get(__URL.hr + 'announcement/detail/'+val).then(
                res => {
                    if (res.data.success) {
                        this.anCfg = res.data.data
                        if (this.anCfg.content != '' && this.anCfg.content != undefined) {
                            this.initEditorValue = this.anCfg.content
                            //给iframe赋值
                            //var doc = document.getElementById("preview").contentDocument || document.frames["preview"].document;
                            //doc.body.innerHTML = this.anCfg.content;
                        }
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
        },
        bytesToSize(bytes) {
            if (bytes === 0) return '0 B';
            var k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
        },
         fileType(val){
                let ext= val.fileName.substr(val.fileName.lastIndexOf(".")+1).toLowerCase();
                let c = ''
                if(this.extIcon[ext] != undefined){
                    c = this.extIcon[ext]
                }else{
                    c = 'icon-other'
                }
                return c
         },
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <div class="preview-content">
            <div class="preview-wrap">
                <div class="preview-title">
                    {{anCfg.name}}
                </div>
                <div class="author">
                    <div>{{anCfg.creator}}</div>
                    <div>{{anCfg.createTime}}</div>
                </div>
                <div class="editor-wrap">
                    {{{initEditorValue}}}
                </div>
                <div class="attach-wrap" v-if="anCfg.attachments.length ">
                    <div class="attach-list" v-for="item in anCfg.attachments">
                        <div class="logo"> <span class="item-icon" :class="fileType(item)"></span> </div>
                        <div class="content">
                            <div class="title">{{item.fileName}}</div>
                            <div class="opt">
                                <span class="down" :title="item.fileName" @click="$downFile(item)"><i class="icon icon-download"></i>下载</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false">关闭</button>
    </div>

    <message :config="msgCfg"></message>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .preview-content{
        padding: 20px 70px;
        background-color: #fbfbfb;

        .preview-wrap {
            padding-bottom: 20px;
            background-color: white;
            border: 1px solid #F2F3F3;
        }
        .preview-title {
            margin: 0 auto;
            padding: 20px 0;
            font-size: 14px;
            text-align: center;
        }
        .author{
            margin-left: 10px;
            color: @gray-sub;
            font-size: 12px;

            div{
                height: 20px;
            }
        }
        .editor-wrap {
            margin: 0 10px;
            min-height: 600px;
            padding: 20px;
            border: 1px solid @border-color;
            word-break: break-all;
            overflow: hidden;
        }
    }

    .attach-title{
        padding: 20px 20px 0px 20px;
        margin: 0 auto;
        font-size: 12px;
    }
    .attach-wrap {
        width: 100%;
        padding: 20px 20px 0px 20px;
        margin: 0 auto;
        border: 1px solid @border-color;
        border-top: none;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .attach-list {
            display: flex;
            flex-direction: row;
            margin-right: 20px;
            margin-bottom: 20px;
            .logo {
                display: flex;
                align-items: center;
                height: 100%;
                width: 24px;
                margin-right: 10px;
                background-size: 100% 100%;
            }
            .item-icon{
                display: flex;
                flex-shrink: 0;
                height: 28px;
                width: 100%;
                margin-right: 8px;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .content {
                font-size: 12px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                .title {
                    max-width: 170px;
                    height: 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    span {
                        color: gray;
                    }
                }
                .opt {
                    line-height: 24px;
                    .down {
                        cursor: pointer;
                        &:hover {
                            color: @base-high-light;
                        }
                    }
                }
            }
        }
    }

    .opt-foot {
        width: 950px;
        margin: 30px auto;
        display: flex;
        justify-content: center;
        button {
            margin: 0 10px;
        }
    }
</style>
