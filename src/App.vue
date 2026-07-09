<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { generateWinningCombination } from "./util/winning-combination";
import NumberModal from "./components/NumberModal.vue";
import ChooseWinningLottery from "./components/ChooseWinningLottery.vue";
import UltraLotto658 from "@/assets/images/ultra-lotto-6-58.webp";

const includeModalRef = ref<InstanceType<typeof NumberModal> | null>(null);
const excludeModalRef = ref<InstanceType<typeof NumberModal> | null>(null);
const atleastModalRef = ref<InstanceType<typeof NumberModal> | null>(null);

const numberOfCombinations = ref(6);
const toMaxNumber = ref(58);
const numberToGenerate = ref(4);
const generatedNumbers = ref<Array<number[]>>([]);
const includeNumbers = ref<number[]>([]);
const excludeNumbers = ref<number[]>([]);
const atleastHasNumbers = ref<number[]>([]);
const copiedIndex = ref<number | null>(null);
const resultsRef = ref<HTMLElement | null>(null);
const actionsRef = ref<HTMLElement | null>(null);
const actionsInView = ref(true);
let actionsObserver: IntersectionObserver | undefined;
let copyTimer: ReturnType<typeof setTimeout> | undefined;

// Show the floating action bar only once there are results AND the main
// Generate button has scrolled out of view.
const showFloating = computed(
    () => generatedNumbers.value.length > 0 && !actionsInView.value
);

onMounted(() => {
    if (!actionsRef.value) return;
    actionsObserver = new IntersectionObserver(
        ([entry]) => (actionsInView.value = entry.isIntersecting),
        { threshold: 0 }
    );
    actionsObserver.observe(actionsRef.value);
});

onBeforeUnmount(() => actionsObserver?.disconnect());

const selectedLottery = ref({
    label: "Ultra Lotto 6/58",
    key: "ultra_lotto_6_58",
    img: UltraLotto658,
    number_of_digits: 6,
    max_number: 58,
});

watch(
    () => selectedLottery.value,
    (newVal) => {
        numberOfCombinations.value = newVal.number_of_digits;
        toMaxNumber.value = newVal.max_number;
        // Drop any selections that no longer fit the new number range.
        includeNumbers.value = includeNumbers.value.filter((n) => n <= newVal.max_number);
        excludeNumbers.value = excludeNumbers.value.filter((n) => n <= newVal.max_number);
        atleastHasNumbers.value = atleastHasNumbers.value.filter((n) => n <= newVal.max_number);
    },
    { deep: true }
);

function pad(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

function clampCount() {
    let v = Math.floor(Number(numberToGenerate.value) || 1);
    v = Math.max(1, Math.min(50, v));
    numberToGenerate.value = v;
}

function stepCount(delta: number) {
    numberToGenerate.value = Number(numberToGenerate.value) || 1;
    numberToGenerate.value += delta;
    clampCount();
}

async function generate() {
    clampCount();
    const results: number[][] = [];
    for (let i = 0; i < numberToGenerate.value; i++) {
        results.push(
            generateWinningCombination(
                numberOfCombinations.value,
                toMaxNumber.value,
                includeNumbers.value,
                excludeNumbers.value,
                atleastHasNumbers.value
            )
        );
    }
    generatedNumbers.value = results;

    // Wait for the results section to render, then smooth-scroll to it.
    await nextTick();
    resultsRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetAll() {
    generatedNumbers.value = [];
    includeNumbers.value = [];
    excludeNumbers.value = [];
    atleastHasNumbers.value = [];
    numberToGenerate.value = 4;
}

function combinationToString(combination: number[]) {
    return combination.map(pad).join(" - ");
}

async function copyCombination(combination: number[], index: number) {
    await navigator.clipboard.writeText(combinationToString(combination));
    copiedIndex.value = index;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copiedIndex.value = null), 1600);
}

