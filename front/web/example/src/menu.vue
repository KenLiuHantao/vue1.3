<script>
    import Menu from 'nc/menu/menu.vue'
    import Submenu from 'nc/menu/submenu.vue'
    import MenuItem from 'nc/menu/menuItem.vue'
    export default {
        components:{
            Menu,Submenu,MenuItem
        },
        data(){
            return {
                currentEvents:'',
                act:''
            }
        },
        ready(){
            console.log(this.act)
            setTimeout(()=>{
                this.act = '3'
                console.log(this.act)
            },5000)
        },
        methods:{
            openSubmenu(item){
                this.currentEvents ='打开了子菜单'+item.value
            },
            closeSubmenu(item){
                this.currentEvents ='关闭了子菜单'+item.value
            },
            selectItem(item){
                this.currentEvents = '选中了某一项'+item.value
            }
        }
    }
</script>
<template>
    <div class="tips">
        当前事件：{{currentEvents}}
    </div>
    <div class="test-menu">
        <menu @select="selectItem" :default-active="act" @open="openSubmenu" @close="closeSubmenu" class="menu">
            <submenu index="1" value="00000" >
                <template slot="title">hello</template>
                <menu-item index="1-1" value="1111">1</menu-item>
                <menu-item index="1-2" value="2222">2</menu-item>
                <menu-item index="1-3" value="3333">3</menu-item>
            </submenu>
            <submenu index="2" value="xxxxx">
                <template slot="title">hello2</template>
                <menu-item index="2-1" value="1231242352">1</menu-item>
                <menu-item index="2-2" value="42323">2</menu-item>
                <menu-item index="2-3" value="643534">3</menu-item>
            </submenu>
            <submenu index="3" :has-children="1222 == 12" value="xxxxx">
                <template slot="title">hello3</template>
            </submenu>
        </menu>
    </div>

</template>
<style lang="less" scoped>
    .test-menu{
        width: 220px;
    }
    .tips{
        margin-bottom: 40px;
    }
</style>