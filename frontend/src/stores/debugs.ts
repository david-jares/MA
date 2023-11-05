import type { Point, Triangle } from '@/myfunctions/tempfunctions';
import { Rectangle } from '@/myfunctions/utilityfunctions';
import { defineStore } from 'pinia';

interface DebugsState {
    drawnPoints: Point[];
    drawnRects: Rectangle[];
    drawnTriangles: Triangle[];
}

export const useDebugsStore = defineStore({
    id: 'debugs',
    state: (): DebugsState => ({
        drawnPoints: [],
        drawnRects: [],
        drawnTriangles: [],
    }),
})