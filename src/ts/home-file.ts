import { apiGetDownloadFile, apiGetDownloadFileBrower } from '@/apis/file-axios'
import type { FileDTO, GlobalReactive } from './home-init'
// import {config} from '@/config/config'

export const onClickdownloadFile = (route: any, router: any, index: number, fileList: FileDTO[], options: any, globalReactive: GlobalReactive) => {
    // 只有文件夹和普通文件由我处理、
    if (fileList[index].type > 2) { 
      return
    }
  
    // 如果是文件夹、进入、
    switch (fileList[index].type) {
      case 0:
        router.push( { path: "/all/" + fileList[index].path } ) 
        break
      case 1:
        // downloadFile(fileList, index)
  
        globalReactive.nowFileIndex = index
        globalReactive.fileDownloadDialog = true
        break
      case 2:
        options.src = 'http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/video/' + fileList[index].path
        break
    }
    // console.log(index)
  }
  
export const onConfirmDownload = (fileList: FileDTO[], globalReactive: GlobalReactive) => {
    globalReactive.fileDownloadDialog = false
    switch (globalReactive.win.globalConfig.downloadMethod) {
        case 0:
            apiGetDownloadFileBrower(globalReactive.win, fileList[globalReactive.nowFileIndex].path)
            break
        case 1:
            downloadFile(fileList, globalReactive.nowFileIndex)
            break
    }
}


// 不要改动内容、已经开发完毕、自定义下载、暂无进度条、
export const downloadFile = (fileList: FileDTO[], index: number) => {
    let path = fileList[index].path
    apiGetDownloadFile(path).then(res => {
                const blob = new Blob([res.data]);
                const fileName = res.headers["content-disposition"]?.split(";")[1].split("filename=")[1];
                // const fileName = "test.md"

                const link = document.createElement("a")
                link.download = fileName as string
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.click()
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
    }
    )
}


const onPotplayerPlay = (index: number, fileList: FileDTO[], globalReactive: GlobalReactive) => {
    let result = "potplayer://http://" + globalReactive.win.globalConfig.serverUrl + ":" + globalReactive.win.globalConfig.serverPort + '/video/' + encodeURI(fileList[index].path)
    // result = "potplayer://http://" + config.serverUrl + ":" + config.serverPort + '/video/' + fileList[index].path
    globalReactive.win.location.href = result
  };