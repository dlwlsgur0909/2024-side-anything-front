<script setup>

import { ref, inject, onMounted, onUnmounted } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';

const props = defineProps({
  portfolioId: {
    type: String,
    required: true
  }
})

const customAxios = inject('customAxios');

const portfolioId = ref('');
const portfolioName = ref('');
const portfolioContent = ref('');
const portfolioUrl = ref('');
const isPublic = ref(true);
const portfolioFileId = ref(null);

const portfolioFilename = ref('');
const portfolioFile = ref(null);

// 포트폴리오 상세 API
async function getPortfolio() {

  await customAxios
    .get(`/portfolios/${props.portfolioId}`)
    .then(res => {
      portfolioId.value = res.data.portfolioId;
      portfolioName.value = res.data.portfolioName;
      portfolioContent.value = res.data.portfolioContent;
      portfolioUrl.value = res.data.portfolioUrl;
      isPublic.value = res.data.isPublic;
      portfolioFileId.value = res.data.portfolioFileId;
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

      const filename = decodeURI(res.headers['content-disposition'])
                        .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
                        .replace(/['"]/g, '');

      portfolioFilename.value = filename;

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

// 버튼 설정
const buttonConfig = {
  update: {
    label: '저장하기',
    fontColor: 'white',
    backgroundColor: 'black'
  }
}

// 첨부파일 다운로드
function downloadFile() {
  const link = document.createElement('a');

  link.href = portfolioFile.value;
  link.style.display = 'none';
  link.download = portfolioFilename.value;

  document.body.appendChild(link);
  link.click();
  link.remove();
}

// 첨부파일 삭제
function deleteFile() {

  globalStore.confirm.openConfirm('첨부파일을 삭제하시겠습니까?', () => {
    customAxios
      .delete(`/portfolios/${portfolioId.value}/files/${portfolioFileId.value}`)
      .then(res => {
          URL.revokeObjectURL(portfolioFile.value);
          portfolioFilename.value = '';
          portfolioFile.value = null;
      })
      .catch(error => {

      })
  })

}

// 파일 Drag&Drop
const fileInput = ref(null);
const uploadFile = ref(null);
const isDragOver = ref(false);

// 드래그 시작
function onDragOver() {
  isDragOver.value = true;
}

// 드래그 종료
function onDragLeave() {
  isDragOver.value = false;
}

// 드랍 이벤트
function onDrop(e) {
  isDragOver.value = false;
  
  if(e.dataTransfer.files.length > 1) {
    globalStore.alert.openAlert('첨부파일은 1개만 등록 가능합니다');
    return;
  }
  
  const droppedFile = e.dataTransfer.files[0]
  if(droppedFile.type !== 'application/pdf') {
    globalStore.alert.openAlert("PDF 형식의 파일만 업로드할 수 있습니다");
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  if(droppedFile.size > maxSize) {
    globalStore.alert.openAlert("최대 5MB까지 업로드할 수 있습니다");
    return;
  }

  uploadFile.value = droppedFile;
}

// 파일 첨부 창 열기
function openFileInput() {
  fileInput.value.click();
}

// 파일 변경
function changeFile(e) {

  const selectedFile = e.target.files[0];
  fileInput.value.value = '';

  if(selectedFile.type !== 'application/pdf') {
    globalStore.alert.openAlert("PDF 파일만 업로드할 수 있습니다");
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  if(selectedFile.size > maxSize) {
    globalStore.alert.openAlert("최대 5MB까지 업로드할 수 있습니다");
    return;
  }

  uploadFile.value = selectedFile;
}

// 포트폴리오 내용 글자 수 검증
function validateContentLimit() {

  if(portfolioContent.value?.length > 500) {
    globalStore.alert.openAlert('최대 500자까지 입력 가능합니다');
    portfolioContent.value = portfolioContent.value.slice(0, 500);
  }

}

// 포트폴리오 수정 API
function updatePortfolio() {
  if(!validatePortfolioUpdateRequest()) {
    return;
  }

  const formData = new FormData();

  const request = {
    portfolioName: portfolioName.value,
    portfolioContent: portfolioContent.value,
    portfolioUrl: portfolioUrl.value,
    isPublic: isPublic.value
  }

  formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));
  formData.append('file', uploadFile.value);

  customAxios
    .patch(`/portfolios/${portfolioId.value}`, formData)
    .then(res => {
      globalStore.router.push({
        name: 'PortfolioDetail',
        params: {
          portfolioId: portfolioId.value
        }
      })
    })
    .catch(error => {
    })
}

// 포트폴리오 요청 검증
function validatePortfolioUpdateRequest() {

  if(!portfolioName.value?.trim()) {
    globalStore.alert.openAlert('포트폴리오 제목을 입력해주세요');
    return false;
  }

  if(!portfolioContent.value?.trim()) {
    globalStore.alert.openAlert('포트폴리오 내용을 입력해주세요');
    return false;
  }

  return true;
}

// 뒤로가기
function goToPortfolioDetail() {
  globalStore.router.push({
    name: 'PortfolioDetail',
    params: {
      portfolioId: portfolioId.value
    }
  });
}

</script>

<template>
  <div class="main">

    <div class="portfolio-update-button-container">
      <svg 
        class="prev-button"
        @click="goToPortfolioDetail()"
        xmlns="http://www.w3.org/2000/svg" height="24" fill="none" 
        stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
      >
        <line x1="10" y1="12" x2="2222" y2="12" />
        <polyline points="12 5 5 12 12 19" />
      </svg>

      <CommonButton
        class="update-button"
        @click="updatePortfolio()"
        :label="buttonConfig.update.label"
        :fontColor="buttonConfig.update.fontColor"
        :background-color="buttonConfig.update.backgroundColor"
      />
    </div>

    <div class="portfolio-update-container">
      <div class="portfolio-name">
        <label class="subject" for="portfolio-update-name">
          포트폴리오 제목
        </label>
        <input 
          type="text" 
          class="name-input"
          id="portfolio-update-name"
          v-model="portfolioName"
        >
      </div>
      <div class="portfolio-content">
        <label class="subject" for="portfolio-update-content">포트폴리오 내용</label>
        <textarea 
          class="content-textarea"
          id="portfolio-update-content"
          v-model="portfolioContent"
          @input="validateContentLimit()"  
        />
        <span class="content-length">
          {{ `${portfolioContent.length}/500` }}
        </span>

      </div>
      <div class="portfolio-url">
        <label class="subject" for="portfolio-update-url">포트폴리오 URL</label>
        <input 
          type="text"
          class="url-input"
          id="portfolio-update-url"
          v-model="portfolioUrl"
          placeholder="https://www.example.com"
        >
      </div>
      <div class="portfolio-file">
        <div class="subject-wanring">
          <label class="subject">첨부파일</label>
          <span class="warning" v-if="!portfolioFile">5MB 이하의 PDF 파일만 업로드 할 수 있습니다</span>
        </div>
        <div class="uploaded-file" v-if="portfolioFile">
          <span class="filename">{{ portfolioFilename }}</span>
          <div class="upload-file-button-container">
            <!-- 다운로드 버튼 svg -->
            <svg
              class="download-button"
              @click="downloadFile()"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            
            <!-- 삭제 버튼 svg -->
            <svg
              class="delete-button"
              @click="deleteFile()"
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20" fill="none"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
        </div>

        <div v-else>
          <div
            :class="isDragOver ? 'on-drag file-drop-zone' : 'file-drop-zone'"
            @dragover.prevent="onDragOver()"
            @dragleave.prevent="onDragLeave()"
            @drop.prevent="(e) => onDrop(e)"
            @click="openFileInput()"
          >
            <p v-if="!uploadFile">클릭하거나 파일을 드랍하여 업로드</p>
            <p v-else class="upload-file-name">{{ uploadFile.name }}</p>
            <input 
              hidden
              ref="fileInput"
              type="file"
              @change="e => changeFile(e)"
            >
          </div>
        </div>
      </div>

      <div class="portfolio-visibility">
        <span class="subject">공개범위</span>
        <div class="visibility-radio-button-container">
          <label>
            Public
            <input 
              type="radio"
              id="public"
              :value="true"
              v-model="isPublic"
            >
          </label>
          <label>
            Private
            <input 
              type="radio"
              id="private" 
              :value="false"
              v-model="isPublic"
            >
          </label>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.portfolio-update-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject {
  font-weight: bold;
  font-size: 18px;
}

.subject-wanring {
  display: flex;
  flex-direction: column;
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

.uploaded-file {
  display: flex;
}

.filename {
  flex: 1;
}

.upload-file-button-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.download-button:hover,
.delete-button:hover {
  cursor: pointer;
  color: #524FE1;
}

.file-drop-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  border: 2px dashed gray;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  color: gray;
  cursor: pointer;
  user-select: none;
}

.on-drag {
  background: rgba(128, 128, 128, 0.281);
}

.upload-file-name {
  font-size: 14px;
  color: #000;
}

.portfolio-visibility {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visibility-radio-button-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.portfolio-update-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prev-button {
  width: 30px;
}

.prev-button:hover {
  color: #524FE1;
}

.update-button {
  width: 30%;
}


</style>
