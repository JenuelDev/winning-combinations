<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { generateWinningCombination } from "./util/winning-combination";
import IncludeNumberModal from "./components/IncludeNumberModal.vue";
import { NButton, NPopconfirm } from "naive-ui";
import ExcludeNumberModal from "./components/ExcludeNumberModal.vue";
import AtleastHasNumberModal from "./components/AtleastHasNumberModal.vue";
import ChooseWinningLottery from "./components/ChooseWinningLottery.vue";
import UltraLotto658 from "@/assets/images/ultra-lotto-6-58.png";

const atleastHasNumberModalRef = ref<InstanceType<typeof AtleastHasNumberModal> | null>(null);
const includeNumberModalRef = ref<InstanceType<typeof IncludeNumberModal> | null>(null);
const excludeNumberModalRef = ref<InstanceType<typeof ExcludeNumberModal> | null>(null);
const numberOfCombinations = ref(6);
const toMaxNumber = ref(58);
const numberToGenerate = ref(1);
const generatedNumbers = ref<Array<number[]>>([]);
const includeNumbers = ref<number[]>([]);
const excludeNumbers = ref<number[]>([]);
const atleastHasNumbers = ref<number[]>([]);
const selectedLottery = ref({
    label: "Ultra Lotto 6/58",
    key: "ultra_lotto_6_58",
    img: UltraLotto658,
    number_of_digits: 6,
    max_number: 58
});

watch(() => selectedLottery.value, (newVal) => {
    numberOfCombinations.value = newVal.number_of_digits;
    toMaxNumber.value = newVal.max_number;
}, {
    deep: true
});

function getRandomNumbers(count: number, max: number) {
    for (let i = 0; i < numberToGenerate.value; i++) {
        generatedNumbers.value.push(generateWinningCombination(count, max, includeNumbers.value, excludeNumbers.value, atleastHasNumbers.value));
    }
}

function convertCombinationToString(combination: number[]) {
    return combination
        .map((num) => {
            return num < 10 ? `0${num}` : num;
        })
        .join(" - ");
}

async function copyCombination(num: string) {
    await navigator.clipboard.writeText(num);
    alert("Copied to clipboard");
}
</script>

