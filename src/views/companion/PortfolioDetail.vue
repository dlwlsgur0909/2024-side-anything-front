<script setup>

import { ref, inject, onMounted, onUnmounted } from 'vue'; 
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';

const props = defineProps({
  portfolioId: {
    type: String,
    required: true
  }
})

const auth = useAuthStore();
const customAxios = inject('customAxios');

const portfolioId = ref('');
const portfolioName = ref('');
const portfolioContent = ref('');
const portfolioUrl = ref('');
const portfolioFileId = ref(null);
const memberId = ref('');
const memberName = ref('');

const portfolioFile = ref(null);

// 버튼 설정
const buttonConfig = {
  update: {
    label: '수정하기',
    fontColor: 'white',
    backgroundColor: 'black'
  },
  delete: {
    label: '삭제하기',
    fontColor: 'white',
    backgroundColor: 'red'
  }
}

// 포트폴리오 상세 API
async function getPortfolio() {

  await customAxios
    .get(`/portfolios/${props.portfolioId}`)
    .then(res => {
      portfolioId.value = res.data.portfolioId;
      portfolioName.value = res.data.portfolioName;
      portfolioContent.value = res.data.portfolioContent;
      portfolioUrl.value = res.data.portfolioUrl;
      portfolioFileId.value = res.data.portfolioFileId;
      memberId.value = res.data.memberId;
      memberName.value = res.data.memberName;
    })
    .catch(error => {
      globalStore.router.push('/portfolioList');
    })

}

// 포트폴리오 첨부파일 조회 API
function getPortfolioFile() {

  customAxios
    .get(`/portfolios/${props.portfolioId}/files/${portfolioFileId.value}`, {
      responseType: 'blob'
    })
    .then(res => {
      const blob = new Blob([res.data], {type: 'application/pdf'})
      portfolioFile.value = URL.createObjectURL(blob);
    })
    .catch(error => {
      globalStore.router.push('/portfolioList');
    })
}

// 최초 데이터 로드
onMounted(async () => {
  await getPortfolio();

  if(portfolioFileId.value) {
    getPortfolioFile();
  }

})

// unmount시 Blob URL 메모리 해제
onUnmounted(() => {
  if(portfolioFile.value) {
    URL.revokeObjectURL(portfolioFile.value);
  }
})


// 포트폴리오 수정 페이지 이동
function goToPortfolioUpdate() {
  globalStore.router.push({
    name: 'PortfolioUpdate',
    params: {
      portfolioId: portfolioId.value
    }
  });
}

// 포트폴리오 삭제
function deletePortfolio() {

  globalStore.confirm.openConfirm(`삭제하시겠습니까?`, () => {
    customAxios
      .delete(`/portfolios/${portfolioId.value}`)
      .then(res => {
        globalStore.router.push('/portfolioList');
      })
      .catch((error) => {
        
      })
  });

}

// 뒤로가기
function goToPortfolioList() {
  const prevMenu = sessionStorage.getItem('menu');

  if(prevMenu === 'PORTFOLIO') {
    globalStore.router.push('/portfolioList');
  }else {
    globalStore.router.push('/myPortfolioList');
  }
}

</script>

<template>
  <div class="main">
    
    <div class="portfolio-detail-button-container">
      <svg 
        class="prev-button"
        @click="goToPortfolioList()"
        xmlns="http://www.w3.org/2000/svg" height="24" fill="none" 
        stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
      >
        <line x1="10" y1="12" x2="2222" y2="12" />
        <polyline points="12 5 5 12 12 19" />
      </svg>

      <div class="update-delete-button-container" v-if="auth.member?.id === memberId">
        <CommonButton
          class="update-button"
          @click="goToPortfolioUpdate()"
          :label="buttonConfig.update.label"
          :fontColor="buttonConfig.update.fontColor"
          :background-color="buttonConfig.update.backgroundColor"
        />
        <CommonButton
          class="delete-button"
          @click="deletePortfolio()"
          :label="buttonConfig.delete.label"
          :fontColor="buttonConfig.delete.fontColor"
          :background-color="buttonConfig.delete.backgroundColor"
        />
      </div>
    </div>

    <div class="portfolio-detail-container">
      <div class="portfolio-member-name">
        <span class="subject">작성자</span>
        <span>{{ memberName }}</span>
      </div>

      <div class="portfolio-name">
        <label class="subject" for="portfolio-detail-name">
          포트폴리오 제목
        </label>
        <input 
          type="text" 
          class="name-input"
          id="portfolio-detail-name"
          :value="portfolioName"
          disabled
        >
      </div>

      <div class="portfolio-content">
        <label class="subject" for="portfolio-detail-content">포트폴리오 내용</label>
        <textarea 
          class="content-textarea"
          id="portfolio-detail-content"
          :value="portfolioContent"
          disabled
        />
      </div>

      <div class="portfolio-url">
        <label class="subject" for="portfolio-detail-url">포트폴리오 URL</label>
        <input 
          type="text"
          class="url-input"
          id="portfolio-detail-url"
          :value="portfolioUrl || '없음'"
          disabled
        >
      </div>

      <div class="portfolio-file" v-if="portfolioFile">
        <label class="subject" for="portfolio-detail-url">첨부파일</label>
        <iframe
          class="pdf-file"
          :src="portfolioFile"    
        />
      </div>
    </div>

  </div>
</template>

<style scoped>

.portfolio-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject {
  font-weight: bold;
  font-size: 18px;
}

.portfolio-member-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.portfolio-name {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.name-input {
  height: 25px;
  font-size: 16px;
}

.portfolio-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.content-textarea {
  resize: none;
  min-height: 200px;
  font-size: 16px;
}

.content-length {
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #333;
}

.portfolio-url {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.url-input {
  height: 25px;
  font-size: 16px;
}

.portfolio-file {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pdf-file {
  min-height: 300px;
}

.portfolio-detail-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prev-button {
  width: 30px;
  cursor: pointer;
}

.prev-button:hover {
  color: #524FE1;
}

.update-delete-button-container {
  display: flex;
  gap: 10px;
  width: 60%;
  min-width: 100px;
}

.update-button,
.delete-button {
  flex: 1;
}

</style>
