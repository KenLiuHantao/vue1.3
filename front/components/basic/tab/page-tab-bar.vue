<script>
import tabitem from './page-tab-bar-item'

export default {
    components: {
        tabitem
    },
    props: {
        config: Object
    },
    ready() {
        this.isSelect()
    },
    watch: {
        config: {
            handler(val) {
                this.isSelect()
                this.$emit('change', this.config.select)
            },
            deep: true
        }
    },
    methods: {
        isSelect() {
            this.config.select = this.config.select ? this.config.select : this.config.tabBarData[0].id;
        }
    }
}
</script>
<template>
    <div class="tab-list">
        <tabitem v-for='model in config.tabBarData' :selectid.sync='config.select' :modal.sync='model'>
        </tabitem>
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.tab-list {
    display: flex;
    background-color:#f7fafd;
    font-size: 0;
    border-bottom: 1px solid @border-color;
}
</style>
