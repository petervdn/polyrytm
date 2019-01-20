export const initStoreCommands = (object, storeName, options) => {
	['state', 'mutations', 'getters', 'actions'].forEach(type => {
		if (!object[type]) {
			return;
		}
		const globals = [];
		const locals = [];
		Object.keys(object[type]).forEach(key => {
			// set value to key name + namespace
			object[type][key] = `${storeName}/${key}`;
			globals.push(key);
		});
		Object.keys(object.local[type]).forEach(key => {
			// set value to key name + namespace
			object.local[type][key] = key;
			locals.push(key);
		});
		globals.forEach(globalKey => {
			if (locals.indexOf(globalKey) === -1) {
				console.warn('Key exists in global, but not in local:', `${storeName}/${type}/${globalKey}`);
			}
		});
		locals.forEach(localKey => {
			const excludedGlobals = (options ? options.excludedGlobals : []) || [];
			if (globals.indexOf(localKey) === -1 && excludedGlobals.indexOf(localKey) === -1) {
				console.warn('Key exists in local, but not in global:', `${storeName}/${type}/${localKey}`);
			}
		});
	});
};
