<template>
    <v-container class="fill-height bg-grey-lighten-4" fluid>
        <v-row justify="start" align="center">
            <v-col cols="12" sm="10" md="8" lg="12">

                <!-- 로고 영역 -->
                <div class="text-start mb-3">
                    <h1 class="text-h3 font-weight-black mb-2 text-primary">
                        제이웍스 워크스페이스
                    </h1>
                </div>
                
                <div class="text-start mb-3">
                    이름
                </div>
                <!-- 메뉴 카드 영역 -->
                <v-row>
                    <!-- 메모장 카드 -->
                    <v-col cols="12" md="6">
                        <v-card
                            class="mx-auto pa-6 transition-swing"
                            elevation="3"
                            hover
                            rounded="xl"
                            @click="goTo('/memo')"
                        >
                            <div class="d-flex flex-column align-center text-center">
                                <v-avatar color="blue-lighten-4" size="80" class="mb-4">
                                    <v-icon size="40" color="bule-darken-2">mdi-note-edit-outline</v-icon>
                                </v-avatar>
                                <h2 class="text-h5 font-weight-bold mb-2">메모장</h2>
                                <p class="text-body-2 text-grey-darken-1">
                                    회의 내용이나 번뜩이는 아이디어를<br>빠르게 기록하고 보관하세요.
                                </p>
                            </div>
                        </v-card>
                    </v-col>

                    <!-- 할 일 목록 카드 -->
                    <v-col cols="12" md="6">
                        <v-card
                            class="mx-auto pa-6 transition-swing"
                            elevation="3"
                            hover
                            rounded="xl"
                            @click="goTo('/todo')"
                        >
                            <div class="d-flex flex-column align-center text-center">
                                <v-avatar color="green-lighten-4" size="80" class="mb-4">
                                    <v-icon size="40" color="green-darken-2">mdi-check-circle-outline</v-icon>
                                </v-avatar>
                                <h2 class="text-h5 font-weight-bold mb-2">할 일 관리</h2>
                                <p class="text-body-2 text-grey-darken-1">
                                    기한이 정해진 프로젝트와<br>업무 스케줄을 체계적으로 관리하세요.
                                </p>
                            </div>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                        <v-card
                            class="mx-auto pa-6 transition-swing"
                            elevation="3"
                            hover
                            rounded="xl"
                            @click="goTo('/email')"
                        >
                            <div class="d-flex flex-column align-center text-center">
                                <v-avatar color="grey-lighten-4" size="80" class="mb-4">
                                    <v-icon size="40" color="grey-darken-2">mdi-email-outline</v-icon>
                                </v-avatar>
                                <h2 class="text-h5 font-weight-bold mb-2">이메일</h2>
                                <p class="text-body-2 text-grey-darken-1">
                                    이메일을 통해 외부 및 다른 부서들과<br>자료를 주고 받으세요.
                                </p>
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card
                            class="mx-auto pa-6 transition-swing"
                            elevation="3"
                            hover
                            rounded="xl"
                        >
                            <div class="d-flex flex-column align-center text-center">
                                <v-avatar color="grey-lighten-4" size="80" class="mb-4">
                                    <v-icon size="40" color="grey-darken-2">mdi-clipboard-outline</v-icon>
                                </v-avatar>
                                <h2 class="text-h5 font-weight-bold mb-2">게시판</h2>
                                <p class="text-body-2 text-grey-darken-1">
                                    게시판을 통해 회사 통합 자료를 받거나<br>최신 회사 소식을 확인해보세요.
                                </p>
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card
                            class="mx-auto pa-6 transition-swing"
                            elevation="3"
                            hover
                            rounded="xl"
                        >
                            <div class="d-flex flex-column align-center text-center">
                                <v-avatar color="grey-lighten-4" size="80" class="mb-4">
                                    <v-icon size="40" color="grey-darken-2">mdi-projecter-outline</v-icon>
                                </v-avatar>
                                <h2 class="text-h5 font-weight-bold mb-2">프로젝트</h2>
                                <p class="text-body-2 text-grey-darken-1">
                                    다른사람과 함께 프로젝트의 진척도를 확인하고<br>팀의 능률을 확인하세요.
                                </p>
                            </div>
                        </v-card>
                    </v-col>

                </v-row>

                <!-- 로그아웃 버튼 -->
                <div class="text-center mt-12">
                    <v-btn color="grey-darken-2" variant="text" prepend-icon="mdi-logout" @click="logout">
                        로그아웃
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

// Confirm Login
onMounted(() => {
    const currentUser = localStorage.getItem('user')
    if (!currentUser) {
        alert('로그인이 필요합니다.')
        router.push('/')
    }
})

// 메뉴 이동 함수
const goTo = (path) => {
    router.push(path)
}

// 로그아웃 함수
const logout = () => {
    localStorage.removeItem('user')
    router.push('/')
}
</script>

<style scoped>
.v-card {
    transition: transform 0.2s ease-in-out;
}
.v-card:hover {
    transform: translateY(-5px);
}
</style>