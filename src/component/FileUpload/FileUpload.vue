<style src="./FileUpload.scss" module lang="scss"></style>
<script src="./FileUpload.js"></script>

<template>
  <div :class="[$style.empty, $style.bar]">

    <div 
      :class="[$style.fill]" 
      :style="{width: progress + '%'}"/>

    <span :class="$style.filestate">{{ file.name }}
      <small v-if="state === fileState.EXISTS">
        (file exists, <a 
          href="#" 
          @click="upload">overwrite</a> or <a 
            href="#" 
            @click="cancel">cancel</a>)
      </small>
      <small v-else>
        ({{ state }})
      </small>
    </span>
  </div>
</template>

