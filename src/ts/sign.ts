import { apiPostSign } from "@/apis/user-axios"
import Cookies from 'js-cookie'
import { h } from 'vue'
import { ElNotification } from 'element-plus'
import md5 from 'js-md5';
import router from '@/router'

export const onSign = (username: string, password: string) => {
    apiPostSign({username: username, password: md5(password)})
        .then(
            (res: any) => {
                if (res.status != '200' || res.data.code != 20001){
                    ElNotification({
                        title: 'Error',
                        message: 'Wrong user or password!',
                        type: 'error',
                      })
                    return
                }

                // 登录成功、存储 token、跳转页面、
                // localStorage.setItem("token", token)
                Cookies.set("token", res.data.data.token, { expires: 365 })
                Cookies.set("userId", res.data.data.userId, { expires: 365 })

                router.push("/")
            }
        )
}