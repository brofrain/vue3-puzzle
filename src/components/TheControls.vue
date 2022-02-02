<template>
  <div id="controls">
    <div class="controls__stats">
      <div>Moves:</div>
      <div class="controls__stats__value">{{ moveCount }}</div>
      <div />
      <div>Time:</div>
      <div class="controls__stats__value">{{ `${time}s` }}</div>
    </div>

    <div class="controls__options">
      <div class="controls__options__size">
        <input
          v-model="tmpHSize"
          class="controls__options__size__input"
          type="number"
        />
        <div>x</div>
        <input
          v-model="tmpVSize"
          class="controls__options__size__input"
          type="number"
        />
        <b-btn class="controls__options__btn" @click="updateSize">
          Update size
        </b-btn>
      </div>

      <b-btn class="controls__options__btn" @click="shuffle"> Shuffle </b-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  hSize: number;
  vSize: number;
  moveCount: number;
  time: number;
}>();

const emit = defineEmits<{
  (e: "update:size", payload: { h: number; v: number }): void;
  (e: "shuffle-puzzle"): void;
}>();

const tmpHSize = ref(props.hSize);
const tmpVSize = ref(props.vSize);

const validateSizeValue = (value: number) =>
  value > 1 && value < 10 && !(value % 1);

const validateTmpSize = () =>
  validateSizeValue(tmpHSize.value) && validateSizeValue(tmpVSize.value);

const updateSize = () => {
  if (validateTmpSize() && tmpHSize.value * tmpVSize.value > 4) {
    emit("update:size", { h: tmpHSize.value, v: tmpVSize.value });
  } else {
    tmpHSize.value = props.hSize;
    tmpVSize.value = props.vSize;
  }
};

const shuffle = () => {
  emit("shuffle-puzzle");
};
</script>

<style lang="scss" scoped>
#controls {
  $shadow__blur-radius: 5px;
  $shadow: 0 0 $shadow__blur-radius $base__color--shadow;
  $shadow--focus: 0 0 $shadow__blur-radius 2px $base__color--shadow;

  @include base__gradient-bg;
  @include base__section-shadow;

  z-index: 1;
  padding: 10px min(20px, 10%);
  text-shadow: 0 0 1px $base__color--shadow;

  display: grid;
  justify-content: end;
  justify-items: end;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  grid-template-areas: "options" "stats";
  gap: 10px;

  @media (min-width: 500px) {
    justify-content: space-between;
    justify-items: stretch;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    grid-template-areas: "stats options";
  }

  .controls__stats,
  .controls__options {
    display: flex;
    align-items: center;
  }

  .controls__stats {
    grid-area: stats;
    gap: 5px;

    .controls__stats__value {
      color: $base__color--secondary;
      font-weight: 800;
    }
  }

  .controls__options {
    grid-area: options;
    gap: inherit;

    .controls__options__btn {
      align-self: stretch;

      transition: box-shadow $base__transition__duration;
      box-shadow: $shadow;

      &:hover {
        box-shadow: $shadow--focus;
      }
    }

    .controls__options__size {
      display: flex;
      align-items: center;
      gap: 4px;

      .controls__options__size__input {
        width: 2rem;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        box-shadow: none;
        outline: none;
        border: none;
        border-radius: 5px;
        background: $base__color--secondary;
        font-size: 0.9rem;
        line-height: 1.4rem;
        font-weight: 700;
        color: $base__color--primary;
        text-align: center;
        text-shadow: none;

        transition: box-shadow $base__transition__duration;
        box-shadow: $shadow;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        -moz-appearance: textfield;

        &:focus {
          outline: none;
          box-shadow: $shadow--focus;
        }
      }
    }
  }
}
</style>
