<script setup lang="ts">
import type SeparationLineVue from './SeparationLine.vue';

const props = defineProps<{
    header: string ;
    text: string;
    buttontext: string;
}>();


// const id = ref(props.id);
// const space1 = ref(props.space1);
// const space2 = ref(props.space2);


</script>

<template>
    <div id="wrapper">
        <div id="head" class="row">
            <div class="headertext">{{ props.header}}</div>
            <div class="statusbox"> Not Started</div>
        </div>
        <hr />
        <div id="lower">
            <p>{{ props.text }}</p>
            <button class="thebutton">{{props.buttontext}}</button>
        </div>
    </div>
</template>


<style scoped>
#wrapper {
    /* display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        width: 100%; */
    background-color: #F5F5F5;
    border: 1px solid black;
    border-radius: 10px;
    margin: 5px;
}

#head{
    padding: 10px;
}
#lower{
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* height: 100%; */
    height: 200px;
}

.row{
    display: flex;
    justify-content: space-between;
}

.statusbox{
    background-color: #555;
    color: white;
    border: 1px solid black;
    border-radius: 10px;
    padding: 2px 10px 2px 10px;
    font-size: 16px;

}

.thebutton{
    background-color: #1759ff;
    color: white;
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    font-size: 16px;
    /* position: absolute; */
    /* bottom: 10; */

}

.headertext{
    font-size: 20px;
    font-weight: bold;
}

</style>