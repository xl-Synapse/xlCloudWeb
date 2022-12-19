<script setup lang="ts">
import '@/assets/sign/css/util.css'
import '@/assets/sign/css/main.css'
import '@/assets/sign/fonts/font-awesome-4.7.0/css/font-awesome.min.css'

import {onSign} from '@/ts/sign'

import {onMounted, onUnmounted } from 'vue'

let username = ""
let password = ""


onMounted(() => {
  window.addEventListener('keydown', keyDown)
})

const keyDown = (e: any) => {
  //如果是回车则执行登录方法
  if (e.keyCode == 13) {
    onSign(username, password)
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})

</script>

<template>
    <div class="dowebok">
	<div class="container-login100">
		<div class="wrap-login100">
			<div class="login100-pic js-tilt" data-tilt>
				<img src="/src/assets/sign/images/img-01.png" alt="IMG">
			</div>

			<form class="login100-form validate-form">
				<span class="login100-form-title">
					会员登陆
				</span>

				<div class="wrap-input100 validate-input">
					<input class="input100" type="text" name="email" placeholder="邮箱" v-model="username">
					<span class="focus-input100"></span>
					<span class="symbol-input100">
						<i class="fa fa-envelope" aria-hidden="true"></i>
					</span>
				</div>

				<div class="wrap-input100 validate-input">
					<input class="input100" type="password" name="pass" placeholder="密码" v-model="password">
					<span class="focus-input100"></span>
					<span class="symbol-input100">
						<i class="fa fa-lock" aria-hidden="true"></i>
					</span>
				</div>
				
				<div class="container-login100-form-btn">
					<button class="login100-form-btn" type="button" @click="onSign(username, password)">
						登陆
					</button>
				</div>

				<div class="text-center p-t-12">
					<a class="txt2" href="javascript:">
						忘记密码？
					</a>
				</div>

				<div class="text-center p-t-136">
					<a class="txt2" href="https://www.helloweba.net/" target="_blank">
							还没有账号？立即注册
						<i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
					</a>
				</div>
			</form>
		</div>
	</div>
</div>
</template>