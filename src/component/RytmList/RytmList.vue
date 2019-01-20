<style src="./RytmList.scss" module lang="scss"></style>
<script src="./RytmList.js"></script>

<template>
	<ul>
		<li v-for="(rytm, id) in rytms">
			<router-link :to="{name: PageNames.PLAY, params: {[Params.RYTM_ID]: id}}">{{rytm.title}}</router-link>
			<router-link v-if="rytm.user" :to="{name: PageNames.USER, params: {[Params.USER_ID]: rytm.user.id}}">(by {{rytm.user.name}})</router-link>
		</li>
	</ul>
</template>

