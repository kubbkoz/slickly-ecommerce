import { ref, reactive, computed } from 'vue';
import { o as useDebounceFn } from './server.mjs';

const REASONS = {
  vratenie: [
    { value: "", label: "— Vyberte —" },
    { value: "zmena_nazoru", label: "Zmena názoru" },
    { value: "nevyhovuje", label: "Tovar nevyhovuje požiadavkám" },
    { value: "nespravny", label: "Dostal/a som nesprávny tovar" },
    { value: "velkost", label: "Nesedí veľkosť" },
    { value: "iny", label: "Iný dôvod" }
  ],
  reklamacia: [
    { value: "", label: "— Vyberte —" },
    { value: "defekt", label: "Výrobná závada" },
    { value: "poskodeny", label: "Tovar prišiel poškodený" },
    { value: "chybajuci", label: "Chýbajúci tovar" },
    { value: "iny", label: "Iný dôvod" }
  ]
};
const LABELS = {
  vratenie: {
    step2title: "Vaše kontaktné údaje",
    items: "Popis tovaru na vrátenie",
    reasonCat: "Dôvod vrátenia tovaru",
    reasonDetail: "Dôvod odstúpenia od zmluvy",
    reasonPh: "Opíšte dôvod vrátenia tovaru…",
    ibanRequired: true,
    warranty: false
  },
  reklamacia: {
    step2title: "Vaše kontaktné údaje",
    items: "Popis reklamovaného tovaru",
    reasonCat: "Dôvod reklamácie",
    reasonDetail: "Popis závady",
    reasonPh: "Podrobne popíšte závadu alebo poškodenie…",
    ibanRequired: false,
    warranty: true
  }
};
function useReturnForm(opts = {}) {
  const currentStep = ref(opts.skipOrderLookup ? 2 : 1);
  const totalSteps = 3;
  const formData = reactive({
    formType: opts.initialFormType ?? "vratenie",
    orderNumber: opts.initialOrderNumber ?? "",
    orderId: opts.initialOrderId ?? null,
    firstName: opts.initialFirstName ?? "",
    lastName: opts.initialLastName ?? "",
    customerEmail: opts.initialEmail ?? "",
    customerPhone: opts.initialCustomerPhone ?? "",
    customerAddress: opts.initialCustomerAddress ?? "",
    orderDate: opts.initialOrderDate ?? "",
    invoiceNumber: "",
    bankAccount: "",
    itemsDescription: opts.initialItemsDescription ?? "",
    reasonCategory: "",
    reasonDetail: "",
    attachmentPaths: [],
    warrantyPaths: [],
    gdprConsent: false
  });
  const attachments = ref([]);
  const warrantyFiles = ref([]);
  const orderLookup = reactive({
    loading: false,
    found: opts.skipOrderLookup ?? false,
    within14Days: true,
    daysSinceOrder: 0,
    order: null,
    error: null
  });
  const isSubmitting = ref(false);
  const submitError = ref(null);
  const submitResult = ref(null);
  const labels = computed(() => LABELS[formData.formType]);
  const reasons = computed(() => REASONS[formData.formType]);
  const stepErrors = reactive({ 1: [], 2: [], 3: [] });
  const validateStep1 = () => {
    stepErrors[1] = [];
    if (!formData.formType) stepErrors[1].push("Vyberte typ žiadosti.");
    if (!formData.orderNumber.trim()) stepErrors[1].push("Vyplňte číslo objednávky.");
    if (!isValidEmail(formData.customerEmail)) stepErrors[1].push("Zadajte platný email.");
    return stepErrors[1].length === 0;
  };
  const validateStep2 = () => {
    stepErrors[2] = [];
    if (!formData.firstName.trim()) stepErrors[2].push("Vyplňte meno.");
    if (!formData.lastName.trim()) stepErrors[2].push("Vyplňte priezvisko.");
    if (!formData.customerPhone.trim()) stepErrors[2].push("Vyplňte telefón.");
    if (!formData.customerAddress.trim()) stepErrors[2].push("Vyplňte adresu.");
    if (labels.value.ibanRequired && !formData.bankAccount.trim()) {
      stepErrors[2].push("Vyplňte IBAN.");
    }
    if (!formData.itemsDescription.trim()) stepErrors[2].push("Popíšte tovar.");
    if (!formData.reasonDetail.trim()) stepErrors[2].push("Uveďte dôvod.");
    if (labels.value.warranty && warrantyFiles.value.length === 0) {
      stepErrors[2].push("Nahrajte záručný list.");
    }
    return stepErrors[2].length === 0;
  };
  const validateStep3 = () => {
    stepErrors[3] = [];
    if (!formData.gdprConsent) stepErrors[3].push("Musíte potvrdiť údaje.");
    return stepErrors[3].length === 0;
  };
  const goToStep = (n) => {
    currentStep.value = n;
  };
  const nextStep = () => {
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
    if (currentStep.value > 1) currentStep.value = currentStep.value - 1;
  };
  const performLookup = async () => {
    if (!formData.orderNumber.trim() || !isValidEmail(formData.customerEmail)) return;
    orderLookup.loading = true;
    orderLookup.error = null;
    try {
      const r = await $fetch("/api/returns/lookup-order", {
        method: "POST",
        body: { orderNumber: formData.orderNumber.trim(), email: formData.customerEmail.trim() }
      });
      orderLookup.found = !!r?.found;
      orderLookup.within14Days = !!r?.within14Days;
      orderLookup.daysSinceOrder = r?.daysSinceOrder ?? 0;
      orderLookup.order = r?.order ?? null;
      if (r?.found && r?.order) {
        const o = r.order;
        if (o.orderDate && !formData.orderDate) formData.orderDate = o.orderDate;
        const ba = o.billingAddress;
        if (ba?.firstName && !formData.firstName) formData.firstName = ba.firstName;
        if (ba?.lastName && !formData.lastName) formData.lastName = ba.lastName;
        if ((!formData.firstName || !formData.lastName) && o.customerName) {
          const parts = String(o.customerName).split(/\s+/);
          if (!formData.firstName && parts[0]) formData.firstName = parts[0];
          if (!formData.lastName && parts[1]) formData.lastName = parts.slice(1).join(" ");
        }
        if (o.customerPhone && !formData.customerPhone) formData.customerPhone = o.customerPhone;
        else if (ba?.phone && !formData.customerPhone) formData.customerPhone = ba.phone;
        if (ba && !formData.customerAddress) {
          const lines = [];
          if (ba.street) lines.push(String(ba.street));
          const cityLine = [ba.zipcode, ba.city].filter(Boolean).join(" ");
          if (cityLine) lines.push(cityLine);
          if (ba.country) lines.push(String(ba.country));
          if (lines.length) formData.customerAddress = lines.join("\n");
        }
        if (Array.isArray(o.items) && o.items.length && !formData.itemsDescription) {
          formData.itemsDescription = o.items.map((i) => `${i.qty ?? 1}× ${i.name ?? ""}`.trim()).filter(Boolean).join("\n");
        }
      }
    } catch (e) {
      orderLookup.error = e?.message || "Lookup failed";
    } finally {
      orderLookup.loading = false;
    }
  };
  const debouncedLookup = useDebounceFn(performLookup, 600);
  const MAX_FILES = 5;
  const MAX_BYTES = 10 * 1024 * 1024;
  const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "video/mp4", "video/quicktime"];
  const validateFile = (f) => {
    if (!ALLOWED_MIME.includes(f.type)) return `Nepodporovaný typ: ${f.type}`;
    if (f.size > MAX_BYTES) return `Súbor je veľký (${(f.size / 1048576).toFixed(1)} MB > 10 MB)`;
    return null;
  };
  const addFiles = async (files, target) => {
    const list = target === "attachments" ? attachments.value : warrantyFiles.value;
    const arr = Array.from(files);
    for (const f of arr) {
      if (list.length >= MAX_FILES) break;
      const err = validateFile(f);
      if (err) {
        list.push({ file: f, previewUrl: "", uploadedId: null, uploading: false, error: err });
        continue;
      }
      const preview = {
        file: f,
        previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
        uploadedId: null,
        uploading: true,
        error: null
      };
      list.push(preview);
      try {
        const fd = new FormData();
        fd.append("file", f);
        const res = await $fetch("/api/returns/upload", { method: "POST", body: fd });
        const id = res?.uploaded?.[0]?.id;
        if (!id) throw new Error("Server vrátil neplatný response");
        preview.uploadedId = id;
        preview.uploading = false;
        if (target === "attachments") {
          formData.attachmentPaths = attachments.value.filter((p) => p.uploadedId).map((p) => p.uploadedId);
        } else {
          formData.warrantyPaths = warrantyFiles.value.filter((p) => p.uploadedId).map((p) => p.uploadedId);
        }
      } catch (e) {
        preview.uploading = false;
        preview.error = e?.data?.statusMessage || e?.message || "Upload zlyhal";
      }
    }
  };
  const removeFile = (idx, target) => {
    const list = target === "attachments" ? attachments.value : warrantyFiles.value;
    const f = list[idx];
    if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    list.splice(idx, 1);
    if (target === "attachments") {
      formData.attachmentPaths = attachments.value.filter((p) => p.uploadedId).map((p) => p.uploadedId);
    } else {
      formData.warrantyPaths = warrantyFiles.value.filter((p) => p.uploadedId).map((p) => p.uploadedId);
    }
  };
  const submit = async () => {
    if (!validateStep3()) return false;
    isSubmitting.value = true;
    submitError.value = null;
    try {
      const res = await $fetch("/api/returns/submit", {
        method: "POST",
        body: { ...formData, gdprConsent: void 0 }
      });
      if (res?.success && res?.referenceNumber) {
        submitResult.value = { id: res.id, referenceNumber: res.referenceNumber };
        currentStep.value = 4;
        return true;
      }
      submitError.value = res?.error || "Submit zlyhal";
      return false;
    } catch (e) {
      submitError.value = e?.data?.statusMessage || e?.message || "Submit zlyhal";
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };
  return {
    // state
    currentStep,
    totalSteps,
    formData,
    attachments,
    warrantyFiles,
    orderLookup,
    isSubmitting,
    submitError,
    submitResult,
    stepErrors,
    // computed
    labels,
    reasons,
    // navigation
    goToStep,
    nextStep,
    prevStep,
    // actions
    debouncedLookup,
    performLookup,
    addFiles,
    removeFile,
    submit,
    // validation (callable from template)
    validateStep1,
    validateStep2,
    validateStep3
  };
}
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export { useReturnForm as u };
