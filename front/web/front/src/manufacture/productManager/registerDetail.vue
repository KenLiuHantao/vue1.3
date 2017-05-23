<script>

export default {
    components:{
    },
    data() {
        return {
            registerDetail:{
                "taskId":"",
                "departmentName":"",
                "processName":"",
                "productionQuantity":0,
                "waitRegisterQuantity":0,
                "createTime":"",
                "quantity":0,
                "userName":"",
                "registerTotalQuantity":0
            },
            registerLists:[],
            arrowTopFlag:false
        }
    },
    props: ['taskId'],
    ready() {
        this.getData();
    },
    methods: {
        getData(){
            this.$http.get(__URL.manufacture + 'production/manager/register/detail/' + this.taskId).then(
                (res) => {
                    if(res.data.success){
                        this.registerDetail = res.data.data.header;
                        this.registerLists = res.data.data.dataList;
                    }
                }
            );
        }
    },
    computed:{
    }
}
</script>


<template>
    <div :class="{ 'arrowTop': arrowTopFlag }" class="check-wrap">
        <div class="left-wrap">
            <ul class="left-content modal-ul">
                <li>
                    <span>生产车间:</span><span>{{registerDetail.departmentName}}</span>
                </li>
                <li>
                    <span>生产工序:</span><span>{{registerDetail.processName}}</span>
                </li>
                <li>
                    <span>生产数量:</span><span>{{registerDetail.productionQuantity}}</span>
                </li>
                <li>
                    <span>待登记数量:</span><span>{{registerDetail.waitRegisterQuantity}}</span>
                </li>
                <li>
                    <span>已登记数量:</span><span>{{registerDetail.registerTotalQuantity}}</span>
                </li>
            </ul>
        </div>
        <div class="right-wrap">
            <table class="modal-table">
                <thead>
                <th width="30%">登记人</th>
                <th width="40%">日期</th>
                <th width="30%">已登记数量</th>
                </thead>
                <tbody>
                <tr v-for='it in registerLists'>
                    <td>
                        {{it.userName}}
                    </td>
                    <td>
                        {{it.createTime}}
                    </td>
                    <td>
                        {{it.quantity}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/referCommon.less';
    .modal-ul {
        li {
            position: relative;
            display: flex;
            justify-content: space-between;
            height: 39px;
            padding-right: 20px;
            border-bottom: none;
        }
    }

    .check-wrap {
        position: relative;
        height: auto;
        min-height: 300px;
        margin-bottom: 0;
        &::before {
            content: "";
            position: absolute;
            left: 269px;
            top: 165px;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border: 1px solid #e1e1e1;
            border-radius: 4px;
            transform: rotate(45deg);
            z-index: 100;
        }
        &::after {
            content: "";
            position: absolute;
            left: 279px;
            top: 162px;
            width: 16px;
            height: 28px;
            background-color: #fff;
            z-index: 100;
        }
        &.arrowTop::before {
            top: 88px;
        }
        &.arrowTop::after {
            top: 85px;
        }

        .modal-table {
            tbody {
                tr:hover {
                    background-color: #fff;
                }
                tr:hover:nth-of-type(2n+1) {
                    background-color: #FAFAFA;
                }
            }
        }
    }

    .right-wrap {
        border-left: 1px solid #e1e1e1 !important;
    }

    .left-wrap,.right-wrap {
        height: auto !important;
        min-height: 100%;
    }

</style>
