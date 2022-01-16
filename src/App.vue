<template>
  <TheBackground />

  <TheControls
    :h-size="hSize"
    :v-size="vSize"
    :move-count="moveCount"
    :time="time"
    @update:size="updateSize"
    @shuffle-puzzle="shuffleUserPuzzle"
  />

  <ThePuzzle
    :h-size="hSize"
    :v-size="vSize"
    :are-puzzle-ordered-correctly="arePuzzleOrderedCorrectly"
    :base-puzzle="basePuzzle"
    :user-puzzle="userPuzzle"
    @swap-user-puzzle="swapUserPuzzle"
  />

  <TheFooter />
</template>

<script lang="ts" setup>
import { TheBackground, TheControls, ThePuzzle, TheFooter } from "@/components";

import { computed, reactive, ref, watch } from "vue";

const hSize = ref(3);
const vSize = ref(3);

const updateSize = ({ h, v }: { h: number; v: number }) => {
  hSize.value = h;
  vSize.value = v;
};

const basePuzzle = computed(() =>
  Array.from({ length: hSize.value * vSize.value }, (_, i) => i)
);

const userPuzzle = reactive<number[]>([]);

const arePuzzleOrderedCorrectly = computed(() => {
  for (let i = 0; i < basePuzzle.value.length; i++) {
    if (basePuzzle.value[i] !== userPuzzle[i]) {
      return false;
    }
  }

  return true;
});

const moveCount = ref(0);
const time = ref(0);
let timeInterval: number;

const getShuffledPuzzle = () => {
  const newPuzzle = basePuzzle.value.slice(0, -1);

  for (let index = newPuzzle.length - 1; index > 0; index--) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [newPuzzle[index], newPuzzle[targetIndex]] = [
      newPuzzle[targetIndex],
      newPuzzle[index]
    ];
  }

  newPuzzle.push(basePuzzle.value[basePuzzle.value.length - 1]);

  return newPuzzle;
};

const shuffleUserPuzzle = () => {
  do {
    userPuzzle.splice(0, userPuzzle.length, ...getShuffledPuzzle());
  } while (arePuzzleOrderedCorrectly.value);
  moveCount.value = 0;
  time.value = 0;
};

const swapUserPuzzle = ({
  indexA,
  indexB
}: {
  indexA: number;
  indexB: number;
}) => {
  [userPuzzle[indexA], userPuzzle[indexB]] = [
    userPuzzle[indexB],
    userPuzzle[indexA]
  ];

  moveCount.value++;
};

watch(moveCount, (value) => {
  if (value === 0) {
    clearInterval(timeInterval);
    return;
  }

  if (value === 1) {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      time.value++;
    }, 1000);
  }
});

watch(arePuzzleOrderedCorrectly, (value) => {
  if (value) {
    clearInterval(timeInterval);
  }
});

watch(basePuzzle, shuffleUserPuzzle);
shuffleUserPuzzle();
</script>

<style lang="scss">
@import "./styles/index.scss";

#app {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
