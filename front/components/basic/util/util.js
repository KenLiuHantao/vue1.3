/**
 * Created by SkyeTang on 2016/12/17.
 */
import confirm from '../messageBox/index.js'
import warning from '../message/index.js'
var util = {
	install: function (vue, options) {
		vue.prototype.$getRights = function (paramAlias, url) {
			let targetUrl = url || 'v1/resource/judge'
			let rights = {}
			let rightParam = Object.keys(paramAlias)

			if (rightParam.length < 1) {
				console.log("请求权限参数不正确")
				return false
			}
			let get = this.$http.post(targetUrl, rightParam).then(
				res => {
					if (res.data.success) {
						res.data.data.forEach((item) => {
							rights[paramAlias[item.permCode]] = item.permission
						})
					} else {
						console.log(res.data.errMsg)
					}
					return rights
				},
				err => {
					return '网络错误，请求失败'
				}
			)
			return get

		}
		vue.prototype.$exportData = function (url, params) {
			let f = document.createElement('form')
			document.body.appendChild(f)
			Object.keys(params).forEach(key => {
				let i = document.createElement('input')
				i.type = 'hidden'
				i.value = params[key]
				i.name = key
				f.appendChild(i)
			})
			f.method = 'post'
			f.action = url
			f.submit()
			f.remove()
		}

		vue.prototype.$downFile = function (val) {
			if (val.downloadUrl && val.downloadUrl != "") {
				window.location.href = val.downloadUrl;
				return;
			}
			this.$http.post(__URL.v1 + 'file/url',null,{params:{fileId:val.fileId,fileName:val.fileName}}).then(res => {
				if (res.data.success) {
					window.location.href = res.data.data;
				} else {
					console.log(res.data.errMsg)
				}
			})
		}
        vue.prototype.$confirm = confirm
        vue.prototype.$warning = warning
	}
}

export default util