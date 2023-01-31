import Artplayer from 'artplayer';
import type { FileDTO, GlobalReactive } from './home-init';
import { apiGetConvertInfo, apiGetPlayRecord, apiPutPlayRecord } from '@/apis/video-axios';
import { apiGetDownloadFileBrower } from '@/apis/file-axios';
import {Base64} from 'js-base64'
import useClipboard from 'vue-clipboard3'

export const addEvListenerToPlayer = (globalReactive: GlobalReactive, setSubCallBack: Function) => {
    let artPlayer = globalReactive.artPlayer as Artplayer
    artPlayer.on('resize', (...args) => {

        let style = {
            // color: 'withe',
            'font-size': artPlayer.width / 30 + "px",
        }
        artPlayer.subtitle.switch(artPlayer.subtitle.url, {
            name: '',
            style: style,
        });
    })

    artPlayer.on('ready', () => {
        // 发起播放记录查询、
        apiGetPlayRecord(globalReactive.userId, globalReactive.fileList[globalReactive.nowFileIndex].path).then((res) => {
            if (res.status != 200 || !res.data.success) {
                return
            }

            // 调整播放（在play中处理）、记录 md5、
            // globalReactive.artPlayer.currentTime = res.data.data.position as number
            globalReactive.nowVideoRecordPosition = res.data.data.position as number
            globalReactive.nowFileMd5 = res.data.data.fileMd5
        })
    });

    artPlayer.on('play', (...args) => {
        if (artPlayer.currentTime < 5) {
            // 只有在刚开始播放的时候会改变进度、（本来应该在 ready 中改变进度、但是导致pc端 mkv 无法拖动进度条、）
            artPlayer.currentTime = globalReactive.nowVideoRecordPosition

            // 设置 sub、
            // 字幕必须在 播放 url 之后加载、否则可能出现字体大小不正确的问题、
            setSubCallBack()
        }


        // 恢复定时器、定时提交播放记录、防止用户直接嘎了浏览器、特别是手机端、
        globalReactive.timer = window.setInterval(function logname() {
            // 其他定时执行的方法
            putPlayRecord(globalReactive)
        }, 2000);
    })

    artPlayer.on('pause', (...args) => {
        // 保存当前位置、防止重新播放被跳转、
        globalReactive.nowVideoRecordPosition = artPlayer.currentTime

        // 停止提交播放记录、
        // 销毁定时器、
        window.clearInterval(globalReactive.timer);
    });
}

export const playVideoAndSub = (row: FileDTO, artPlayerConfig: any, globalReactive: GlobalReactive, setSubCallBack: Function) => {
    // row 中是选中的字幕、
    // 先关闭对话框、并清理数据、
    globalReactive.selectSubDialog = false
    globalReactive.selectSubData = []

    // 重新创建播放器实例、
    if (globalReactive.artPlayer && globalReactive.artPlayer.destroy) {
        globalReactive.artPlayer.destroy(false)
      }
    
    globalReactive.artPlayer = new Artplayer(artPlayerConfig)
    addEvListenerToPlayer(globalReactive, setSubCallBack)



    // 不需要触发查询转换记录、
    if (globalReactive.isPC || !globalReactive.fileList[globalReactive.nowFileIndex].fileName.toLowerCase().endsWith('.mkv')) {
        playVideo(
            'http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/video/' 
                + Base64.encode(globalReactive.fileList[globalReactive.nowFileIndex].path, true),
            globalReactive.fileList[globalReactive.nowFileIndex].fileName,
            globalReactive
        )
        return
    }


    // 移动端、需要查询转换记录、
    apiGetConvertInfo(globalReactive.fileList[globalReactive.nowFileIndex].path).then((res) => {
        if (res.status != 200 || !res.data.success) {
            // 没有转换记录、
            playVideo(
                'http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/video/' 
                    + Base64.encode(globalReactive.fileList[globalReactive.nowFileIndex].path, true),
                globalReactive.fileList[globalReactive.nowFileIndex].fileName,
                globalReactive
            )
            return
        }

        // 已经转换完成、
        playVideo(
            'http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/video/' 
                + Base64.encode('.cache/' + res.data.data + '.mp4', true),
            globalReactive.fileList[globalReactive.nowFileIndex].fileName,
            globalReactive
        )
    })

}

const playVideo = (url: string, fileName: string, globalReactive: GlobalReactive) => {
    globalReactive.isShowArtPlayer = true
    globalReactive.artPlayer.switchUrl(url, fileName)
}

export const setSub = (url: string, fileName: string, globalReactive: GlobalReactive) => {
    console.log(url)
    // 有字幕、
    globalReactive.artPlayer.subtitle.show = true
    globalReactive.artPlayer.subtitle.switch(url, {
      name: fileName,
      style: {
          color: 'white',
          'font-size': globalReactive.subtitleSize + 'px',
      },
    });
}

export const putPlayRecord = (globalReactive: GlobalReactive) => {
    if (globalReactive.artPlayer.currentTime <= 30) {
        // 该文件没有播放 30s 以上、没有保存记录的必要、
        return
    }
    globalReactive.nowVideoRecordPosition = globalReactive.artPlayer.currentTime

    apiPutPlayRecord({
        userId: globalReactive.userId,
        fileMd5: globalReactive.nowFileMd5,
        position: globalReactive.artPlayer.currentTime 
    }).then((res) => {
        console.log("Submit play record success.")
    })
}

export const onPotplayerPlay = (index: number, fileList: FileDTO[]) => {
    let win = window as any;
    let result = "potplayer://http://" + win.globalConfig.serverUrl + ":" + win.globalConfig.serverPort + '/video/' 
        + Base64.encode(fileList[index].path, true)

    win.location.href = result
}

export const onDownloadFile = (index: number, fileList: FileDTO[]) => {
    apiGetDownloadFileBrower(window, fileList[index].path)
}

export const copyInfo = async (info: string) => {
    const { toClipboard } = useClipboard()
    await toClipboard(info)
}

export const copyUrl = async (index: number, fileList: FileDTO[]) => {
    let win = window as any;
    let result = "http://" + win.globalConfig.serverUrl + ":" + win.globalConfig.serverPort + '/video/' 
        + Base64.encode(fileList[index].path, true)
    await copyInfo(result)
}