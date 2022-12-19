import type { GlobalReactive } from "./home-init";

export interface ImgDTO {
    fileName: string,
    src: string,
} 

export const showPic = (index: number, globalReactive: GlobalReactive) => {
    console.log("onshow" + index);
    updateImgSrcListLazy(index, globalReactive)
    globalReactive.imgViewer.setActiveItem(index)
    globalReactive.isShowPics = true;
  }
  
export const swichPic = (index: number, globalReactive: GlobalReactive) => {
    console.log(index);
    updateImgSrcListLazy(index, globalReactive)
    globalReactive.imgViewer.setActiveItem(index)
    // el_image_viewer.value.setActiveItem(index)
  };
  
export const updateImgSrcListLazy = (index: number, globalReactive: GlobalReactive) => {
    // 判断是否需要更新占位 url、
    if (globalReactive.imgSrcListLazy[index] != ""){
      // 不需要更新、
      return
    }
    // 需要更新、
    globalReactive.imgSrcListLazy[index] = globalReactive.imgList[index].src
  }
