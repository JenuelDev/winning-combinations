<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
    defineProps<{
        title?: string;
        max?: number;
        accent?: "green" | "red" | "violet";
    }>(),
    {
        title: "Add Number",
        max: 58,
        accent: "violet",
    }
);

const emit = defineEmits<{ add: [value: number] }>();

const show = ref(false);
const selected = ref<number | null>(null);

const numbers = computed(() =>
    Array.from({ length: props.max }, (_, i) => i + 1)
);

function toggleModal() {
    selected.value = null;
    show.value = !show.value;
}

function close() {
    show.value = false;
}

function choose(n: number) {
    selected.value = selected.value === n ? null : n;
}

function confirm() {
    if (selected.value == null) return;
    emit("add", selected.value);
    close();
}

defineExpose({ toggleModal });
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="overlay" :data-accent="accent" @click.self="close" @keydown.esc="close">
                <div class="panel" role="dialog" aria-modal="true" tabindex="-1">
                    <header class="panel__head">
                        <h3 class="panel__title">{{ title }}</h3>
                        <button class="icon-btn" aria-label="Close" @click="close">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                                stroke-width="2.2" stroke-linecap="round">
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </header>

                    <p class="panel__hint">Tap a number to select it.</p>

                    <div class="grid">
                        <button v-for="n in numbers" :key="n" class="num" :class="{ 'num--on': selected === n }"
                            @click="choose(n)">
                            {{ n < 10 ? "0" + n : n }}
                        </button>
                    </div>

                    <footer class="panel__foot">
                        <span class="preview">
                            <template v-if="selected != null">
                                Selected: <strong>{{ selected < 10 ? "0" + selected : selected }}</strong>
                            </template>
                            <template v-else>No number selected</template>
                        </span>
                        <button class="add" :disabled="selected == null" @click="confirm">Add</button>
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(6px);
}

.panel {
    width: 100%;
    max-width: 380px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
}

.panel__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.25rem 0.5rem;
}

.panel__title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.panel__hint {
    margin: 0;
    padding: 0 1.25rem 0.75rem;
    font-size: 0.82rem;
    color: var(--ink-faint);
}

.icon-btn {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 10px;
    background: var(--card-2);
    color: var(--ink-soft);
    cursor: pointer;
    transition: background 0.2s var(--ease), color 0.2s var(--ease);
}

.icon-btn:hover {
    background: #eef2ff;
    color: var(--ink);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
    gap: 8px;
    padding: 0 1.25rem;
    overflow-y: auto;
}

.num {
    aspect-ratio: 1;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card-2);
    color: var(--ink);
    font-size: 0.95rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: transform 0.15s var(--ease), background 0.15s var(--ease),
        border-color 0.15s var(--ease), color 0.15s var(--ease);
}

.num:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    color: var(--accent);
}

.num--on,
.num--on:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -8px var(--accent);
}

.panel__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem 1.25rem;
    margin-top: 0.75rem;
}

.preview {
    font-size: 0.85rem;
    color: var(--ink-soft);
}

.preview strong {
    font-variant-numeric: tabular-nums;
}

.add {
    border: none;
    border-radius: 12px;
    padding: 0.6rem 1.4rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
    background: var(--accent);
    cursor: pointer;
    transition: transform 0.15s var(--ease), opacity 0.15s var(--ease);
}

.add:hover:not(:disabled) {
    transform: translateY(-1px);
}

.add:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Accent theming */
.overlay[data-accent="green"] {
    --accent: var(--green);
}

.overlay[data-accent="red"] {
    --accent: var(--red);
}

.overlay[data-accent="violet"] {
    --accent: var(--violet);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s var(--ease);
}

.modal-enter-active .panel,
.modal-leave-active .panel {
    transition: transform 0.28s var(--ease), opacity 0.28s var(--ease);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .panel,
.modal-leave-to .panel {
    transform: translateY(16px) scale(0.96);
    opacity: 0;
}
</style>
