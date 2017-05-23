<script>

    import cfg from './cfg.js'

    import newPurchase from './newPurchase'
    import editPurchase from './editPurchase'
    import viewPurchase from './viewPurchase'

    export default {
        components: {
            newPurchase,
            editPurchase,
            viewPurchase
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                newConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '物料请购单'
                },
                editConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '物料采购单'
                },
                viewConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '物料采购单'
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
                showCheckbox: false,
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
                    'beginApplyDate': '',
                    'endApplyDate': '',
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
                if (type == 'operate') {
                    item.docRecordId = item.docNo;
                    this.$http.post(__URL.doc + 'purchase/findList', item).then((res) => {
                        this.remarkData = res.data.data;
                        this.modalCfg.show = true;
                    });
                }
            },
            href(item, type) {
                this.docNo = item.docNo;
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.newConfig.show = true;
                } else if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.editConfig.show = true;
                } else {
                    this.viewConfig.show = true;
                }
            },
            getFilter(item, obj) {
                if (obj && obj.supplierCode) {
                    item.supplierCode = obj.supplierCode;
                }

                this.checkedData = [];

                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                var url = __URL.purchase + 'order/await/query/list';
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        url = __URL.purchase + 'order/await/query/list';
                        if(obj && obj.supplierCode && obj.supplierCode != '待确定供应商') {
                            this.showCheckbox = true;
                        } else {
                            this.showCheckbox = false;
                        }
                        break;
                    case 'tab2':
                        obj.docStatus = 1;
                        url = __URL.purchase + 'order/query/list';
                        break;
                    case 'tab3':
                        obj.docStatus = 2;
                        url = __URL.purchase + 'order/query/list';
                        break;
                }
                this.$http.post(url, obj).then((res) => {
                    this.tableData = res.data.data.dataList;
                });
            },
            reference(emit) {

            },
            clearTable(uid, obj) {
                this.tableData = []
            },
            refresh() {
                let _this = this;
                setTimeout(function() {
                    _this.newConfig.show = false;
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
                if (!this.lock) {
                    if(this.remarkData.content == null || this.remarkData.content == ''){
                        this.$warning({'type':'warning','message':'备注信息不能为空'});
                        return;
                    }
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
                        this.lock = false;
                        if (res.data.success) {
                            this.showMsg('success', '保存成功');
                            this.modalCfg.show = false;
                        } else {
                            this.showMsg('warning', res.data.data);
                        }
                    });
                }
            },
            saveOrders() {
                let params = [];
                for(let index in this.checkedData) {
                    if(this.checkedData[index]['remark']) {
                        this.showMsg('warning', '不能选择待完善订单');
                        params = [];
                        return;
                    } else {
                        params.push(this.checkedData[index]['docNo'])
                    }
                }
                if(!this.lock && params.length) {
                    this.lock = true;
                    this.$http.post(__URL.purchase + 'order/selected/save', params).then((res) => {
                        if(!res.data.success) {
                            this.showMsg('failure', res.data.errMsg);
                            this.lock = false;
                        } else {
                            this.showMsg('success', '下单成功');
                            this.refresh();
                        }
                    });
                }
            },
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.awaitTableCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = this.showCheckbox ? cfg.awaitCheckTableCfg : cfg.awaitTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.unfinishedTableCfg;
                        break;
                    case 'tab3':
                        myCfg = cfg.finishedTableCfg;
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
                    'beginApplyDate': '',
                    'endApplyDate': '',
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
                    <a href="javascript:;"  @click='saveOrders' v-if="showCheckbox">
                        <i class='icon-add-index'></i>下单
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate'
                            @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增内页-->
    <inner :config='newConfig'>
        <new-purchase :config="newConfig" :docno.sync="docNo" @refresh='refresh'></new-purchase>
    </inner>

    <!-- 编辑内页-->
    <inner :config='editConfig'>
        <edit-purchase :config="editConfig" :docno.sync="docNo" @refresh='refresh'></edit-purchase>
    </inner>

    <!-- 查看内页-->
    <inner :config='viewConfig'>
        <view-purchase :config="viewConfig" :docno.sync="docNo" @refresh='refresh'></view-purchase>
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