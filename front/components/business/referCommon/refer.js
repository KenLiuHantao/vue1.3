/**
 * Created by SkyeTang on 2017/2/28.
 */
export  default {
    props:{
        config:{
            type:Object
        },
        init:{
            type:Boolean,
            default:false
        }
    },
    ready(){
        this.keyWord = ''
        this.getCateData()
        //this.getTableData('',-1)
    },
    data(){
        return {
            //多选部门弹框配置
            modalCfg: {
                show: this.config.show || false,
                width: '860px',
                height: 'auto',
                header: '选择客户',
                btn: [{
                    name: '取消',
                    emit: 'quite'
                }, {
                    name: '确定',
                    emit: 'sure'
                }],
            },
            //分类列表数据
            cateData:[],
            //详细列表数据
            tableData:[],
            //当前操作分类
            currentUl:'-1',
            //当前选中列
            chooseRadio:'',

            //搜索关键字
            keyWord:'',

        }
    },
    methods:{
        getCateData(){
            let param = {
                "customerContact": "",
                "customerName": "",
                "employeeName": "",
                "keyWord": this.keyWord,
                "pageIndex": 0,
                "pageSize": 0
            }
            this.$http.post(__URL.arc + 'customer/category',param).then(
                res=>{
                    if(res.data.success){
                        this.cateData = res.data.data.dataList
                    }
                })
        },
        getTableData(item,index){
            this.currentUl = index
            let param = {
                "customerCategoryCode": item,
                "customerContact": "",
                "customerName": "",
                "employeeCode": "",
                "employeeName": "",
                "keyWord": this.keyWord,
                "pageIndex": 0,
                "pageSize": 0
            }
            this.$http.post(__URL.arc + 'customer/ref',param).then(
                res=>{
                    if(res.data.success){
                        this.tableData = res.data.data.dataList
                    }
                }
            )
        },
        searchData(){
            this.getTableData('',-1)
        },
        quite(){
            this.currentUl=-1
            this.config.show = false
            this.chooseRadio = ''
            this.tableData = []
        },
        sure(){
            this.currentUl=-1
            this.config.show = false
            this.$emit('cb',this.chooseRadio)
            this.tableData = []
        },
        checkThisLine(item){
            this.chooseRadio = item
        }
    },
    watch:{
        config:{
            handler: function (val, oldVal) {
                this.modalCfg.show = val.show
                if(val.show==true){
                    this.keyWord = ''
                    this.getCateData()
                }
                if(val.show == true && val.data &&  val.data != ''){
                    this.chooseRadio = val.data
                }
            },
            deep: true
        },
        keyWord(val,oldval){
            if(val.trim() == ''){
                this.getTableData('',-1)
            }
        },
        modalCfg:{
            handler: function (val, oldVal) {
                this.config.show = val.show
            },
            deep: true
        }
    }
}