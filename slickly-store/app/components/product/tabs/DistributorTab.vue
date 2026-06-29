<script setup lang="ts">
import { type Product } from '~/types';
import { slugify } from '~/utils/url';
import ManufacturerInfo from '~/components/product/ManufacturerInfo.vue';

const props = defineProps<{
  product: Product;
}>();

const manufacturer = computed(() => (props.product as any).manufacturer);

const manufacturerName = computed(() =>
  manufacturer.value?.translated?.name || manufacturer.value?.name || (props.product as any).brand || 'Výrobca'
);

const brandFilterUrl = computed(() => {
  const name = manufacturerName.value;
  if (name && name !== 'Výrobca') return `/znacka/${slugify(name)}`;
  return null;
});
</script>

<template>
  <ManufacturerInfo :manufacturer="manufacturer" :products-link="brandFilterUrl" />
</template>
