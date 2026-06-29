import { ref, reactive, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';

export type FormType = 'vratenie' | 'reklamacia';
export type ReturnStatus = 'received' | 'processing' | 'approved' | 'rejected';

export interface ReasonOption {
  value: string;
  label: string;
}

/** Identicky podľa WP plugin frontend.js:10-26 — konzistentnosť s pôvodným UX */
export const REASONS: Record<FormType, ReasonOption[]> = {
  vratenie: [
    { value: '',             label: '— Vyberte —' },
    { value: 'zmena_nazoru', label: 'Zmena názoru' },
    { value: 'nevyhovuje',   label: 'Tovar nevyhovuje požiadavkám' },
    { value: 'nespravny',    label: 'Dostal/a som nesprávny tovar' },
    { value: 'velkost',      label: 'Nesedí veľkosť' },
    { value: 'iny',          label: 'Iný dôvod' },
  ],
  reklamacia: [
    { value: '',           label: '— Vyberte —' },
    { value: 'defekt',     label: 'Výrobná závada' },
    { value: 'poskodeny',  label: 'Tovar prišiel poškodený' },
    { value: 'chybajuci',  label: 'Chýbajúci tovar' },
    { value: 'iny',        label: 'Iný dôvod' },
  ],
};

export const LABELS: Record<FormType, {
  step2title: string;
  items: string;
  reasonCat: string;
  reasonDetail: string;
  reasonPh: string;
  ibanRequired: boolean;
  warranty: boolean;
}> = {
  vratenie: {
    step2title:   'Vaše kontaktné údaje',
    items:        'Popis tovaru na vrátenie',
    reasonCat:    'Dôvod vrátenia tovaru',
    reasonDetail: 'Dôvod odstúpenia od zmluvy',
    reasonPh:     'Opíšte dôvod vrátenia tovaru…',
    ibanRequired: true,
    warranty:     false,
  },
  reklamacia: {
    step2title:   'Vaše kontaktné údaje',
    items:        'Popis reklamovaného tovaru',
    reasonCat:    'Dôvod reklamácie',
    reasonDetail: 'Popis závady',
    reasonPh:     'Podrobne popíšte závadu alebo poškodenie…',
    ibanRequired: false,
    warranty:     true,
  },
};

export interface ReturnFormData {
  formType: FormType;
  orderNumber: string;
  orderId: string | null;
  firstName: string;
  lastName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  orderDate: string;       // YYYY-MM-DD
  invoiceNumber: string;
  bankAccount: string;
  itemsDescription: string;
  reasonCategory: string;
  reasonDetail: string;
  attachmentPaths: string[]; // Shopware Media UUIDs
  warrantyPaths: string[];   // Shopware Media UUIDs
  gdprConsent: boolean;
}

export interface UseReturnFormOptions {
  initialFormType?: FormType;
  initialOrderNumber?: string;
  initialOrderDate?: string;
  initialOrderId?: string;
  initialEmail?: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialCustomerPhone?: string;
  initialCustomerAddress?: string;
  initialItemsDescription?: string;
  skipOrderLookup?: boolean;
}

export function useReturnForm(opts: UseReturnFormOptions = {}) {
  const currentStep = ref<1 | 2 | 3 | 4>(opts.skipOrderLookup ? 2 : 1);
  const totalSteps = 3;

  const formData = reactive<ReturnFormData>({
    formType:         opts.initialFormType ?? 'vratenie',
    orderNumber:      opts.initialOrderNumber ?? '',
    orderId:          opts.initialOrderId ?? null,
    firstName:        opts.initialFirstName ?? '',
    lastName:         opts.initialLastName ?? '',
    customerEmail:    opts.initialEmail ?? '',
    customerPhone:    opts.initialCustomerPhone ?? '',
    customerAddress:  opts.initialCustomerAddress ?? '',
    orderDate:        opts.initialOrderDate ?? '',
    invoiceNumber:    '',
    bankAccount:      '',
    itemsDescription: opts.initialItemsDescription ?? '',
    reasonCategory:   '',
    reasonDetail:     '',
    attachmentPaths:  [],
    warrantyPaths:    [],
    gdprConsent:      false,
  });

  // File previews (client-side before upload)
  interface FilePreview {
    file: File;
    previewUrl: string;
    uploadedId: string | null;
    uploading: boolean;
    error: string | null;
  }
  const attachments = ref<FilePreview[]>([]);
  const warrantyFiles = ref<FilePreview[]>([]);

  // Order lookup state
  const orderLookup = reactive({
    loading:        false,
    found:          opts.skipOrderLookup ?? false,
    within14Days:   true,
    daysSinceOrder: 0,
    order:          null as any,
    error:          null as string | null,
  });

  // Submit state
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);
  const submitResult = ref<{ id: string; referenceNumber: string } | null>(null);

  const labels = computed(() => LABELS[formData.formType]);
  const reasons = computed(() => REASONS[formData.formType]);

  // ─── Validation ────────────────────────────────────────────────────────────
  const stepErrors = reactive<Record<number, string[]>>({ 1: [], 2: [], 3: [] });

  const validateStep1 = (): boolean => {
    stepErrors[1] = [];
    if (!formData.formType) stepErrors[1].push('Vyberte typ žiadosti.');
    if (!formData.orderNumber.trim()) stepErrors[1].push('Vyplňte číslo objednávky.');
    if (!isValidEmail(formData.customerEmail)) stepErrors[1].push('Zadajte platný email.');
    return stepErrors[1].length === 0;
  };

  const validateStep2 = (): boolean => {
    stepErrors[2] = [];
    if (!formData.firstName.trim()) stepErrors[2].push('Vyplňte meno.');
    if (!formData.lastName.trim()) stepErrors[2].push('Vyplňte priezvisko.');
    if (!formData.customerPhone.trim()) stepErrors[2].push('Vyplňte telefón.');
    if (!formData.customerAddress.trim()) stepErrors[2].push('Vyplňte adresu.');
    if (labels.value.ibanRequired && !formData.bankAccount.trim()) {
      stepErrors[2].push('Vyplňte IBAN.');
    }
    if (!formData.itemsDescription.trim()) stepErrors[2].push('Popíšte tovar.');
    if (!formData.reasonDetail.trim()) stepErrors[2].push('Uveďte dôvod.');
    if (labels.value.warranty && warrantyFiles.value.length === 0) {
      stepErrors[2].push('Nahrajte záručný list.');
    }
    return stepErrors[2].length === 0;
  };

  const validateStep3 = (): boolean => {
    stepErrors[3] = [];
    if (!formData.gdprConsent) stepErrors[3].push('Musíte potvrdiť údaje.');
    return stepErrors[3].length === 0;
  };

  const goToStep = (n: 1 | 2 | 3 | 4) => {
    currentStep.value = n;
  };
  const nextStep = (): boolean => {
    if (currentStep.value === 1 && validateStep1()) {
      currentStep.value = 2;
      return true;
    }
    if (currentStep.value === 2 && validateStep2()) {
      currentStep.value = 3;
      return true;
    }
    return false;
  };
  const prevStep = () => {
    if (currentStep.value > 1) currentStep.value = (currentStep.value - 1) as 1 | 2 | 3;
  };

  // ─── Order Lookup ──────────────────────────────────────────────────────────
  const performLookup = async () => {
    if (!formData.orderNumber.trim() || !isValidEmail(formData.customerEmail)) return;
    orderLookup.loading = true;
    orderLookup.error = null;
    try {
      const r = await $fetch<any>('/api/returns/lookup-order', {
        method: 'POST',
        body: { orderNumber: formData.orderNumber.trim(), email: formData.customerEmail.trim() },
      });
      orderLookup.found = !!r?.found;
      orderLookup.within14Days = !!r?.within14Days;
      orderLookup.daysSinceOrder = r?.daysSinceOrder ?? 0;
      orderLookup.order = r?.order ?? null;
      if (r?.found && r?.order) {
        const o = r.order;
        // orderDate
        if (o.orderDate && !formData.orderDate) formData.orderDate = o.orderDate;

        // Meno/Priezvisko — preferuj billingAddress, fallback customerName
        const ba = o.billingAddress;
        if (ba?.firstName && !formData.firstName) formData.firstName = ba.firstName;
        if (ba?.lastName && !formData.lastName) formData.lastName = ba.lastName;
        if ((!formData.firstName || !formData.lastName) && o.customerName) {
          const parts = String(o.customerName).split(/\s+/);
          if (!formData.firstName && parts[0]) formData.firstName = parts[0];
          if (!formData.lastName && parts[1]) formData.lastName = parts.slice(1).join(' ');
        }

        // Telefón
        if (o.customerPhone && !formData.customerPhone) formData.customerPhone = o.customerPhone;
        else if (ba?.phone && !formData.customerPhone) formData.customerPhone = ba.phone;

        // Adresa — formátovaná multi-line
        if (ba && !formData.customerAddress) {
          const lines: string[] = [];
          if (ba.street) lines.push(String(ba.street));
          const cityLine = [ba.zipcode, ba.city].filter(Boolean).join(' ');
          if (cityLine) lines.push(cityLine);
          if (ba.country) lines.push(String(ba.country));
          if (lines.length) formData.customerAddress = lines.join('\n');
        }

        // Položky z objednávky
        if (Array.isArray(o.items) && o.items.length && !formData.itemsDescription) {
          formData.itemsDescription = o.items
            .map((i: any) => `${i.qty ?? 1}× ${i.name ?? ''}`.trim())
            .filter(Boolean)
            .join('\n');
        }
      }
    } catch (e: any) {
      orderLookup.error = e?.message || 'Lookup failed';
    } finally {
      orderLookup.loading = false;
    }
  };
  const debouncedLookup = useDebounceFn(performLookup, 600);

  // ─── File Upload ───────────────────────────────────────────────────────────
  const MAX_FILES = 5;
  const MAX_BYTES = 10 * 1024 * 1024;
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/quicktime'];

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_MIME.includes(f.type)) return `Nepodporovaný typ: ${f.type}`;
    if (f.size > MAX_BYTES) return `Súbor je veľký (${(f.size / 1_048_576).toFixed(1)} MB > 10 MB)`;
    return null;
  };

  const addFiles = async (files: FileList | File[], target: 'attachments' | 'warranty') => {
    const list = target === 'attachments' ? attachments.value : warrantyFiles.value;
    const arr = Array.from(files);

    for (const f of arr) {
      if (list.length >= MAX_FILES) break;
      const err = validateFile(f);
      if (err) {
        list.push({ file: f, previewUrl: '', uploadedId: null, uploading: false, error: err });
        continue;
      }
      const preview: FilePreview = {
        file: f,
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
        uploadedId: null,
        uploading: true,
        error: null,
      };
      list.push(preview);

      // Upload immediately to Shopware Media
      try {
        const fd = new FormData();
        fd.append('file', f);
        const res = await $fetch<any>('/api/returns/upload', { method: 'POST', body: fd });
        const id = res?.uploaded?.[0]?.id;
        if (!id) throw new Error('Server vrátil neplatný response');
        preview.uploadedId = id;
        preview.uploading = false;
        // Sync into formData
        if (target === 'attachments') {
          formData.attachmentPaths = attachments.value.filter(p => p.uploadedId).map(p => p.uploadedId!);
        } else {
          formData.warrantyPaths = warrantyFiles.value.filter(p => p.uploadedId).map(p => p.uploadedId!);
        }
      } catch (e: any) {
        preview.uploading = false;
        preview.error = e?.data?.statusMessage || e?.message || 'Upload zlyhal';
      }
    }
  };

  const removeFile = (idx: number, target: 'attachments' | 'warranty') => {
    const list = target === 'attachments' ? attachments.value : warrantyFiles.value;
    const f = list[idx];
    if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    list.splice(idx, 1);
    if (target === 'attachments') {
      formData.attachmentPaths = attachments.value.filter(p => p.uploadedId).map(p => p.uploadedId!);
    } else {
      formData.warrantyPaths = warrantyFiles.value.filter(p => p.uploadedId).map(p => p.uploadedId!);
    }
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const submit = async (): Promise<boolean> => {
    if (!validateStep3()) return false;
    isSubmitting.value = true;
    submitError.value = null;
    try {
      const res = await $fetch<any>('/api/returns/submit', {
        method: 'POST',
        body: { ...formData, gdprConsent: undefined },
      });
      if (res?.success && res?.referenceNumber) {
        submitResult.value = { id: res.id, referenceNumber: res.referenceNumber };
        currentStep.value = 4; // success
        return true;
      }
      submitError.value = res?.error || 'Submit zlyhal';
      return false;
    } catch (e: any) {
      submitError.value = e?.data?.statusMessage || e?.message || 'Submit zlyhal';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // state
    currentStep, totalSteps, formData, attachments, warrantyFiles,
    orderLookup, isSubmitting, submitError, submitResult, stepErrors,
    // computed
    labels, reasons,
    // navigation
    goToStep, nextStep, prevStep,
    // actions
    debouncedLookup, performLookup, addFiles, removeFile, submit,
    // validation (callable from template)
    validateStep1, validateStep2, validateStep3,
  };
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
