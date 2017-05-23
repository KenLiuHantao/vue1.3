<script>
export default {
    props: ['conf', 'item'],
    methods: {
        itemInfo(item, ind) {
            this.$parent.itemInfo(item, ind)
        }
    }
}
</script>
<template>
    <div class="s-input" :style='{"width":conf.width?conf.width:""}'>
        <input readonly type='text' v-model='item[conf.key]'>
        <i @click='item[conf.key]=""' v-show='item[conf.key]' class="r2 icon-close__round"></i>
        <i @click='itemInfo(item,index)' class="r1 icon-search"></i>
    </div>
</template>
<style lang='less' scoped>
@import '../../../../public/css/variable.less';
.s-input {
    position: relative;
    margin: 3px 0; 
    [class^="icon-"],
    [class*=" icon-"] {
        position: absolute;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        top: 0px;
    }
    .r1 {
        right: 0;
        border-left: 1px solid @border-color;
    }
    .r2 {
        right: 28px;
    }
    input[type='text'] {
        width: 100%;
        &.pl1 {
            padding-left: 28px;
        }
        &.pr1 {
            padding-right: 28px;
        }
        &.pr2 {
            padding-right: 56px;
        }
        &:focus~[class*=" icon-"] {
            color: @link-color;
            border-color: @link-color;
        }
    }
    input[type='number'] {
        width: 100%;
        &.pl1 {
            padding-left: 28px;
        }
        &.pr1 {
            padding-right: 28px;
        }
        &.pr2 {
            padding-right: 56px;
        }
        &:focus~[class*=" icon-"] {
            color: @link-color;
            border-color: @link-color;
        }
    }
}
</style>
