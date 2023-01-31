// 导入axios实例
import httpRequest from '@/request/axios-config'
import {Base64} from 'js-base64'

export function apiGetFileRecord(userId: number, param: string[]) {
	let fileMd5 = ""
	for (const index in param) {
		fileMd5 += (param[index] + ",")
	}
	
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/filerecord/' 
			+ userId + '?fileMd5s=' + fileMd5,
		method: 'get'
	})
}

export function apiGetConvertInfo(param: string) {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/convertinfo/' 
			+ Base64.encode(param, true),
		method: 'get'
	})
}

export function apiGetPlayRecord(userid: number, path: string) {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/playrecord/' 
			+ userid + '&&'
			+ Base64.encode(path, true),
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