// --- number-list mutations (dedupe + keep the three lists mutually exclusive) ---
function addInclude(n: number) {
    if (includeNumbers.value.length >= numberOfCombinations.value) return;
    if (!includeNumbers.value.includes(n)) includeNumbers.value.push(n);
    excludeNumbers.value = excludeNumbers.value.filter((x) => x !== n);
    atleastHasNumbers.value = atleastHasNumbers.value.filter((x) => x !== n);
}

function addExclude(n: number) {
    if (!excludeNumbers.value.includes(n)) excludeNumbers.value.push(n);
    includeNumbers.value = includeNumbers.value.filter((x) => x !== n);
    atleastHasNumbers.value = atleastHasNumbers.value.filter((x) => x !== n);
}

function addAtleast(n: number) {
    if (!atleastHasNumbers.value.includes(n)) atleastHasNumbers.value.push(n);
    includeNumbers.value = includeNumbers.value.filter((x) => x !== n);
    excludeNumbers.value = excludeNumbers.value.filter((x) => x !== n);
}
</script>

<template>
    <div class="page">
        <header class="hero">
            <span class="badge">🎱 Play responsibly</span>
            <h1 class="hero__title">Winning Combinations<br />for the Lottery</h1>
            <p class="hero__sub">
                Generate potential lottery combinations using a cryptographically secure
                random generator. Please gamble responsibly — never bet money you can't
                afford to lose, and only play when you're truly comfortable with the decision.
            </p>
        </header>

        <main class="card">
            <!-- Lottery -->
            <section class="section">
                <div class="section__label">
                    <span class="step-no">1</span>
                    Choose your lottery
                </div>
                <ChooseWinningLottery v-model="selectedLottery" />
            </section>

            <div class="divider"></div>

            <!-- Parameters -->
            <section class="section">
                <div class="section__label">
                    <span class="step-no">2</span>
                    Set your parameters
                </div>

                <!-- How many -->
                <div class="field">
                    <div class="field__head">
                        <span class="field__name">How many combinations</span>
                    </div>
                    <div class="stepper">
                        <button class="stepper__btn" aria-label="Fewer" @click="stepCount(-1)">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                                stroke-width="2.4" stroke-linecap="round">
                                <path d="M5 12h14" />
                            </svg>
                        </button>
                        <input class="stepper__input" type="number" min="1" max="50" v-model="numberToGenerate"
                            @change="clampCount" @blur="clampCount" />
                        <button class="stepper__btn" aria-label="More" @click="stepCount(1)">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                                stroke-width="2.4" stroke-linecap="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Include -->
                <div class="field">
                    <div class="field__head">
                        <span class="field__name">
                            <span class="dot dot--green"></span>Include numbers
                        </span>
                        <button v-if="includeNumbers.length" class="reset-link" @click="includeNumbers = []">
                            Reset
                        </button>
                    </div>
                    <div class="chips">
                        <span v-for="(num, i) in includeNumbers" :key="num" class="chip chip--green">
                            {{ pad(num) }}
                            <button class="chip__x" aria-label="Remove" @click="includeNumbers.splice(i, 1)">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                                    stroke-width="2.6" stroke-linecap="round">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </span>
                        <button class="chip-add" :disabled="includeNumbers.length >= numberOfCombinations"
                            @click="includeModalRef?.toggleModal()">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                                stroke-width="2.4" stroke-linecap="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add
                        </button>
                    </div>
                    <p class="field__hint">These numbers always appear in every combination.</p>
                </div>

                <!-- Exclude -->
                <div class="field">
                    <div class="field__head">
                        <span class="field__name">
                            <span class="dot dot--red"></span>Exclude numbers
                        </span>
                        <button v-if="excludeNumbers.length" class="reset-link" @click="excludeNumbers = []">
                            Reset
                        </button>
                    </div>
                    <div class="chips">
                        <span v-for="(num, i) in excludeNumbers" :key="num" class="chip chip--red">
                            {{ pad(num) }}
                            <button class="chip__x" aria-label="Remove" @click="excludeNumbers.splice(i, 1)">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                                    stroke-width="2.6" stroke-linecap="round">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </span>
                        <button class="chip-add" @click="excludeModalRef?.toggleModal()">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                                stroke-width="2.4" stroke-linecap="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add
                        </button>
                    </div>
                    <p class="field__hint">These numbers never appear in any combination.</p>
                </div>

                <!-- At least one -->
                <div class="field">
                    <div class="field__head">
                        <span class="field__name">
                            <span class="dot dot--violet"></span>At least one of these
                        </span>
                        <button v-if="atleastHasNumbers.length" class="reset-link" @click="atleastHasNumbers = []">
                            Reset
                        </button>
                    </div>
                    <div class="chips">
                        <span v-for="(num, i) in atleastHasNumbers" :key="num" class="chip chip--violet">
                            {{ pad(num) }}
                            <button class="chip__x" aria-label="Remove" @click="atleastHasNumbers.splice(i, 1)">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                                    stroke-width="2.6" stroke-linecap="round">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </span>
                        <button class="chip-add" @click="atleastModalRef?.toggleModal()">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                                stroke-width="2.4" stroke-linecap="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add
                        </button>
                    </div>
                    <p class="field__hint">Each combination will contain at least one of these numbers.</p>
                </div>
            </section>

            <!-- Actions -->
            <div ref="actionsRef" class="actions">
                <button class="btn btn--primary" @click="generate">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3l1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9L12 3z" />
                        <path d="M19 14l.8 1.9L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-1.1L19 14z" />
                    </svg>
                    Generate combination{{ numberToGenerate > 1 ? "s" : "" }}
                </button>
                <button v-if="generatedNumbers.length" class="btn btn--ghost" @click="resetAll">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Reset
                </button>
            </div>
        </main>

        <!-- Results -->
        <section v-if="generatedNumbers.length" ref="resultsRef" class="results">
            <h2 class="results__title">
                Your combinations
                <span class="results__count">{{ generatedNumbers.length }}</span>
            </h2>
            <div class="results__grid">
                <div v-for="(combination, i) in generatedNumbers" :key="i" class="result">
                    <div class="balls">
                        <span v-for="num in combination" :key="num" class="ball">{{ pad(num) }}</span>
                    </div>
                    <button class="copy" :class="{ 'copy--done': copiedIndex === i }" title="Copy combination"
                        @click="copyCombination(combination, i)">
                        <svg v-if="copiedIndex === i" viewBox="0 0 24 24" width="16" height="16" fill="none"
                            stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="11" height="11" rx="2" />
                            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </svg>
                        <span>{{ copiedIndex === i ? "Copied" : "Copy" }}</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <p class="footer__note">
                <strong>Thank you!</strong> If these numbers brought you luck and you'd like
                to say thanks, you can buy me a coffee. ☕
            </p>
            <a class="coffee" href="https://buymeacoffee.com/jenuel.dev" target="_blank" rel="noopener">
                Send a coffee
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8h1a3 3 0 0 1 0 6h-1" />
                    <path d="M3 8h15v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8z" />
                    <path d="M6 2v2M10 2v2M14 2v2" />
                </svg>
            </a>
        </footer>

        <!-- Floating actions (shown when the main Generate button is off-screen) -->
        <Transition name="float">
            <div v-if="showFloating" class="floating">
                <button class="btn btn--primary btn--sm" @click="generate">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3l1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9L12 3z" />
                        <path d="M19 14l.8 1.9L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-1.1L19 14z" />
                    </svg>
                    Generate
                </button>
                <button class="btn btn--ghost btn--sm" @click="resetAll">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Reset
                </button>
            </div>
        </Transition>

        <!-- Modals -->
        <NumberModal ref="includeModalRef" title="Include a number" accent="green" :max="toMaxNumber"
            @add="addInclude" />
        <NumberModal ref="excludeModalRef" title="Exclude a number" accent="red" :max="toMaxNumber"
            @add="addExclude" />
        <NumberModal ref="atleastModalRef" title="Add a required number" accent="violet" :max="toMaxNumber"
            @add="addAtleast" />
    </div>
