import { apiGetListFiles, apiGetDownloadFile } from '@/apis/file-axios'
import {config} from '@/config/config'
import type {ImgDTO} from '@/ts/home-img'

export interface FileDTO {
    path: string,
    fileName: string,
    type: number
  }

export interface PathCache {
  fullPath: string,
  path: string
}

export interface GlobalReactive {
  fileDownloadDialog: boolean,
  nowFileIndex: number,
  win: any,
  isPC: boolean,
  isShowPics: boolean,
  imgViewer: any,
  imgList: ImgDTO[],
  imgSrcListLazy: string[],
  fileList: FileDTO[],
  pathList: PathCache[],
}

export function initHome(path: string, options: any, globalReactive: GlobalReactive) {
    // 更新 fileList
    apiGetListFiles(path).then((res) => {
        if (res.status != 200 || !res.data.success) {
          console.log("ge")
          return
        }

        // 删除原有元素、
        globalReactive.fileList.splice(0, globalReactive.fileList.length)
        globalReactive.imgList.splice(0, globalReactive.imgList.length)
        globalReactive.imgSrcListLazy.splice(0, globalReactive.imgSrcListLazy.length)
        
        // 遍历并加入、
        let tempFileList = (res.data.data as unknown as FileDTO[])
        if (tempFileList == null) {
          return
        }
        tempFileList.forEach((value) => {
          // 更新 imgSrcList
          if (value.type == 3) {
            globalReactive.imgList.push({
              fileName: value.fileName,
              src: 'http://' + config.serverUrl + ':' + config.serverPort + '/file/' + value.path
            })

            // 添加占位 url、
            globalReactive.imgSrcListLazy.push("")
          }
          globalReactive.fileList.push(value)
        })

        globalReactive.fileList.sort((a, b) => a.type - b.type)
      })
    
    // 更新 pathList
    globalReactive.pathList.splice(0, globalReactive.pathList.length)
    let tempPathList = path.split("/")
    let tempPath: string = "/all"
    for (path of tempPathList) {
      // path = path
      tempPath = tempPath + "/" + path
      console.log("now = " + tempPath)
      globalReactive.pathList.push({
        fullPath: tempPath,
        path: path
      })
    }

    // 更新 video src
    options.src = ""

}

export const onBack = (router: any, pathList: PathCache[], options: any) => {
    // 如果正在播放视频、关闭视频不回退、
    if (options.src != '') {
      options.src = ''
      return
    }


    // notify('Back')
    if (pathList.length < 1) {
        return
    }

    if (pathList.length == 1) {
      router.push( { path: "/all/"} )
      return
    }
   
    let backPath = pathList[pathList.length - 2].fullPath
    // console.log("onback" + backPath)
    router.push( { path: backPath} )
    return
  }


  export const isPC = (win: any) => {
    let flag = win.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    if (flag) {
      return false;
    }
    return true;
  }