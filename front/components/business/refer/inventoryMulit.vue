<script>
    /*
     title:选择货品编码

     配置:
     config:{
     show:false, //弹框显示 true|false 必填
     },

     回调：
     cb(val)

     */
    import Pagination from 'nc/nav/pagination'
    import Vue from 'vue'
    import Menu from 'nc/menu/menu.vue'
    import Submenu from 'nc/menu/submenu.vue'
    import MenuItem from 'nc/menu/menuItem.vue'
    export default {
        props: ['config'],
        components: {
            Pagination,Menu,Submenu,MenuItem
        },
        ready(){
            this.keyword = ''
            this.getCateData()
        },
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '860px',
                    height: 'auto',
                    header: '选取货品编码',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                //分类列表数据
                cateData: [],
                cateSonData: [],
                cateSonShow: false,
                //详细列表数据
                tableData: [],
                //当前选中列
                chooseCheckbox:[],
                //搜索关键字
                keyword: '',
                // 二级分类flag
                firstInventoryCategoryCode: '',
                currentIndex: -1,
                selectIndex: '',
                //分页有关属性
                tableTotal: 0,
                pageCfg: {
                    'pageSize': 50,
                    'pageIndexName': 'pageIndex',
                    'pageSizeName': 'pageSize',
                    'jump': true
                },
                lastItem: '',
                lastIndex: '',
            }
        },
        methods: {
            getCateData(){
                let param = {
                    "keyword": this.keyword,
                }
                this.$http.post(__URL.development+'inventory/category/children', param,{emulateJSON: true}).then(
                    res => {
                        if (res.data.success) {
                            this.cateData = res.data.data
                        }
                    })
            },
            changePage(page){
                this.getTableData(this.lastItem, page)
            },
            getTableData(item, page){
                this.lastItem = item;
                let param = {
                    "attributeCode": 0,
                    "inventoryCategoryCode": item.code,
                    "inventoryCategoryName": "",
                    "firstInventoryCategoryCode": this.code,
                    "firstInventoryCategoryName": "",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "keyword": this.keyword,
                    "pageIndex": page ? page.pageIndex : 1,
                    "pageSize": page ? page.pageSize : 50,
                    "secondInventoryCategoryCode": item.code,
                    "secondInventoryCategoryName": '',
                    "tabIndex": 0
                }
                this.$http.post(__URL.dev + 'inventory/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.tableTotal = res.data.data.totalCount;
                            this.tableData = res.data.data.dataList
                            this.firstInventoryCategoryCode = ''
                        }
                    }
                )
            },
            getAllTableData(){
                this.getTableData('')
                this.currentIndex = -1
            },
            searchData(){
                this.getCateData()
                this.getTableData('')
            },
            quite(){
                this.config.show = false
                this.chooseCheckbox =[]
                this.tableData = []
            },
            sure(){
                this.config.show = false
                this.$emit('cb', this.chooseCheckbox)
            },
            addnew(){
                this.$emit('addnew')
            },
            checkThisLine(item){
                for(var i=0;i<this.chooseCheckbox.length;i++){
                    if(this.chooseCheckbox[i]==item){
                        this.chooseCheckbox.splice(i,1)
                        return
                    }
                }
                this.chooseCheckbox.push(item)
            }
        },
        watch: {
            modalCfg: {
                handler: function (val, oldVal) {
                    this.config.show = val.show
                },
                deep: true
            },
            keyword(val, oldval){
                if (val.trim() == '') {
                }
            },
            config: {
                handler: function (val, oldVal) {
                    this.modalCfg.show = val.show
                    if (val.show == true) {
                        this.keyword = ''
                    }
                    if (val.show == true && val.data && val.data != '') {
                        this.chooseCheckbox = val.data
                    }
                },
                deep: true
            },
        }

    }
</script>
<template>

    <modal :config="modalCfg" @quite="quite" @sure="sure" @close="quite">
        <div class="check-wrap ">
            <div class="left-wrap">
                <div class="common-head ">
                    <div class="search-input">
                        <input type="text" placeholder="货品编码/货品名称/规格型号" v-model="keyword" @keyup.enter="searchData">
                        <i class="icon-modal__serach" @click="searchData"></i>
                    </div>
                </div>
                <menu class="modal-menu">
                    <submenu v-for="item in cateData"
                             :index="item.code"
                             :has-children="item.children.length >0"
                             @cb="getTableData(item)">
                        <template slot="title">{{item.name}}</template>
                        <menu-item v-for="info in item.children"
                                   :index="info.code"
                                   @cb="getTableData(info)">
                            {{info.name}}
                            </menu-item>
                    </submenu>
                </menu>
            </div>
            <div class="right-wrap">
                <div class="common-head right-head">
                    <div v-if='config.addNew'>
                        <button @click='addnew' class="button-primary"><i
                                class='{{config.addNew.icon}}'></i>{{config.addNew.name}}
                        </button>
                    </div>
                </div>
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                        <tr>
                            <th width="10%"></th>
                            <th width="20%" class="text-left">货品编码</th>
                            <th width="15%">货品名称</th>
                            <th width="15%">规格型号</th>
                            <th width="10%">单位</th>
                            <th width="15%">物料属性</th>
                            <th width="15%">启用日期</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" @click="checkThisLine(item)">
                            <td>
                                <input type="checkbox" :value="item" v-model="chooseCheckbox">
                            </td>
                            <td class="text-left">{{item.inventoryCode}} </td>
                            <td>{{item.inventoryName}}</td>
                            <td>{{item.inventorySpec}}</td>
                            <td>{{item.unitName}}</td>
                            <td>{{item.attributeName}}</td>
                            <td>{{item.enableDate}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class='pagination' v-if='tableTotal>pageCfg.pageSize'>
                    <pagination :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                </div>
            </div>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../public/css/variable.less';
    @import '../../../public/css/referCommon.less';

    .pagination {
        margin: 10px 0;
    }

    .right-wrap {
        .right-head {
            justify-content: flex-start;
        }
    }
    .modal-menu{
        font-size: 12px;
    }
</style>

