export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            filter: false
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: false,
        },
        /* 
         * filter 配置
         */
        filterCfg: [

        ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '编辑'
            }, {
                type: 'danger',
                btn: 'delete',
                text: '停用'
            }]
        ],
        serial:true,
        width: [3, 3, 3,9,4], //排除序号，多选，单选，操作栏
        match: [
            { key: 'processName', href: true },
            'departmentName',
            'departmentEmployeeName',
            (obj) => {
                var str = "";
                for(var i=0;i<obj.attachments.length;i++){
                    str+="<a style='display: block; padding: 4px 0; overflow: hidden; text-overflow: ellipsis;' href='"+obj.attachments[i].url + "' title='" + obj.attachments[i].fileName + "'>" +
                    "<i class='icon-other' style='display: inline-block; width: 16px;height: 18px; background-size: cover;vertical-align: sub;'></i>" +
                    obj.attachments[i].fileName+"</a>";
                }
                return str;
            },
            'remark'
        ],
        head: ['工序','班组','班组负责人', '工序图档','备注']
    },
    tableCfg2: {
        serial:true,
        width: [3, 3, 3,9,4], //排除序号，多选，单选，操作栏
        match: [
            { key: 'processName', href: true },
            'departmentName',
            'departmentEmployeeName',
            (obj) => {
                var str = "";
                for(var i=0;i<obj.attachments.length;i++){
                    str+="<a style='display: block; padding: 4px 0; overflow: hidden; text-overflow: ellipsis;' href='"+obj.attachments[i].url + "' title='" + obj.attachments[i].fileName + "'>" +
                        "<i class='icon-other' style='display: inline-block; width: 16px;height: 18px; background-size: cover;vertical-align: sub;'></i>" +
                        obj.attachments[i].fileName+"</a>";
                }
                return str;
            },
            'remark'
        ],
        head: ['工序','班组','班组负责人', '工序图档','备注']
    }
}
