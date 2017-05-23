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
        <div class="c">
            <img class="noPage" :src="noPage">
        </div>
</template>
<style lang='less'>
    .c{
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: white;
    }
    .noPage{
        width: 600px;
    }
</style>
