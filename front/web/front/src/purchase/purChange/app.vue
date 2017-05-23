<script>

import cfg from './cfg.js'

import editPurchase from './editPurchase'
import viewPurchase from './viewPurchase'

export default {
    components: {
        editPurchase,
        viewPurchase
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            editConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '采购单变更'
            },
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '采购单变更'
            },
            warCfg: {
                show: false,
                type: 'warning',
                content: '',
                showTime: '2000'
            },
            modalCfg: {
                show: false,
                width: '480px',
                height: 'auto',
                header: '跟单备注',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '保存',
                    emit: 'sure',
                }]
            },
            tableData: [],
            checkedData: [],
            remarkData: [],
            docNo: '',
            lock: false
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'beginDocDate': '',
                'endDocDate': '',
                'supplierCode': obj.supplierCode,
                'beginChangeDate': '',
                'endChangeDate': '',
                'beginDemandDate': '',
                'endDemandDate': '',
                'beginDeliveryDate': '',
                'endDeliveryDate': '',
                'inventoryId': '',
                'saleOrderDocNo': '',
                'customerDocNo': '',
                'yearWeek': obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            this.docNo = item.docNo;
            if(type == 'operate') {
                item.docRecordId = item.docNo;
                this.$http.post(__URL.doc + 'purchase/findList', item).then((res) => {
                    this.remarkData = res.data.data;
                    this.modalCfg.show = true;
                });
            }
        },
        href(item, type) {
            this.docNo = item.docNo
            if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                this.editConfig.show = true;
            } else {
                this.viewConfig.show = true;
            }
        },
        getFilter(item,obj) {
            if(obj && obj.docNo){
                item.saleOrderDocNo = obj.docNo;
            }
            this.checkedData = [];

            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.purchase + 'order/change/await/query/list';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.purchase + 'order/change/await/query/list';
                    break;
                case 'tab2':
                    url = __URL.purchase + 'order/change/query/list';
                    break;
            }
            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList;
            });
        },
        reference(emit) {

        },
        clearTable(uid,obj) {
            this.tableData = []
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.editConfig.show = false;
                _this.viewConfig.show = false;
                _this.$broadcast('_RESETLIST');
                _this.tableData = [];
            }, 1500);
        },
        showMsg(type, msg) {
            this.warCfg.show = true;
            this.warCfg.type = type;
            this.warCfg.content = msg;
        },
        doRemark() {
            if(!this.lock) {
                this.lock = true;
                let params = {
                    'attachments': '',
                    'content': this.remarkData.content,
                    'docNo': this.docNo,
                    'docRecordId': this.docNo,
                    'docType': 0,
                    'quantity': 0,
                    'remarkType': 0,
                    'remarkTypeName': '采购跟单'
                }
                this.$http.post(__URL.doc + 'purchase/addRemark', params).then((res) => {
                    if(res.data.success) {
                        this.showMsg('success', '保存成功');
                        this.modalCfg.show = false;
                    } else {
                        this.showMsg('warning', res.data.data);
                        this.lock = false;
                    }
                });
            }
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            this.tableData = [];
            var myCfg = cfg.awaitTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.awaitTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.changeTableCfg;
                    break;
            }
            return myCfg;
        },
        tableParams() {
            let param = {
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'beginDocDate': '',
                'endDocDate': '',
                'supplierCode': obj.supplierCode,
                'beginChangeDate': '',
                'endChangeDate': '',
                'beginDemandDate': '',
                'endDemandDate': '',
                'beginDeliveryDate': '',
                'endDeliveryDate': '',
                'inventoryId': '',
                'saleOrderDocNo': '',
                'customerDocNo': '',
                'yearWeek': this.listObj.yearWeek
            }
            return param
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @reference='reference'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 编辑内页-->
    <inner :config='editConfig'>
        <edit-purchase  :config="editConfig" :docno.sync="docNo" @refresh='refresh'></edit-purchase>
    </inner>

    <!-- 查看内页-->
    <inner :config='viewConfig'>
        <view-purchase  :config="viewConfig" :docno.sync="docNo" @refresh='refresh'></view-purchase>
    </inner>

    <!-- 弹框系列 -->
    <modal :config.sync='modalCfg' @sure='doRemark' @close='modalCfg.show = false'>
        <div class="modal-content">
            <div class="remark-wrap">
                <div class="remark-list">
                    <div class="list-item" v-for="item in remarkData.dataList">
                        <div>{{item.createUser}}:</div>
                        <div class="item-right">
                            <p>{{item.createTime}}</p>
                            <p>{{item.content}}</p>
                        </div>
                    </div>
                </div>
                <textarea class="remark-text" maxlength='140' v-model="remarkData.content" placeholder="请输入备注"></textarea>
            </div>
        </div>
    </modal>

    <!--警告-->
    <warning :config="warCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .modal-content {
        max-height: 400px;
        overflow: auto;
        margin-bottom: 10px;
    }

        /*这里的备注格式和其它不同*/
        .remark-wrap{
            padding: 15px;

        .remark-list{
            width: 100%;
            height: 200px;
            overflow: auto;
            margin-bottom: 20px;

            .list-item{
                text-align: left;
                font-size: 12px;
                line-height: 1.2;
                margin-bottom: 10px;
                display: flex;
                flex-direction: row;

                .item-right{
                    margin-left: 10px;
                }
                .item-right p{
                    margin-bottom: 5px;
                }
            }
        }
        .remark-text{
            width: 100%;
            height: 108px;
            border: 1px solid @border-color;
        }
    }
</style>