import Vue from 'vue';

export const globalEventBus = new Vue();

export const GlobalEvent = {
  RING_ITEM_VOLUME_CHANGE_BY_DRAGGING: 'ring-item-volume-change-by-dragging',
  RING_ITEM_VOLUME_CHANGE: 'ring-item-volume-change',
  RING_ITEMS_CHANGE: 'ring-items-change',
};
