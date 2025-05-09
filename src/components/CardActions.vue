<script setup lang="ts">
import { useCardsStore } from '../stores/cardsStore'
import { Icon } from "@iconify/vue";

interface Props {
  cardId: number;
  isFrozen: boolean;
}

const props = defineProps<Props>()

const cardsStore = useCardsStore()

const toggleFreeze = (): void => {
  cardsStore.toggleCardFreeze(props.cardId)
}
</script>

<template>
    <div class="card-actions">
        <div class="action-button" @click="toggleFreeze">
            <div class="action-icon">
                <Icon icon="charm:snowflake" width="24" height="24" style="color: #fff" v-if="!isFrozen" />
                <Icon icon="mdi:freeze-advisory" width="24" height="24" style="color: #fff" v-if="isFrozen" />
            </div>
            <div class="action-text">{{ isFrozen ? 'Unfreeze' : 'Freeze' }}<br>card</div>
        </div>

        <div class="action-button">
            <div class="action-icon">
                <Icon icon="famicons:speedometer" width="20" height="20" style="color: #fff" />
            </div>
            <div class="action-text">Set spend<br>limit</div>
        </div>

        <div class="action-button">
            <div class="action-icon gpay-icon">
                <Icon icon="devicon:google" width="20" height="20" />
            </div>
            <div class="action-text">Add to<br>GPay</div>
        </div>

        <div class="action-button">
            <div class="action-icon">
                <Icon icon="tabler:reload" width="20" height="20" style="color: #fff" />
            </div>
            <div class="action-text">Replace<br>card</div>
        </div>

        <div class="action-button">
            <div class="action-icon">
                <Icon icon="ic:round-delete" width="20" height="20" style="color: #fff" />
            </div>
            <div class="action-text">Cancel<br>card</div>
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

.action-icon svg {
  stroke: #325BAF;
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

@media (max-width: 768px) {
    .card-actions {
        border-radius: 12px 12px 0 0;
    }
    .action-text {
        font-size: 10px;
    }
    .action-icon {
        width: 24px;
        height: 24px;
    }
    .action-icon svg {
        width: 18px;
        height: 18px;
    }
}
</style>