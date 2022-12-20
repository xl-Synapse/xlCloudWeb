// 导入axios实例
import httpRequest from '@/request/axios-config'

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
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/files/' + param,
		method: 'get'
	})
}

export function apiGetDownloadFile(param: string) {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/file/' + param,
		method: 'get',
		responseType:'blob'
	})
}

export function apiGetDownloadFileBrower(win: any, param: string) {
	win.location.href = 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/file/' + param
}

export function apiGetPlayRecord(param: string) {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/playrecord/' + param.replaceAll("/", "&"),
		method: 'get'
	})
}

export function apiPutPlayRecord(data: {}) {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/playrecord/',
		method: 'put',
		data: data,
	})
}