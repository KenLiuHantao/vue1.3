<script>
    import mix from './common.js'
    export default{
        componentName:'ecSubmenu',
        mixins:[mix],
        props:{
            index:{
                required:true
            },
            value:'',
            hasChildren:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {
                items:{},
                submenus:{}
            }
        },
        methods:{
            /*
            * 添加子项到当前item中
            * */
            addItem(item){
                this.$set(this.items,item.index,item)
            },
            /*
            * 删除子项
            * */
            removeItem(item){
                delete this.items[item.index]
            },
            /*
            * 添加子菜单到当前submenus中
            * */
            addSubmenu(item){
                this.$set(this.submenus,item.index,item)
            },
            /*
            * 删除子菜单
            * */
            removeItem(item){
                delete this.submenus[item.index]
            },
            /*
            * 点击事件
            * */
            handleClick(){
                this.$dispatch('submenuClick',this)
                this.$emit('cb',this.value)
            }
        },
        ready(){
            this.rootMenu.addSubmenu(this)
            this.parentMenu.addSubmenu(this)
        },
        computed:{
            /*
            * 计算当前是否打开
            * */
            opened() {
                return this.rootMenu.openedMenus.indexOf(this.index) > -1;
            },
            /*
             * 当前项是否被选中
             * */
            active() {
                return this.index == this.rootMenu.activeIndex;
            }
        }
    }
</script>
<template>
    <li class="sub">
        <div class="sub-title" :class="{'open':opened,'active':active}" @click.stop="handleClick">
            <i v-if="hasChildren" class="icon" :class="[opened ? 'icon-arrow__down':'icon-arrow__right']"></i>
            <i v-else class="icon"></i>
            <slot name="title"></slot>
        </div>
        <ul class="ec-menu" v-show="opened">
            <slot></slot>
        </ul>
    </li>
</template>
<style lang="less">
</style>