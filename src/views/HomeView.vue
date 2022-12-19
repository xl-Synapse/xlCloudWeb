<script setup lang="ts">

import {ref, reactive, watch } from 'vue'
import { useRoute, useRouter, type Router } from 'vue-router'
import "vue3-video-play/dist/style.css"
import {videoPlay} from "vue3-video-play"
import Cookies from 'js-cookie'

import type { FileDTO, PathCache, GlobalReactive} from '@/ts/home-init'
import {initHome, onBack, isPC} from '@/ts/home-init'
import {onClickdownloadFile, onConfirmDownload} from '@/ts/home-file'
import {showPic, swichPic} from '@/ts/home-img'
import type {ImgDTO} from '@/ts/home-img'
import {config} from '@/config/config'
import imgSrc from '@/assets/img.png'


// const pathList = [{path: "dir1"}, {path: "dir11"}]



// const fileList = reactive<FileDTO[]>([])
// const pathList = reactive<PathCache[]>([]) // 已访问路径、


const route = useRoute()
const router = reactive(useRouter())

const el_image_viewer: any = ref(null)
// const fileDownloadDialog = ref(false) // 是否展示文件下载确认对话框、
// const nowFileName = ref("") // 正准备下载的文件名、

const globalReactive = reactive<GlobalReactive>({
  fileDownloadDialog: false,
  nowFileIndex: 0,
  win: window,
  isPC: isPC(window),
  isShowPics: false,
  imgViewer: el_image_viewer,
  imgList: [],
  imgSrcListLazy: [],
  fileList: [],
  pathList: [],
})


let videoWidth: number = document.documentElement.clientWidth * (globalReactive.isPC ? 0.7 : 0.85)
const options = reactive({
  width: videoWidth + "px", //播放器宽度
  height: videoWidth * 9 / 16 + "px", //播放器高度
  color: "#409eff", //主题色
  title: "", //视频名称
  webFullScreen:false,//网页全屏
  speed:true,//是否支持快进快退
  currentTime:0,//跳转到固定播放时间(s)
  muted:false,//静音
  autoPlay: false, //自动播放
  loop:false,//循环播放
  mirror:false,//镜像画面
  control: true, //是否显示控制器
  ligthOff:false,//关灯模式
  volume:1,//默认音量0-1
  preload: "meata",
  src: '', //视频源
  // poster: '', //封面
  speedRate: [1.0,1.25,1.5,2.0], // 可选的播放速度
  controlBtns: [
  "audioTrack",//音轨切换按钮
  "quality",//视频质量切换按钮
  "speedRate",//速率切换按钮
  "volume",//音量
  "setting",//设置
  "pip",//画中画按钮
  "pageFullScreen",//网页全屏按钮
  "fullScreen",//全屏按钮
  ], //显示所有按钮,

})



initHome(route.params.pathMatch as string, options, globalReactive)

// 初始化预览图 list、


watch(router, async (to, from) => {
  initHome(route.path.substring(5), options, globalReactive)
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

</script>

<template>
  <main>
    <!-- <TheWelcome /> -->

    <nav aria-label="xlCloud-nav">
      <el-page-header @back="onBack(router, globalReactive.pathList, options)">
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

    <videoPlay ref="aplayVideo" v-bind="options"  @play="" v-if="options.src != ''"/>
    <!-- <img style="width: 30px; height: 30px" v-if="(isShowPics.value as boolean)" src="../assets/video.png" alt="">  -->

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
      <div v-if="item.type != 3" class="rowDiv" @click="onClickdownloadFile(route, router, index, globalReactive.fileList, options, globalReactive)">
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

  /* div.leftDiv {
    float: left;
  }

  div.rightDiv {
    float: right;
    width: 30%;
  } */

  div.rowDiv {
    border-bottom:1px solid #000 ;
    margin-top: 10px;
  }

  /* div.inlineDiv {
    display: inline-block;
  } */


  div.tableCell {
    /* width: 50%; */
    vertical-align: middle;
    display:table-cell;
  }

</style>