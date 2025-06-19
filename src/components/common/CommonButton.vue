<script setup>

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
  logo: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

function getImageUrl() {
  return new URL(`/src/assets/logo/${props.logo}`, import.meta.url).href;
}

</script>

<template>
  <button
    :class="props.disabled ? 'common-disabled-button' : 'common-button'"
    :style="`color: ${props.fontColor}; background: ${props.backgroundColor}`"
    :disabled="props.disabled"
  >
    <div class="common-button-logo"  v-if="!!props.logo?.trim()">
      <img 
        class="logo-image" :src="getImageUrl()"
      >
    </div>
    <div class="common-button-label">
      <span class="label-with-logo" v-if="!!props.logo?.trim()">
        {{ props.label }}
      </span>
      <span class="label-without-logo" v-else>
        {{ props.label }}
      </span>
    </div>
  </button>
</template>

<style scoped>

.common-disabled-button {
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
  opacity: 0.5;
  cursor: not-allowed;
}

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
  border: 1px solid black;
  box-shadow: 1px 1px 3px black;
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
