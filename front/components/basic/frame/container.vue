<script>
    export default{
    }
</script>
<template>
    <div class="container">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less">
    @import '../../../public/css/variable.less';
    .container{
        padding-left: 212px;
        padding-top: 55px;
        width: 100%;
        height: 100%;

        .content{
            width: 100%;
            height: 100%;
            background-color: white;
            position: relative;
            overflow: hidden;
            box-shadow: -1px -1px 5px 0 rgba(0, 0, 0, .07);
        }
    }
</style>

