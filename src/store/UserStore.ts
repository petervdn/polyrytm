import * as firebase from 'firebase/app';
import AbstractStore from './AbstractStore';
import { action, observable } from 'mobx';
import RootStore from './RootStore';

export default class UserStore extends AbstractStore {
  @observable user: firebase.User | null = null;

  constructor(rootStore: RootStore) {
    super(rootStore);

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  @action.bound signIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  @action.bound signOut() {
    return firebase.auth().signOut();
  }
}
