<script>
    import editor from 'nc/editor/app'
export default {
    props: ['show', 'isadd', 'anid', 'currentItem'],
    components:{
        editor
    },
    data() {
        return {
            flowCfg:{
                    data:[{
                    no:'1',
                    name:'新增行政公告',
                    flag:true,
                    },{
                    no:'2',
                    name:'发布',
                    flag:false,
                    },{
                    no:'3',
                    name:'完成',
                    flag:false,
                    }]
                },
            //多选部门弹框配置
            departCfg: {
                show: false,
                dataList:[]
            },
            chooseArr: [],
            chooseInfo: [],
            //文件上传配置
            upCfg: {
                extensions: 'pdf,jpg,jpeg,png,gif,doc,docx,xls,xlsx,ppt,pptx,zip,rar',
                size:1024*1024*5
            },
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
            editorInitValue: '',
            //提示消息
            msgCfg: {
                show: true,
                showtime: 2000,
                content: '提示消息'
            },
            repeatSub: false,
            //类型图标
            extIcon:{
                'jpg':'icon-jpg',
                'jpeg':'icon-jpg',
                'png':'icon-png',
                'gif':'icon-jpg',
                'doc':'icon-word',
                'docx':'icon-wrod',
                'xls':'icon-excel',
                'xlsx':'icon-excel',
                'ppt':'icon-ppt',
                'pptx':'icon-ppt',
                'zip':'icon-zip',
                'txt':'icon-txt',
                'pdf':'icon-pdf',
            },
            /* preview */
            isedit: false,
            content: '',
            //传递给编辑器的初始值
            initEditorValue:'',
            //删除确认框
            delCfg: {
                show: false,
            },
            //停用确认框
            stopCfg: {
                show: false
            },
            /* preview end */
        }
    },
    ready() {
        if (this.isadd) {
            this.isedit = true
        } else {
            this.getInfoFromId(this.anid)
        }
    },
    methods: {
        //选择部门
        chooseDep() {
            this.departCfg.show = true
            //根据当前选中部门的值，回选chooseArr的值，使得打开弹框后可以回选
            this.departCfg.dataList = [].concat(this.anCfg.objects)
        },
        //根据ID获取详细信息
        getInfoFromId(val) {
            this.$http.get(__URL.hr + 'announcement/detail/'+val).then(
                res => {
                    if (res.data.success) {
                        this.anCfg = Object.assign({}, res.data.data)
                        if (this.anCfg.content.trim() != '' && this.anCfg.content != undefined) {
                            this.initEditorValue = this.anCfg.content
                        }
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
        },
        //获取小传的组件
        getUpFile(val) {
            let newDep = {
                "fileId": val.fileId,
                "fileName": val.fileName,
                "eTag": val.eTag
            }
            this.anCfg.attachments.push(newDep)
        },
        validate() {
            if (this.anCfg.name.trim() == '') {
                this.msgCfg.show = true
                this.msgCfg.content = '公告主题不能为空'
                return false
            }
            if (this.anCfg.objects.length <= 0) {
                this.msgCfg.show = true
                this.msgCfg.content = '请选择通知对象'
                return false
            }
            return true
        },
        //保存
        save() {
            //必填项检测
            if (!this.validate()) {
                return false
            }
            this.anCfg.content = tinyMCE.activeEditor.getContent()
            //防止重复提交
            if (!this.repeatSub) {
                this.repeatSub = true
                let url = __URL.hr + 'announcement/insert'
                if (!this.isadd && this.isedit) {
                    url = __URL.hr + 'announcement/update'
                }
                this.$http.post(url, this.anCfg).then(
                    res => {
                        this.repeatSub = false
                        if (res.data.success) {
                            this.show = false
                            this.$emit('refresh')
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.content = res.data.errMsg
                        }
                    }
                )
            }

        },
        sure(val) {
            this.departCfg.show = false
            //根据返回回来详情信息，添加新的字段，在保存数据时使用
            val.forEach(item=>{
                item.departmentCode = item.code
                item.departmentName = item.name
            })
            this.anCfg.objects = val
        },
        /* preview */
        bytesToSize (bytes) {
            if (bytes === 0) return '0 B';
            var k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
        },
        //编辑
        edit() {
            this.isedit = true
        },
        //发布
        publish() {
            this.syncOpt(__URL.hr + 'announcement/update/status/'+this.currentItem.recordId)
        },
        //删除弹框
        del() {
            this.delCfg.show = true
            this.delCfg.item = this.currentItem
        },
        //确认删除
        delSure() {
            this.syncOpt(__URL.hr + 'announcement/delete/'+this.currentItem.recordId, 'delCfg')
        },
        //停用弹框
        stop() {
            this.stopCfg.show = true
            this.stopCfg.item = this.currentItem
        },
        //确认停用
        stopSure() {
            this.syncOpt(__URL.hr + 'announcement/disable/'+this.currentItem.recordId, 'stopCfg')
        },
        syncOpt(url,cfg) {
            if (this.repeatLock) {
                return
            }
            this.repeatLock = true
            this.$http.get(url).then(
                res => {
                    if (cfg) this[cfg]['show'] = false
                    if (res.data.success) {
                        this.show = false
                        this.$emit('refresh')
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                    let vThis = this
                    setTimeout(function() {
                        vThis.repeatLock = false
                    }, 1000)
                }
            )
        },
        /* preview end */
        fileType(val){
            if(val){
                let ext= val.fileName.substr(val.fileName.lastIndexOf(".")+1).toLowerCase();
                let c = ''
                if(this.extIcon[ext] != undefined){
                    c = this.extIcon[ext]
                }else{
                    c = 'icon-other'
                }
                return c
            }
        },
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <div v-if="!isedit">
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

        <div v-else>
            <workflow :config="flowCfg"></workflow>
            <div class="an-wrap">
                <table class="head-table">
                    <tr>
                        <td width="110px">
                            <label class="star">*</label>公告主题:</td>
                        <td >
                            <input type="text" maxlength="30" placeholder="请输入公告主题" v-model="anCfg.name">
                        </td>
                        <td width="10%"></td>
                    </tr>
                    <tr>
                        <td>
                            <label class="star">*</label>通知对象:</td>
                        <td>
                            <span class="warning" v-if="anCfg.objects.length <= 0">请添加通知对象</span>
                            <div class="list-wrap" v-else>
                                <span class="list-item" v-for="item in anCfg.objects">{{item.departmentName}}<i class="icon-modal__close" @click="anCfg.objects.splice($index,1)"></i></span>
                            </div>
                        </td>
                        <td class="opt">
                            <i class="add-more" @click="chooseDep">+</i>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label class="star"></label>附件:</td>
                        <td>
                            <span class="warning" v-if="anCfg.attachments.length <= 0">
                                可添加格式为PDF、Word、Excel、PPT、JPG、PNG、ZIP、RAR等格式文件，大小不超过5M。
                            </span>
                            <div class="list-wrap" v-else>
                                <span class="list-item" v-for="item in anCfg.attachments"><span class="item-icon" :class="fileType(item)"></span> {{item.fileName}}<i class="icon-modal__close" @click="anCfg.attachments.splice($index,1)"></i></span>
                            </div>
                        </td>
                        <td class="opt">
                            <upfile :config="upCfg" @cb='getUpFile'>
                                <i class="add-more">+</i>
                            </upfile>
                        </td>
                    </tr>
                </table>
                <div class="editor-wrap">
                    <editor :id="announceEditor" :value="initEditorValue"></editor>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <template v-if="isedit">
            <button class="btn-xl-def" @click="show=false">取消</button>
            <button class="btn-xl-imp" @click="save">保存</button>
        </template>
        <template v-else>
            <button class="btn-xl-def" @click="show=false">取消</button>
            <ajax-button class="btn-xl-danger" v-if="currentItem.announcementStatus !== 1" @click="del()">删除</ajax-button>
            <button class="btn-xl-imp" v-if="currentItem.announcementStatus !== 1" @click="edit()">编辑</button>
            <ajax-button class="btn-xl-imp" v-if="currentItem.announcementStatus === 0" @click="publish()">发布</ajax-button>
            <ajax-button class="btn-xl-imp" v-if="currentItem.announcementStatus === 1" @click="stop()">停用</ajax-button>
        </template>
    </div>

    <!--提示信息-->
    <message :config="msgCfg"></message>
    <!--删除确认-->
    <alert :config="delCfg" @cb="delSure">是否确认删除此公告？</alert>
    <!--停用确认-->
    <alert :config="stopCfg" @cb="stopSure">是否确认停用此公告？</alert>

    <refer-multi-department :config="departCfg" @cb="sure"></refer-multi-department>
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .an-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        padding: 10px 70px;
        background-color: #fbfbfb;
        .head-table {
            width: 100%;
            margin: 0 auto;
            border-collapse: collapse;
            font-size: 12px;
            background-color: white;
            tr {
                border-bottom: 1px solid @border-color;
            }
            tr:first-child {
                border-top: 1px solid @border-color;
            }
            td {
                vertical-align: middle;
                line-height: 24px;
                padding: 10px 20px;
            }
            input {
                border: none;
                padding: 0;
                width: 100%;
            }
            .star {
                width: 6px;
                height: 6px;
                display: inline-block;
                color: red;
                margin-right: 5px;
            }
            .warning {
                color: #9f9f9f;
            }
            .list-wrap {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .list-item {
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 5px;
                    border-radius: 2px;
                    margin: 2px 10px 2px 0;
                    border: 1px solid @border-color;
                    color: @gray-sub;
                    cursor: pointer;

                    .item-icon{
                        font-size: 16px;
                        display: inline-block;
                        width: 18px;
                        height: 20px;
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        background-position: center center;
                    }
                }
                i {
                    margin-left: 15px;
                }
            }
            .opt {
                text-align: left;
                padding-right: 20px;
                color: #008af5;
            }
            .add-more {
                font-size: 14px;
                margin-left: 5px;
                line-height: 10px;
                border: 1px solid #008af5;
                display: flex;
                justify-content: center;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                cursor: pointer;
            }
        }
        .editor-wrap {
            width: 100%;
            margin: 0 auto;
            padding-bottom: 40px;
            height: 600px;
            background-color: white;
        }
    }

    /* preview */
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
    /* preview end */
</style>
