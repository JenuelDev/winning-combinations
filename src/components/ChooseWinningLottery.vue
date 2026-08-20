<script lang="ts" setup>
import { lotteryOptions, type LotteryOption } from "@/config/lotteries";

const model = defineModel<LotteryOption>();
</script>

<template>
    <div class="picker">
        <button v-for="value in lotteryOptions" :key="value.key" type="button" class="card"
            :class="{ 'card--on': model?.key === value.key }" :aria-pressed="model?.key === value.key"
            @click="model = value">
            <span class="check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </span>
            <img :src="value.img" :alt="value.label" width="98" height="64" loading="lazy" decoding="async" />
            <span class="tag">6 / {{ value.max_number }}</span>
        </button>
    </div>
</template>

<style scoped>
.picker {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.85rem;
}

.card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 120px;
    padding: 0.85rem 0.6rem 0.7rem;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: transform 0.2s var(--ease), border-color 0.2s var(--ease),
        box-shadow 0.2s var(--ease);
}

.card:hover {
    transform: translateY(-3px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-md);
}

.card--on {
    border-color: var(--brand-2);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.16), var(--shadow-md);
}

.card img {
    height: 44px;
    width: auto;
    object-fit: contain;
}

.tag {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
}

.card--on .tag {
    color: var(--brand-2);
}

.check {
    position: absolute;
    top: -8px;
    right: -8px;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--brand-grad);
    color: #fff;
    box-shadow: var(--shadow-sm);
    transform: scale(0);
    transition: transform 0.22s var(--ease);
}

.card--on .check {
    transform: scale(1);
}
</style>
