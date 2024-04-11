import { defineStore } from 'pinia'
import type { ShapeGeometry, Group } from 'three';

export const useMainStore = defineStore('main', {
  state: () => ({
    shapeGeometry: null as ShapeGeometry | null,
  }),
  actions: {
    setShapeGeometry(geometry: Group) {
      this.shapeGeometry = geometry;
    }
  }
});