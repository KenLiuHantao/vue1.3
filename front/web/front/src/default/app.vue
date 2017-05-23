<script>
import defaultPng from 'np/images/box.png'
export default {
    data(){
        return {
            defaultPng:defaultPng
        }
    }
}
</script>

<template>
    <container>
        <div class="c">
            <img class="noPage" :src="defaultPng">
            <div class="text">欢迎进入【我的经管】系统首页!</div>
        </div>
    </container>
</template>
<style lang='less' scoped>
    .c{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }
    .noPage{
        width: 174px;
        height:170px ;
        margin-bottom: 20px;
    }
    .text{
        color: #757575;
    }
</style>
