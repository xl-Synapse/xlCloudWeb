import type Artplayer from 'artplayer';
import type { FileDTO, GlobalReactive } from './home-init';
import { apiGetPlayRecord, apiPutPlayRecord } from '@/apis/file-axios';

export const addEvListenerToPlayer = (artPlayer: Artplayer, globalReactive: GlobalReactive) => {
    artPlayer.on('resize', (...args) => {
        artPlayer.subtitle.style(
            'font-size', artPlayer.width / 30 + "px"
        )
    });

    artPlayer.on('play', (...args) => {
        artPlayer.currentTime = globalReactive.nowVideoRecordPosition
    });

    artPlayer.on('fullscreen', (...args) => {
        artPlayer.subtitle.style(
            'font-size', artPlayer.width / 30 + "px"
        )
    });

    artPlayer.on('fullscreenWeb', (...args) => {
        artPlayer.subtitle.style(
            'font-size', artPlayer.width / 30 + "px"
        )
    });
}

export const selectSub = (row: FileDTO, isSub: boolean, globalReactive: GlobalReactive) => {
    // row 中是选中的字幕、
    // 先关闭对话框、并清理数据、
    globalReactive.selectSubDialog = false
    globalReactive.selectSubData = []


    // 播放视频、
    globalReactive.isShowArtPlayer = true
    globalReactive.artPlayer.switchUrl(
      'http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/video/' + globalReactive.fileList[globalReactive.nowFileIndex].path,
      globalReactive.fileList[globalReactive.nowFileIndex].fileName
      )
    
    // 发起播放记录查询、
    apiGetPlayRecord(globalReactive.userId + "&&" + globalReactive.fileList[globalReactive.nowFileIndex].path).then((res) => {
        if (res.status != 200 || !res.data.success) {
            return
        }

        // 调整播放、记录 md5、
        // globalReactive.artPlayer.currentTime = res.data.data.position as number
        globalReactive.nowVideoRecordPosition = res.data.data.position as number
        globalReactive.nowFileMd5 = res.data.data.fileMd5
    })

    // 设置字幕、
    if (!isSub) {
        return
    }

    globalReactive.artPlayer.subtitle.switch('http://' + globalReactive.win.globalConfig.serverUrl + ':' + globalReactive.win.globalConfig.serverPort + '/file/' + row.path, {
      name: row.fileName,
      style: {
          color: 'white',
          'font-size': globalReactive.subtitleSize,
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