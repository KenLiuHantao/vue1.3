<script>
export default {
    props: {
        config: Object
    },
    ready() {
        this.isSelect()
    },
    methods: {
        isSelect() {
            this.config.select = this.config.select ? this.config.select : this.config.tabBarData[0].id;
        },
        changeSelectItem(id) {
            this.config.select = id
        }
    }
}
</script>
<template>
    <div class="tab-list">
        <a v-for='model in config.tabBarData' @click='changeSelectItem(model.id)'>
            <input type="radio" :value="model.id" v-model="config.select"> {{model.name}}
        </a>
    </div>
</template>
<style lang="less" scoped>
@import '../../../public/css/variable.less';
.tab-list {
    display: flex;
    font-size: 0;
    a {
        display: flex;
        align-items: center;
        font-size: 14px;
        justify-content: flex-start;
        cursor: pointer;
        color: @main-text;
        margin-right: 30px;
        line-height: 18px;
        input {
            margin-right: 5px;
        }
    }
}
</style>
