<template>
  <div id="puzzle">
    <div class="puzzle__cover" />

    <div
      class="puzzle__container"
      :class="!isImgLoaded && 'puzzle__container--hidden'"
    >
      <img class="puzzle__container__img" :src="img" />

      <div class="puzzle__container__playground">
        <transition-group name="puzzle__container__playground__transition">
          <SinglePuzzle
            v-for="(item, index) in userPuzzleItems"
            :key="item.id"
            v-bind="item"
            @click="handlePuzzleClick(index)"
          />
        </transition-group>
      </div>

      <transition
        enter-active-class="base__fade-in"
        leave-active-class="base__fade-out"
      >
        <div
          v-show="arePuzzleOrderedCorrectly"
          class="puzzle__container__cover"
        >
          <img class="puzzle__container__cover__img" :src="img" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SinglePuzzle } from "./puzzle";

import { computed, ref, nextTick } from "vue";

const props = defineProps<{
  hSize: number;
  vSize: number;
  arePuzzleOrderedCorrectly: boolean;
  basePuzzle: number[];
  userPuzzle: number[];
}>();

const img = new URL(
  `../assets/${import.meta.env.VITE_PUZZLE_IMG_NAME}`,
  import.meta.url
).href;

const isImgLoaded = ref(false);
(() => {
  const imgLoader = new Image();
  imgLoader.src = img;
  imgLoader.onload = async () => {
    await nextTick();
    isImgLoaded.value = true;
  };
})();

const emit = defineEmits<{
  (e: "swapUserPuzzle", payload: { indexA: number; indexB: number }): void;
}>();

const getPuzzleCol = (index: number) => index % props.hSize;

const getPuzzleRow = (index: number) => Math.floor(index / props.hSize);

const blankPuzzleIndex = computed(() =>
  props.userPuzzle.indexOf(props.hSize * props.vSize - 1)
);

const blankPuzzleCol = computed(() => getPuzzleCol(blankPuzzleIndex.value));

const blankPuzzleRow = computed(() => getPuzzleRow(blankPuzzleIndex.value));

const checkIfPuzzleIsBlank = (index: number) =>
  index === blankPuzzleIndex.value;

const getPuzzleBgPosition = (id: number) => {
  const index = props.basePuzzle.indexOf(id);

  const col = getPuzzleCol(index);
  const row = getPuzzleRow(index);

  const hPosition = col / (props.hSize - 1);
  const vPosition = row / (props.vSize - 1);

  return `${hPosition * 100}% ${vPosition * 100}%`;
};

const checkIfPuzzleCanMove = (index: number) => {
  const col = getPuzzleCol(index);
  const row = getPuzzleRow(index);

  return (
    (col === blankPuzzleCol.value &&
      Math.abs(row - blankPuzzleRow.value) === 1) ||
    (row === blankPuzzleRow.value && Math.abs(col - blankPuzzleCol.value) === 1)
  );
};

const userPuzzleItems = computed(() =>
  props.userPuzzle.map((id, index) =>
    checkIfPuzzleIsBlank(index)
      ? { id, isBlank: true }
      : {
          id,
          bgPosition: getPuzzleBgPosition(id),
          canMove: checkIfPuzzleCanMove(index)
        }
  )
);

const handlePuzzleClick = (index: number) => {
  if (!checkIfPuzzleCanMove(index)) {
    return;
  }

  emit("swapUserPuzzle", { indexA: index, indexB: blankPuzzleIndex.value });
};
</script>

<style lang="scss" scoped>
@mixin img {
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  max-width: 100%;
  max-height: 100%;
  border-radius: inherit;
}

#puzzle {
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .puzzle__cover {
    @include base__cover;

    z-index: -1;
    background: $base__color--primary;
    opacity: 0.9;
  }

  .puzzle__container {
    @include base__gradient-bg;
    @include base__section-shadow;

    border-radius: 5px;
    position: relative;
    overflow: hidden;

    transition: opacity $base__transition__duration;
    opacity: 1;

    &.puzzle__container--hidden {
      opacity: 0;
    }

    $puzzle__padding: 1px;

    .puzzle__container__img {
      @include img;
      width: $base__puzzle-img__width;
      height: auto;
      opacity: 0.3;
    }

    .puzzle__container__playground {
      @include base__cover;

      display: grid;
      grid-template-columns: repeat(v-bind("props.hSize"), 1fr);
      grid-template-rows: repeat(v-bind("props.vSize"), 1fr);
      gap: 3px;
      padding: $puzzle__padding;

      .puzzle__container__playground__transition {
        &-move {
          transition: transform $base__transition__duration;
        }

        &-enter-from,
        &-leave-to {
          transition: opacity $base__transition__duration;
          opacity: 0;
        }

        &-leave-active {
          position: absolute;
        }
      }
    }

    .puzzle__container__cover {
      @include base__cover;
      @include base__gradient-bg;

      user-select: none;
      padding: $puzzle__padding;

      .puzzle__container__cover__img {
        @include img;
        pointer-events: none;
      }
    }
  }
}
</style>
