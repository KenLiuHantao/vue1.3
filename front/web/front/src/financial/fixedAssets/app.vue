<script>



    import cfg from './cfg.js'
    import fixedAssets from '../../hr/asset/infoEdit'

    export default {
        components: {
            fixedAssets,
        },
        ready() {

        },
        data() {
            return {
                msgConfig: {
                    show: false,
                    content: '提交成功',
                    type: 'success'
                },
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                listData: [],
                selectedObj: "",
                assetsTypeCode:"",
                fixedAssetConfig:{
                    show : false,
                    content: '提交成功'
                },
                assetCode:"",
            }
        },
        methods: {
            /* 公用方法 */
            assign(base, target) {
                let tk = Object.keys(target)

                for (let i in base) {
                    if (tk.indexOf(i) != -1) {
                        target[i] = base[i]
                    }
                }
            },
            // table返回的操作参数
            operate(type, item) {
                if(type == 'giveYouALittleColorToSeeSee'){
                    this.detail(item);
                }
            },
            detail(item){
                this.assetCode = item.assetCode;
                this.fixedAssetConfig.show = true;
            },
            getFilter(item, obj) {
                console.log(item, obj)
                if (obj && obj.assetsCategoryCode != undefined) {
                    item.assetsCategoryCode = obj.assetsCategoryCode;
                    item.assetsCategoryName = obj.assetsCategoryName;
                    this.selectedObj = obj;
                } else {
                    this.selectedObj = "";
                }
                this.getList(item);
            },
            /* 数据请求 */
            getList(obj) {
                this.$http.post(__URL.hr + 'asset/list',{assetCategoryCode:obj.assetsCategoryCode}).then(
                    res => {
                        if (res.data.success) {
                            this.listData = res.data.data.dataList;
                        } else {
                            this.msgConfig.show = true
                            this.msgConfig.type = "failure";
                            this.msgConfig.content = res.data.errMsg
                        }
                    }
                )
            },



            closeNew(type, tips){
                this.refresh(type, tips)
            },

            setWarningSuccess(type, tips){
                this.msgConfig.show = true
                this.msgConfig.content = tips
                this.msgConfig.type = type
            },

            refresh(type, tips){
                console.log(tips)
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.listData = []
            },

        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                return cfg.tableCfg
            }
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @cb='getFilter'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <!--<a href="javascript:;"  @click="add">
                        <i class='icon-hp_list__add'></i>新增
                    </a>-->
                </div>
                <div class="item_body">
                    <vtable :config="tableCfg" :data="listData" @op='operate'></vtable>
                </div>
            </div>
        </div>
    </container>

    <fixed-assets  :show = "fixedAssetConfig.show" :code="assetCode" :isEdit = "false" :status="1"></fixed-assets>
    <warning :config="msgConfig"></warning>


    <!--<addassetstype :bank-detail.sync="bankDetail" :detail.sync="editConfig" @refresh='closeNew'></addassetstype>-->

    <!--&lt;!&ndash;删除确认&ndash;&gt;-->
    <!--<alert :config="delCfg" @cb="delSure">是否确认删除此公告？</alert>-->
    <!--&lt;!&ndash;停用确认&ndash;&gt;-->
    <!--<alert :config="stopCfg" @cb="stopSure">是否确认停用此公告？</alert>-->
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';

    .red {
        border: 1px dashed red;
        color: red !important;
        display: inline !important;
        padding: 3px 5px;
    }
    .grayed {
        color: gray;
    }

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

