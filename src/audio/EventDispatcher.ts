// todo move this elsewhere (is not only audio)

export default class EventDispatcher {
	private events: { [key: string]: ((eventData: EventData) => void)[] } = {};

	constructor() {}

	public addEventListener(type: string, callback: (eventData: EventData) => void) {
		if (!this.events[type]) {
			this.events[type] = [];
		}

		this.events[type].push(callback);
	}

	public dispatchEvent(type: string, data?: any) {
		if (this.events[type]) {
			this.events[type].forEach(callback => {
				callback({
					type,
					data,
				});
			});
		}
	}

	public destruct(): void {
		this.events = null;
	}
}

interface EventData {
	type: string;
	data?: any;
}
