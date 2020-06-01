import * as firebase from 'firebase/app';
import AbstractStore from './AbstractStore';
import { observable } from 'mobx';
import RootStore from './RootStore';

export default class UserStore extends AbstractStore {
  @observable user: firebase.User | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore);

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }
}
