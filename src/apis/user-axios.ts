// 导入axios实例
import httpRequest from '@/request/axios-config'

// import {config} from '@/config/config'

export const apiPostSign = (param: {}) => {
	return httpRequest({
		url: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/user-sign',
		method: 'post',
		data: param
	})
} 