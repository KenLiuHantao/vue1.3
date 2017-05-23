<script>
    import mix from '../referCommon/refer.js'
    /*
     title:选择工序

     配置:
     config:{
         show:false, //弹框显示 true|false 必填
         },

     回调：
     cb(val)

     */
    export default {
        mixins: [mix],
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '860px',
                    height: 'auto',
                    header: '选择工序',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },

            }
        },
        methods: {
            getCateData(){
                let param = {
                    "keyWord": this.keyWord,
                }
                this.$http.post(__URL.arc + 'process/department/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.cateData = res.data.data.dataList
                        }
                    })
            },
            getTableData(item, index){
                this.currentUl = index
                let param = {
                    "departmentCode": item,
                    "name": '',
                    "keyWord": this.keyWord,
                    "pageIndex": 0,
                    "pageSize": 0
                }
                this.$http.post(__URL.arc + 'process/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList
                        }
                    }
                )
            },
        },
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure" @close="quite">
        <div class="check-wrap ">
            <div class="left-wrap">
                <div class="common-head ">
                    <!--<div>
                        <span class="icon icon-hp_list__add"></span>新增
                    </div>-->
                    <div class="search-input">
                        <input type="text" placeholder="工序名称" v-model="keyWord" @keyup.enter="searchData">
                        <i class="icon-modal__serach" @click="searchData"></i>
                    </div>
                </div>
                <ul class="left-content modal-ul">
                   <!-- <li @click="getTableData('',-1)" :class="{'active':currentUl == -1}">
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
                            <th width="20%" class="text-left">工序</th>
                            <th width="15%">车间</th>
                            <th width="20%">生产负责人</th>
                            <th width="30%">工序图档</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" @click="checkThisLine(item)">
                            <td class="no-padding">
                                <input type="radio" :value="item" v-model="chooseRadio">
                            </td>
                            <td class="text-left">{{item.processName}}</td>
                            <td>{{item.departmentName}}</td>
                            <td>{{item.departmentEmployeeName}}</td>
                            <td>
                                <div class="attachment" v-for="i in item.attachments" :title="i.fileName">
                                    {{i.fileName}}

                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../public/css/variable.less';
    @import '../../../public/css/referCommon.less';

    table {
        table-layout: fixed;
    }

    .attachment {
        width: 100%;
        text-align: left;
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>

