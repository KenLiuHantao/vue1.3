<script>
     /*
     * 向外暴露的方法：
     * menu组件上:    select     item点击后会触发
     *               open       打开子级时
     *               close      关闭子级时
     * submenu组件上: cb         点击submenu时
     * item组件上:    cb         点击item时
     * */
    import Vue from 'vue'
    export default{
        componentName: 'ecMenu',
        props:{
            defaultActive:{
                default:''
            },
            defaultOpened:Array
        },
        data(){
            return{
                activeIndex:'',
                openedMenus:[],
                items:{},
                submenus:[]
            }
        },
        watch:{
            'defaultActive':{
                handler(val){
                   this.activeIndex = val
                },
                deep:true
            },
            'defaultOpened':{
                handler(val){
                    this.openedMenus = val
                },
                deep:true
            },

        },
        methods:{
            /*
            * 添加item给items对象
            * */
            addItem(item){
                Vue.set(this.items,item.index,item)
            },
            /*
            * 从items对象中删除item
            * */
            removeItem(item){
                delete this.items[item.index]
            },
            /*
            * 添加子菜单到submens
            * */
            addSubmenu(item){
                Vue.set(this.submenus,item.index,item)
            },
            /*
            * 从submenus当中删除某菜单
            * */
            removeItem(item){
                delete this.submenus[item.index]
            },
            /*
            * 打开某个子菜单
            * */
            openMenus(index,indexPath){
                //当前菜单已打开，则不做任何处理
                if(this.openedMenus.indexOf(index) !== -1) return

                //将不在此菜单下的其余菜单全部收起
                this.openedMenus = this.openedMenus.filter(item=>{
                    return indexPath.indexOf(item) !== -1
                })

                this.openedMenus.push(index)

            },
            /*
            * 关闭某个子菜单
            * */
            closeMenus(index){
                this.openedMenus.splice(this.openedMenus.indexOf(index),1)
            },
            /*
            * 初始化需要打开的菜单
            * */
            initOpenMenus(){
                let active = this.activeIndex
                let actItem = this.items[active]
                if(!actItem) return;

                let actPath = actItem.indexPath

                //展开此路径上的所有菜单
                actPath.forEach(index=>{
                    let submenu = this.submenus[index]
                    submenu && this.openMenus(index,submenu.indexPath)
                })
            },
        },
        events:{
            /*
            * 子菜单点击后会触发的事件
            * */
            submenuClick(item){
                let index = item.index
                let indexPath = item.indexPath
                let isOpen = this.openedMenus.indexOf(index) !== -1
                this.activeIndex = item.index
                if(isOpen){
                    this.closeMenus(index,indexPath)
                    this.$emit('close',item,index,indexPath)
                }else{
                    this.openMenus(index,indexPath)
                    this.$emit('open',item,index,indexPath)
                }
            },
            /*
            * 子项点击后会触发的事件
            * */
            itemClick(item){
                this.activeIndex = item.index
                this.$emit('select',item,item.index,item.indexPath)
            }
        },
        ready(){
            this.initOpenMenus()
        }
    }
</script>
<template>
  <ul class="ec-menu">
      <slot></slot>
  </ul>
</template>
<style lang="less">
    @import '../../../public/css/variable.less';
    .ec-menu{
        background-color: @gray-dark;
        overflow: auto;
        li:first-of-type .sub-title{
            border-top: none;
        }
        .icon{
            width: 12px;
            font-size: 12px;
        }
        .sub-title {
            padding-left: 10px;
            background-color: white;
            border-bottom: 1px solid @border-color;
            position: relative;
            &:hover{
                color: @link-color;
                cursor: pointer;
                background-color:#EBF7FD ;
            }
            &.open{
                color: @link-color;
            }
            .icon{
                margin-right: 12px;
            }
            &.active{
                background-color: #EBF7FD;
                color: @link-hover;

                &:after{
                    display: flex;
                    content: '';
                    position: absolute;
                    width: 2px;
                    height: 100%;
                    top:0;
                    left: 0;
                    background-color: @link-hover;
                }
            }
        }
        .sub-title,.menu-item{
            display: flex;
            height: 42px;
            align-items: center;
        }
        .menu-item{
            padding-left: 42px;
            border-bottom: 1px solid @border-color;
            position: relative;


            &:hover{
                cursor: pointer;
                background-color:#EBF7FD ;
            }

            &.active{
                background-color: #EBF7FD;
                color: @link-hover;

                &:after{
                    display: flex;
                    content: '';
                    position: absolute;
                    width: 2px;
                    height: 100%;
                    top:0;
                    left: 0;
                    background-color: @link-hover;
                }
            }
        }
    }

</style>