</template>

<style scoped>
.page {
    max-width: 720px;
    margin: 0 auto;
    padding: clamp(2rem, 5vw, 4rem) 1.1rem 3rem;
}

/* Hero */
.hero {
    text-align: center;
    margin-bottom: 2rem;
}

.badge {
    display: inline-block;
    padding: 0.35rem 0.85rem;
    margin-bottom: 1.1rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--brand-2);
    background: rgba(79, 70, 229, 0.08);
    border: 1px solid rgba(79, 70, 229, 0.18);
    border-radius: 999px;
}

.hero__title {
    margin: 0 0 1rem;
    font-size: clamp(2.2rem, 6vw, 3.4rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #1e293b 0%, #4f46e5 60%, #7c3aed 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.hero__sub {
    max-width: 34rem;
    margin: 0 auto;
    font-size: 1.02rem;
    line-height: 1.65;
    color: var(--ink-soft);
}

/* Card */
.card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-md);
    padding: clamp(1.25rem, 3.5vw, 2rem);
}

.section {
    margin: 0;
}

.section__label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.1rem;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.step-no {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #fff;
    background: var(--brand-grad);
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
}

.divider {
    height: 1px;
    margin: 1.75rem 0;
    background: linear-gradient(to right, transparent, var(--border-strong), transparent);
}

