<script>

export default {
    components:{
    },
    data() {
        return {
            redirectDetails:[]
        }
    },
    props: ['recordId'],
    ready() {
        this.getDetail(this.recordId)
    },
    methods: {
        getDetail(recordId){
            this.$http.get(__URL.manufacture + 'redirect/detail/'+ recordId,{}).then(
                (res) => {
                    //成功才赋值
                    if(res.data.success){
                        this.redirectDetails = res.data.data;
                    }
                }
           )
        }
    },
    computed:{
        redirectObj(){
            return this.detail
        }
    }
}
</script>


<template>
    <div class="check-wrap">
        <div class="right-wrap">
            <div class="left-content">
                <table class="modal-table">
                    <thead>
                    <tr>
                        <th width="13%">转出单位</th>
                        <th width="13%">转出人</th>
                        <th width="13%">转出数量</th>
                        <th width="13%">转入单位</th>
                        <th width="13%">转入人</th>
                        <th width="13%">转入数量</th>
                        <th width="13%">日期</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in redirectDetails'>
                        <td>
                            {{item.fromProcessName}}
                        </td>
                        <td>
                            {{item.fromEmployeeName}}
                        </td>
                        <td>
                            {{item.redirectQty}}
                        </td>
                        <td>
                            {{item.toProcessName}}
                        </td>
                        <td>
                            {{item.toEmployeeName}}
                        </td>
                        <td>
                            {{item.redirectQty}}
                        </td>
                        <td>
                            {{item.redirectDate}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!--</div>-->
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
        height: 100%;
        min-height: 300px;
        &.arrow {
            &::before {
                background-color: #fafafa;
            }
            &::after {
                background-color: #fafafa;
            }
        }

        .modal-table {
            tbody {
                tr td:nth-of-type(3n) {
                    border-right: 1px solid #f2f3f3 !important;
                }
                tr:hover {
                    background-color: #fff;
                }
                tr:hover:nth-of-type(2n+1) {
                    background-color: #FAFAFA;
                }
            }
        }
    }

</style>
