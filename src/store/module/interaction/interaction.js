import { getHint } from '../../../util/interactionUtils';
import { getDiscForInteractable, getRingForInteractable } from '../../../util/discUtils';

const namespace = 'interaction';

export const interactionStore = {
  SET_SELECTION: `${namespace}/setSelection`,
  SET_HIGHLIGHT: `${namespace}/setHighlight`,
  CLEAR_SELECTION: `${namespace}/clearSelection`,
  SET_HIGHLIGHT_AS_SELECTION: `${namespace}/setHighlightAsSelection`,
  SET_FORCE_HINT: `${namespace}/setForceHint`,
  GET_HINT: `${namespace}/getHint`,
  GET_SELECTED_DISC: `${namespace}/selectedDisc`, // todo remove GET in getters?
  GET_SELECTED_RING: `${namespace}/selectedRing`,
  GET_HIGHLIGHTED_DISC: `${namespace}/highlightedDisc`,
  GET_HIGHLIGHTED_RING: `${namespace}/highlightedRing`,
};

export default {
  state: {
    selection: null, // IInteractable
    highlight: null, // IInteractable
    forceHint: null, // a hint (string) that overrides hints resulting from selection/interaction
  },
  getters: {
    [interactionStore.GET_HINT]: state => getHint(state),
    [interactionStore.GET_SELECTED_DISC]: state => getDiscForInteractable(state.selection),
    [interactionStore.GET_SELECTED_RING]: state => getRingForInteractable(state.selection),
    [interactionStore.GET_HIGHLIGHTED_DISC]: state => getDiscForInteractable(state.highlight),
    [interactionStore.GET_HIGHLIGHTED_RING]: state => getRingForInteractable(state.highlight),
  },
  mutations: {
    [interactionStore.SET_FORCE_HINT]: (state, payload) => {
      state.forceHint = payload;
    },
    [interactionStore.SET_HIGHLIGHT_AS_SELECTION]: state => {
      state.selection = state.highlight;
    },
    [interactionStore.CLEAR_SELECTION]: state => {
      state.selection = null;
    },
    [interactionStore.SET_SELECTION]: (state, payload) => {
      state.selection = payload;
    },
    [interactionStore.SET_HIGHLIGHT]: (state, payload) => {
      state.highlight = payload;
    },
  },
};
