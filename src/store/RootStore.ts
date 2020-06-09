import ApplicationStore from './ApplicationStore';
import DiscStore from './DiscStore';
import InteractionStore from './InteractionStore';
import UserStore from './UserStore';
import * as firebase from 'firebase/app';
import { firebaseConfig } from '../firebase/firebase.config';
import SampleStore from './SampleStore';

export default class RootStore {
  public applicationStore = new ApplicationStore(this);
  public discStore = new DiscStore(this);
  public interactionStore = new InteractionStore(this);
  public userStore = new UserStore(this);
  public sampleStore = new SampleStore(this);
}
firebase.initializeApp(firebaseConfig);

export const store = new RootStore();
