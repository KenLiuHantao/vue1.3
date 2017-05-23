<script>
    /*
     title:选择人员

     配置:
     config:{
     show:false, //弹框显示 true|false 必填
     },

     回调：
     cb(val)

     */
    import Pagination from 'nc/nav/pagination'
    import mix from '../referCommon/refer.js'
    export default {
        mixins: [mix],
        components: {
            Pagination
        },
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '860px',
                    height: 'auto',
                    header: '选择人员',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
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
                    keyword: this.keyword
                }
                if (this.init == true) {
                    param.initStatus = true;
                } else {
                    param.initStatus = false;
                }
                this.$http.post(__URL.hr + 'employee/department/list/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.cateData = res.data.data.dataList
                        }
                    })
            },
            changePage(page){
                this.getTableData(this.lastItem, this.lastIndex, page)
            },
            getTableData(item, index, page){
                this.lastItem = item;
                this.lastIndex = index;
                this.currentUl = index
                let param = {
                    "departmentCode": item,
                    "keyword": this.keyword,
                    "pageIndex": page ? page.pageIndex : 1,
                    "pageSize": page ? page.pageSize : 50,
                }
                if (this.init == true) {
                    param.initStatus = true;
                } else {
                    param.initStatus = false;
                }
                this.$http.post(__URL.hr + 'employee/list/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.tableTotal = res.data.data.totalCount;
                            this.tableData = res.data.data.dataList
                        }
                    }
                )
            },
        },
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="check-wrap ">
            <div class="left-wrap">
                <div class="common-head ">
                    <!--<div>
                        <span class="icon icon-hp_list__add"></span>新增
                    </div>-->
                    <div class="search-input">
                        <input type="text" placeholder="人员名称" v-model="keyword" @keyup.enter="searchData">
                        <i class="icon-modal__serach" @click="searchData"></i>
                    </div>
                </div>
                <ul class="left-content modal-ul">
                    <!--<li @click="getTableData('',-1)" :class="{'active':currentUl == -1}">
                        全部
                    </li>-->
                    <li v-for="item in cateData" :class="{'active':currentUl == $index}"
                        @click="getTableData(item.departmentCode,$index)">
                        {{item.departmentName}}

                    </li>
                </ul>
            </div>
            <div class="right-wrap">
                <div class="common-head left-head">
                    <!-- <div><span class="icon-in"></span>导入</div>
                     <div><span class="icon-out"></span>导出</div>-->
                </div>
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                        <tr>
                            <th width="10%"></th>
                            <th width="20%" class="text-left">姓名</th>
                            <th width="20%">部门</th>
                            <th width="15%">职务</th>
                            <th width="20%">联系电话</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" @click="checkThisLine(item)">
                            <td class="no-padding">
                                <input type="radio" :value="item" v-model="chooseRadio">
                            </td>
                            <td class="text-left">{{item.employeeName}}</td>
                            <td>{{item.departmentName}}</td>
                            <td>{{item.roleName}}</td>
                            <td>{{item.phone}}</td>
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
</style>

