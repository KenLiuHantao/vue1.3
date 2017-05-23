<script>
import mix from '../referCommon/refer.js'
/*
    title:选取供应商参照

    配置:
    config:{
     show:false, //弹框显示 true|false 必填
     },

    回调：
    cb(val)
*/
    export default {
        mixins:[mix],
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '860px',
                    height: 'auto',
                    header: '选取供应商',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                cateSonData:[],
                selectIndex:'',
                //是否包含冻结状态的供应商参数  ‘’||‘1’  查所有  ‘2’ 除冻结外的所有
                supplierStatus:this.config.supplierStatus || ''
            }
        },
        methods:{
            getCateData(){
               let param = {
                    "entCode": "",
                    "firstIndutryCategoryCode": "",
                    "firstIndustryCategoryName": "",
                    "keyWord": this.keyWord,
                    "secondIndustryCategoryCode": "",
                    "secondIndustryCategoryName": "",
                    "supplierStatus":this.supplierStatus
                }
                this.$http.post(__URL.arc + 'supplier/firstIndustryGroup',param).then(
                res=>{
                      if(res.data.success){
                           this.cateData = res.data.data.dataList
                      }
                })
            },
            getCateSonData(item){
                this.cateSonData=[];
                let param = {
                  "firstIndustryCategoryCode": item.firstIndustryCategoryCode,
                  "firstIndustryCategoryName": item.firstIndustryCategoryName,
                  "entCode": "",
                  "secondIndustryCategoryCode": "",
                  "secondIndustryCategoryName": "",
                  "keyWord": this.keyWord,
                  "supplierStatus":this.supplierStatus
                }
                this.$http.post(__URL.arc + 'supplier/secondIndustryGroup',param).then(
                    res=>{
                        if(res.data.success){
                             this.cateSonData = res.data.data.dataList
                        }
                })
            },
            clickFirst(item,index){
                if(this.currentUl !== index){
                    this.currentUl = index
                }else{
                    this.currentUl=''
                }
                this.getTableData(item,index)
                this.getCateSonData(item)
            },
            getTableData(item,index){
                this.selectIndex = item.secondIndustryCategoryCode
                let param = {
                  "entCode": "",
                  "firstIndustryCategoryCode": item.firstIndustryCategoryCode,
                  "firstIndustryCategoryName": item.firstIndustryCategoryName,
                  "keyWord": this.keyWord,
                  "secondIndustryCategoryCode": item.secondIndustryCategoryCode,
                  "secondIndustryCategoryName": item.secondIndustryCategoryName,
                  "supplierStatus":this.supplierStatus
                }
                this.$http.post(__URL.arc+'supplier/supplierList',param).then(
                    res=>{
                       if(res.data.success){
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
                    <div class="common-head">
                       <!-- <div>
                            <span class="icon icon-hp_list__add"></span>新增
                        </div>-->
                        <div class="search-input">
                            <input type="text" placeholder="供应商名称" v-model="keyWord" @keyup.enter="searchData">
                            <i class="icon-modal__serach" @click="searchData"></i>
                        </div>
                    </div>
                    <ul class="left-content dep-list">
                       <!-- <li @click="getTableData('',-1)" >
                            <div class="li-content" :class="{'active-first':currentUl == -1}">全部</div>
                        </li>-->
                        <li v-for="item in cateData" :class="{'active':currentUl === $index}" @click="clickFirst(item,$index)">
                            <div class="li-content">
                                <i v-show='item.secondCount>0' class="icon icon-arrow__right"></i>
                                <div :class="{'active-first':(currentUl == $index && item.secondCount==0)}">{{item.firstIndustryCategoryName}}</div>
                            </div>
                            <ul v-if='item.secondCount>0'>
                                <li v-for="itemSon in cateSonData" @click.stop="getTableData(itemSon)">
                                    <div class="li-inner" :class="{'active':selectIndex == itemSon.secondIndustryCategoryCode }">{{ itemSon.secondIndustryCategoryName }}</div>
                                </li>
                            </ul>
                        </li>
                    </ul>
            </div>
            <div class="right-wrap">
                <div class="common-head right-head">
                    <div v-if='config.addNew'><button @click='addnew' class="button-primary"><i class='{{config.addNew.icon}}'></i>{{config.addNew.name}}</button></div>
                    <!-- <div><span class="icon-in"></span>导入</div>
                     <div><span class="icon-out"></span>导出</div>-->
                </div>
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th width="10%"></th>
                                <th width="20%" class="text-left">供应商</th>
                                <th width="15%">采购员</th>
                                <th width="15%">联系人</th>
                                <th width="15%">职务</th>
                                <th width="25%">联系电话</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableData" @click="checkThisLine(item)">
                                <td class="no-padding">
                                    <input type="radio" :value="item" v-model="chooseRadio">
                                </td>
                                <td class="text-left" >{{item.supplierName}}</td>
                                <td>{{item.employeeName}}</td>
                                <td>{{item.contact}}</td>
                                <td>{{item.duty}}</td>
                                <td>{{item.phone}}</td>
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
    .active-first{
        /*padding-left: 20px;*/
        background-color: #EBF7FD;
    }
    .active-first:after{
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 2px;
        height: 44px;
        background-color: #03a9f4;
    }
    .right-wrap{
        .right-head{
            justify-content:flex-start;
            font-size: 12px;
        }
    }
</style>

