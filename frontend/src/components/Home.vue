<template>
    <div id="mainContainer" class="flex flex-row h-full w-full p-2">
        <div id='sidebar' class="flex flex-col col h-full bg-slate-200 rounded-xl overflow-hidden p-2 space-y-4">
            <div class="text-slate-800 font-semibold text-lg text-center p-2">Image-Opencv-Plotter.tech</div>
            <button class="w-fit mx-auto rounded-xl p-2 bg-slate-400 hover:bg-slate-500 active:bg-slate-600 ">
                <PhotoIcon class="h-16" />
            </button>
            <button class="w-fit mx-auto rounded-xl p-2 bg-slate-400 hover:bg-slate-500 active:bg-slate-600 ">
                <CubeIcon class="h-16" />
            </button>

        </div>
        <div id="content" class="relative flex flex-col p-6 w-full bg-slate-200/0 rounded-xl">

            <div
                class="relative flex flex-col justify-center items-center text-center w-full h-28 p-6 m-6 hover:bg-slate-200/80  outline-dashed outline-2 rounded-lg outline-slate-300 hover:outline-offset-4">
                <button>Datei
                    hochladen</button>
                <label class="text-slate-600">oder hier ablegen</label>
                <input class="opacity-0 absolute w-full h-full" type="file" @change="handleImageUpload" accept="*" />

            </div>
            <div id="controls">
                <button
                    class="flex w-fit flex-col items-center rounded-xl p-2 bg-sky-400/50  hover:bg-sky-400/70 active:bg-sky-400/90 ">
                    <PhotoIcon class="h-16" />
                    <div>Features extrahieren</div>
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { BeakerIcon, CubeIcon, PhotoIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue';
// import { uploadImage } from '../utils/backend_services';
const loadedFile = ref<File>()
const uploadableImage = ref<File[]>([])
const handleImageUpload = (e: any) => {
    uploadableImage.value = e.target.files;
    uploadImage(uploadableImage.value);
}
</script>

