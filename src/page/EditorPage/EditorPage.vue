<style src="./EditorPage.scss" module lang="scss"></style>
<script src="./EditorPage.js"></script>

<template>
	<div :class="$style.wrapper">
		<ul :class="$style.menu">
			<li
				v-for="item in menuItems"
				:class="{[$style.active]: activeMenuItemId === item.id}"
				@click="setActiveMenuItem(item)"
			>
				{{item.id}}
			</li>
		</ul>
		<DiscControls v-show="activeMenuItemId === 'disc'" />
		<RingControls v-show="activeMenuItemId === 'ring'" />
		<SampleControls v-show="activeMenuItemId === 'sample'" />
		<ThemeControls v-show="activeMenuItemId === 'theme'" />
		<ShareControls v-show="activeMenuItemId === 'share'" />
		<MixerControls v-show="activeMenuItemId === 'mixer'" />
	</div>
</template>

