import ApplicationStore from './ApplicationStore';
import DiscStore from './DiscStore';

export default class RootStore {
  public applicationStore = new ApplicationStore(this);
  public discStore = new DiscStore(this);
}

export const store = new RootStore();
