<script setup lang="ts">
import { useCardsStore } from '../stores/cardsStore'
import { Icon } from "@iconify/vue";
import { useDeviceDetection } from '../composables/useDeviceDetection'

interface Props {
  cardId: number;
  isFrozen: boolean;
}

const props = defineProps<Props>()
const { isMobile } = useDeviceDetection()

const cardsStore = useCardsStore()

const toggleFreeze = (): void => {
  cardsStore.toggleCardFreeze(props.cardId)
}
</script>

<template>
    <div class="card-actions" :class="{ 'mobile-actions': isMobile }">
        <div class="action-button" @click="toggleFreeze">
            <div class="action-icon" :class="{ 'mobile-icon': isMobile }">
                <Icon :icon="!isFrozen ? 'charm:snowflake' : 'mdi:freeze-advisory'"
                      :width="isMobile ? '18' : '24'"
                      :height="isMobile ? '18' : '24'"
                      style="color: #fff" />
            </div>
            <div class="action-text" :class="{ 'mobile-text': isMobile }">
                {{ isFrozen ? 'Unfreeze' : 'Freeze' }}<br>card
            </div>
        </div>

        <div class="action-button">
            <div class="action-icon" :class="{ 'mobile-icon': isMobile }">
                <Icon icon="famicons:speedometer"
                      :width="isMobile ? '18' : '20'"
                      :height="isMobile ? '18' : '20'"
                      style="color: #fff" />
            </div>
            <div class="action-text" :class="{ 'mobile-text': isMobile }">Set spend<br>limit</div>
        </div>

        <div class="action-button">
            <div class="action-icon gpay-icon" :class="{ 'mobile-icon': isMobile }">
                <Icon icon="devicon:google"
                      :width="isMobile ? '18' : '20'"
                      :height="isMobile ? '18' : '20'" />
            </div>
            <div class="action-text" :class="{ 'mobile-text': isMobile }">Add to<br>GPay</div>
        </div>

        <div class="action-button">
            <div class="action-icon" :class="{ 'mobile-icon': isMobile }">
                <Icon icon="tabler:reload"
                      :width="isMobile ? '18' : '20'"
                      :height="isMobile ? '18' : '20'"
                      style="color: #fff" />
            </div>
            <div class="action-text" :class="{ 'mobile-text': isMobile }">Replace<br>card</div>
        </div>

        <div class="action-button">
            <div class="action-icon" :class="{ 'mobile-icon': isMobile }">
                <Icon icon="ic:round-delete"
                      :width="isMobile ? '18' : '20'"
                      :height="isMobile ? '18' : '20'"
                      style="color: #fff" />
            </div>
            <div class="action-text" :class="{ 'mobile-text': isMobile }">Cancel<br>card</div>
        </div>
    </div>
</template>

<style scoped>
.card-actions {
  display: flex;
  justify-content: space-around;
  background-color: #EDF3FF;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  width: 100%;
}

.mobile-actions {
  border-radius: 12px 12px 0 0;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  width: 20%;
}

.action-button:hover {
  background-color: rgba(50, 91, 175, 0.1);
}

.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 2px;
  background-color: #325BAF;
  border-radius: 50%;
}

.mobile-icon {
  width: 24px;
  height: 24px;
}

.gpay-icon {
  background-color: #fff;
}

.action-text {
  font-size: 11px;
  font-weight: 500;
  color: #325BAF;
  text-align: center;
  line-height: 1.2;
}

.mobile-text {
  font-size: 10px;
}
</style>