<template>
    <div class="mx-auto max-w-3xl flex items-center justify-center min-h-100vh py-20">
        <div class="text-center">
            <h1 class="text-3xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl">
                Winning Combinations For Lottery
            </h1>
            <p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                You can use this template to help create potential winning lottery combinations.
                However, please gamble responsibly—never bet money you can't afford to lose. Only
                spend what you’re comfortable letting go, and avoid playing unless you're absolutely
                sure about your decision.
            </p>
            <div>
                <h3>Choose Winning Lottery</h3>
                <ChooseWinningLottery v-model="selectedLottery" />
            </div>
            <div>
                <h3>Set Parameters</h3>
                <div class="flex justify-center mb-5 text-center">
                    <div>
                        <div> How Many Combinations: <NButton size="tiny" @click="numberToGenerate = 1">
                                <template #icon>
                                    <Icon icon="carbon:reset-alt" />
                                </template>
                                Reset
                            </NButton>
                        </div>
                        <input type="number" v-model="numberToGenerate"
                            class="p-2 rounded-md border-gray-9 focus:border-indigo-6 max-w-150px" />
                    </div>
                </div>
                <div class="mb-5">
                    <div> Include Numbers: <NButton size="tiny" @click="includeNumbers = []">
                            <template #icon>
                                <Icon icon="carbon:reset-alt" />
                            </template>
                            Reset
                        </NButton>
                    </div>
                    <div class="flex gap-2 justify-center">
                        <template v-for="(num, i) in includeNumbers" :key="i">
                            <NPopconfirm @positive-click="includeNumbers.splice(i, 1)">
                                <template #trigger>
                                    <div
                                        class="bg-green-2 h-30px w-30px rounded-full flex items-center justify-center relative cursor-pointer">
                                        {{ num }}
                                    </div>
                                </template>
                                Remove Number?
                            </NPopconfirm>
                        </template>
                        <div
                            class="bg-gray-2 h-30px w-30px rounded-full flex items-center justify-center relative cursor-pointer">
                            <Icon icon="material-symbols:add" class="text-2xl"
                                @click="includeNumberModalRef?.toggleModal()" />
                        </div>
                    </div>
                </div>
                <div class="mb-5">
                    <div>Exclude Numbers: <NButton size="tiny" @click="excludeNumbers = []">
                            <template #icon>
                                <Icon icon="carbon:reset-alt" />
                            </template>
                            Reset
                        </NButton>
                    </div>
                    <div class="flex gap-2 justify-center">
                        <template v-for="(num, i) in excludeNumbers" :key="i">
                            <NPopconfirm @positive-click="excludeNumbers.splice(i, 1)">
                                <template #trigger>
                                    <div
                                        class="bg-red-2 h-30px w-30px rounded-full flex items-center justify-center relative cursor-pointer">
                                        {{ num }}
                                    </div>
                                </template>
                                Remove Number?
                            </NPopconfirm>
                        </template>
                        <div
                            class="bg-gray-2 h-30px w-30px rounded-full flex items-center justify-center relative cursor-pointer">
                            <Icon icon="material-symbols:add" class="text-2xl"
                                @click="excludeNumberModalRef?.toggleModal()" />
                        </div>
                    </div>
                </div>
                <div>
                    <div>Atleast Has One of This Numbers: <NButton size="tiny" @click="atleastHasNumbers = []">
                            <template #icon>
                                <Icon icon="carbon:reset-alt" />
                            </template>
                            Reset
                        </NButton>
                    </div>
                    <div class="flex gap-2 justify-center">
                        <template v-for="(num, i) in atleastHasNumbers" :key="i">
                            <NPopconfirm @positive-click="atleastHasNumbers.splice(i, 1)">
                                <template #trigger>
                                    <div
                                        class="bg-purple-2 h-30px w-30px rounded-full flex items-center justify-center relative cursor-pointer">
                                        {{ num }}
                                    </div>
                                </template>
                                Remove Number?
                            </NPopconfirm>
                        </template>
                        <div
                            class="bg-gray-2 h-30px w-30px rounded-full flex items-center justify-center relative cursor-pointer">
                            <Icon icon="material-symbols:add" class="text-2xl"
                                @click="atleastHasNumberModalRef?.toggleModal()" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-10 flex items-center justify-center gap-x-6 pb-5">
                <button
                    class="rounded-md bg-gray-9 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 decoration-none border-none cursor-pointer flex items-center gap-2"
                    @click="getRandomNumbers(numberOfCombinations, toMaxNumber)">
                    <Icon icon="fluent:lottery-24-filled" class="text-2xl" />
                    Generate Combination{{ numberToGenerate > 1 ? "s" : "" }}
                </button>
                <button v-if="generatedNumbers.length > 0"
                    class="rounded-md bg-gray-3 px-3.5 py-2.5 text-sm font-semibold text-dark shadow-xs hover:bg-gray-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 decoration-none border-none cursor-pointer flex items-center gap-2"
                    @click="generatedNumbers = []">
                    <Icon icon="material-symbols:refresh" class="text-2xl" />
                    Reset
                </button>
            </div>
            <div v-if="generatedNumbers.length > 0" class="flex flex-col justify-center items-center gap-2 pb-5">
                <div>Combinations:</div>
                <div v-for="(combination, i) in generatedNumbers" :key="i">
                    <div class="p-3 bg-gray-5 rounded-md text-white flex items-center gap-5">
                        <div>
                            {{ convertCombinationToString(combination) }}
                        </div>

                        <div title="Copy" class="group cursor-pointer relative w-[20px] h-[20px]"
                            @click="copyCombination(convertCombinationToString(combination))">
                            <Icon icon="material-symbols:content-copy"
                                class="text-2xl group-hover:text-3xl transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center mt-5">
                <div class="mb-3">
                    <strong>Note:</strong> If you won a lottery, and want to thank me for the
                    <br />
                    help. You can buy me a coffee by clicking the button below.
                </div>
                <a href="https://buymeacoffee.com/jenuel.dev"
                    class="bg-orange-600 p-2 rounded-md flex items-center gap-2 cursor-pointer border-none text-white decoration-none px-2 hover:px-3 transition-all hover:underline hover:text-lg">
                    Send a Coffee
                    <Icon icon="material-symbols:coffee" class="text-2xl" />
                </a>
            </div>
        </div>
        <IncludeNumberModal ref="includeNumberModalRef" @include="(number) => {
            includeNumbers.push(number)
            excludeNumbers = excludeNumbers.filter((num) => num !== number)
        }" :max="toMaxNumber" />
        <ExcludeNumberModal ref="excludeNumberModalRef" @include="(number) => {
            excludeNumbers.push(number)
            includeNumbers = includeNumbers.filter((num) => num !== number)
        }" :max="toMaxNumber" />
        <AtleastHasNumberModal ref="atleastHasNumberModalRef" @include="(number) => {
            atleastHasNumbers.push(number)
            includeNumbers = includeNumbers.filter((num) => num !== number)
        }" :max="toMaxNumber" />
    </div>
</template>
