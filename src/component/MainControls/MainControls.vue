<style src="./MainControls.scss" module lang="scss"></style>
<script src="./MainControls.js"></script>

<template>
	<div :class="$style.wrapper" ref="wrapper">
		<p :class="$style.hints" v-html="hint || '&nbsp'"></p>
		<ul :class="$style.controls">
			<li :class="$style.playstop">
				<h3 ref="playLabel">play</h3>
				<button @click="start" v-show="!isPlaying">play</button>
				<button @click="stop" v-show="isPlaying">stop</button>
			</li>
			<li :class="$style.playstop">
				<h3 ref="modeLabel">mode</h3>
				<span @click="togglePlayMode">{{playMode}}</span>
			</li>
			<li :class="$style.time">
				<h3 ref="secRevLabel">s/rev</h3>
				<input
					type="text"
					:value="secondsPerRevolution"
					@change="updateSecondsPerRevolution"
				/>
			</li>
			<!--<li :class="$style.playstop">-->
				<!--<h3 ref="flashLabel">flash</h3>-->
				<!--<input type="checkbox">-->
			<!--</li>-->
			<li>
				<h3 ref="discsLabel">discs</h3>
				<DiscSelector />
			</li>
			<li v-show="selectedDisc">
				<h3 ref="ringsLabel">rings</h3>
				<RingSelector />
			</li>
		</ul>
	</div>
</template>

