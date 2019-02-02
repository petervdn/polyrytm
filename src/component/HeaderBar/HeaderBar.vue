<style src="./HeaderBar.scss" module lang="scss"></style>
<script src="./HeaderBar.js"></script>

<template>
  <header :class="$style.header">
    <h1><router-link :to="{ name: RouteNames.HOME }">polyrytm</router-link></h1>
    <div :class="$style.loginState">
      <router-link :to="RouteNames.EDITOR">editor</router-link>
      <router-link
        v-if="!isLoggedIn"
        :to="{ name: RouteNames.LOGIN }">log in</router-link>
      <router-link
        v-if="isLoggedIn"
        :to="{
          name: RouteNames.USER_HOME,
          params: { [Params.USER_ID]: userId },
        }"
      >
        profile
      </router-link>
      <router-link
        v-if="isAdmin"
        :to="{ name: RouteNames.SAMPLES }"
      >samples</router-link
      >
      <a
        v-if="isLoggedIn"
        href="#"
        @click="logout">log out</a>
    </div>
  </header>
</template>
