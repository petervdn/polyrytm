<style src="./ProjectInfo.scss" module lang="scss"></style>
<script src="./ProjectInfo.js"></script>

<template>
	<div :class="$style.info" v-bind:style="{color: styleObject.infoColor}">
		<p>
			&#8220;{{name || 'Unnamed project'}}&#8221;<br/>
			by {{author || 'anonymous'}}<br/>
			{{link}}
			<!-- <img src="https://pbs.twimg.com/profile_images/856049883207393280/OajsHVIC_mini.jpg"/> -->
		</p>
	</div>
</template>

