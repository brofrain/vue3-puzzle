<template>
  <div class="base__button">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.base__button {
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 0 0.5rem;
  font-size: 0.9rem;
  line-height: 1;
  color: $base__color--secondary;
  background: $base__color--primary;
  text-shadow: none;
  user-select: none;
  cursor: pointer;
}
</style>
