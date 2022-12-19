// 导入axios实例
import httpRequest from '@/request/axios-config'

import {config} from '@/config/config'

export const apiPostSign = (param: {}) => {
	return httpRequest({
		url: 'http://' + config.serverUrl + ':' + config.serverPort + '/user-sign',
		method: 'post',
		data: param
	})
} 