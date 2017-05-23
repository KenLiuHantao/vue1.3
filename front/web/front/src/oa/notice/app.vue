<script>


import cfg from './cfg.js'
import preview from './preview'
import moment from 'moment'

export default {
    components: {
        preview
    },
    ready() {
        document.addEventListener('click', () => {
            this.currentIndex = -1
        })
    },
    data() {
        return {
            //左列表配置
            leftItemCfg: cfg.leftItemCfg,
            tableData: [],
            listData:{},
            //当前请求Table列表的参数
            currentParam:{},
            //当前操作的数据ID
            actId:'',
            //当前操作行
            currentIndex:-1,
            //权限
            rights: {},
            //提示消息弹框
            msgCfg: {
                show: false,
                content: ''
            },
            //内页弹框配置
            preCfg:{
                show:false,
                title:'行政公告'
            },
        }
    },
    methods: {
        //获取table列表数据
        getListData(param) {
            this.$http.post(__URL.hr + 'announcement/list/oa', param).then(
                res => {
                    if (res.data.success) {
                        this.listData = res.data.data.dataList
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
        },
        //筛选回传方法
        getFilter(param) {
            this.currentParam = param
            this.getListData(param)
        },
        //预览
        preInfo(item) {
            this.actId = item.announcementRecordId
            this.preCfg.show = true
        },
        //刷新
        refresh() {
            this.listData = []
            this.$broadcast('_RESETLIST');
        },
        format(val){
            return moment(val).format('YYYY-MM-DD')
        },
        cleanTable(){
            this.listData = []
        }
    },

}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab="cleanTable" @cb='getFilter' @add="addNew"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <table class="table-wrap">
                        <thead>
                        <tr>
                            <th width="5%" class="text-left">序号</th>
                            <th width="30%"  class="text-left">公告主题</th>
                            <th width="10%">发布时间</th>
                            <th width="15%">发布人</th>
                        </tr>
                        </thead>
                        <tbody v-show="listData.length">
                        <tr v-for="item in listData">
                            <td class="text-left">{{$index+1}}</td>
                            <td class="text-left" width="30%">
                                <!--有附件时的图标-->
                                <!--<span class="icon-attachment" v-if="item.hasAttrchment"></span>-->
                                <a href="javascript:;" @click="preInfo(item)">{{item.announcementName}}</a>
                            </td>
                            <td>{{format(item.createTime)}}</td>
                            <td>{{item.creator}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </container>
    <!--预览-->
    <inner :config="preCfg">
        <preview :show.sync="preCfg.show" :anid="actId" @refresh="refresh"></preview>
    </inner>
    <!--提示信息-->
    <message :config="msgCfg"></message>
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .table-wrap{
        width: 100%;
        height: inherit;
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
        a{
            color: @link-color;
            max-width: 250px;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }

    .option-wrap {
        position: relative;
        text-align: center;
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

            &.active span{
                background-color: @link-color;
            }
        }
        .button-group {
            position: absolute;
            display: flex;
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
