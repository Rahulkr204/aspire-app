<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

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
  { path: '/home', name: 'Home', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>' },
  { path: '/cards', name: 'Cards', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>' },
  { path: '/payments', name: 'Payments', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 12h-6.5" /><path d="M13 8.5L16 12L13 15.5" /></svg>' },
  { path: '/credit', name: 'Credit', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>' },
  { path: '/settings', name: 'Profile', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' } // Changed Settings to Profile for mobile
]
</script>

<template>
  <div class="app-container">
    <aside class="sidebar" v-if="!isMobile">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z" fill="#01D167" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2959 21.4315L24.9999 31.2371L32.7038 21.4315H36.125L25 36.25L13.875 21.4315H17.2959Z" fill="white" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M25 13.75L36.125 28.5685H32.7038L25 18.7629L17.2959 28.5685H13.875L25 13.75Z" fill="white" />
            </svg>
          </span>
          <span class="logo-text">aspire</span>
        </div>
        <div class="tagline">
          Trusted way of banking for 3,000+ SMEs and startups in Singapore
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentRoute === item.path }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-text">{{ item.name === 'Profile' ? 'Settings' : item.name }}</span> <!-- Show Settings for desktop -->
        </router-link>
      </nav>
    </aside>

    <main class="main-content" :class="{ 'full-width': isMobile }">
      <RouterView />
    </main>

    <nav class="bottom-nav" v-if="isMobile">
      <div
        v-for="item in menuItems"
        :key="item.path"
        class="bottom-nav-item"
        :class="{ active: currentRoute === item.path }"
        @click="navigateTo(item.path)"
      >
        <span class="bottom-nav-icon" v-html="item.icon"></span>
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
  width: 40px;
  height: 40px;
  margin-right: 12px;
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
  color: var(--primary-color); /* Active text color */
}

.nav-icon {
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
 stroke: white; /* Default icon stroke color for sidebar */
 transition: stroke 0.3s;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  color: white; /* Default text color for sidebar */
  transition: color 0.3s;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: #FAFBFC; /* Slightly off-white for content area */
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content.full-width {
  padding-bottom: 80px; /* Space for bottom nav */
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

.bottom-nav-item.active .bottom-nav-icon svg {
 stroke: var(--primary-color);
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
    display: none; /* Hide sidebar on mobile */
  }
  .main-content {
    margin-left: 0;
    padding: 16px; /* Adjust padding for mobile */
  }
   .app-container {
    background-color: #0C365A; /* Mobile background matches header */
  }
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none; /* Hide bottom nav on desktop */
  }
}
</style>
