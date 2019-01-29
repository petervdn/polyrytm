<style src="./HeaderBar.scss" module lang="scss"></style>
<script src="./HeaderBar.js"></script>

<template>
  <header :class="$style.header">
    <h1><router-link :to="{ name: RouteNames.HOME }">polyrytm</router-link></h1>
    <div :class="$style.loginState">
      <router-link :to="RouteNames.EDITOR">editor</router-link>
      <router-link 
        v-if="!user" 
        :to="{ name: RouteNames.LOGIN }">log in</router-link>
      <router-link
        v-if="user"
        :to="{
          name: PageNames.USER_HOME,
          params: { [Params.USER_ID]: user.uid },
        }"
      >
        profile
      </router-link>
      <router-link 
        v-if="user && user.isAdmin" 
        :to="{ name: RouteNames.SAMPLES }"
      >samples</router-link
      >
      <a 
        v-if="user" 
        href="#" 
        @click="logout">log out</a>
    </div>
  </header>
</template>
