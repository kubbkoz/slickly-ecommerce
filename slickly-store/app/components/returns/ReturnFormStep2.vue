<script setup lang="ts">
import { ref } from 'vue';
import { Upload, X, Loader2, FileText } from 'lucide-vue-next';
import type { ReturnFormData, ReasonOption } from '~/composables/useReturnForm';

interface FilePreview {
  file: File;
  previewUrl: string;
  uploadedId: string | null;
  uploading: boolean;
  error: string | null;
}

const props = defineProps<{
  formData: ReturnFormData;
  attachments: FilePreview[];
  warrantyFiles: FilePreview[];
  reasons: ReasonOption[];
  labels: {
    items: string;
    reasonCat: string;
    reasonDetail: string;
    reasonPh: string;
    ibanRequired: boolean;
    warranty: boolean;
  };
  errors: string[];
}>();

const emit = defineEmits<{
  (e: 'add-files', files: FileList | File[], target: 'attachments' | 'warranty'): void;
  (e: 'remove-file', idx: number, target: 'attachments' | 'warranty'): void;
}>();

const attachmentsInputRef = ref<HTMLInputElement | null>(null);
const warrantyInputRef = ref<HTMLInputElement | null>(null);

const handleAttachmentsChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files?.length) emit('add-files', files, 'attachments');
};
const handleWarrantyChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files?.length) emit('add-files', files, 'warranty');
};

const onDrop = (e: DragEvent, target: 'attachments' | 'warranty') => {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files?.length) emit('add-files', files, target);
};
</script>

<template>
  <div class="space-y-5">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
          Meno <span class="text-brand">*</span>
        </label>
        <input v-model="formData.firstName" type="text" autocomplete="given-name"
               class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
          Priezvisko <span class="text-brand">*</span>
        </label>
        <input v-model="formData.lastName" type="text" autocomplete="family-name"
               class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans" />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
          Telefón <span class="text-brand">*</span>
        </label>
        <input v-model="formData.customerPhone" type="tel" autocomplete="tel"
               placeholder="+421 9XX XXX XXX"
               class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans" />
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
          IBAN <span v-if="labels.ibanRequired" class="text-brand">*</span>
        </label>
        <input v-model="formData.bankAccount" type="text"
               placeholder="SK00 0000 0000 0000 0000 0000"
               class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans" />
        <p v-if="!labels.ibanRequired" class="text-[10px] text-gray-400 mt-1">Voliteľné pre reklamáciu</p>
      </div>
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
        Adresa (ulica, PSČ, mesto) <span class="text-brand">*</span>
      </label>
      <textarea v-model="formData.customerAddress" rows="2" autocomplete="street-address"
                class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans resize-y"></textarea>
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
        {{ labels.items }} <span class="text-brand">*</span>
      </label>
      <textarea v-model="formData.itemsDescription" rows="3"
                placeholder="Uveďte názov produktu, množstvo…"
                class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans resize-y"></textarea>
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
        {{ labels.reasonCat }}
      </label>
      <select v-model="formData.reasonCategory"
              class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans bg-white">
        <option v-for="r in reasons" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
        {{ labels.reasonDetail }} <span class="text-brand">*</span>
      </label>
      <textarea v-model="formData.reasonDetail" rows="4"
                :placeholder="labels.reasonPh"
                class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans resize-y"></textarea>
    </div>

    <!-- Warranty upload — only for reklamacia -->
    <div v-if="labels.warranty">
      <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
        Záručný list <span class="text-brand">*</span>
      </label>
      <div class="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-brand transition-colors"
           @dragover.prevent
           @drop="onDrop($event, 'warranty')"
           @click="warrantyInputRef?.click()">
        <FileText class="w-8 h-8 mx-auto text-gray-300 mb-2" />
        <p class="text-xs"><strong>Nahrať záručný list</strong> – presuňte alebo kliknite</p>
        <p class="text-[10px] text-gray-400">JPG, PNG, PDF · max 10 MB/súbor</p>
      </div>
      <input ref="warrantyInputRef" type="file" multiple accept="image/*,application/pdf"
             class="hidden" @change="handleWarrantyChange" />
      <div v-if="warrantyFiles.length" class="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
        <div v-for="(f, i) in warrantyFiles" :key="i"
             class="relative border border-gray-200 p-2 text-xs">
          <button type="button" class="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center"
                  @click="emit('remove-file', i, 'warranty')">
            <X class="w-3 h-3" />
          </button>
          <img v-if="f.previewUrl" :src="f.previewUrl" class="w-full h-16 object-cover mb-1" />
          <FileText v-else class="w-8 h-8 mx-auto text-gray-400 mb-1" />
          <p class="truncate font-bold">{{ f.file.name }}</p>
          <p v-if="f.uploading" class="text-gray-400 text-[10px] flex items-center">
            <Loader2 class="w-3 h-3 animate-spin mr-1" /> Nahrávam…
          </p>
          <p v-else-if="f.error" class="text-brand text-[10px]">{{ f.error }}</p>
          <p v-else class="text-green-600 text-[10px]">✓ Nahraté</p>
        </div>
      </div>
    </div>

    <!-- Photos/videos -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
        Fotografie / videá
      </label>
      <div class="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-brand transition-colors"
           @dragover.prevent
           @drop="onDrop($event, 'attachments')"
           @click="attachmentsInputRef?.click()">
        <Upload class="w-8 h-8 mx-auto text-gray-300 mb-2" />
        <p class="text-xs"><strong>Presuňte súbory sem</strong> alebo kliknite</p>
        <p class="text-[10px] text-gray-400">Max 5 súborov · 10 MB/súbor · JPG, PNG, MP4</p>
      </div>
      <input ref="attachmentsInputRef" type="file" multiple accept="image/*,video/mp4,video/quicktime"
             class="hidden" @change="handleAttachmentsChange" />
      <div v-if="attachments.length" class="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
        <div v-for="(f, i) in attachments" :key="i"
             class="relative border border-gray-200 p-2 text-xs">
          <button type="button" class="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center"
                  @click="emit('remove-file', i, 'attachments')">
            <X class="w-3 h-3" />
          </button>
          <img v-if="f.previewUrl" :src="f.previewUrl" class="w-full h-16 object-cover mb-1" />
          <FileText v-else class="w-8 h-8 mx-auto text-gray-400 mb-1" />
          <p class="truncate font-bold">{{ f.file.name }}</p>
          <p v-if="f.uploading" class="text-gray-400 text-[10px] flex items-center">
            <Loader2 class="w-3 h-3 animate-spin mr-1" /> Nahrávam…
          </p>
          <p v-else-if="f.error" class="text-brand text-[10px]">{{ f.error }}</p>
          <p v-else class="text-green-600 text-[10px]">✓ Nahraté</p>
        </div>
      </div>
    </div>

    <div v-if="errors.length" class="border border-brand bg-brand/5 p-3 text-xs text-brand">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </div>
  </div>
</template>
