<script>

    import cfg from './cfg.js'

    import viewStockTakeMaterial from './viewStockTakeMaterial'
    import newStockTakeMaterial from './newStockTakeMaterial'
    import editStockTakeMaterial from './editStockTakeMaterial'

    export default {
        components: {
            viewStockTakeMaterial,
            newStockTakeMaterial,
            editStockTakeMaterial
        },
        ready() {
            this.lock = false;
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                newConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '新增盘点单'
                },
                editConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '盘点单'
                },
                viewConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '盘点单'
                },
                modalConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '请选择需要盘点的仓库，创建盘点单',
                    btn: [{
                        name: '关闭',
                        emit: 'close',
                    }, {
                        name: '创建盘点单',
                        emit: 'create',
                    }]
                },
                warCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
                },
                stockQueryVo:{
                    warehouseCode: '',
                    inventoryCategoryCode: '',
                    inventoryId: ''
                },
                selectWarehouse: {
                    code: ''
                },
                errMsg:{
                    warehouse: ['仓库不能为空', '仓库不存在']
                },
                warehouseListData: '',
                selectedData: {docNo: ''},
                tableData: [],
                lock:true,
            }
        },
        methods: {
            // table返回的操作参数
            operate(type, item) {

            },
            href(item, type) {
                this.selectedData = item;
                if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.editConfig.show = true;
                } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.viewConfig.show = true;
                } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                    this.viewConfig.show = true;
                }
            },
            getFilter(item, obj) {
                if(obj && obj.inventoryCategoryCode){
                    item.inventoryCategoryCode = obj.inventoryCategoryCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                var url = __URL.warehouse + 'stock/take/material/query/list/wait';
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        url = __URL.warehouse + 'stock/take/material/query/list/wait';
                        break;
                    case 'tab2':
                        url = __URL.warehouse + 'stock/take/material/query/list/unaudit';
                        break;
                    case 'tab3':
                        url = __URL.warehouse + 'stock/take/material/query/list/audit';
                        break;
                }

                this.$http.post(url, obj).then((res) => {
                    this.tableData = res.data.data.dataList
            });
            },
            refresh() {
                let _this = this;
                setTimeout(function() {
                    _this.newConfig.show = false;
                    _this.editConfig.show = false;
                    _this.viewConfig.show = false;
                    _this.$broadcast('_RESETLIST');
                    _this.tableData = [];
                }, 1000);
            },
            clearTable(uid,obj){
                this.tableData = []
            },
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            verifyParams() {
                
                if(this.selectWarehouse.code == '') {
                    this.showMsg('failure', this.errMsg.warehouse[0]);
                    return false;
                }
                return true;
            },
            create() {
                if(!this.verifyParams()){
                    return;
                }
                let obj = {
                    warehouseCode:this.selectWarehouse.code
                };
                if(!this.lock){
                    this.lock = true;
                    var url = __URL.warehouse + 'stock/take/material/query/isExistDocByWarehouseCode';
                    this.$http.post(url, obj).then((res) => {
                        if (res.data.success) {
                        this.modalConfig.show = false;
                        this.newConfig.show = true;
                    }else {
                        this.showMsg('failure', res.data.errMsg);
                    }
                       this.lock = false;
                   });
                }
            },
            //打开新增页
            openAdd() {
                this.getSelectList();
                this.modalConfig.show = true;
            },
            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc +  'warehouse/find/ref', 'warehouseListData');
            },
            getInitSelectData(url, val){
                this.$http.post(url,this.stockQueryVo).then((res) => {
                    if (res.data.success) {
                        this.selectWarehouse.code = '';
                        this[val] = res.data.data.dataList;
                        this.selectWarehouse.code = this[val][0].warehouseCode
                    }else {
                        this.showMsg('failure', res.data.errMsg);
                    }
            });
            }
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab3':
                        myCfg =  cfg.auditTableTableCfg;
                        break;
                }
                return myCfg;
            }
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="openAdd"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData'  @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>


    <!-- 新增原料盘点内页-->
    <inner :config='newConfig'>
        <new-stock-take-material :config="newConfig" :warehouse="selectWarehouse.code" @refresh='refresh'></new-stock-take-material>
    </inner>

    <!--查看原料盘点单-->
    <inner :config="viewConfig">
        <view-stock-take-material :config="viewConfig" :docno.sync="selectedData.docNo"></view-stock-take-material>
    </inner>

    <!-- 编辑原料盘点内页-->
    <inner :config='editConfig'>
        <edit-stock-take-material :config="editConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></edit-stock-take-material>
    </inner>




    <!-- 弹框系列 -->
    <modal :config.sync='modalConfig' @create='create' @close='modalConfig.show = false;'>
        <div class='form-group'>
            &nbsp;&nbsp;
            <select  v-model='selectWarehouse.code' style='width:95%'>
                <option v-for="item in warehouseListData" :value="item.warehouseCode">
                    {{ item.warehouseName }}
                </option>
            </select>
        </div>
    </modal>


    <!--警告-->
    <warning :config="warCfg"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

