<style src="./ThemeControls.scss" module lang="scss"></style>
<script src="./ThemeControls.js"></script>

<template>
  <div class="controls-wrapper">
    <p class="info">
      Change the appearance of your creation.
    </p>
    <label>theme: </label>
    <select v-model="localThemeIndex" >
      <option
        v-for="(theme, index) in themes"
        :key="theme.name"
        :value="index">
        {{ theme.name }}
      </option>
    </select>
  </div>
</template>


