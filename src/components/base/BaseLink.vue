<template>
  <a class="base__link" :href="href" target="_blank">
    <slot />

    <div class="base__link__underline" />
  </a>
</template>

<script lang="ts" setup>
defineProps<{ href: string }>();
</script>

<style lang="scss" scoped>
.base__link {
  @include base__gradient-bg;

  position: relative;
  line-height: 1.2;
  text-decoration: none;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  .base__link__underline {
    @include base__gradient-bg;

    position: absolute;
    height: 2px;
    bottom: -1px;
    left: 0;
    right: 0;
    pointer-events: none;

    transition: opacity $base__transition__duration;
    opacity: 0;
  }

  &:hover {
    .base__link__underline {
      opacity: 1;
    }
  }
}
</style>
