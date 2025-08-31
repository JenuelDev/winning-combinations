<script lang="ts" setup>
import UltraLotto658 from "@/assets/images/ultra-lotto-6-58.png";
import SuperLotto649 from "@/assets/images/super-lotto-6-49.png";
import GrandLotto655 from "@/assets/images/grand-lotto-6-55.png";
import MegaLotto645 from "@/assets/images/mega-lotto-6-45.png";
import NationalLottery642 from "@/assets/images/national-lottery-6-42.png";
import { ref } from "vue";

const model = defineModel<{
    label: string;
    key: string;
    img: string;
    number_of_digits: number;
    max_number: number;
}>();
const winningLotteryOptions = ref([
    {
        label: "Ultra Lotto 6/58",
        key: 'ultra_lotto_6_58',
        img: UltraLotto658,
        number_of_digits: 6,
        max_number: 58
    },
    {
        label: "Grand Lotto 6/55",
        key: 'grand_lotto_6_55',
        img: GrandLotto655,
        number_of_digits: 6,
        max_number: 55
    },
    {
        label: "Super Lotto 6/49",
        key: 'super_lotto_6_49',
        img: SuperLotto649,
        number_of_digits: 6,
        max_number: 49
    },
    {
        label: "Mega Lotto 6/45",
        key: 'mega_lotto_6_45',
        img: MegaLotto645,
        number_of_digits: 6,
        max_number: 45
    },
    {
        label: "National Lottery 6/42",
        key: 'national_lottery_6_42',
        img: NationalLottery642,
        number_of_digits: 6,
        max_number: 42
    }
]);

</script>
<template>
    <div class="flex gap-4 items-center justify-center flex-wrap">
        <div v-for="value in winningLotteryOptions" :key="value.label"
            class="cursor-pointer hover:bg-gray-8 hover:bg-opacity-10 p-1 rounded-md" @click="model = value"
            :class="{ '!bg-green': model?.key === value.key }">
            <img :src="value.img" :alt="value.label" height="70" />
        </div>
    </div>
</template>