<script>

import noPage from 'np/images/404.png'
export default {
    ready(){

    },
    data(){
        return {
            noPage:noPage
        }
    }
}
</script>

<template>
    <container>
        <div class="c">
            <img class="noPage" :src="noPage">
            <div class="text">这个页面不存在!</div>
        </div>
    </container>
</template>
<style lang='less' scoped="">
    .c{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }
    .noPage{
        width: 132px;
        height:115px ;
        margin-bottom: 20px;
    }
    .text{
        color: #757575;
    }
</style>
