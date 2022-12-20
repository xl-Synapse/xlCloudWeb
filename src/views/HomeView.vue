<script setup lang="ts">

import {ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, type Router } from 'vue-router'
import Cookies from 'js-cookie'
import Artplayer from 'artplayer';

import type { FileDTO, PathCache, GlobalReactive} from '@/ts/home-init'
import {initHome, onBack, isPCCheck} from '@/ts/home-init'
import {onClickdownloadFile, onConfirmDownload} from '@/ts/home-file'
import {showPic, swichPic} from '@/ts/home-img'
import {artPlayerConfig} from '@/config/art-player-config'
import {addEvListenerToPlayer, selectSub, putPlayRecord} from '@/ts/home-video'



const route = useRoute()
const router = reactive(useRouter())

const el_image_viewer: any = ref(null) // Vue 自己注入依赖、
const artRef: any = ref(null)
const timer = ref(0) // 定时提交播放记录、


let isPC: boolean = isPCCheck(window)
let videoWidth = document.documentElement.clientWidth * (isPC ? 0.7 : 0.85)
let subtitleSize = videoWidth / 30 + "px"

const globalReactive = reactive<GlobalReactive>({
  fileDownloadDialog: false,
  selectSubDialog: false,
  selectSubData: [],

  path: '',
  nowFileIndex: 0,
  nowFileMd5: "",
  nowVideoRecordPosition: 0,
  win: window,
  isPC: isPC,

  userId: Cookies.get("userId"),

  isShowPics: false,
  imgViewer: el_image_viewer,
  imgList: [],
  imgSrcListLazy: [],
  fileList: [],
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
  globalReactive.artPlayer = new Artplayer(artPlayerConfig)
  addEvListenerToPlayer(globalReactive.artPlayer, globalReactive)

  // 注册定时器、定时提交播放记录、防止用户直接嘎了浏览器、特别是手机端、
  timer.value = window.setInterval(function logname() {
                // 其他定时执行的方法
                putPlayRecord(globalReactive)
            }, 10000);
})

onUnmounted(() => {
  if (globalReactive.artPlayer && globalReactive.artPlayer.destroy) {
    globalReactive.artPlayer.destroy(false)
  }

  // 销毁定时器、
  window.clearInterval(timer.value);
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
  selectSub(row, true, globalReactive)
}

const onNoSub = (ev: any) => {
  selectSub(null as unknown as FileDTO, false, globalReactive)
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
          <span>{{item.fileName}}</span>
          
        </div>
        
        <!-- <div class="tableCell" v-if="item.type == 2">
          <el-button type="primary" @click="onPotplayerPlay(index)">本地播放</el-button>
        </div> -->
        
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