<script setup lang="ts">
import { useGlobalsStore } from '@/stores/globals';
import BridgeEntry from './BridgeEntry.vue';
import { BridgePair } from '@/myfunctions/model';
let gs = useGlobalsStore();

function createNewBridge() {
    gs.bridgeSpaceIdPairs.push(new BridgePair(gs.bridgeSpaceIdPairs.length, -1, -1));
}
</script>

<template>
    <div style="display: block;">

        <div style="display: flex; justify-content: space-evenly; align-items: center;">
            <div style="padding: 0 20px 0 5px; ">Bridge Space Pairs </div>
            <button style="flex-grow: 1;" @click="createNewBridge">Add New BridgePair</button>
            <!-- <SmartEvent v-for="event in gs.smartEvents" :key="event.id" v-bind="event"></SmartEvent> -->

        </div>
        <div>
            <!-- <p>Bridge </p> -->
            <BridgeEntry v-for="bridge in gs.bridgeSpaceIdPairs" :key="bridge.id" :id="bridge.id"
                :space1="bridge.space1Id" :space2="bridge.space2Id"></BridgeEntry>
            <!-- <div v-for="space in bridge.spaces" :key="space.id">
                <p>Space {{space.id}}: {{space.name}}</p> -->
        </div>
    </div>
</template>
