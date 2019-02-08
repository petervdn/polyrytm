<style src="./EditorPage.scss" module lang="scss"></style>
<script src="./EditorPage.js"></script>

<template>
  <div :class="$style.wrapper">
    <ul :class="$style.menu">
      <li
        v-for="item in menuItems"
        :key="item.id"
        :class="{[$style.active]: activeMenuItem === item.id}"
        @click="setActiveMenuItem(item)"
      >
        {{ item.id }}
      </li>
    </ul>
    <DiscControls v-show="activeMenuItem === MenuItems.DISC" />
    <RingControls v-show="activeMenuItem === MenuItems.RING" />
    <!--<SampleControls v-show="activeMenuItemId === 'sample'" />-->
    <ThemeControls v-show="activeMenuItem === MenuItems.THEME" />
    <ShareControls v-show="activeMenuItem === MenuItems.SHARE" />
    <MixerControls v-show="activeMenuItem === MenuItems.MIXER" />
  </div>
</template>

