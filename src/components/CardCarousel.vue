<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUpdated } from 'vue'
import CardComponent from './CardComponent.vue'
import { Card } from '../types'
import { useDeviceDetection } from '../composables/useDeviceDetection'

interface Props {
  cards: Card[];
  selectedIndex: number;
  showCardNumber: boolean;
}

const props = defineProps<Props>()
const { isMobile } = useDeviceDetection()

const emit = defineEmits<{
  'update:selectedIndex': [index: number]
}>()

const currentIndex = ref<number>(props.selectedIndex)
const carouselRef = ref<HTMLElement | null>(null)
const cardsCount = ref<number>(props.cards.length)

// Watch for changes in the cards array length to detect new cards
watch(() => props.cards.length, (newLength: number, oldLength: number) => {
    if (newLength > oldLength) {
        // A new card has been added, select it (it will be the last card)
        selectCard(newLength - 1)
    }
    cardsCount.value = newLength
})

// Watch for changes in the selected index from parent
watch(() => props.selectedIndex, (newVal: number) => {
    if (currentIndex.value !== newVal) {
        currentIndex.value = newVal
        nextTick(() => {
            scrollToActiveCard()
        })
    }
})

onMounted(() => {
    scrollToActiveCard()
})

onUpdated(() => {
    scrollToActiveCard()
})

const selectCard = (index: number): void => {
    if (index < 0 || index >= props.cards.length) return

    currentIndex.value = index
    emit('update:selectedIndex', index)

    nextTick(() => {
        scrollToActiveCard()
    })
}

const isCardActive = (index: number): boolean => {
    return index === currentIndex.value
}

const scrollToActiveCard = (): void => {
    if (!carouselRef.value) return

    const carouselElement = carouselRef.value
    const activeCard = carouselElement.querySelector('.active-card')

    if (activeCard) {
        const scrollPos = (activeCard as HTMLElement).offsetLeft

        carouselElement.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
        })
    }
}
</script>

<template>
  <div class="card-carousel-container" :class="{ 'mobile-carousel': isMobile }">
    <div class="card-carousel" ref="carouselRef">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card-item"
        :class="{ 'active-card': isCardActive(index), 'mobile-card-item': isMobile }"
        :style="{
          opacity: isCardActive(index) ? 1 : 0.7
        }"
      >
        <CardComponent
          :card="card"
          :isVisible="showCardNumber"
          :isActive="isCardActive(index)"
        />
      </div>
    </div>

    <div v-if="cards.length > 1" class="carousel-navigation">
      <div class="carousel-indicators" :class="{ 'mobile-indicators': isMobile }">
        <div
          v-for="(card, index) in cards"
          :key="`indicator-${card.id}`"
          class="carousel-dot"
          :class="{ 'active': isCardActive(index), 'mobile-dot': isMobile }"
          @click="selectCard(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-carousel-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;
}

.card-carousel {
    display: flex;
    overflow-x: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    border-radius: 12px;
    margin-bottom: 8px;
    scroll-snap-type: x mandatory;
    position: relative;
}

.card-carousel::-webkit-scrollbar {
    display: none;
}

.card-item {
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    scroll-snap-align: center;
    padding: 8px 0;
    transition: transform 0.7s ease, opacity 0.8s ease;
}

.mobile-card-item {
    padding: 0;
}

.card-item.active-card {
    z-index: 2;
}

.carousel-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 8px;
}

.carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 4px;
}

.mobile-indicators {
    margin-top: 0;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #01D167;
    opacity: 0.2;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 4px;
}

.mobile-dot {
    width: 6px;
    height: 6px;
}

.carousel-dot.active {
    width: 20px;
    height: 8px;
    border-radius: 4px;
    opacity: 1;
}

.mobile-dot.active {
    width: 16px;
}
</style>