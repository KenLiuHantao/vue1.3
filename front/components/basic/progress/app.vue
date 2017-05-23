<script>
    export default {
        props:{
            data:{
                type:Number,
                default:0
            }
        }
    }
</script>
<template>
    <div class="progress" v-if="data > 0 && data < 100">
        <div class="progress-wrap">
            <div class="progress-bar" :style="{width:data +'%'}"></div>
        </div>
        <div class="progress-text">{{data}}%</div>
    </div>

</template>
<style lang="less">
   @import '../../../public/css/variable.less';
   .progress{
       display: flex;
       align-items: center;
       border: none;
       margin-top: 10px;

       .progress-wrap{
           width: 200px;
           height: 10px;
           border-radius: 10px;
           margin-right: 10px;
           background-color: #F0F0F0;

           .progress-bar{
               width: 0px;
               height: 100%;
               border-radius: 10px;
               background-color: #03A9F4;
               transition: width .5s;
           }
       }

       .progress-text{
           font-size: 12px;
           color: #03A9F4;
       }
   }



</style>

