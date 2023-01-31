<script setup lang="ts">

import {ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, type Router } from 'vue-router'
import Cookies from 'js-cookie'
import {Base64} from 'js-base64'
import Artplayer from 'artplayer';

import type { FileDTO, PathCache, GlobalReactive} from '@/ts/home-init'
import {initHome, onBack, isPCCheck, getServerInfo} from '@/ts/home-init'
import {onClickdownloadFile, onConfirmDownload} from '@/ts/home-file'
import {showPic, swichPic} from '@/ts/home-img'
import {artPlayerConfig} from '@/config/art-player-config'
import {addEvListenerToPlayer, playVideoAndSub, setSub, putPlayRecord, onPotplayerPlay, onDownloadFile, copyUrl} from '@/ts/home-video'

getServerInfo() // 刷新当前server配置、

const route = useRoute()
const router = reactive(useRouter())

const el_image_viewer: any = ref(null) // Vue 自己注入依赖、
const artRef: any = ref(null)


let isPC: boolean = isPCCheck(window)
let videoWidth = document.documentElement.clientWidth * (isPC ? 0.7 : 0.85)
let subtitleSize = videoWidth / 30

const globalReactive = reactive<GlobalReactive>({
  fileDownloadDialog: false,
  selectSubDialog: false,
  selectSubData: [],

  path: '',
  nowFileIndex: 0,
  nowFileMd5: "",
  nowVideoRecordPosition: 0,
  timer: 0, // 提交播放记录的定时器 index、

  win: window,
  isPC: isPC,

  userId: Cookies.get("userId"),

  isShowPics: false,
  imgViewer: el_image_viewer,
  imgList: [],
  imgSrcListLazy: [],
  fileList: [],
  playedList: [],
  pathList: [],
  
  artPlayer: null,
  isShowArtPlayer: false,
  videoWidth: videoWidth,
  subtitleSize: subtitleSize,
})






initHome(route.params.pathMatch as string, globalReactive)

// 初始化预览图 list、


watch(router, async (to, from) => {
  initHome(route.path.substring(5), globalReactive)
})

onMounted(() => {
  artPlayerConfig.container = artRef.value
  
  let win = window as any
  win.globalReactive = globalReactive

  // globalReactive.artPlayer = new Artplayer(artPlayerConfig)
  // addEvListenerToPlayer(globalReactive)
})

onUnmounted(() => {
  if (globalReactive.artPlayer && globalReactive.artPlayer.destroy) {
    globalReactive.artPlayer.destroy(false)
  }

  // 销毁定时器、
  window.clearInterval(globalReactive.timer);
})

// img-viewer 由于无法改传入参数、只能放在这里、
const onShowPic = (index: number) => {
  showPic(index, globalReactive)
}

const onSwichPic = (index: number) => {
  swichPic(index, globalReactive)
}

const onClose = () => {
    globalReactive.isShowPics = false;
    console.log("close");
  };

// el-table 无法改参数、只能放在这里、
const onSelectSub = (row: FileDTO, column: any, event: any) => {
  playVideoAndSub(row, artPlayerConfig, globalReactive, () => {
    setSub(
      'http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/file/' 
        + Base64.encode(row.path), 
      row.fileName, 
      globalReactive
    )
  })

}

const onNoSub = (ev: any) => {
  playVideoAndSub(null as unknown as FileDTO, artPlayerConfig, globalReactive, () => {
    globalReactive.artPlayer.subtitle.show = false
  })
}

</script>

<template>
  <main>
    <!-- <TheWelcome /> -->

    <nav aria-label="xlCloud-nav">
      <el-page-header @back="onBack(router, globalReactive.pathList, globalReactive)">
        <template #breadcrumb>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              /
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: item.fullPath}" :key="index" v-for="(item, index) in globalReactive.pathList">
              {{item.path}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </template>

      </el-page-header>
    </nav>

    <div class="artPlayerDiv" ref="artRef" v-show="globalReactive.artPlayer && globalReactive.isShowArtPlayer"></div>

    <div v-show="globalReactive.isShowPics">
      <el-image-viewer
        ref="el_image_viewer"
        @close="onClose"
        @switch="onSwichPic"
        :url-list="globalReactive.imgSrcListLazy"
        :initial-index="0"
        :hide-on-click-modal="true"
      />
    </div>

    <el-dialog v-model="globalReactive.fileDownloadDialog" title="Tips" width="30%" draggable>
      <span>确认下载 {{globalReactive.fileList[globalReactive.nowFileIndex].fileName}}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="globalReactive.fileDownloadDialog = false">Cancel</el-button>
          <el-button type="primary" @click="onConfirmDownload(globalReactive.fileList, globalReactive)">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 选择字幕对话框 -->
  <el-dialog v-model="globalReactive.selectSubDialog" title="Select an subtitle.">
    <el-table :data="globalReactive.selectSubData" @row-click="onSelectSub">
      <el-table-column property="fileName" label="FileName" />
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="globalReactive.selectSubDialog = false">Cancel</el-button>
        <el-button type="primary" @click="onNoSub">
          No thanks
        </el-button>
      </div>
    </template>
  </el-dialog>


<!-- 真实内容 -->

    <div v-for="(item, index) in globalReactive.imgList">
      <div @click="onShowPic(index)" class="rowDiv">
        <div class="tableCell">
          <img style="width: 30px; height: 30px" src="../assets/img.png" alt=""> 
        </div>
        <div class="tableCell">
          <span>{{item.fileName}}</span>
        </div>
        
      </div>
    </div>
    <div v-for="(item, index) in globalReactive.fileList">
      <div v-if="item.type != 3" class="rowDiv" @click="onClickdownloadFile(route, router, index, globalReactive.fileList, globalReactive)">
        <div class="tableCell" >
          <img style="width: 30px; height: 30px" v-if="item.type == 0" src="../assets/dir.png" alt=""> 
          <img style="width: 30px; height: 30px" v-if="item.type == 1" src="../assets/file.png" alt=""> 
          <img style="width: 30px; height: 30px" v-if="item.type == 2" src="../assets/video.png" alt=""> 
          <span :style="{'color': (item.type == 2 && globalReactive.playedList && globalReactive.playedList.includes(item.fileMd5)) ? 'purple' : 'black'}">{{item.fileName}}</span>
          
        </div>

        <div class="tableCell" v-if="item.type == 2 && globalReactive.isPC">
          <el-button type="primary" @click.stop="onPotplayerPlay(index, globalReactive.fileList)">本地播放</el-button>
        </div>

        <div class="tableCell" v-if="item.type == 2 && globalReactive.isPC">
          <el-button type="primary" @click.stop="onDownloadFile(index, globalReactive.fileList)">直接下载</el-button>
        </div>

        <div class="tableCell" v-if="item.type == 2 && !globalReactive.isPC">
          <el-button type="primary" @click.stop="copyUrl(index, globalReactive.fileList)">Copy</el-button>
        </div>
        
      </div>
      
    </div>
  </main>
</template>

<style>
  .demo-image__error .image-slot {
    font-size: 30px;
  }
  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }
  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }

  nav {
    margin-top: 20px;
  }

  img {
    vertical-align: middle;
  }

  span {
    vertical-align: middle;
  }

  div.rowDiv {
    border-bottom:1px solid #000 ;
    margin-top: 10px;
  }

  div.tableCell {
    vertical-align: middle;
    display:table-cell;
  }

  div.artPlayerDiv {
    width: v-bind('globalReactive.videoWidth + "px"');
    height: v-bind('globalReactive.videoWidth * 9 / 16 + "px"');
  }

</style>