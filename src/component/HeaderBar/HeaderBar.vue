<style src="./HeaderBar.scss" module lang="scss"></style>
<script src="./HeaderBar.js"></script>


<template>
	<header :class="$style.header">
		<h1>
			<router-link :to="PagePaths.HOME">polyrytm</router-link>
		</h1>
		<div :class="$style.loginState">

			<router-link :to="PagePaths.EDITOR">editor</router-link>
			<router-link v-if="!user" :to="PagePaths.LOGIN">log in</router-link>
			<router-link
					v-if="user"
					:to="{
					    name: PageNames.USER_HOME,
					    params:
					    	{[Params.USER_ID]: user.uid}
					}
					"
			>
				profile
			</router-link>
			<router-link v-if="user && user.isAdmin" :to="PagePaths.SAMPLES">samples</router-link>
			<a href="#" v-if="user" @click="logout">log out</a>
		</div>
	</header>
</template>


