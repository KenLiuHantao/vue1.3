<script>
    import cfg from './cfg.js'
    import newcustomer from './newCustomer.vue'
    import customerDetail from './customerDetail.vue'
    export default {
        components: {
            newcustomer,
            customerDetail,
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listCfg,
                tableData: [],
                checkboxArr: [],
                addConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '新增客户档案',
                },
                detailConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '客户档案详情'
                },
                customerdetail: {},
                dCfg: {
                    show: false,
                    msg: '',
                    subMsg: '',
                    type: 'success',
                    quite: false
                },
                importCfg: {
                    show: false,
                    title: '客户档案',
                    url: __URL.crm + 'customer/upload',
                    tmpUrl: __URL.crm + 'customer/download',
                },
                msgconfig: {
                    show: false,
                    content: ''
                },
                cdCfg: {
                    show: false,
                    msg: '是否禁用此客户档案？',
                    subMsg: '',
                    type: 'failure'
                },
                deleteItem: {},
                edit: false,
                disabled: false,
                total:0,
                pageCfg:{
                    'pageSize': 50,
                    'pageIndexName': 'pageIndex',
                    'pageSizeName': 'pageSize',
                    'jump':true
                },
                item:{}
            }
        },
        methods: {
            showCb(item){
                this.item.pageIndex=item.pageIndex;
                this.item.pageSize = item.pageSize;
                this.getFilter(this.item);
            },
            /* 公用方法 */
            assign(base, target) {
                let tk = Object.keys(target)

                for (let i in base) {
                    if (tk.indexOf(i) != -1) {
                        target[i] = base[i]
                    }
                }
            },
            /* 重置对象 */
            initListObj(obj) {
                let init = {
                    "customerContact": obj.customerContact ? obj.customerContact : "",
                    "customerName": obj.customerName ? obj.customerName : "",
                    "customerStatusCode": obj.customerStatusCode ? obj.customerStatusCode : "",
                    "regionCategoryCode": obj.regionCategoryCode ? obj.regionCategoryCode : "",
                    "importanceRatingCode": obj.importanceRatingCode ? obj.importanceRatingCode : "",
                    "employeeName": obj.employeeName ? obj.employeeName : "",
                    "phone": obj.phone ? obj.phone : "",
                    "keyWord": obj.keyWord ? obj.keyWord : "",
                    "pageIndex": obj.pageIndex?obj.pageIndex:1,
                    "pageSize": obj.pageSize?obj.pageSize:50
                }
                return init
            },
            // table返回的操作参数
            operate(type, item) {
                if ('edit' == type) {
                    this.$http.get(__URL.crm + 'customer/detail/' + item.customerCode).then(
                        (res) => {
                            this.customerdetail = res.data.data;
                            this.detailConfig.show = true;
                            this.edit = true;
                        }
                    )
                } else if ('delete' == type) {
                    this.deleteItem = item;
                    this.cdCfg.show = true;
                }
            },
            href(item, type) {
                if (type == 'customerName') {
                    this.$http.get(__URL.crm + 'customer/detail/' + item.customerCode).then(
                        (res) => {
                            this.customerdetail = res.data.data;
                            this.detailConfig.show = true;
                            if (item.recordStatus == '0') {
                                this.disabled = true;
                            } else {
                                this.disabled = false;
                            }
                            this.edit = false;
                        }
                    )
                }
            },
            getFilter(item, obj) {
                if (obj && obj.importanceRatingCode) {
                    item.importanceRatingCode = obj.importanceRatingCode;
                }
                this.listObj = this.initListObj(item);
                this.getList();
            },
            /* 数据请求 */
            getList() {
                this.$http.post(__URL.crm + 'customer/list', this.tableParams).then(
                    (res) => {
                        this.tableData = res.data.data.dataList;
                        this.item = this.tableParams;
                        this.total = res.data.data.totalCount;
                    }
                )
            },
            //新增按钮事件
            addNew(){
                this.addConfig.show = true;
            },
            //关闭新增页面
            closeNewCustomer(text){
                this.addConfig.show = false;
                this.refresh(text)
            },
            //关闭详情页面
            closeCustomerDetail(text){
                this.detailConfig.show = false;
                this.refresh(text)
            },
            //刷新外页
            refresh(text){
                // this.tableData=[];
                // this.getList()
                if (text) {
                    this.dCfg.msg = text;
                    this.dCfg.show = true;
                }
                this.$broadcast('_RESETLIST')
                this.tableData = []
            },
            sureDeleteCustomer(){
                this.$http.get(__URL.crm + 'customer/disable/' + this.deleteItem.customerCode).then(
                    (res) => {
                        if (res.data.success) {
                            this.refresh('禁用成功')
                        } else {
                            this.msgconfig.type = 'warning';
                            this.msgconfig.content = res.data.errMsg;
                            this.msgconfig.show = true;
                        }
                    }
                )
            },
            clearTable(uid, obj){
                this.total=0;
                this.tableData = []
            }
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    return cfg.tableCfg2;
                } else {
                    return cfg.tableCfg1;
                }
            },
            tableParams() {
                let param = {
                    "customerContact": this.listObj.customerContact,
                    "customerName": this.listObj.customerName,
                    "customerStatusCode": this.listObj.customerStatusCode,
                    "regionCategoryCode": this.listObj.regionCategoryCode,
                    "importanceRatingCode": this.listObj.importanceRatingCode,
                    "employeeName": this.listObj.employeeName,
                    "phone": this.listObj.phone,
                    "keyWord": this.listObj.keyWord,
                    "pageIndex": this.listObj.pageIndex,
                    "pageSize": this.listObj.pageSize
                }

                return param
            }
        }
    }
</script>
<template>
    <container>
        <alert @cb='sureDeleteCustomer' :config="cdCfg"></alert>
        <alert :config="dCfg"></alert>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew'></new-app>
            </div>
            <div :class="{'have_footer': total > pageCfg.pageSize}" class="right_item">
                <div class="item_head btn-ic">
                    <!-- <a @click='batchDelete' href="javascript:;">
                        <i class='icon-delete'></i>批量删除
                    </a>
                    <a  href="javascript:;">
                        <i class='icon-out'></i>导出
                    </a> -->
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxArr' :config='tableCfg' :data='tableData' @op='operate'
                            @link='href'>
                    </vtable>
                </div>
                <div v-if="total > pageCfg.pageSize" class="item_footer">
                    <pagination :total='total' :config='pageCfg' @cb='showCb'></pagination>
                </div>
            </div>
        </div>
    </container>
    <!-- 新增内页-->
    <inner :config='addConfig'>
        <newcustomer @refresh='closeNewCustomer'></newcustomer>
    </inner>
    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <customer-detail :detail='customerdetail' @refreshTable="refresh" @refresh='closeCustomerDetail' :disabled='disabled' :edit='edit'></customer-detail>
    </inner>
    <vimport :config="importCfg" @cb="inputcb"></vimport>
    <warning :config="msgconfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .body_item .item_head.btn-ic a {
        width: 80px;
    }
</style>
