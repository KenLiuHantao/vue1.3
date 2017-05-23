<script>
export default {
    props: ['show']
}
</script>
<template>
    <div v-show="show" class="loading-wrap">
        <div class="loading-bg"></div>
    </div>
</template>
<style lang="less">
@import '../../../public/css/variable.less';
.loading-wrap {
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    transform: translate(-50%, -50%);
    a {
        cursor: pointer;
    }
    .loading-bg {
        width: 60px;
        height: 40px;
        background: url('../../../public/images/loading_loop.gif') no-repeat;
        background-size: 100%;
    }
}
</style>
