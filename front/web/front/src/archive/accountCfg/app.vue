<script>
    export default {
        ready() {

        },
        data() {
            return {
                tableData: [],
                tableCfg:{},
                clik1:'',
                clik2:''
            }
        },
        methods: {
            accountingdate(){
                this.clik1 = true;
                this.clik2 = false;
                this.tableCfg = {
                    serial:true,
                    width: [7,7,6],
                    match: [
                        'startDate',
                        'endDate',
                        'status'
                    ],
                    head: [ '开始日期', '结束日期', '状态']
                }
                this.$http.post(__URL.arc + 'accountingPeriod/list').then(
                    (res)=>{
                        this.tableData =res.data.data;
                    }
                );
            },
            commercialreportcurrency(){
                this.clik1 = false;
                this.clik2 = true;
                this.tableCfg = {
                    width: [10,10],
                    match: ['localCurrencyName','accStartDate'],
                    head: [ '币种', '启用日期']
                }
                this.$http.post(__URL.arc + 'systemSetting/detail').then(
                    (res)=>{
                        var arr = [];

                        arr.push(res.data.data);
                        this.tableData =arr;
                    }
                );
            }
        },
        computed: {

        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between"></div>
                <div class="item_body">
                    <div class="tab-list">
                        <a href="javascript:;"  class="ckd">
                            <i class=""></i>
                            会计基础设置
                        </a>
                    </div>
                    <div class="list_item">
                        <ul class="box">
                            <li  :class="{ckd:clik1}" @click="accountingdate">会计期间</li>
                            <li  :class="{ckd:clik2}" @click="commercialreportcurrency">财务报表本位币</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData'></vtable>
                </div>
            </div>
        </div>
    </container>
</template>
<style>
    .tab-list{
        display: flex;
        font-size: 0;
        border-bottom: 1px solid #F2F3F3;
    }
    a{
        display: inline-block;
        padding: 18px 0;
        width: 50%;
        text-align: center;
        font-size: 14px;
        color: #212121;
        margin-bottom: -1px;
        border-bottom: 1px solid transparent;
    }

    a.ckd {
        border-color: #008af5;
        color: #008af5;
    }

</style>

