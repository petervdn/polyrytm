<style src="./LoginPage.scss" module lang="scss"></style>
<script src="./LoginPage.js"></script>

<template>
  <div>
    <div v-if="!user">
      <input 
        id="email" 
        v-model="email" 
        type="text" 
        placeholder="email">
      <input 
        id="password" 
        v-model="password" 
        type="password" 
        placeholder="password">
      <button @click="login">login</button>
      <button @click="signup">signup</button>
    </div>
    <p :class="$style.error">{{ errorMessage }}</p>
  </div>
</template>

