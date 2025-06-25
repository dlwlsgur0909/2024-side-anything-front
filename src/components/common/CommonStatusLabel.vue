<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  },
})

function getLabel() {
    switch(props.status) {
    case 'OPEN':
      return '모집중'
    case 'CLOSED':
      return '마감됨'
    case 'PENDING':
      return '대기중';
    case 'APPROVED':
      return '승인됨';
    case 'REJECTED':
      return '거절됨';
    case 'CANCELLED':
      return '취소됨';
    case 'CANCELLED_BY_HOST':
      return '철회됨';
    default:
      return '기본값';
  }
}

function getClassName() {

  switch(props.status) {
    case 'OPEN':
      return 'status-open'
    case 'CLOSED':
      return 'status-closed'
    case 'PENDING':
      return 'status-pending';
    case 'APPROVED':
      return 'status-approved';
    case 'REJECTED':
      return 'status-rejected';
    case 'CANCELLED':
      return 'status-cancelled';
    case 'CANCELLED_BY_HOST':
      return 'status-cancelled-by-host';
    default:
      return 'status-default';
  }
}

</script>

<template>
  <span :class="[getClassName(), 'status-label']">
    {{ getLabel() }}
  </span>
</template>

<style scoped>

.status-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 25px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #fff;
  border-radius: 15px;
  user-select: none;
}

.status-open {
  background: #514fe1;
}

.status-closed {
  background: #e34444;
}

.status-pending {
  background: #000;
}

.status-approved {
  background: #514fe1;
}

.status-rejected {
  background: #e34444;
}

.status-cancelled {
  background: #ffc107;
}

.status-cancelled-by-host {
  background: #6b7280;
}

.status-default { 
  background: #000;
}

</style>
