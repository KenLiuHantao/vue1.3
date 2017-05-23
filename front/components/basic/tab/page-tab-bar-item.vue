<script>
export default {
    props: {
        modal: Object,
        selectid: String
    },
    methods: {
        changeSelectItem(id) {
            this.selectid = id;
            // this.$emit('tabchange',id)
        }
    }
}
</script>
<template>
    <a @click='changeSelectItem(modal.id)' :class="{ckd:selectid == modal.id}" href="javascript:;">
        <span v-if='modal.must' class="must-point">*</span>
        <i v-if='modal.icon' :class='modal.icon'></i>{{modal.name}}
    </a>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';

a {
    display: inline-block;
    height: 38px;
    line-height: 34px;
    /*padding: 15px 0;*/
    width: auto;
    padding: 0 25px;
    text-align: center;
    font-size: 14px;
    color: @main-text;
    margin-bottom: -1px;
    border: 1px solid transparent;
    border-top: 2px solid transparent;
    &.ckd,
    &:hover {
        color: @link-color;
    }
    &.ckd {
        background-color: @body-bg;
        border-top-color: @link-color;
        border-left-color: @border-color;
        border-right-color: @border-color;
    }
}
</style>
