import { apiPostSign } from "@/apis/user-axios"
import Cookies from 'js-cookie'
import { h } from 'vue'
import { ElNotification } from 'element-plus'
import md5 from 'js-md5';

export const onSign = (username: string, password: string, router: any) => {
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
                let token = res.data.data as string
                // localStorage.setItem("token", token)
                Cookies.set("token", token)

                router.push("/")
            }
        )
}