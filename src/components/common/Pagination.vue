<script setup>
import { computed } from 'vue';

// 페이지 정보 props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

// emit 이벤트 정의
const emit = defineEmits(['changePage']);

// 노출될 페이지 수 
const DISPLAY_PAGE_NUMBER = 5;

// 현재 페이지 그룹
const pageList = computed(() => {

  const startPage = Math.floor((props.currentPage - 1) / DISPLAY_PAGE_NUMBER) * DISPLAY_PAGE_NUMBER + 1;
  const endPage = Math.min(startPage + (DISPLAY_PAGE_NUMBER-1), props.totalPages);

  const list = [];

  for(let i=startPage; i<=endPage; i++) {
    list.push(i);
  }

  return list;
})

// 페이지 변경
function changePage(page) {

  if(page === props.currentPage || props.totalPages === 0) {
    return;
  }

  emit('changePage', page);
}

// 이전 페이지 이동
function prevPage() {
  const startPage = Math.floor((props.currentPage - 1) / DISPLAY_PAGE_NUMBER) * DISPLAY_PAGE_NUMBER + 1;

  if(startPage <= 1) {
    return;
  }

  emit('changePage', startPage - DISPLAY_PAGE_NUMBER);
}

// 다음 페이지 이동
function nextPage() {
  const startPage = Math.floor((props.currentPage - 1) / DISPLAY_PAGE_NUMBER) * DISPLAY_PAGE_NUMBER + 1;

  if(startPage + DISPLAY_PAGE_NUMBER > props.totalPages) {
    return;
  }

  emit('changePage', startPage + DISPLAY_PAGE_NUMBER);
}


</script>

<template>
  <div class="pagination">
      
    <span class="first-page" @click="changePage(1)">
      처음
    </span>

    <span class="prev-page" @click="prevPage()">
      이전
    </span>

    <div class="page-list">
      <span 
        v-for="(page) in pageList" :key="page"
        :class="`page-item ${page === props.currentPage ? 'selected-page' : ''}`" 
        @click="changePage(page)"  
      >
        {{ page }}
      </span>
    </div>

    <span class="next-page" @click="nextPage()">
      다음
    </span>

    <span class="last-page" @click="changePage(props.totalPages)">
      끝
    </span>

  </div>
</template>

<style scoped>

.pagination {
  display: flex;
  justify-content: center;
  user-select: none;
}

.page-list {
  display: flex;
}

.page-item,
.prev-page,
.next-page,
.first-page,
.last-page {
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;
}

.page-item:hover,
.prev-page:hover,
.next-page:hover,
.first-page:hover,
.last-page:hover,
.selected-page {
  background: #524FE1;
  color: #fff;
}



</style>
