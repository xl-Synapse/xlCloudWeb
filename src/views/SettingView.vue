<script lang="ts" setup>
import {getServerInfo, setServerInfo} from '@/ts/home-init'
import {ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, type Router } from 'vue-router'

getServerInfo()

const router = useRouter()

const serverUrl = ref((window as any).globalConfig.serverUrl)
const serverPort = ref((window as any).globalConfig.serverPort)

const onSetServer = () => {
    setServerInfo(serverUrl.value, serverPort.value)
}

const onToIndex = () => {
  router.push("/")
}

</script>

<template>
    <div class="about">
      <h1>This is an setting page</h1>
    </div>

    <el-input v-model="serverUrl" placeholder="server url" />
    <el-input v-model="serverPort" placeholder="server port" />
    <el-button type="primary" @click="onSetServer">Set server</el-button>
    <el-button type="primary" @click="onToIndex">To index</el-button>

</template>

<style>
</style>