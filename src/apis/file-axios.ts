// 导入axios实例
import httpRequest from '@/request/axios-config'

import {config} from '@/config/config'

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
	return httpRequest({
		url: 'http://' + config.serverUrl + ':' + config.serverPort + '/files/' + param,
		method: 'get'
	})
}

export function apiGetDownloadFile(param: string) {
	return httpRequest({
		url: 'http://' + config.serverUrl + ':' + config.serverPort + '/file/' + param,
		method: 'get',
		responseType:'blob'
	})
}

export function apiGetDownloadFileBrower(win: any, param: string) {
	win.location.href = 'http://' + config.serverUrl + ':' + config.serverPort + '/file/' + param
}