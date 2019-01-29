import * as firebase from 'firebase';
import Vue from 'vue';
import axios from 'axios';
import DeviceStateTracker from 'seng-device-state-tracker';
import VueExposePlugin from '../util/VueExposePlugin';
import { constants } from '../data/constants';
import { URLNames, PropertyNames, VariableNames } from '../data/enum/configNames';
import { RouteNames } from '../router/routes';
import { createPath } from '../util/routeUtils';
import Params from '../data/enum/Params';
import { getValue } from '../util/injector';
import { CONFIG_MANAGER, GATEWAY, SCHEDULER } from '../data/Injectables';
import localeLoader from '../util/localeLoader';
import { mediaQueries, deviceState } from '../data/mediaQueries.json';
import waitForStyleSheetsLoaded from '../util/waitForStyleSheetsLoaded';
import { initUserLogin, loadPublicSamples } from '../firebase/firebaseUtils';
import { setupSchedulerStoreCommunication } from '../audio/Scheduler';

const initPlugins = () => {
  const configManager = getValue(CONFIG_MANAGER);

  const cleanMediaQueries = Object.keys(mediaQueries).reduce((result, key) => {
    result[key] = mediaQueries[key].replace(/'/g, '');
    return result;
  }, {});

  // expose objects to the Vue prototype for easy access in your vue templates and components
  Vue.use(VueExposePlugin, {
    $config: configManager,
    $gateway: getValue(GATEWAY),
    $http: axios,
    $versionRoot: configManager.getVariable(VariableNames.VERSIONED_STATIC_ROOT),
    $staticRoot: configManager.getVariable(VariableNames.STATIC_ROOT),
    $scheduler: getValue(SCHEDULER),
    URLNames,
    PropertyNames,
    VariableNames,
    RouteNames,
    Params,
    createPath,
    $deviceStateTracker: new DeviceStateTracker({
      mediaQueries: cleanMediaQueries,
      deviceState,
      showStateIndicator: process.env.NODE_ENV !== 'production',
    }),
    DeviceState: deviceState,
    constants,
  });
};

const waitForLocale = store =>
  new Promise(resolve => {
    if (localeLoader.isLoaded(store.getters.currentLanguage.code)) {
      resolve();
    } else {
      localeLoader.setLoadCallback(locale => {
        if (locale === store.getters.currentLanguage.code) {
          resolve();
        }
      });
    }
  });

const startUp = store => {
  // Initialise plugins
  initPlugins();

  const config = {
    apiKey: 'AIzaSyBWrdFVFh_NQXVQT5PA6y330n82ner3VbI',
    authDomain: 'polyrytm.firebaseapp.com',
    databaseURL: 'https://polyrytm.firebaseio.com',
    projectId: 'polyrytm',
    storageBucket: 'polyrytm.appspot.com',
    messagingSenderId: '137282098627',
  };
  firebase.initializeApp(config);

  const configManager = getValue(CONFIG_MANAGER);

  // Add async methods to the Promise.all array
  return Promise.all([
    initUserLogin(store),
    loadPublicSamples(store),
    setupSchedulerStoreCommunication(getValue(SCHEDULER), store),
    configManager.getVariable(VariableNames.LOCALE_ENABLED)
      ? waitForLocale(store)
      : Promise.resolve(),
    process.env.NODE_ENV !== 'production' ? waitForStyleSheetsLoaded(document) : Promise.resolve(),
  ]);
};

export default startUp;
