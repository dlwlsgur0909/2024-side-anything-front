<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../js/auth.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const props = defineProps({
  label: {
    type: String,
    required: true,
    default: '버튼',
  },
  fontColor: {
    type: String,
    required: false,
    default: 'black'
  },
  backgroundColor: {
    type: String,
    required: false,
    default: 'white',
  },
  icon: {
    type: String,
    required: false,
  }
})

function getImageUrl() {
  return new URL(`/src/assets/${props.icon}`, import.meta.url).href;
}

</script>

<template>
  <button
    class="common-button"
    :style="`color: ${props.fontColor}; background: ${props.backgroundColor}`"
  >
    <div class="common-button-logo"  v-if="!!props.icon?.trim()">
      <img 
        class="logo-image" :src="getImageUrl()"
      >
    </div>
    <div class="common-button-label">
      <span class="label-with-logo" v-if="!!props.icon?.trim()">
        {{ props.label }}
      </span>
      <span class="label-without-logo" v-else>
        {{ props.label }}
      </span>
    </div>
  </button>
</template>

<style scoped>

.common-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  padding: 0;
  margin: 0;
  border-radius: 5px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
}

.common-button:hover {
  cursor: pointer;
  font-weight: bold;
  border: 1px solid black;
}

.common-button-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
}

.common-button-label {
  width: 80%;
}

.logo-image {
  width: 50%;
  height: 30px;
}

.label-with-logo {
  margin-right: 20%;
}

</style>
