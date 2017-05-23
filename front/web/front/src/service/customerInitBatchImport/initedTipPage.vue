<script>
</script>
<template>
    <container>
        <div class="inited-wrap">
            <i class="success icon-success"></i>
            <div class="text">您已经完成初始化！</div>
        </div>
    </container>
</template>
<style lang="less">
    /*  初始化成功之后的提示页面样式  */
    .inited-wrap{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .success{
            font-size: 60px;
            margin-bottom: 20px;
            color: #7ED321;
        }
        .text{
            color: #757575;
        }
    }
</style>