import { apiGetListFiles, apiGetDownloadFile } from '@/apis/file-axios'
import {config} from '@/config/config'

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
}

export function initHome(path: string, fileList: FileDTO[], pathList: PathCache[], imgSrcList: string[], imgSrcListLazy: string[], options: any) {
    // 更新 fileList
    apiGetListFiles(path).then((res) => {
        if (res.status != 200 || !res.data.success) {
          console.log("ge")
          return
        }

        // 删除原有元素、
        fileList.splice(0, fileList.length)
        imgSrcList.splice(0, imgSrcList.length)
        imgSrcListLazy.splice(0, imgSrcListLazy.length)
        
        // 遍历并加入、
        let tempFileList = (res.data.data as unknown as FileDTO[])
        if (tempFileList == null) {
          return
        }
        tempFileList.forEach((value) => {
          // 更新 imgSrcList
          if (value.type == 3) {
            imgSrcList.push('http://' + config.serverUrl + ':' + config.serverPort + '/file/' + value.path)

            // 添加占位 url、
            imgSrcListLazy.push("")
          }
          fileList.push(value)
        })

        fileList.sort((a, b) => a.type - b.type)
      })
    
    // 更新 pathList
    pathList.splice(0, pathList.length)
    let tempPathList = path.split("/")
    let tempPath: string = "/all"
    for (path of tempPathList) {
      // path = path
      tempPath = tempPath + "/" + path
      console.log("now = " + tempPath)
      pathList.push({
        fullPath: tempPath,
        path: path
      })
    }

    // 更新 video src
    options.src = ""

}

export const onBack = (router: any, pathList: PathCache[]) => {
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
