<script setup lang="ts">
import Step from '@/components/Step.vue';

const text1 = "This stage executes the Scenario-Learning component to generate a model out of the input data stored in the database. It analyses the structure and diversity of the data to create a representation of the entities` behavior."
const text2 = "This stage executes the Scenario-Generation component which uses the previously trained model to generate new data. The output are simulated locations of generated entities."
const text3 = "After the Scenario-Generation has finished the result can be persisted in the database and afterwards viewed on the map in the tab Map View."

</script>


<template>
    <div>
        <h1>Execution</h1>
        <p>Train your model and execute your simulation.</p>
        <div class="stepcontainer">
            <Step style="flex: 1;" header="Scenario-Learning" buttontext="Start Scenario-Learning" :text="text1"></Step>
            <Step style="flex: 1;" header="Scenario-Generation" buttontext="Start Scenario-Generation" :text="text2"></Step>
            <Step style="flex: 1;" header="Persist Result" buttontext="Persist Result" :text="text3"></Step>
        </div>
    </div>
</template>


<style scoped>
.stepcontainer {
    display: flex;
    flex-direction: row;
    width: 1200px;
}
</style>