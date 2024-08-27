<template>
    <div class="relative h-[512px] w-[512px] overflow-hidden" id="threejs-map" ref="threejsMap">
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, markRaw, shallowRef } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { useMainStore } from '../store';
import * as TWEEN from '@tweenjs/tween.js';
const store = useMainStore();
const addableObject = shallowRef<THREE.Group>();
watch(() => store.lineGeometry, (newVal) => {
    if (newVal) {
        addableObject.value = markRaw(newVal);
        // addableObject.value.rotateX(Math.PI);
        const newGroup = new THREE.Group();
        scene.add(newGroup);
        console.log(addableObject.value.children.length)
        addObjectsAsync();

    }
})

const threejsMap = ref<HTMLElement>();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 20, 10000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const domElement = renderer.domElement;
camera.position.set(0, 0, 5000);
camera.position.set(229.14401307546788, -538.4501816598943, 332)
const controller = new OrbitControls(camera, domElement);
controller.target.set(228.73873934507935, -545.7206095178788, 3.693646875546118e-14)

controller.enableDamping = true;
controller.update();
const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.background = new THREE.Color(0x051935);
// scene.add(cube);
const controllerTarget = controller.target;
const controllerGoalTarget = new THREE.Vector3(1500, -538.4501816598943, 0);
const tween = new TWEEN.Tween(controllerTarget)  // Define the object and property to tween
    .to(controllerGoalTarget, 20000)                       // Define the target value and duration
    .easing(TWEEN.Easing.Cubic.InOut)         // Define the easing function
    .onUpdate(() => {
        controller.target = controllerTarget
        controller.update();
    })  // Update the scene during tween
// .start();
const camPosition = camera.position;
const camGoalPosition = new THREE.Vector3(1500, -538.4501816598943, 500);
const tween1 = new TWEEN.Tween(camPosition)  // Define the object and property to tween
    .to(camGoalPosition, 20000)                       // Define the target value and duration
    .easing(TWEEN.Easing.Cubic.InOut)         // Define the easing function
    .onUpdate(() => {
        camera.position.set(camPosition.x, camPosition.y, camPosition.z);
    })  // Update the scene during tween
// .start();
let camPosition1 = camera.position
const camGoalPosition1 = new THREE.Vector3(1500, -538.4501816598943, 3600);
const tween2 = new TWEEN.Tween(camPosition1)  // Define the object and property to tween
    .to(camGoalPosition1, 20000)                       // Define the target value and duration
    .easing(TWEEN.Easing.Cubic.InOut)         // Define the easing function
    .onUpdate(() => {
        camera.position.set(camPosition1.x, camPosition1.y, camPosition1.z);
        controller.update();
    })  // Update the scene during tween
// .start();
onMounted(() => {

    threejsMap.value?.appendChild(domElement);
    window.addEventListener("resize", setSize);
    setSize();
    animate();
});
const divSize = ref({ width: 0, height: 0 });
const setSize = () => {
    divSize.value.width = threejsMap.value?.clientWidth || 0;
    divSize.value.height = threejsMap.value?.clientHeight || 0;
    camera.aspect = divSize.value.width / divSize.value.height;
    camera.updateProjectionMatrix();

    renderer.setSize(divSize.value.width, divSize.value.height);
    renderer.setPixelRatio(window.devicePixelRatio);
};
let enableNormalRender = true;
let index = 0;
let first = true;
let second = true;
const addObjectsAsync = () => {
    enableNormalRender = false;

    const length = addableObject.value?.children?.length;
    if (index < length) {
        const child = addableObject.value.children[(length - 1) - index];
        child.rotateX(Math.PI);
        scene.add(child);
        index++;
        console.log(index)
        renderer.render(scene, camera);
        TWEEN.update();
        if (index > 300 && first) {
            tween.start();
            tween1.start();
            first = false;
        }
        if (index > 1600 && second) {
            camPosition1 = camera.position;
            tween2.start();
            second = false;
        }
        requestAnimationFrame(addObjectsAsync);
    } else {
        enableNormalRender = true
        requestAnimationFrame(animate);
    }

};
const animate = function () {
    if (enableNormalRender) {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controller.update();
        console.log('target: ')
        console.log(controller.target)
        console.log('position: ')
        console.log(camera.position)

    }

};  
</script>

<style>
/* Your component's styles go here */
</style>