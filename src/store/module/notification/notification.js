import { initStoreCommands } from '../../../util/storeUtils';

export const notificationStore = {
	mutations: {
		setNotification: null,
		setNotificationProgress: null,
	},
	actions: {
		showNotification: null,
		hideNotification: null,
	},
	local: {
		mutations: {
			setNotification: null,
			setNotificationProgress: null,
		},
		actions: {
			showNotification: null,
			hideNotification: null,
		},
	},
};

initStoreCommands(notificationStore, 'notification');

export default {
	namespaced: true,
	state: {
		notification: null,
	},
	getters: {},
	mutations: {
		[notificationStore.local.mutations.setNotification]: (state, payload) => {
			state.notification = payload;
		},
		[notificationStore.local.mutations.setNotificationProgress]: (state, payload) => {
			if (!state.notification) {
				console.error('No notification, cannot set progress');
				return;
			}
			// todo Number.isNaN(undefined) => false ??
			if (typeof state.notification.progress === 'undefined') {
				console.error('Notification has no progress, cannot set');
				return;
			}
			state.notification.progress = payload;
		},
	},
	actions: {
		// todo check for validness of notification data (for example, can not all be missing)
		[notificationStore.local.actions.showNotification]: (context, payload) => {
			// todo check if there is already a notification
			if (payload.okButton && typeof payload.progress !== 'undefined') {
				console.error('Notification can not have both ok-button and progress');
				return Promise.reject;
			}
			// notification component can handle closing by either clicking or progress reaching 1
			const notificationHandlesClosing = !!(payload.okButton || !Number.isNaN(payload.progress));

			const openNotification = new Promise(resolve => {
				context.commit(notificationStore.local.mutations.setNotification, {
					// when the notification handles closing, pass the resolve-method
					resolve: notificationHandlesClosing ? resolve : null,
					title: payload.title,
					message: payload.message,
					okButton: payload.okButton,
					cancelButton: payload.cancelButton,
					progress: payload.progress,
				});

				// if notification doesnt close itself, we immediately resolve
				// (this is for notifications that just show a message and have to be hidden again by code)
				if (!notificationHandlesClosing) {
					resolve();
				}
			});

			if (notificationHandlesClosing) {
				return openNotification.then(result => {
					context.dispatch(notificationStore.local.actions.hideNotification);
					return result;
				});
			}

			return openNotification;
		},
		[notificationStore.local.actions.hideNotification]: context => {
			// todo check if there is a pending notification that closes itself?
			context.commit(notificationStore.local.mutations.setNotification, null);
		},
	},
};
