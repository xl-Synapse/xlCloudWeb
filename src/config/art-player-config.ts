export const artPlayerConfig = {
    url: '',
    container: '',
    volume: 1,
    autoMini: true,

    setting: true,
    flip: true, // 翻转
    playbackRate: true, // 倍速
    aspectRatio: true, // 显示长宽比、
    // screenshot: true, // 视频截图、
    hotkey: true,
    pip: true,
    fullscreen: true,
    fullscreenWeb: true,
    playsInline: true, // 移动端
    fastForward: true, // 移动端长按倍速、
    autoOrientation: true, // 移动端网页全屏自动旋转、

    subtitle: {
        url: '',
        type: 'srt',
        encoding: 'utf-8',
        style: {
            color: '#03A9F4',
            'font-size': '40px', // 注意后面需要根据移动端屏幕大小调整、
        },
    },
    
    whitelist: ['*'], // 使得所有端设备都强制使用本播放器、
}