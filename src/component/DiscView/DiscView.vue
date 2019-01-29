<style src="./DiscView.scss" module lang="scss"></style>
<script src="./DiscView.js"></script>

<template>
  <div
    ref="wrapper"
    :class="[$style['disc-view'], isInEditor ? $style.editor : '']">
    <div
      v-for="(disc, index) in discs"
      :key="index"
      :style="{
        position: 'absolute',
        width: (sizeData.squareSize) + 'px',
        height: (sizeData.squareSize) + 'px',
        top: verticalTop + 'px',
        left: (leftOffset + (index * sizeData.squareSize * scale)) + 'px',
        transform: `scale(${scale},${scale})`
      }"
    >
      <DiscViewItem
        :key="index"
        :index="index"
        :disc="disc"
        :size-data="sizeData"
      />
    </div>
  </div>
</template>

±
