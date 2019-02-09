<style src="./DiscSelector.scss" module lang="scss"></style>
<script src="./DiscSelector.js"></script>

<template>
  <ul class="selector-list">
    <li
      v-for="(disc, index) in discs"
      :class="{ active: disc === selectedDisc }"
      :key="index"
      @click="setSelection(disc === selectedDisc && discs.length > 1 ? null : disc)"
    >
      {{ index + 1 }}
    </li>
    <li @click="onAddDiscClick">+</li>
  </ul>
</template>

