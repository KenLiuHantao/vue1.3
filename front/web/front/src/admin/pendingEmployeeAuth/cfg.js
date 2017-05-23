export default {
    employeeTableCfg: {
        serial: true,
        width: [3, 5, 12], //排除序号，多选，单选，操作栏
        newline: [2],
        firstItemTextAlignLeft: true,
        match: [
            'name',
            'zhiNengQuanXian',
            function(x){
                if (x.users && x.users.length) {
                    return x.users.map(function(o){
                        return o.name;
                    }).join(" / ")
                } else {
                    return ''
                }
            },
        ],
        head: ['岗位名称', '职能权限', '员工名单'],
        operating: [true, 'config-operate', [{text: '岗位授权', btn: 'employee'}]],
    },
    functionTableCfg: {
        serial: true,
        width: [20], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'postName',
        ],
        head: ['职能权限'],
        operating: [true, 'config-operate', [{text: '职能授权', btn: 'function'}]],
    },
}
