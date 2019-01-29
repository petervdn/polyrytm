<style src="./StorageSpace.scss" module lang="scss"></style>
<script src="./StorageSpace.js"></script>

<template>
  <div :class="$style.wrap">
    <div 
      :class="$style.used" 
      :style="{width: animatedPercentage + '%'}"/>
  </div>
</template>

