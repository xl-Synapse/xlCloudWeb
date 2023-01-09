
import { apiGetListFiles, apiGetDownloadFile } from '@/apis/file-axios'
import {apiGetFileRecord} from '@/apis/video-axios'
import Cookies from 'js-cookie'
import {Base64} from 'js-base64'
// import {config} from '@/config/config'
import type {ImgDTO} from '@/ts/home-img'
import path from 'path'

export interface FileDTO {
    path: string,
    fileName: string,
    type: number
    fileMd5: string,
  }

export interface PathCache {
  fullPath: string,
  path: string
}

export interface GlobalReactive {
  fileDownloadDialog: boolean,
  selectSubDialog: boolean,
  selectSubData: FileDTO[],

  path: string,
  nowFileIndex: number,
  nowFileMd5: string,
  nowVideoRecordPosition: number,
  timer: number,

  win: any,
  isPC: boolean,

  userId: number,

  isShowPics: boolean,
  imgViewer: any,
  imgList: ImgDTO[],
  imgSrcListLazy: string[],
  fileList: FileDTO[],
  playedList: string[],
  pathList: PathCache[],
  
  artPlayer: any,
  isShowArtPlayer: boolean,
  videoWidth: number,
  subtitleSize: number,
}

export function initHome(path: string, globalReactive: GlobalReactive) {
    // 保存当前 path 到全局、
    globalReactive.path = path

    // 更新 fileList
    apiGetListFiles(path).then((res) => {
        if (res.status != 200 || !res.data.success) {
          return
        }

        // 删除原有元素、
        globalReactive.fileList = []
        globalReactive.imgList = []
        globalReactive.imgSrcListLazy = []
        
        
        // 遍历并加入、
        globalReactive.fileList = (res.data.data as unknown as FileDTO[])
        if (globalReactive.fileList == null) {
          return
        }

        let videoList: string[] = []
        // 处理特殊类型、
        globalReactive.fileList.sort((a, b) => a.type - b.type)
        globalReactive.fileList.forEach((value) => {
          // 更新 imgSrcList
          if (value.type == 3) {
            globalReactive.imgList.push({
              fileName: value.fileName,
              src: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/file/' + Base64.encode(value.path, true)
            })

            // 添加占位 url、
            globalReactive.imgSrcListLazy.push("")
          }

          // 处理已播放过的视频、
          
          if (value.type == 2) {
            videoList.push(value.fileMd5)
          }
        })

        // 查询视频是否播放过、
        if (videoList.length > 0)
        apiGetFileRecord(globalReactive.userId, videoList).then((res) => {
          if (res.status != 200) {
            return
          }

          globalReactive.playedList = res.data.data as unknown as string[]
        })
      })
    
    // // 更新 pathList
    // globalReactive.pathList = []
    // let tempPathList = path.split("/")
    // let tempPath: string = "/all"
    // for (path of tempPathList) {
    //   // path = path
    //   tempPath = tempPath + "/" + path
    //   console.log("now = " + tempPath)
    //   globalReactive.pathList.push({
    //     fullPath: tempPath,
    //     path: path
    //   })
    // }

}

export const onBack = (router: any, pathList: PathCache[], globalReactive: GlobalReactive) => {

    if (globalReactive.isShowArtPlayer) {
      // 销毁播放器实例、
      globalReactive.isShowArtPlayer = false
      if (globalReactive.artPlayer && globalReactive.artPlayer.destroy) {
        globalReactive.artPlayer.pause()
        globalReactive.artPlayer.destroy(false)
      }
      return
    }


    // notify('Back')
    if (pathList.length < 1) {
        return
    }

   
    pathList.splice(pathList.length - 1, 1)
    let backPath = (pathList.length >= 1) ? pathList[pathList.length - 1].fullPath : ""
    initHome(backPath, globalReactive)

    return
  }

  export const isPCCheck = (win: any) => {
    let flag = win.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    if (flag) {
      return false;
    }
    return true;
  }

  export const setServerInfo = (serverUrl: string, serverPort: number) => {
    (window as any).globalConfig.serverUrl = serverUrl;
    (window as any).globalConfig.serverPort = serverPort;

    Cookies.set("serverUrl", serverUrl)
    Cookies.set("serverPort", serverPort)
  }

  export const getServerInfo = () => {
    
    let serverUrl = Cookies.get("serverUrl")
    let serverPort: number = Cookies.get("serverPort")

    if (!serverUrl || !serverPort) {
      return
    }

    (window as any).globalConfig.serverUrl = serverUrl;
    (window as any).globalConfig.serverPort = serverPort;
  }