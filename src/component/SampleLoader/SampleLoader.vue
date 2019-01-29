<style src="./SampleLoader.scss" module lang="scss"></style>
<script src="./SampleLoader.js"></script>

<template>
  <div
    ref="dropArea"
    :class="[$style.dropArea, isDraggingOverDropArea ? $style.dragOver : '']"
    @drop.prevent.stop="onFileDrop"
    @dragover.prevent.stop="onDragOver"
    @dragleave.prevent.stop="onDragLeave"

  >
    {{ isLoading ? 'loading...' : 'drop sample here to load it' }}
  </div>

</template>

