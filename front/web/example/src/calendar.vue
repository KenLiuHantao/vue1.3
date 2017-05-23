<script>
   import datepicker from 'nc/calendar/app';
   import moment from 'moment'
    export default{
        data(){
            return{
                config:{
                    placeholder:'请选择时间',
                    format:'YYYY-MM-DD HH:mm:ss'  //YYYY/MM/DD
                },
                noTime:moment(new Date()).format('YYYY/MM/DD')
            }
        },
        components:{
            datepicker
        },
        methods:{
            ca(val){
                console.log(val)
            },
            hide(){
             this.end = this.start = false
            }
        }
    }
</script>
<template>
    {{noTime}}
    <div class="date-wrap">
        <table>
            <tbody>
            <tr>
                <td>
                    <datepicker :config="config"  :date="noTime"></datepicker>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <pre>
    config参数:

    {
        //日期选择框默认提示语 | 选填
        placeholder: '请选择时间',

        //可选择的最小日期 | 选填
        minDate: null,

        //可选择的最大日期 | 选填
        maxDate: null,

        //日期格式化的格式 | 选填
        format: 'YYYY-MM-DD HH:mm:ss',

        //是否显示清除按钮 | 选填
        clear: true

     }

    methods方法:

        //点击日期图标，所触发的勾子函数，主要用于两个日期组件时，控件另一个日期组件的显示状态
        @toggle

        //选择日期后会触发的勾子函数
        @cb

    props:
        //双向绑定的日期数据，可以直接拿到所选择日期数据
        :date

        //当前日期的显示状态
        :show
    </pre>
</template>
<style lang="less" scoped>
    .date-wrap{
        display:flex;
        flex-direction: row;

        >div{
            display: flex;
        }
        >div:first-child{
            margin-right: 20px;
        }
        >div:nth-child(2){
            margin-right: 20px;
        }
    }
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
    }
</style>

