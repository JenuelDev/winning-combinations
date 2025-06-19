<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const numberOfCombinations = ref(6);
const toMaxNumber = ref(58);
const numberToGenerate = ref(1);
const generatedNumbers = ref<Array<number[]>>([]);

function getRandomNumbers(count: number, max: number) {
    for (let i = 0; i < numberToGenerate.value; i++) {
        const numbers: number[] = [];

        while (numbers.length < count) {
            const num = Math.floor(Math.random() * max) + 1;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }

        generatedNumbers.value.push(numbers);
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
    <div class="mx-auto max-w-2xl flex items-center justify-center min-h-100vh">
        <div class="text-center">
            <h1
                class="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl"
            >
                Winning Combinations For Lottery
            </h1>
            <p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                You can use this template to help create potential winning lottery combinations.
                However, please gamble responsibly—never bet money you can't afford to lose. Only
                spend what you’re comfortable letting go, and avoid playing unless you're absolutely
                sure about your decision.
            </p>
            <div class="flex gap-5 justify-center flex-wrap">
                <div class="flex flex-col text-left">
                    <label for="">Number of Combinations</label>
                    <input
                        type="number"
                        v-model="numberOfCombinations"
                        class="p-2 rounded-md border-gray-9 focus:border-indigo-6"
                    />
                </div>
                <div class="flex flex-col text-left">
                    <label for="">Max Number</label>
                    <input
                        type="number"
                        v-model="toMaxNumber"
                        class="p-2 rounded-md border-gray-9 focus:border-indigo-6"
                    />
                </div>
                <div class="flex flex-col text-left">
                    <label for="">How Many Combinations</label>
                    <input
                        type="number"
                        v-model="numberToGenerate"
                        class="p-2 rounded-md border-gray-9 focus:border-indigo-6"
                    />
                </div>
            </div>
            <div class="mt-10 flex items-center justify-center gap-x-6 pb-5">
                <button
                    class="rounded-md bg-gray-9 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 decoration-none border-none cursor-pointer flex items-center gap-2"
                    @click="getRandomNumbers(numberOfCombinations, toMaxNumber)"
                >
                    <Icon icon="fluent:lottery-24-filled" class="text-2xl" />
                    Generate Combinations
                </button>
            </div>
            <div
                v-if="generatedNumbers.length > 0"
                class="flex flex-col justify-center items-center gap-2 pb-5"
            >
                <div>Combinations:</div>
                <div v-for="(combination, i) in generatedNumbers" :key="i">
                    <div class="p-3 bg-gray-5 rounded-md text-white flex items-center gap-5">
                        <div>
                            {{ convertCombinationToString(combination) }}
                        </div>

                        <div
                            title="Copy"
                            class="group cursor-pointer relative w-[20px] h-[20px]"
                            @click="copyCombination(convertCombinationToString(combination))"
                        >
                            <Icon
                                icon="material-symbols:content-copy"
                                class="text-2xl group-hover:text-3xl transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center mt-5">
                    <div class="mb-3">
                        <strong>Note:</strong> If you won a lottery, and want to thank me for the
                        <br />
                        help. You can buy me a coffee by clicking the button below.
                    </div>
                    <a
                        href="https://buymeacoffee.com/jenuel.dev"
                        class="bg-orange-600 p-2 rounded-md flex items-center gap-2 cursor-pointer border-none text-white decoration-none px-2 hover:px-3 transition-all hover:underline hover:text-lg"
                    >
                        Send a Coffee
                        <Icon icon="material-symbols:coffee" class="text-2xl" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
