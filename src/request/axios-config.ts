import axios from 'axios'
import Cookies from 'js-cookie'
import { getCurrentInstance } from "vue";
import router from '@/router';

// 创建一个 axios 实例
const service = axios.create({
	baseURL: '/api', // 所有的请求地址前缀部分
	timeout: 60000, // 请求超时时间毫秒
	withCredentials: true, // 异步请求携带cookie
	headers: {
		// 设置后端需要的传参类型
		'Content-Type': 'application/json',
		'token': 'your token',
		'X-Requested-With': 'XMLHttpRequest',
	},
})

// 添加请求拦截器
service.interceptors.request.use(
	function (config: any) {
		// 在发送请求前增加 token、
		let token = Cookies.get("token");
		if (token) {
			config.headers.token = token;
		}
		return config
	},
	function (error) {
		// 对请求错误做些什么
		console.log(error)
		return Promise.reject(error)
	}
)

// 添加响应拦截器
service.interceptors.response.use(
	function (response) {
		// console.log(response)
		// 2xx 范围内的状态码都会触发该函数。
		// 对响应数据做点什么
		// dataAxios 是 axios 返回数据中的 data
		const dataAxios = response.data
		// 这个状态码是和后端约定的
		const code = dataAxios.reset

		// 检查后端 token 是否过期、
		if (response.status == 200 && response.data.code == 20003) {
			Cookies.remove("token")
			router.push("/sign")
			// let currentVue = getCurrentInstance();
			// console.log(currentVue)
			// currentVue?.proxy?.$router.push("/")
		}
		return response
	},
	function (error) {
		// 超出 2xx 范围的状态码都会触发该函数。
		// 对响应错误做点什么
		console.log(error)
		return Promise.reject(error)
	}
)

export default service