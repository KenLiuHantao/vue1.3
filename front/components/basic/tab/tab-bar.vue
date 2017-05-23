<script>
import tabitem from './tab-bar-item'

export default {
    components: {
        tabitem
    },
    data() {
        return {}
    },
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
        cbt(id, obj) {
            this.config.select = id
            this.$emit('cb', id, obj)
        }
    }
}
</script>
<template>
    <div class="tab-list">
        <tabitem v-for='model in config.tabBarData' :selectid='config.select' :type="config.type" :modal.sync='model' @cb='cbt'>
        </tabitem>
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.tab-list {
    display: flex;
    font-size: 0;
    border-bottom: 1px solid @border-color;
}
</style>
