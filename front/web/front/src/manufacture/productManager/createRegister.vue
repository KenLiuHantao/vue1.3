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
            }
        }
    },
    props: ['detail'],
    ready() {

    },
    methods: {

    },
    computed:{
        registerDetail(){
            return this.detail
        }
    }
}
</script>


<template>

    <div class="m_main">
        <div class="m_block">
            <div class="m_item">
                <label>生产数量:</label>
                <span>{{registerDetail.productionQuantity}}</span>
            </div>
            <div class="m_item">
                <label>生产工序:</label>
                <span>{{registerDetail.processName}}</span>
            </div>
            <div class="m_item">
                <label>生产班组:</label>
                <span>{{registerDetail.departmentName}}</span>
            </div>

        </div>
        <div class="m_block">
            <div class="m_item">
                <label>待登:</label>
                <span>{{registerDetail.waitRegisterQuantity}}</span>
            </div>
            <div class="m_item">
                <label>登记时间:</label>
                <span>{{registerDetail.createTime}}</span>
            </div>
            <div class="m_item">
                <label>登记人:</label>
                <span>{{registerDetail.userName}}</span>
            </div>
            <div class="m_item">
                <label>此次登数:</label>
                <span>
                    <input-number  style='width:100px;margin-top:-6px;'  placeholder="登记数量" :code.sync='registerDetail.quantity'></input-number>
                </span>
            </div>
        </div>
    </div>


</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';

    .m_main {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
    }

    .m_block {
        flex: 1;

        &:first-of-type {
            border-right: 1px solid #ddd;
        }
    }

    .m_item {
        margin: 20px;

        > label {
            display: inline-block;
            width: 72px;
        }
    }


</style>
