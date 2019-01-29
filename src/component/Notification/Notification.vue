<style src="./Notification.scss" module lang="scss"></style>
<script src="./Notification.js"></script>

<template>
  <div 
    v-if="notification" 
    :class="$style.notificationLayer">
    <div :class="$style.notification">
      <h2 v-if="notification.title">
        {{ notification.title }}
      </h2>
      <p v-if="notification.message">
        {{ notification.message }}
      </p>
      <div 
        v-if="typeof notification.progress !== 'undefined'" 
        :class="$style.progressWrap">
        <div
          :class="$style.progress"
          :style="{ width: (animatedProgress * 100) + '%' }"/>
      </div>

      <button
        v-if="notification.okButton"
        @click="onOkButtonClick"
      >
        {{ notification.okButton }}
      </button>
      <button
        v-if="notification.cancelButton"
        @click="onCancelButtonClick"
      >
        {{ notification.cancelButton }}
      </button>
    </div>
  </div>
</template>

