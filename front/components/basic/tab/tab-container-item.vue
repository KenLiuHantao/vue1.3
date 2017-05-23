<script>
export default {
    props: ['id', 'class']
}
</script>
<template>
    <div :class="['tab-container-item',class]" v-show="id === $parent.active">
        <slot></slot>
    </div>
</template>
<style lang='less' scoped>
.tab-container-item {
    box-sizing: border-box;
    width: 100%;
    flex-shrink: 0;
}
</style>
