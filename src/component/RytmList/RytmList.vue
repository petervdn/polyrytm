<style src="./RytmList.scss" module lang="scss"></style>
<script src="./RytmList.js"></script>

<template>
  <ul>
    <!-- todo rytm,id ? are ryms in an object? why? -->
    <li
      v-for="(rytm, id) in rytms"
      :key="id"
    >
      <router-link :to="{ name: RouteNames.PLAY, params: { [Params.RYTM_ID]: id } }">{{
        rytm.title
      }}</router-link>
      <router-link
        v-if="rytm.user"
        :to="{ name: RouteNames.USER, params: { [Params.USER_ID]: rytm.user.id } }"
      >(by {{ rytm.user.name }})</router-link
      >
    </li>
  </ul>
</template>
