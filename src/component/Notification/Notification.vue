<style src="./Notification.scss" module lang="scss"></style>
<script src="./Notification.js"></script>

<template>
	<div :class="$style.notificationLayer" v-if="notification">
		<div :class="$style.notification">
			<h2 v-if="notification.title">
				{{notification.title}}
			</h2>
			<p v-if="notification.message">
				{{notification.message}}
			</p>
			<div v-if="typeof notification.progress !== 'undefined'" :class="$style.progressWrap">
				<div
					:class="$style.progress"
					:style="{ width: (animatedProgress * 100) + '%' }">
				</div>
			</div>

			<button
				@click="onOkButtonClick"
				v-if="notification.okButton"
			>
				{{notification.okButton}}
			</button>
			<button
					@click="onCancelButtonClick"
					v-if="notification.cancelButton"
			>
				{{notification.cancelButton}}
			</button>
		</div>
	</div>
</template>

