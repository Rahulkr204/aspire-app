<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { Icon } from "@iconify/vue";

const route = useRoute()
const router = useRouter()
const currentRoute = computed(() => route.path)

const isMobile = ref(window.innerWidth < 768)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  updateIsMobile() // Initial check
})

watchEffect(() => {
  // Clean up the event listener when the component is unmounted
  return () => {
    window.removeEventListener('resize', updateIsMobile)
  }
})

const navigateTo = (path) => {
  router.push(path)
}

const menuItems = [
    { path: '/home', name: 'Home', icon: 'iconamoon:home' },
    { path: '/cards', name: 'Cards', icon: 'solar:card-2-linear' },
    { path: '/payments', name: 'Payments', icon: "fluent:wallet-credit-card-16-regular" },
    { path: '/credit', name: 'Credit', icon: "ion:card" },
    { path: '/settings', name: 'Profile', icon: "fa:user" }
]
</script>

<template>
    <div class="app-container">
        <aside class="sidebar" v-if="!isMobile">
            <div class="sidebar-header">
                <div class="logo">
                    <img class="logo-icon"
                        src="https://cdn.prod.website-files.com/5ed5b60be1889f546024ada0/672b1e9d21d98dcfc6d10d5a_aspire-logo-p-500.png" />
                </div>
                <div class="tagline">
                    Trusted way of banking for 3,000+ SMEs and startups in Singapore
                </div>
            </div>

            <nav class="sidebar-nav">
                <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
                    :class="{ active: currentRoute === item.path }">
                    <Icon :icon="item.icon" width="20" height="20" style="color: #fff; margin-right: 12px;" />
                    <span class="nav-text">{{ item.name === 'Profile' ? 'Settings' : item.name }}</span>
                </router-link>
            </nav>
        </aside>

        <main class="main-content" :class="{ 'full-width': isMobile }">
            <RouterView />
        </main>

        <nav class="bottom-nav" v-if="isMobile">
            <div v-for="item in menuItems" :key="item.path" class="bottom-nav-item"
                :class="{ active: currentRoute === item.path }" @click="navigateTo(item.path)">
                <Icon :icon="item.icon" width="20" height="20" :style="`color: ${currentRoute === item.path ? '#01D167' : '#DDDDDD'};`" />
                <span class="bottom-nav-text">{{ item.name }}</span>
            </div>
        </nav>
    </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Open Sans', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222;
  background-color: #f5f5f5;
  overflow-x: hidden;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #fff;
  overflow-y: hidden;
}

.sidebar {
  width: 280px;
  background-color: #0C365A;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  transition: width 0.3s ease;
}

.sidebar-header {
  padding: 12px;
  margin-bottom: 48px;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.logo-icon {
  min-width: 96px;
  height: 32px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #01D167;
}

.tagline {
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.4;
  max-width: 220px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: white;
  border-radius: 8px;
  transition: background-color 0.3s, opacity 0.3s; /* Added opacity transition */
  opacity: 0.7;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.05); /* Subtle active background */
  opacity: 1;
  font-weight: 600; /* Make active text bolder */
}

.nav-item.active .nav-icon svg {
  stroke: var(--primary-color); /* Active icon color */
}
.nav-item.active .nav-text{
  color: var(--primary-color);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
 stroke: white;
 transition: stroke 0.3s;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.main-content {
  flex: 1;
  background-color: #fff;
  overflow-y: hidden;
  transition: margin-left 0.3s ease;
  padding: 2rem 4rem;
}

.main-content.full-width {
  padding-bottom: 80px;
  width: 100%;
  margin: 0;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--white-color);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px 0;
  cursor: pointer;
  color: var(--medium-gray);
  transition: color 0.3s;
}

.bottom-nav-item.active {
  color: var(--primary-color);
}

.bottom-nav-icon {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.bottom-nav-icon svg {
  width: 22px; /* Adjusted icon size */
  height: 22px; /* Adjusted icon size */
  stroke: var(--medium-gray); /* Default stroke for icons */
  transition: stroke 0.3s;
}

.bottom-nav-text {
  font-size: 10px;
  font-weight: 500;
}

/* Responsive adjustments for sidebar and main content */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
  .main-content {
    margin-left: 0;
    padding: 0;
  }
   .app-container {
    background-color: #0C365A;
  }
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none; /* Hide bottom nav on desktop */
  }
}
</style>
