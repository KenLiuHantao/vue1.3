
<script>
    export default{
        data(){
            return{
                productDetailLists:[],
            }
        },
        components:{

        },
        props:['docNo'],
        ready(){
            this.$http.get(__URL.manufacture + 'productOrder/go/product/' + this.docNo).then(
                (res) => {
                    if(res.data.success){
                        this.productDetailLists = res.data.data.dataList;
                    }else{
                        this.errTips(res.data.errMsg);
                    }
                }
            );
        },
        method:{

        }

    }
</script>
<template>
    <div class="check-wrap">
        <div class="right-wrap">
            <div class="left-content">
                <table class="modal-table">
                    <thead>
                    <th width="25%">生产工序</th>
                    <th width="25%">生产数量</th>
                    <th width="25%">已登记数量</th>
                    <th width="25%">未登记数量</th>
                    </thead>
                    <tbody>
                    <tr v-for='item in productDetailLists'>
                        <td>
                            {{item.processName}}
                        </td>
                        <td>
                            {{item.productQuantity}}
                        </td>
                        <td>
                            {{item.productRegisterQuantity}}
                        </td>
                        <td>
                            {{item.unRegisterQuantity}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
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
    .right-arr{

        &::before {
            content: "";
            position: absolute;
            left: 269px;
            top: 127px;
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
            top: 124px;
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
    }
    .check-wrap {
        position: relative;
        height: auto;
        min-height: 300px;
        margin-bottom: 0;

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

        .right-wrap {
            border-bottom: none;
            border-left: 1px solid #e1e1e1 !important;
        }
    }

    .left-wrap,
    .right-wrap {
        height: auto !important;
        min-height: 100%;
    }
</style>