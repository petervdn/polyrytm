import * as firebase from 'firebase/app';
import AbstractStore from './AbstractStore';
import { computed, observable } from 'mobx';
import RootStore from './RootStore';

export default class UserStore extends AbstractStore {
  @observable user: firebase.User | null = null;
  @observable isAdmin = false;

  constructor(rootStore: RootStore) {
    super(rootStore);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((result) => {
          this.isAdmin = result.claims.admin === true;
          this.user = user;
        });
      } else {
        this.user = null;
      }
    });
  }

  @computed get userId() {
    return this.user ? this.user.uid : undefined;
  }
}
