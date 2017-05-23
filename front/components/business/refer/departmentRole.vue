<script>
    /*
     title:选择岗位

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
                    header: '选择岗位',
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
                selectIndex: '',
                keyword: ''
            }
        },
        methods: {
            getCateData(){
                let param = {
                    roleName: this.keyword
                }
                this.$http.post(__URL.service + 'department/find-by-role-name', '', {'params': param}).then(
                    res => {
                        if (res.data.success) {
                            this.cateData = res.data.data
                            // console.log(this.cateData)
                        }
                    })
            },
            changePage(page){
                this.getTableData(this.lastItem, this.lastIndex, page)
            },
            clickFirst(item, index){
                if (this.currentUl !== index) {
                    this.currentUl = index
                } else {
                    this.currentUl = ''
                }
                this.getTableData(item, index)
            },
            clickSec(item){
                this.selectIndex = item.code;
                this.getTableData(item, this.lastIndex)
            },
            getTableData(item, index, page){
                this.lastItem = item;
                this.lastIndex = index;
                let param = {
                    "departmentCode": item.code,
                    "name": this.keyword
                }
                this.$http.get(__URL.service + 'role/search/department/name/like', {'params': param}).then(
                    res => {
                        if (res.data.success) {
                            this.tableTotal = res.data.data.length;
                            this.tableData = res.data.data
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
                        <input type="text" placeholder="搜索岗位" v-model="keyword" @keyup.enter="searchData">
                        <i class="icon-modal__serach" @click="searchData"></i>
                    </div>
                </div>
                <ul class="left-content dep-list">
                    <li v-for="item in cateData" :class="{'active':currentUl === $index}"
                        @click="clickFirst(item,$index)">
                        <div class="li-content">
                            <i v-show='item.children.length>0' class="icon icon-arrow__right"></i>
                            <div>{{item.name}}</div>
                        </div>
                        <ul v-if='item.children.length>0'>
                            <li v-for="itemSon in item.children" @click.stop="clickSec(itemSon)">
                                <div class="li-inner " :class="{'active':selectIndex == itemSon.code }">{{ itemSon.name
                                    }}
                                </div>
                            </li>
                        </ul>
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
                            <th width="15%"></th>
                            <th width="85%" class="text-left">岗位</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" @click="checkThisLine(item)">
                            <td class="no-padding">
                                <input type="radio" :value="item" v-model="chooseRadio">
                            </td>
                            <td class="text-left">{{item.name}}</td>
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

