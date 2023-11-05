<script setup lang="ts">
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { onMounted } from 'vue';

onMounted(() => {
    tippy('.myButton', {
        content: 'Tooltip',
    });
});

</script>

<template>
    <div>
        <div style="display: block;border-radius: 50%; background-color: #000; color: #fff; width: 20px; height: 30px; text-align: center; " class="myButton" title="click me to perform action">
            I
        </div>
    </div>
</template>