/* Fields */
.field {
    margin-bottom: 1.4rem;
}

.field:last-child {
    margin-bottom: 0;
}

.field__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
}

.field__name {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.94rem;
    font-weight: 600;
    color: var(--ink);
}

.field__hint {
    margin: 0.55rem 0 0;
    font-size: 0.8rem;
    color: var(--ink-faint);
}

.dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.dot--green {
    background: var(--green);
}

.dot--red {
    background: var(--red);
}

.dot--violet {
    background: var(--violet);
}

.reset-link {
    border: none;
    background: none;
    padding: 0.15rem 0.35rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--ink-faint);
    cursor: pointer;
    border-radius: 6px;
    transition: color 0.15s var(--ease), background 0.15s var(--ease);
}

.reset-link:hover {
    color: var(--red);
    background: var(--red-bg);
}

/* Stepper */
.stepper {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.3rem;
    background: var(--card-2);
    border: 1px solid var(--border);
    border-radius: 14px;
}

.stepper__btn {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 10px;
    background: var(--card);
    color: var(--ink);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: transform 0.15s var(--ease), color 0.15s var(--ease);
}

.stepper__btn:hover {
    color: var(--brand-2);
    transform: translateY(-1px);
}

.stepper__input {
    width: 68px;
    height: 38px;
    border: none;
    background: transparent;
    text-align: center;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
    -moz-appearance: textfield;
    appearance: textfield;
}

.stepper__input::-webkit-outer-spin-button,
.stepper__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.stepper__input:focus {
    outline: none;
}

/* Chips */
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.35rem 0.35rem 0.7rem;
    font-size: 0.88rem;
    font-weight: 700;
    border-radius: 999px;
    font-variant-numeric: tabular-nums;
    animation: chip-in 0.2s var(--ease);
}

.chip--green {
    color: #065f46;
    background: var(--green-bg);
}

.chip--red {
    color: #9f1239;
    background: var(--red-bg);
}

.chip--violet {
    color: #5b21b6;
    background: var(--violet-bg);
}

.chip__x {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.08);
    color: inherit;
    cursor: pointer;
    transition: background 0.15s var(--ease);
}

.chip__x:hover {
    background: rgba(15, 23, 42, 0.18);
}

.chip-add {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.4rem 0.85rem 0.4rem 0.65rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--ink-soft);
    background: var(--card-2);
    border: 1.5px dashed var(--border-strong);
    border-radius: 999px;
    cursor: pointer;
    transition: color 0.15s var(--ease), border-color 0.15s var(--ease),
        background 0.15s var(--ease);
}

