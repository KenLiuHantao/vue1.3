<script>
    /*
     title:选择客户

     配置:
     config:{
     show:false, //弹框显示 true|false 必填
     },

     回调：
     cb(val)

     */
    import mix from '../referCommon/refer.js'
    export default {
        mixins: [mix],
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '860px',
                    height: 'auto',
                    header: '选择客户',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                cateSonData: [],
                selectIndex: ''
            }
        },
        methods: {
            getCateData(){
                let param = {
                    "customerName": "",
                    "employeeName": "",
                    "firstIndustryCategoryCode": "",
                    "keyWord": this.keyWord,
                    "pageIndex": 0,
                    "pageSize": 0,
                    "refDocDate": "",
                    "secondIndustryCategoryCode": ""
                }
                this.$http.post(__URL.crm + 'customer/firstIndustry/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.cateData = res.data.data.dataList
                        }
                    })
            },
            getCateSonData(item){
                this.cateSonData = [];
                let param = {
                    "customerName": "",
                    "employeeName": "",
                    "firstIndustryCategoryCode": item.firstIndustryCategoryCode,
                    "keyWord": this.keyWord,
                    "pageIndex": 0,
                    "pageSize": 0,
                    "refDocDate": "",
                    "secondIndustryCategoryCode": ""
                }
                this.$http.post(__URL.crm + 'customer/industry/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.cateSonData = res.data.data.dataList
                        }
                    })
            },
            clickFirst(item, index){
                if (this.currentUl !== index) {
                    this.currentUl = index
                } else {
                    this.currentUl = ''
                }
                this.getTableData(item, index)
                this.getCateSonData(item)

            },
            getTableData(item, index){
                this.selectIndex = item.secondIndustryCategoryCode
                let param = {
                    "customerName": "",
                    "employeeName": "",
                    "firstIndustryCategoryCode": item.firstIndustryCategoryCode,
                    "keyWord": this.keyWord,
                    "pageIndex": 0,
                    "pageSize": 0,
                    "refDocDate": "",
                    "secondIndustryCategoryCode": item.secondIndustryCategoryCode
                }
                this.$http.post(__URL.crm + 'customer/ref', param).then(
                    res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList
                        }
                    }
                )
            },
            addnew(){
                this.$emit('addnew')
            }
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
                        <input type="text" placeholder="客户名称/业务员" v-model="keyWord" @keyup.enter="searchData">
                        <i class="icon-modal__serach" @click="searchData"></i>
                    </div>
                </div>
                <ul class="left-content dep-list">
                   <!-- <li @click="getTableData('',-1)">
                        <div class="li-content" :class="{'active':currentIndex == -1}">全部</div>
                    </li>-->
                    <li v-for="item in cateData" :class="{'active':currentUl === $index}"
                        @click="clickFirst(item,$index)">
                        <div class="li-content">
                            <i v-show='item.count>0' class="icon icon-arrow__right"></i>
                            <div>{{item.firstIndustryCategoryName}}</div>
                        </div>
                        <ul v-if='item.count>0'>
                            <li v-for="itemSon in cateSonData" @click.stop="getTableData(itemSon)">
                                <div class="li-inner"
                                     :class="{'active':selectIndex == itemSon.secondIndustryCategoryCode }">
                                    {{ itemSon.secondIndustryCategoryName }}
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="right-wrap">
                <div class="common-head right-head">
                    <div v-if='config.addNew'>
                        <button @click='addnew' class="button-primary"><i
                                class='{{config.addNew.icon}}'></i>{{config.addNew.name}}
                        </button>
                    </div>
                    <!-- <div><span class="icon-in"></span>导入</div>
                     <div><span class="icon-out"></span>导出</div>-->
                </div>
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                        <tr>
                            <th width="10%"></th>
                            <th width="40%" class="text-left">客户名称</th>
                            <th width="40%">业务员</th>
                            <!--  <th width="15%">联系人</th>
                             <th width="15%">职务</th>
                             <th width="20%">联系电话</th> -->
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" @click="checkThisLine(item)">
                            <td class="no-padding">
                                <input type="radio" :value="item" v-model="chooseRadio">
                            </td>
                            <td class="text-left">{{item.customerName}}</td>
                            <td>{{item.employeeName}}</td>
                            <!-- <td>{{item.contact}}</td>
                            <td>{{item.duty}}</td>
                            <td>{{item.phone}}</td> -->
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

    .right-wrap {
        .right-head {
            justify-content: flex-start;
        }
    }
</style>

