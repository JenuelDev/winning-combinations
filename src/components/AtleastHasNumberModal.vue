<script setup lang="ts">
import { NCard, NInputNumber, NModal } from 'naive-ui';
import { ref } from 'vue';

defineProps({
    max: {
        type: Number,
        default: 58
    }
})

const emit = defineEmits(['include'])

const showModal = ref(false);
const value = ref<number | null>(null);

function toggleModal() {
    value.value = null;
    showModal.value = !showModal.value
}

function handleSubmit() {
    emit('include', value.value ?? 0);
    toggleModal();
}

defineExpose({
    toggleModal
})
</script>

<template>
    <NModal v-model:show="showModal">
        <NCard class="w-200px" title="Add Number">
            <form @submit.prevent="handleSubmit">
                <NInputNumber v-model:value="value" :max="max" :min="1" />
                <small>Press Enter</small>
            </form>
        </NCard>
    </NModal>
</template>