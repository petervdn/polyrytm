<style src="./SampleManager.scss" module lang="scss"></style>
<script src="./SampleManager.js"></script>

<template>
  <div>
    <h2 v-if="!isPublic">
      your samples
      <small>(used {{ usedSize | formatBytes }} of {{ maxSize | formatBytes }})</small>
    </h2>
    <h2 v-else>
      public samples
      <small>({{ usedSize | formatBytes }})</small>
    </h2>
    <StorageSpace
      v-if="!isPublic"
      :used="usedSize"
      :max="maxSize"
    />

    <p 
      v-if="fileNames.length === 0" 
      :class="$style.empty">Nothing here yet...</p>

    <UserSampleListItem
      v-for="fileName in fileNames"
      ref="listItem"
      :file-name="fileName"
      :user-file="userFiles.find(file => file.name === fileName)"
      :upload-file="uploadFiles.find(file => file.name === fileName)"
      :key="fileName"
      :is-public="isPublic"
      @fileUploaded="onFileUploaded"
      @stateChange="onSampleStateChange"
    />
    <div :class="$style.add">
      <input
        v-show="false"
        ref="fileSelect"
        type="file"
        multiple
        name="sample"
        @change="onFileSelectionChange"
      >

      <button
        v-if="uploadEnabled"
        @click="addSamples"
      >add samples</button>
    </div>
  </div>
</template>

