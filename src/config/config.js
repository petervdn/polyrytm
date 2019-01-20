import { EnvironmentNames, PropertyNames, URLNames, VariableNames } from 'data/enum/configNames';

const config = {
	environments: {
		[EnvironmentNames.PRODUCTION]: {
			variables: {},
			urls: {},
		},
		[EnvironmentNames.STAGING]: {
			extends: EnvironmentNames.PRODUCTION,
			variables: {},
			urls: {},
		},
		[EnvironmentNames.DEVELOPMENT]: {
			extends: EnvironmentNames.STAGING,
			variables: {},
			urls: {},
		},
		[EnvironmentNames.LOCAL]: {
			extends: EnvironmentNames.DEVELOPMENT,
			variables: {},
			urls: {},
		},
	},
	variables: {
		[VariableNames.LOCALE_ENABLED]: false,
		[VariableNames.LOCALE_ROUTING_ENABLED]: false,
		[VariableNames.VERSIONED_STATIC_ROOT]: process.env.VERSIONED_STATIC_ROOT,
		[VariableNames.STATIC_ROOT]: process.env.STATIC_ROOT,
		[VariableNames.PUBLIC_PATH]: process.env.PUBLIC_PATH,
	},
	urls: {
		[URLNames.LOCALE]: `${process.env.VERSIONED_STATIC_ROOT}locale/{locale}.json`,
		[URLNames.API]: `${process.env.PUBLIC_PATH}api/`,
		[URLNames.SAMPLES_PATH]: `${process.env.VERSIONED_STATIC_ROOT}samples/`,
		[URLNames.EXAMPLES_PATH]: `${process.env.VERSIONED_STATIC_ROOT}examples/`,
		[URLNames.SHADERS_PATH]: `${process.env.VERSIONED_STATIC_ROOT}shaders/`,
	},
	properties: {
		[PropertyNames.DEFAULT_LOCALE]: 'en-gb',
		[PropertyNames.AVAILABLE_LOCALES]: ['en-gb'],
	},
};

let environment = EnvironmentNames.PRODUCTION;
const { host } = document.location;

switch (host.split(':').shift()) {
	case 'localhost': {
		environment = EnvironmentNames.LOCAL;
		break;
	}
	default: {
		environment = EnvironmentNames.PRODUCTION;
		break;
	}
}

export default {
	config,
	environment,
};