.chip-add:hover:not(:disabled) {
    color: var(--brand-2);
    border-color: var(--brand-2);
    background: #fff;
}

.chip-add:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

/* Actions */
.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 1.9rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.85rem 1.5rem;
    font-size: 0.98rem;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease),
        background 0.18s var(--ease);
}

.btn--primary {
    color: #fff;
    background: var(--brand-grad);
    box-shadow: var(--shadow-lg);
}

.btn--primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 28px 64px -18px rgba(79, 70, 229, 0.5);
}

.btn--primary:active {
    transform: translateY(0);
}

.btn--ghost {
    color: var(--ink);
    background: var(--card);
    border: 1px solid var(--border-strong);
    box-shadow: var(--shadow-sm);
}

.btn--ghost:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn--sm {
    padding: 0.6rem 1.15rem;
    font-size: 0.9rem;
}

/* Floating action bar */
.floating {
    position: fixed;
    left: 50%;
    bottom: max(1.1rem, env(safe-area-inset-bottom));
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    gap: 0.5rem;
    padding: 0.45rem;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(14px);
    border: 1px solid var(--border);
    border-radius: 999px;
    box-shadow: var(--shadow-lg);
}

.floating .btn--primary {
    box-shadow: none;
}

.floating .btn--ghost {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
}

.float-enter-active,
.float-leave-active {
    transition: opacity 0.28s var(--ease), transform 0.28s var(--ease);
}

.float-enter-from,
.float-leave-to {
    opacity: 0;
    transform: translate(-50%, 20px);
}

/* Results */
.results {
    margin-top: 2.25rem;
    scroll-margin-top: 1.25rem;
}

.results__title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    justify-content: center;
    margin: 0 0 1.25rem;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.results__count {
    display: grid;
    place-items: center;
    min-width: 26px;
    height: 26px;
    padding: 0 0.5rem;
    font-size: 0.8rem;
    color: #fff;
    background: var(--brand-grad);
    border-radius: 999px;
}

.results__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 0.85rem;
}

.result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem 0.95rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
    animation: result-in 0.35s var(--ease) both;
}

.balls {
    display: grid;
    grid-template-columns: repeat(3, 38px);
    gap: 0.45rem;
    justify-items: center;
}

.ball {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    font-size: 0.9rem;
    font-weight: 800;
    color: #7c2d12;
    font-variant-numeric: tabular-nums;
    border-radius: 50%;
    background:
        radial-gradient(circle at 32% 28%, #fffbeb 0%, #fcd34d 45%, #f59e0b 100%);
    box-shadow:
        inset 0 -3px 6px rgba(180, 83, 9, 0.35),
        inset 0 2px 3px rgba(255, 255, 255, 0.7),
        0 3px 6px rgba(180, 83, 9, 0.25);
}

.copy {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
    padding: 0.5rem 0.8rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink-soft);
    background: var(--card-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: color 0.15s var(--ease), border-color 0.15s var(--ease),
        background 0.15s var(--ease);
}

.copy:hover {
    color: var(--brand-2);
    border-color: var(--brand-2);
}

.copy--done,
.copy--done:hover {
    color: var(--green);
    border-color: var(--green);
    background: var(--green-bg);
}

/* Footer */
.footer {
    margin-top: 3rem;
    text-align: center;
}

.footer__note {
    max-width: 30rem;
    margin: 0 auto 1.1rem;
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--ink-soft);
}

.coffee {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.3rem;
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: none;
    color: #fff;
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    border-radius: 12px;
    box-shadow: 0 14px 30px -12px rgba(234, 88, 12, 0.6);
    transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease);
}

.coffee:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -14px rgba(234, 88, 12, 0.7);
}

@keyframes chip-in {
    from {
        opacity: 0;
        transform: scale(0.85);
    }
}

@keyframes result-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
}
</style>
