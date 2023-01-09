
import { apiGetDownloadFile, apiGetDownloadFileBrower, apiGetListFiles } from '@/apis/file-axios'
import type { FileDTO, GlobalReactive } from './home-init'
import {initHome} from './home-init'
import {Base64} from 'js-base64'
// import {config} from '@/config/config'

export const onClickdownloadFile = (route: any, router: any, index: number, fileList: FileDTO[], globalReactive: GlobalReactive) => {
  // 保存当前操作的文件 index 到全局、
  globalReactive.nowFileIndex = index  
  
  // 只有文件夹和普通文件由我处理、
    if (fileList[index].type > 2) { 
      return
    }
  
    // 如果是文件夹、进入、
    switch (fileList[index].type) {
      case 0:
        initHome(fileList[index].path, globalReactive)
        globalReactive.pathList.push({
              fullPath: fileList[index].path,
              path: fileList[index].fileName
            })
        // router.push( { path: "/all/" + fileList[index].path } ) 
        break
      case 1:
        // downloadFile(fileList, index)
        globalReactive.fileDownloadDialog = true
        break
      case 2:
        // 播放视频、

        // 弹框提醒选择字幕、同时为弹框添加数据、
        globalReactive.selectSubDialog = true
        apiGetListFiles(globalReactive.path + "/sub").then((res) => {
          if (res.status != 200 || !res.data.success) {
            return
          }

          // 为选择字幕添加数据、
          let tempFileList = (res.data.data as unknown as FileDTO[])
          if (tempFileList == null) {
            return
          }
          globalReactive.selectSubData = tempFileList
        })

        break
    }
    // console.log(index)
  }
  
export const onConfirmDownload = (fileList: FileDTO[], globalReactive: GlobalReactive) => {
    globalReactive.fileDownloadDialog = false
    switch (globalReactive.win.globalConfig.downloadMethod) {
        case 0: // 触发浏览器下载、
            apiGetDownloadFileBrower(globalReactive.win, fileList[globalReactive.nowFileIndex].path)
            break
        case 1: // 自定义下载、
            downloadFile(fileList, globalReactive.nowFileIndex)
            break
    }
}


// 不要改动内容、已经开发完毕、自定义下载、暂无进度条、
export const downloadFile = (fileList: FileDTO[], index: number) => {
    let path = fileList[index].path
    apiGetDownloadFile(path.replaceAll('/', '&')).then(res => {
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
