<script type="text/javascript">
/* 还差的东西
 * 1、权限right
 * 2、头配置
 * 3、table逻辑操作栏
 *
 */

import list from 'nc/list/sub'
import filter from 'nc/filter/app'

import tabbar from 'nc/tab/tab-bar'
import containeritem from 'nc/tab/tab-container-item'

import cfg from './cfg.js'

export default {
    components: {
        list,
        filter,
        tabbar,
        containeritem
    },
    props: {
        config: {
            type: Object
        }
    },
    ready() {
        this.config.tabCfg = Object.assign({}, this.config.tabCfg)
        this.config.tabCfg.select=this.config.tabCfg.tabBarData[0].id
        this.getUrl(this.tabCfg.tabBarData[0].id, this.tabCfg.tabBarData[0])
        this.getTabData()
        window.addEventListener('click', () => {
            this.openSelect = false
        })
    },
    data() {
        return {
            initTableParam: {},
            tableData: [],
            allCodes: [],
            // head 配置
            addModCfg: cfg.addModCfg,
            filterModCfg: cfg.filterModCfg,
            //配置保存
            oldFilterConfig: '',
            // list值
            mainEntity: {},
            subEntity: {},
            listData: [],
            onlyId: '',
            // 临时配置
            subParam: {},
            tabDataArr: [],
            tabSubCfg: {},
            openSelect:false
        }
    },
    methods: {
        copyParam(base, target) {
            let tk = Object.keys(target)
            for (let i in base) {
                if (!tk[i]) {
                    target[i] = base[i]
                }
            }
        },
        isEqual(x, y) {
            if (x === y) {
                return true;
            }

            if (!(x instanceof Object) || !(y instanceof Object)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            for (var p in x) {
                if (x.hasOwnProperty(p)) {
                    if (!y.hasOwnProperty(p)) {
                        return false;
                    }

                    if (x[p] === y[p]) {
                        continue;
                    }

                    if (typeof(x[p]) !== "object") {
                        return false;
                    }

                    if (!Object.equals(x[p], y[p])) {
                        return false;
                    }
                }
            }

            for (p in y) {
                if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                    return false;
                }
            }
            return true;
        },
        // table返回的操作参数
        operate(type, item) {
            this.$emit('op', type, item)
        },
        href(item, type) {
            this.$emit('link', item, type)
        },
        // tab操作
        getUrl(uid, obj) {
            this.onlyId = ''
            this.subParam = obj
            this.getMainList(obj)
            this.getMainEntity(obj)
            this.$emit('tab',uid,obj)
        },
        getMainEntity(obj) {
            this.mainEntity = obj.params
        },
        getMainList(obj) {
            let url = obj.params.main.url;
            let param = obj.params.main.param;
            let method = obj.params.main.method ? obj.params.main.method.toLowerCase() : "post";
            let dataListHandler = obj.params.main.dataListHandler || function(res) {
                return res.data.data.dataList;
            }
            this.listData = [];

            if (method == "post") {
                this.$http.post(url, param).then(
                    (res) => {
                        this.listData = dataListHandler(res);
                        if(this.listData && this.listData.length>0){
                            let autoGetListParam = Object.assign({},this.mainEntity.main.param)
                            this.copyParam(this.listData[0], autoGetListParam)
                            this.$emit('cb', autoGetListParam)
                        }
                    }
                );
            } else {
                this.$http.get(url, {
                    params: param
                }).then(
                    (res) => {
                        this.listData = dataListHandler(res);
                        if(this.listData && this.listData.length>0){
                            let autoGetListParam = Object.assign({},this.mainEntity.main.param)
                            this.copyParam(this.listData[0], autoGetListParam)
                            this.$emit('cb', this.mainEntity.main.param)
                        }
                    }
                );
            }
        },
        //list选中的回调函数
        getParam(item, obj) {
            this.$emit('cb', item, obj)
        },
        // head操作回调
        addMod() {
            this.$emit('add')
        },
        filterMod() {
            this.filterModCfg.show = true
            if (this.config.filterCfg) {
                this.oldFilterConfig = JSON.parse(JSON.stringify(this.config.filterCfg));
            }
        },
        /* modal的回调函数 */
        addSure() {
            this.addModCfg.show = false
        },
        addClose() {
            this.addModCfg.show = false
        },
        filterSure() {
            this.filterModCfg.show = false

            //刷新list
            this.copyToTabCfg(this.config.filterCfg)
            for (let i = 0; i < this.config.filterCfg.length; i++) {
                if (!this.isEqual(this.config.filterCfg[i], this.oldFilterConfig[i])) {
                    this.$emit('filtcb')
                    break
                }
            }
        },
        copyToTabCfg(obj) {
            this.tabCfg.tabBarData.forEach((item) => {
                obj.forEach((it) => {
                    item.params.main.param[it.key] = it.value
                    if (this.listCfg.hasChild) {
                        item.params.sub.param[it.key] = it.value
                    }
                })
            })
        },
        filterClose() {
            this.filterModCfg.show = false
            this.config.filterCfg = this.oldFilterConfig;
        },
        //筛选回调
        openReference(item) {
            this.$emit('reference', item)
        },
        // 通过select获取当前操作第几个tab的listCfg
        getTabList(uid) {
            let place = this.tabDataArr.indexOf(uid) != -1 ? this.tabDataArr.indexOf(uid) : 0
            return this.config.tabCfg.tabBarData[place].listCfg
        },
        // 获取tab对象有几个
        getTabData() {
            this.config.tabCfg.tabBarData.forEach((item) => {
                this.tabDataArr.push(item.id)
                    // this.getUrl(item.id, item)
            })
        },
        //展开头部的下拉
        openselect(){
            this.openSelect=true;
        },
        //多个下拉冒泡
        addlist(index,item){
            this.$emit('addlist',index,item)
        }
    },
    events: {
        _RESETLIST(index = 0) {
            this.config.tabCfg = Object.assign({}, this.config.tabCfg)
            this.config.tabCfg.select=this.config.tabCfg.tabBarData[index].id
            this.getUrl(this.tabCfg.tabBarData[index].id, this.tabCfg.tabBarData[index])
        }
    },
    computed: {
        leftHead() {
            return this.config.headCfg
        },
        leftHeadAdd() {
            let a = ''
            typeof this.leftHead.add == 'object' ? a = this.leftHead.add[1] : a = '新增'
            return a
        },
        tabCfg() {
            return this.config.tabCfg
        },
        listCfg() {
            let obj = this.config.listCfg ? this.config.listCfg : this.getTabList(this.tabCfg.select)
            return obj
        }
    }
}
</script>
<template>
    <div class="item_head between">
        <!-- 单个新增 -->
        <a href="javascript:;" v-if='leftHead.add' @click='addMod'>
            <i class="icon-hp_list__add"></i>{{leftHeadAdd}}
        </a>
        <!-- 新增和导入 -->
        <a href="javascript:;" v-if='leftHead.addList' @click='addlist(0,leftHead.addList[0])' class='leftArr'>
            <i class={{leftHead.addList[0].icon}}></i>{{leftHead.addList[0].name}}
            <span class="arrow-close" @click.stop='openselect'></span>
        </a>
        <div class='select-option' v-if='openSelect'>
            <a href="javascript:;" @click='addlist($index,item)' v-for='item in leftHead.addList'>
                <i class={{item.icon}}></i>{{item.name}}
                <span class="arrow" v-show='$index==0'></span>
            </a>
        </div>

        <a href="javascript:;" v-if='leftHead.filter' @click='filterMod'>
            <i class="icon-filter"></i>筛选
        </a>
    </div>
    <div class="item_body">
        <tabbar :config.sync='tabCfg' @cb='getUrl'></tabbar>
        <list :config='listCfg' :entity='mainEntity' :data='listData' :oid.sync='onlyId' @cb='getParam'></list>
    </div>
    <!-- 弹框系列 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='config.filterCfg' @cb='openReference'></filter>
    </modal>
</template>
<style lang='less' scoped>
.pd-10 {
    padding: 10px;
}
.arrow-close{
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #212121;
    border-bottom: 6px solid transparent;
    margin-left: 10px;
    -webkit-transform: translateY(30%);
    transform: translateY(30%);
}
.leftArr:hover .arrow-close{
    border-top: 6px solid #03a9f4;
}
.select-option{
    position: absolute;
    top:0;
    left: 0;
    background-color: #fff;
    box-shadow: 0 3px 3px 0 rgba(140,150,171,.41);
    line-height: 46px;
    z-index: 3;
    width: 150px;
    a{
        display: inline-block;
        padding: 0 12px;
        height: 46px;
        width: 126px;  
    }
    a:hover{
        color:#212121;
        background: #EBF7FD;
    }
    .arrow{
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid transparent;
        border-bottom: 6px solid #212121;
        margin-left: 10px;
        -webkit-transform: translateY(-30%);
        transform: translateY(-30%);
    }
}
</style>
