<style src="./Profile.scss" module lang="scss"></style>
<script src="./Profile.js"></script>

<template>
  <div>
    <div v-if="!loadComplete">
      <p>getting user info...</p>
    </div>
    <div v-else>
      <div :class="$style.profile"/>
      <div v-if="user">
        <div :class="$style.header">
          <img 
            :class="$style.profile" 
            src="https://scontent-ams3-1.xx.fbcdn.net/v/t31.0-8/18121775_1042292445915432_8054261554952166938_o.png?oh=54ebb2fb2dd9c9ba7976773c03790cdf&oe=5A9D1FB0">
          <div :class="$style.info">
            <h2>{{ user ? user.name : '' }}</h2>
          </div>
        </div>
        <div>
          <h3>public rytms</h3>
          <RytmList :rytms="publicRytms" />
        </div>

      </div>
      <div v-else>
        <p>User not found</p>
      </div>
    </div>

  </div>
</template>

