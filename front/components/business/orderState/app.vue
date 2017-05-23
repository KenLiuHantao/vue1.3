<script>
    /*
     config:
     {
     show:false, //弹框显示 true|false 必填
     },

     //回调函数
     @cb(val)

     */
    export default {
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '600px',
                    height: 'auto',
                    header: '查看订单状态',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                // demo
                demoLeft: [{
                    type: '生产数量',
                    num: '30.00',
                },{
                    type: '已完工数量',
                    num: '40.00',
                },{
                    type: '待流转数量',
                    num: '40.00',
                },{
                    type: '已流转数量',
                    num: '40.00',
                }],
                demoRight: [{
                    person1: '人员1',
                    person2: '人员2',
                    date: '2017-02-02',
                    num: '10.00',
                },{
                    person1: '人员3',
                    person2: '人员4',
                    date: '2017-02-03',
                    num: '20.00',
                },{
                    person1: '人员3',
                    person2: '人员4',
                    date: '2017-02-03',
                    num: '20.00',
                },{
                    person1: '人员3',
                    person2: '人员4',
                    date: '2017-02-03',
                    num: '20.00',
                }],
            }
        },
        computed: {
            arrow () {
                return this.demoRight.length >= 3 ? true : false
            },
        },
    }
</script>

<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div :class="{ 'arrow': arrow }" class="check-wrap">
            <div class="left-wrap">
                <ul class="left-content modal-ul">
                    <li v-for="item of demoLeft">
                        <span>{{ item.type }}</span><span>{{ item.num }}</span>
                    </li>
                </ul>
            </div>
            <div class="right-wrap">
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th width="20%">班组长</th>
                                <th width="20%">物料员</th>
                                <th width="20%">日期</th>
                                <th width="40%">已流转数量</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item of demoRight">
                                <td>{{ item.person1 }}</td>
                                <td>{{ item.person2 }}</td>
                                <td>{{ item.date }}</td>
                                <td>{{ item.num }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </modal>
</template>

<style lang="less" scoped>
@import '../../../public/css/variable.less';
@import '../../../public/css/referCommon.less';
.modal-ul {
    li {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 39px;
        padding-right: 20px;
        border-bottom: none;
    }
}

.check-wrap {
    position: relative;
    &::before {
         content: "";
         position: absolute;
         left: 269px;
         top: 127px;
         width: 20px;
         height: 20px;
         background-color: #fff;
         border: 1px solid #F2F3F3;
         border-radius: 4px;
         transform: rotate(45deg);
     }
    &::after {
         content: "";
         position: absolute;
         left: 279px;
         top: 124px;
         width: 20px;
         height: 27px;
         background-color: #fff;
     }

    &.arrow {
        &::before {
            background-color: #fafafa;
        }
        &::after {
            background-color: #fafafa;
        }
    }

    .modal-table {
        tbody {
            tr:hover {
                background-color: #fff;
            }
            tr:hover:nth-of-type(2n+1) {
                background-color: #FAFAFA;
            }
        }
    }
}
</style>

