import ApplicationStore from './ApplicationStore';
import DiscStore from './DiscStore';
import InteractionStore from './InteractionStore';

export default class RootStore {
  public applicationStore = new ApplicationStore(this);
  public discStore = new DiscStore(this);
  public interactionStore = new InteractionStore(this);
}

export const store = new RootStore();
