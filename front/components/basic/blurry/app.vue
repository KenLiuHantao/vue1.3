<script>
    export default {
        props:{
            data:{
                type:Array,
                default(){
                    return []
                }
            },
            config:{
                type:Object,
                default(){
                    return {
                        show:false,
                        key:'currencyName'
                    }
                }
            }
        },
        ready(){
            window.addEventListener('click', () => {
                this.config.show = false
            })
        },
        methods:{
            getItem(item){
                this.$emit('cb',item)
                this.config.show = false
            }
        }
    }
</script>
<template>
    <ul v-show='config.show' class="filtCount">
        <li v-for='item in data'  @click.stop='getItem(item)'>{{item[config.key]}}</li>
        <li v-if='data.length == 0'>暂无数据</li>
    </ul>
</template>
<style lang="less" scoped>
@import '../../../public/css/variable.less';
.filtCount {
    position: absolute;
    z-index: 9999;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid @border-color;
    background-color: @body-bg;
    li {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 10px;
        font-size: 12px;
        cursor: pointer;
        &:hover {
            background-color: @list-hover;
        }
    }
}
</style>

