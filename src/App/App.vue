<style src="./App.scss" module lang="scss"></style>
<script src="./App.js"></script>

<template>
  <div>
    <notivuecation :class="$style.notification" />
    <HeaderBar />
    <div :class="[$style.flexer, isInEditor ? $style.editor : null]">
      <div
        :class="$style.discView"
        :style="{backgroundColor: activeTheme.mainColor.hex}">
        <DiscView />
        <MainControls />
      </div>
      <div :class="$style.routerContent">
        <router-view/>
      </div>
      <Notification />
    </div>
  </div>
</template>
