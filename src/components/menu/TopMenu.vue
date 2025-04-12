<script setup>

</script>

<template>

  <div class="top-menu-container">

    <div class="top-menu-logo-section">
        <img class="top-menu-logo" src="../../assets/top-menu-logo.svg" alt="logo">
    </div>

    <div class="top-menu-item-section">
        <div class="top-menu-item">내 정보</div>
        <div class="top-menu-item">MY 포트폴리오</div>
        <div class="top-menu-item">내 동료가 되라!</div>
        <div class="top-menu-item">자유게시판</div>
    </div>

    <!-- <span>Loading...</span> -->
  </div>

</template>

<style scoped>

.top-menu-container {
    display: flex;
    gap: 30px;
    height: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
    background: #524FE1;
}

.top-menu-logo-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    padding: 10px;
    margin-left: 20px;
    border: 3px solid #fff;
    border-radius: 100px;
}

.top-menu-logo {
    height: 50%;
}

.top-menu-item-section {
    flex-grow: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
}

.top-menu-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
}

.top-menu-item:hover {
    color: #000;
}


</style>
