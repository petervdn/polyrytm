<style src="./LoginPage.scss" module lang="scss"></style>
<script src="./LoginPage.js"></script>

<template>
	<div>
		<div v-if="!user">
			<input type="text" id="email" placeholder="email" v-model="email">
			<input type="password" id="password" placeholder="password" v-model="password">
			<button @click="login">login</button>
			<button @click="signup">signup</button>
		</div>
		<p :class="$style.error">{{errorMessage}}</p>
	</div>
</template>

