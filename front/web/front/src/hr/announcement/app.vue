<script>
import cfg from './cfg.js'
import info from './infoEdit'
import preview from './preview'
import moment from 'moment'

export default {
    components: {
        info,
        preview
    },
    ready() {
    },
    data() {
        return {
            //左列表配置
            leftItemCfg: cfg.leftItemCfg,
            tableData: [],
            listData:[],
            //当前请求Table列表的参数
            currentParam:{},
            //当前操作的数据ID
            actId:'',
            //权限
            rights: {},
            //删除确认框
            delCfg: {
                show: false,
            },
            //停用确认框
            stopCfg: {
                show: false
            },
            //新增|编辑 内页弹框配置
            innerCfg:{
                show:false,
                title:'新增行政公告'
            },
            //内页弹框配置
            preCfg:{
                show:false,
                title:'行政公告'
            },
            // 保留当前操作项给子组件
            currentItem: {},
        }
    },
    methods: {
        //获取权限
        getRights() {
            let rightAlias = {
                "RA001019001": 'add',
                "RA001019002": 'publish',
                "RA001019003": 'edit',
                "RA001019004": 'delete',
            }
            this.$getRights(rightAlias).then(
                res => {
                    this.rights = res
                }
            )
        },
        //获取table列表数据
        getListData(param) {
            this.$http.post(__URL.hr + 'announcement/list', param).then(
                res => {
                    if (res.data.success) {
                        this.listData = res.data.data.dataList
                    } else {
                        this.$warning({'type':'warning','message':res.data.errMsg})
                    }
                }
            )
        },
        //筛选回传方法
        getFilter(param) {
            this.currentParam = param
            this.listData = []
            this.getListData(param)
        },
        //新增
        addNew(){
            this.isEdit = false
            this.isAdd = true
            this.currentItem = ''
            this.actId = ''
            this.innerCfg.show = true
            this.innerCfg.title = '新增行政公告'
        },
        //编辑
        edit(item) {
            this.isEdit = true
            this.actId = item.recordId
            this.innerCfg.show = true
            this.innerCfg.title = '行政公告'
        },
        // 查看详情
        detail(item) {
            this.isEdit = true
            this.isAdd = false
            this.currentItem = item
            this.actId = item.recordId
            this.innerCfg.show = true
            this.innerCfg.title = '行政公告'
        },
        //预览
        preInfo(item) {
            this.actId = item.recordId
            this.preCfg.show = true
        },
        //发布
        publish(item) {
            this.syncOpt(__URL.hr + 'announcement/update/status/'+item.recordId)
        },
        //删除弹框
        del(item) {
            this.delCfg.show = true
            this.delCfg.item = item
        },
        //确认删除
        delSure(item) {
            this.syncOpt(__URL.hr + 'announcement/delete/'+item.recordId, 'delCfg')
        },
        //停用弹框
        stop(item) {
            this.stopCfg.show = true
            this.stopCfg.item = item
        },
        //确认停用
        stopSure(item) {
            this.syncOpt(__URL.hr + 'announcement/disable/'+item.recordId, 'stopCfg')
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
                        this.getListData(this.currentParam)
                    } else {
                        this.$warning({'type':'failure','message':res.data.errMsg})
                    }
                    let vThis = this
                    setTimeout(function() {
                        vThis.repeatLock = false
                    }, 1000)
                }
            )
        },
        //刷新
        refresh() {
            this.$warning({'type':'success','message':'保存成功'})
            this.getListData(this.currentParam)
        },
        format(val){
            return moment(val).format('YYYY-MM-DD')
        }
    },

}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @cb='getFilter' @add="addNew"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <table class="table-wrap">
                        <thead>
                        <tr>
                            <th width="8%" class="text-left">序号</th>
                            <th width="20%" class="text-left">公告主题</th>
                            <th width="15%">通知对象</th>
                            <th width="15%">发布时间</th>
                            <th width="15%">发布人</th>
                            <th width="10%">发布状态</th>
                            <th width="12%">操作</th>
                        </tr>
                        </thead>
                        <tbody v-show="listData.length">
                        <tr v-for="item in listData">
                            <td class="text-left">{{$index+1}}</td>
                            <td class="text-left" >
                                <!--有附件时的图标-->
                                <!--<span class="icon-attachment" v-if="item.hasAttrchment"></span>-->
                                <a href="javascript:;" @click="preInfo(item)">{{item.name}}</a>
                            </td>
                            <td>
                                <span>
                                    {{item.objects[0].departmentName}} <span v-if="item.objects && item.objects.length > 1">...</span>
                                </span>
                            </td>
                            <td>{{format(item.updateTime)}}</td>
                            <td>{{item.updator}}</td>
                            <td class="black" :class="{'wait-publish':item.announcementStatus == 0,'published':item.announcementStatus != 0}">
                                {{item.announcementStatusName}}
                            </td>
                            <td class="option left-line">
                                <button @click="detail(item)" class="button-primary">查看详情</button>
                                <!--<div class="option-wrap">-->
                                    <!--<div class="dot-group">-->
                                        <!--<span></span><span></span><span></span>-->
                                    <!--</div>-->
                                    <!--<div class="button-group">-->
                                        <!--<span class="arrow"></span>-->
                                        <!--<div class="opt success" v-if="item.announcementStatus==0  " @click="publish(item)">发布</div>-->
                                        <!--<div class="opt disabled" v-if="item.announcementStatus==1 " @click="stop(item)">停用</div>-->
                                        <!--<div class="opt disabled" v-if="item.announcementStatus !=1 " @click="edit(item)">编辑</div>-->
                                        <!--<div class="opt danger" @click="del(item)" >删除</div>-->
                                    <!--</div>-->
                                <!--</div>-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </container>
    <!--新增/编辑 -->
    <inner :config="innerCfg">
        <info :show.sync="innerCfg.show" @refresh="refresh" :isadd="isAdd" :anid="actId" :current-item="currentItem"></info>
    </inner>
    <!--预览-->
    <inner :config="preCfg">
        <preview :show.sync="preCfg.show" :anid="actId"></preview>
    </inner>
    <!--删除确认-->
    <alert :config="delCfg" @cb="delSure">是否确认删除此公告？</alert>
    <!--停用确认-->
    <alert :config="stopCfg" @cb="stopSure">是否确认停用此公告？</alert>
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .table-wrap{
        width: 100%;
        font-size: 14px;
        color: @gray;
        text-align: center;
        thead tr th {
            padding: 18px 7px;
            position: relative;
            font-weight: normal;
            color: @gray-sub;
            border-bottom: 1px solid @border-color;
        }
        tbody tr {
            &:nth-of-type(2n-1) {
                background-color: #FAFAFA;
            }
            &:hover {
                background-color: #EBF7FD;
            }
            td{
                position: relative;
                border-bottom: 1px solid @border-color;
                font-size: 12px;
                padding: 14px 7px;
            }
        }
        .published{
            color: #61BA5B;
        }
        .wait-publish{
            color: #FF5722;
        }
        .text-left{
            text-align: left;
        }
        .left-line{
            border-left: 1px solid @border-color;
        }
        a{
            color: @link-color;
            max-width: 250px;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            line-height: 1.2;
        }
    }

    .option-wrap {
        position: relative;
        text-align: center;
        &:hover .button-group{
            display: flex;
        }
        .dot-group {
            display: flex;
            height: 20px;
            align-items: center;
            flex-direction: row;
            justify-content: center;
            cursor: pointer;
            span {
                display: flex;
                width: 4px;
                height: 4px;
                margin-right: 3px;
                border-radius: 50%;
                background-color: #ADADAD;
            }

            &:hover span{
                background-color: @link-color;
            }
        }
        .button-group {
            position: absolute;
            display: none;
            flex-direction: column;
            border: 1px solid @border-color;
            border-radius: 2px;
            background-color: white;
            width: 55px;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            z-index: 99;
            .arrow {
                width: 6px;
                height: 6px;
                background-color: white;
                border: 1px solid @border-color;
                border-bottom: none;
                border-left: none;
                left: 50%;
                top: -1px;
                position: absolute;
                transform: translateY(-50%) translateX(-50%) rotate(-45deg);
            }
            div.opt {
                padding: 5px;
            }
            div.opt:hover {
                color: #008af5;
                cursor: pointer;
            }
            div:nth-of-type(1) {
                padding-top: 10px;
            }
            div:last-child {
                margin-bottom: 0;
                padding-bottom: 10px;
            }
            .success{
                color: #008AF5;
            }
            .disabled{
                color: @gray-sub;
            }
            .danger{
                color: #FF0700;
            }
        }
    }
</style>
