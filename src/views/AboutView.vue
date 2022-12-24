<script setup lang="ts">
import DPlayer from 'dplayer';
import {ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'


onMounted(() => {
  // const dp = new DPlayer({
  //   container: document.getElementById('dplayer'),
  //   video: {
  //       url: 'http://192.168.31.229:8080/video/%E5%BD%B1%E8%A7%86/Yu.Zui.EP01-12.2016.WEB-DL.1080p.x264.AAC-HQC/01.mkv',
  //   },
  // });
})

</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>

  <div id="dplayer" class="dplayer"></div>

  <video-player
    src="http://192.168.31.229:8080/video/%E5%BD%B1%E8%A7%86/Yu.Zui.EP01-12.2016.WEB-DL.1080p.x264.AAC-HQC/01.mkv"
    :loop="true"
    :volume="1"
  />

  <!-- <video
        ref="myVideo"

        src="http://192.168.31.229:8080/video/%E5%BD%B1%E8%A7%86/Yu.Zui.EP01-12.2016.WEB-DL.1080p.x264.AAC-HQC/01.mkv"
        oncontextmenu="return false"
        controlslist="nodownload"
        class="video-box"
      ></video> -->
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

div.dplayer {
  width: 500px;
  height: 440px;
}
</style>
