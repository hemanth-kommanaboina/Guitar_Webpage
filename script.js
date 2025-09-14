// === Header Interactivity ===

// Shrink header on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("shrink", window.scrollY > 50);
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Dark mode toggle
const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  // Optional: change scene background in dark mode
  if (window.scene) {
    scene.background = document.body.classList.contains("dark-mode") 
      ? new THREE.Color(0x111111) 
      : new THREE.Color(0x000000);
  }
});

// Smooth scroll for intro scroll-down button
const scrollBtn = document.querySelector('.scroll-down');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });
}

// === Three.js 3D Guitar Setup ===

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, guitarModel;

function init3D() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  scene = new THREE.Scene();
  window.scene = scene; // global for dark mode toggle
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    'models/guitar.glb',
    (gltf) => {
      guitarModel = gltf.scene;
      guitarModel.scale.set(1.5, 1.5, 1.5);
      scene.add(guitarModel);
      animate3D();
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
    }
  );

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate3D() {
  requestAnimationFrame(animate3D);
  if (guitarModel) {
    guitarModel.rotation.y += 0.005; // slow rotation
  }
  renderer.render(scene, camera);
}

// Initialize Three.js after DOM loads
document.addEventListener('DOMContentLoaded', init3D);




