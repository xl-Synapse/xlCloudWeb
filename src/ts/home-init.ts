
import { apiGetListFiles, apiGetDownloadFile } from '@/apis/file-axios'
// import {config} from '@/config/config'
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
  selectSubDialog: boolean,
  selectSubData: FileDTO[],

  path: string,
  nowFileIndex: number,
  nowFileMd5: string,
  nowVideoRecordPosition: number,
  win: any,
  isPC: boolean,

  userId: number,

  isShowPics: boolean,
  imgViewer: any,
  imgList: ImgDTO[],
  imgSrcListLazy: string[],
  fileList: FileDTO[],
  pathList: PathCache[],
  artPlayer: any,
  isShowArtPlayer: boolean,
  videoWidth: number,
  subtitleSize: string,
}

export function initHome(path: string, globalReactive: GlobalReactive) {
    // 保存当前 path 到全局、
    globalReactive.path = path

    // 更新 fileList
    apiGetListFiles(path).then((res) => {
        if (res.status != 200 || !res.data.success) {
          console.log("ge")
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

        // 处理图片类型、
        globalReactive.fileList.sort((a, b) => a.type - b.type)
        globalReactive.fileList.forEach((value) => {
          // 更新 imgSrcList
          if (value.type == 3) {
            globalReactive.imgList.push({
              fileName: value.fileName,
              src: 'http://' + (window as any).globalConfig.serverUrl + ':' + (window as any).globalConfig.serverPort + '/file/' + value.path
            })

            // 添加占位 url、
            globalReactive.imgSrcListLazy.push("")
          }
        })
      })
    
    // 更新 pathList
    globalReactive.pathList = []
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

}

export const onBack = (router: any, pathList: PathCache[], globalReactive: GlobalReactive) => {

    if (globalReactive.isShowArtPlayer) {
      globalReactive.isShowArtPlayer = false
      globalReactive.artPlayer.switchUrl('', 'null file')
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


  export const isPCCheck = (win: any) => {
    let flag = win.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    if (flag) {
      return false;
    }
    return true;
  }