<script>
import item from './item'
import cfg from './cfg.js'

export default {
    components: {
        item
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: {},
            listCfg: cfg.leftItemCfg.listCfg,
            tableData: [],
            radioObj: {},
            importCfg: cfg.importCfg,
            innerCfg: {
                show: false,
                title: '新增'
            },
            itemEdit: 0,
            itemData: {},
            currentItem: {},
            wCfg: {
                show: false,
                content: '',
                type: 'success'
            },
            alertCfg: {
                show: false,
                type: 'failure',
                sAutoClose: false,
                msg: '确定删除此货品？删除后不可找回！'
            },
            type:1
        }
    },
    methods: {
        /* 公用方法 */
        warnMod(bol, ctx, type) {
            type ? this.wCfg.type = type : this.wCfg.type = 'success'
            this.wCfg.content = ctx
            this.wCfg.show = bol
        },
        refresh() {
            this.innerCfg.show = false
            this.reset()
        },
        reset() {
            this.$broadcast('_RESETLIST')
            this.tableData = []
        },
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "attributeCode": obj.attributeCode,
                "firstInventoryCategoryCode": obj.firstInventoryCategoryCode,
                "firstInventoryCategoryName": '',
                "secondInventoryCategoryCode": '',
                "secondInventoryCategoryName": '',
                "inventoryTypeCode":obj.inventoryTypeCode,
                "inventoryCode": obj.inventoryCode,
                "inventoryName": obj.inventoryName,
                "inventorySpec": obj.inventorySpec,
                "keyword": obj.keyword,
                "pageIndex": 0,
                "pageSize": 0,
                "tabIndex": obj.tabIndex
            }
            return init
        },
        /* 弹框操作 */
        add() {
            this.itemEdit = 0
            this.innerCfg.title='新增货品档案'
            this.innerCfg.show = true
        },
        import () {
            this.importCfg.show = true
        },
        // table返回的操作参数
        href(item, type) {
            if(this.tab == 'tab4'){
                this.itemEdit = 1
            } else {
                this.itemEdit = 2
            }
            this.getItemInfo(item.inventoryId)
        },
        getFilter(item, obj) {
            this.listObj = this.initListObj(item);
            this.listObj.secondInventoryCategoryCode = obj && obj.secondInventoryCategoryCode ? obj.secondInventoryCategoryCode:'';
            this.getList()
        },
        operate(type, item) {
            this.currentItem = Object.assign({}, item)
            if ('edit' == type) {
                this.getItemInfo(item.inventoryId)
                this.itemEdit = 2
            }
        },
        /* 数据请求 */
        getList() {
            this.$http.post(__URL.dev + 'inventory/findByPage', this.tableParams).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        getItemInfo(uid) {
            this.$http.get(__URL.dev + 'inventory/get/' + uid).then(
                (res) => {
                    if (res.data.success) {
                        this.itemData = res.data.data
                        this.innerCfg.title='货品档案'
                        this.innerCfg.show = true
                    }
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = [];
            /*if(this.leftItemCfg.tabCfg.select == 'tab2'){
                this.listCfg.hasChild = false;
                this.type = 1;
            }else if(this.leftItemCfg.tabCfg.select == 'tab3'){
                this.type = 2;
                this.listCfg.hasChild = true;
            }else{
                this.type = 1;
                this.listCfg.hasChild = true;
            }*/
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            return cfg.tableCfg
        },
        tab(){
            return cfg.leftItemCfg.tabCfg.select
        },
        tableParams() {
            let obj = this.listObj
            let param = {
                "attributeCode": obj.attributeCode?obj.attributeCode:'',
                "firstInventoryCategoryCode": obj.firstInventoryCategoryCode?obj.firstInventoryCategoryCode:'',
                "firstInventoryCategoryName": '',
                "secondInventoryCategoryCode": obj.secondInventoryCategoryCode?obj.secondInventoryCategoryCode:'',
                "secondInventoryCategoryName": '',
                "inventoryTypeCode":obj.inventoryTypeCode?obj.inventoryTypeCode:'',
                "inventoryCode": obj.inventoryCode?obj.inventoryCode:'',
                "inventoryName": obj.inventoryName?obj.inventoryName:'',
                "inventorySpec": obj.inventorySpec?obj.inventorySpec:'',
                "keyword": obj.keyword?obj.keyword:'',
                "pageIndex": 0,
                "pageSize": 0,
                "tabIndex": obj.tabIndex?obj.tabIndex:0
            }
            return param;
        }
    }
}


</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @cb='getFilter' @tab='clearTable' @add='add' @filtcb='reset'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <!-- <a @click='import' href="javascript:;">
                        <i class='icon-in'></i>导入
                    </a>
                    <a href="javascript:;">
                        <i class='icon-out'></i>导出
                    </a> -->
                </div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <vimport :config.sync='importCfg'></vimport>
    <!-- 新增修改弹框选项 -->
    <inner :config.sync='innerCfg'>
        <item :edit='itemEdit' :data='itemData' :type="type" @cb='refresh'></item>
    </inner>
    <warning :config='wCfg'></warning>
</template>
