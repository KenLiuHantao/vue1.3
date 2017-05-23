<script>
export default {
    props: {
        'config': Object,
        'active': String,
        'class': String
    }
}
</script>
<template>
    <div class="tab-container" :class="class">
        <slot></slot>
    </div>
</template>
<style lang='less'>
.tab-container {
    box-sizing: border-box;
    position: relative;
    display: flex;
}
</style>
