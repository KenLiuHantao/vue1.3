<script>
import mix from './common.js'
export default{
    componentName:'ecMenuItem',
    mixins:[mix],
    props:{
        index:{
            required:true
        },
        value:''
    },
    data(){
        return{

        }
    },
    methods:{
        /*
        * 点击事件
        * */
        handleClick(){
            this.$dispatch('itemClick',this)
            this.$emit('cb',this.value)
        }
    },
    ready(){
        this.rootMenu.addItem(this)
        this.parentMenu.addItem(this)
    },
    computed:{
        /*
        * 当前子项是否被选中
        * */
        active() {
            return this.index == this.rootMenu.activeIndex;
        }
    }

}
</script>
<template>
    <li class="menu-item" :class="{'active':active}" @click.stop="handleClick">
        <slot></slot>
    </li>
</template>
<style lang="less">

</style>