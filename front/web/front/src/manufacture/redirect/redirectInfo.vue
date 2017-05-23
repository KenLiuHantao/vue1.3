<script>

export default {
    components:{
    },
    data() {
        return {

        }
    },
    props: ['detail'],
    ready() {

    },
    methods: {

    },
    computed:{
        redirectObj(){
            return this.detail
        }
    }
}
</script>


<template>
    <!--<div class="modal-input-wrap">-->
        <div class="m_main">
            <div class="m_block">
                <div class="m_item">
                    <label>转出单位:</label>
                    <span>{{redirectObj.fromProcessName}}</span>
                </div>
                <div class="m_item">
                    <label>转出人:</label>
                    <span>{{redirectObj.fromEmployeeName}}</span>
                </div>
                <div class="m_item">
                    <label>转出数量:</label>
                    <span>{{redirectObj.redirectQty}}</span>
                </div>
            </div>
            <div class="m_block">
                <div class="m_item">
                    <label>转入单位:</label>
                    <span>{{redirectObj.toProcessName}}</span>
                </div>
                <div class="m_item">
                    <label>转入人:</label>
                    <span>{{redirectObj.toEmployeeName}}</span>
                </div>
                <div class="m_item">
                    <label>转入数量:</label>
                    <span>
                        <input-number  style='width:100px;margin-top:-6px;' placeholder="流转数量"
                             :code.sync='redirectObj.currentQty'></input-number>
                    </span>
                </div>
            </div>
        </div>
    <!--</div>-->
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
