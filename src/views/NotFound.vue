<script setup>

import globalStore from '../stores/globalStore';

</script>

<template>
  <div class="home">
    <h1>페이지를 찾을 수 없습니다😢</h1>
    <button @click="globalStore.router.push('/')">메인으로</button>
    <button @click="globalStore.router.back()">이전으로</button>
  </div>
</template>

<style>

</style>
