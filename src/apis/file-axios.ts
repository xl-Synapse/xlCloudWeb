// 导入axios实例
import httpRequest from '@/request/axios-config'
import {Base64} from 'js-base64'

// import {config} from '@/config/config'

// // 定义接口的传参
// interface UserInfoParam {
// 	userID: string,
// 	userName: string
// }

// 获取用户信息
export function apiGetUserInfo(param: {}) {
    return httpRequest({
		url: 'your api url',
		method: 'post',
		data: param,
	})
}

export function apiGetListFiles(param: string) {
	console.log(Base64.encode(param))
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/files/' 
			+ Base64.encode(param, true),
		method: 'get'
	})
}

export function apiGetDownloadFile(param: string) {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/file/' 
			+ Base64.encode(param, true),
		method: 'get',
		responseType:'blob'
	})
}

export function apiGetDownloadFileBrower(win: any, param: string) {
	win.location.href = 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/file/' 
	+ Base64.encode(param, true)
}


