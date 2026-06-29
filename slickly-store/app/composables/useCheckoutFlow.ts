import { validateShippingForm, validateBillingForm } from '~/utils/checkoutValidation';

export interface ShippingAddressForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zipcode: string;
    countryId: string;
    company: string;
    ico: string;
    dic: string;
    icdph: string;
    note: string;
}

export interface BillingAddressForm {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    zipcode: string;
    countryId: string;
}

export interface PickupPoint {
    id: string;
    description: string;
    address: string;
    zip: string;
    city: string;
    countryISO: string;
    cod?: boolean;
    type?: string;
}

const EMPTY_SHIPPING: ShippingAddressForm = {
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', zipcode: '', countryId: '',
    company: '', ico: '', dic: '', icdph: '', note: '',
};

const EMPTY_BILLING: BillingAddressForm = {
    firstName: '', lastName: '', street: '', city: '', zipcode: '', countryId: '',
};

export const useCheckoutFlow = () => {
    const { selectedCountryId: navbarCountryId } = useCountrySelector();
    const { isLoggedIn, isGuestSession, register, login, userDefaultBillingAddress, userDefaultShippingAddress, user } = useUser();
    const {
        setShippingMethod, setPaymentMethod,
        getPaymentMethods, getShippingMethods,
        paymentMethods,
    } = useCheckout();
    // Shipping methods — raw data from useShippingMetadata (includes media + all active methods,
    // same source as TrustBadges). Avoids @shopware/composables onlyAvailable filter that
    // incorrectly excludes SPS when country context is not yet set in session.
    const { shippingMethods: rawShippingMethods } = useShippingMetadata();
    const { selectedShippingMethod: sessionShipping, selectedPaymentMethod: sessionPayment, setCountry } = useSessionContext();
    const { getCountries, getCountriesOptions } = useCountries();

    // Krajiny sortované podľa position z Shopware admin (getCountriesOptions ignoruje position)
    const sortedCountriesOptions = computed(() =>
        [...(getCountries.value ?? [])]
            .sort((a: any, b: any) => (a.position ?? 999) - (b.position ?? 999))
            .map((c: any) => ({ label: c.translated?.name ?? c.name, value: c.id, iso: (c.iso || '').toUpperCase() }))
    );

    // Tax rates map: countryId → taxRate — lazy fetch na mount, žiadny useAsyncData
    const taxRatesMap = ref<Record<string, number> | null>(null);
    onMounted(async () => {
        try {
            taxRatesMap.value = await $fetch<Record<string, number>>('/api/checkout/tax-rates');
        } catch (e) {
            console.error('[checkout] Failed to load tax rates:', e);
        }
    });

    // Efektívna DPH sadzba pre vybranú krajinu (okamžitá — bez čakania na cart)
    const selectedCountryTaxRate = computed<number>(() => {
        const countryId = shippingAddress.value.countryId;
        const map = taxRatesMap.value;
        if (!map) return 23;
        if (countryId && map[countryId] != null) return map[countryId];
        return map._default ?? 23;
    });

    // ISO kód vybranej krajiny
    const selectedCountryIso = computed(() => {
        const countryId = shippingAddress.value.countryId;
        if (!countryId) return '';
        return sortedCountriesOptions.value.find(c => c.value === countryId)?.iso || '';
    });

    // Country-default shipping override: CZ → Toptrans CZ, PL → Toptrans PL,
    // inak (SK) → späť na generický Toptrans (Shopware sales-channel default)
    const applyCountryShippingDefault = async (iso: string) => {
        const shippingIds = config.public.shopware.ids.shipping as Record<string, string>;
        const currentId = selectedShippingMethodId.value;
        let nextId: string | undefined;

        if (iso === 'CZ' && shippingIds.toptransCz && currentId !== shippingIds.toptransCz) {
            nextId = shippingIds.toptransCz;
        } else if (iso === 'PL' && shippingIds.toptransPl && currentId !== shippingIds.toptransPl) {
            nextId = shippingIds.toptransPl;
        } else if (
            iso !== 'CZ' && iso !== 'PL' &&
            (currentId === shippingIds.toptransCz || currentId === shippingIds.toptransPl) &&
            shippingIds.toptrans
        ) {
            nextId = shippingIds.toptrans;
        }

        if (nextId && nextId !== currentId) {
            selectedShippingMethodId.value = nextId;
            try {
                await setShippingMethod({ id: nextId });
                await refreshCart();
            } catch (e) {
                console.error('[Checkout] setShippingMethod (country default) error:', e);
            }
        }
    };

    // B2B reverse charge: firemný nákup + cudzia EU krajina (nie SK)
    // Shopware nepozná B2B zákazníka pred registráciou — výpočet robíme na základe krajiny
    const isB2bReverseCharge = computed(() =>
        isCompanyPurchase.value && !!shippingAddress.value.countryId && selectedCountryIso.value !== 'SK'
    );

    const { refreshCart, cartItems, addProduct, removeItem } = useCart();
    const { apiClient } = useShopwareContext();
    const config = useRuntimeConfig();
    const expressProductId = config.public.shopware.ids.products?.expressShipping as string | undefined;
    const dobierkaProductId = config.public.shopware.ids.products?.dobierka as string | undefined;
    const dobierkaPaymentId = (config.public.shopware.ids.payment as any)?.dobierka as string | undefined;

    // 2 interné kroky:
    // 1 = Doručenie (adresa + spôsob dopravy)
    // 2 = Platba (spôsob platby + podmienky)
    const currentStep = ref(1);
    const isSubmitting = ref(false);
    const submitError = ref<string | null>(null);

    const isBillingDifferent = ref(false);
    const isCompanyPurchase = ref(false);
    const createAccount = ref(true);
    const accountPassword = ref('');
    const accountPasswordConfirm = ref('');
    const isExpressLoading = ref(false);
    const isExpressShipping = computed({
        get: () => !!expressProductId && (cartItems.value as any[]).some((i: any) => i.referencedId === expressProductId),
        set: async (val: boolean) => {
            if (isExpressLoading.value || !expressProductId) return;
            isExpressLoading.value = true;
            try {
                const item = (cartItems.value as any[]).find((i: any) => i.referencedId === expressProductId);
                if (val && !item) await addProduct({ id: expressProductId, quantity: 1 });
                else if (!val && item) await removeItem(item);
            } finally {
                isExpressLoading.value = false;
            }
        },
    });
    const agreedToTerms = ref(false);

    const selectedShippingMethodId = ref('');
    const selectedPaymentMethodId = ref('');
    const selectedPickupPoint = ref<PickupPoint | null>(null);

    watch(selectedShippingMethodId, (id) => {
        const balikovoId = (config.public.shopware.ids.shipping as Record<string, string> | undefined)?.balikovo;
        if (id !== balikovoId) {
            selectedPickupPoint.value = null;
        }
    });

    // ── sessionStorage persist ─────────────────────────────────────────────
    const STORAGE_KEY = 'mtsport_checkout_form';

    const loadFromStorage = (): Partial<{
        shipping: ShippingAddressForm;
        billing: BillingAddressForm;
        isBillingDiff: boolean;
        isCompany: boolean;
    }> => {
        if (typeof window === 'undefined') return {};
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    };

    const saveToStorage = () => {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                shipping: shippingAddress.value,
                billing: billingAddress.value,
                isBillingDiff: isBillingDifferent.value,
                isCompany: isCompanyPurchase.value,
            }));
        } catch {}
    };

    const clearStorage = () => {
        if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
    };
    // ── /sessionStorage persist ────────────────────────────────────────────

    // Pre prihlásených zákazníkov ignorujeme cache — dáta prídu z Shopware v onMounted
    const stored = isLoggedIn.value ? {} : loadFromStorage();
    const shippingAddress = ref<ShippingAddressForm>(stored.shipping ?? { ...EMPTY_SHIPPING, countryId: navbarCountryId.value || '' });
    const billingAddress = ref<BillingAddressForm>(stored.billing ?? { ...EMPTY_BILLING });
    if (stored.isBillingDiff != null) isBillingDifferent.value = stored.isBillingDiff;
    if (stored.isCompany != null) isCompanyPurchase.value = stored.isCompany;

    // Auto-set first country when countries load and countryId is still empty
    watch(sortedCountriesOptions, (opts) => {
        if (!shippingAddress.value.countryId && opts.length > 0) {
            shippingAddress.value.countryId = opts[0].value;
        }
    }, { immediate: true });

    // Persist form data to sessionStorage on every change
    watch([shippingAddress, billingAddress, isBillingDifferent, isCompanyPurchase], saveToStorage, { deep: true });

    const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);

    const requiredShippingFilled = computed(() => {
        const a = shippingAddress.value;
        return !!(a.firstName && a.lastName && a.email && a.phone && a.street && a.city && a.zipcode && a.countryId);
    });

    // Plná country-aware validácia (formát mailu, tel, PSČ, IČO/DIČ/IČ DPH, dĺžky)
    const billingIsoForValidation = computed(() =>
        sortedCountriesOptions.value.find(c => c.value === billingAddress.value.countryId)?.iso || ''
    );
    const isShippingValid = computed(() => {
        const shipErrors = validateShippingForm(
            shippingAddress.value,
            selectedCountryIso.value,
            isCompanyPurchase.value,
        );
        if (Object.keys(shipErrors).length > 0) return false;
        if (isBillingDifferent.value) {
            const billErrors = validateBillingForm(billingAddress.value, billingIsoForValidation.value);
            if (Object.keys(billErrors).length > 0) return false;
        }
        return true;
    });

    // Krok 1 → 2: adresa validná aj spôsob dopravy vybraný
    const canProceedToPayment = computed(() =>
        isShippingValid.value && !!selectedShippingMethodId.value
    );

    // Finálne zadanie objednávky
    const canPlaceOrder = computed(() => {
        if (!isShippingValid.value) return false;
        if (!selectedShippingMethodId.value) return false;
        if (!selectedPaymentMethodId.value) return false;
        if (!agreedToTerms.value) return false;
        const balikovoId = (config.public.shopware.ids.shipping as Record<string, string> | undefined)?.balikovo;
        if (balikovoId && selectedShippingMethodId.value === balikovoId && !selectedPickupPoint.value) return false;
        return true;
    });

    const goToStep = (step: number) => {
        currentStep.value = step;
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextStep = () => goToStep(currentStep.value + 1);
    const prevStep = () => goToStep(currentStep.value - 1);

    const handleShippingMethodChange = async (id: string) => {
        selectedShippingMethodId.value = id;
        try { 
            await setShippingMethod({ id }); 
            await refreshCart();
        } catch (e) { 
            console.error('[Checkout] setShippingMethod error:', e); 
        }
    };

    const handlePaymentMethodChange = async (id: string) => {
        selectedPaymentMethodId.value = id;
        try {
            await setPaymentMethod({ id });
            // Dobierka virtual product: add/remove based on payment selection
            if (dobierkaProductId && dobierkaPaymentId) {
                const isDobierka = id === dobierkaPaymentId;
                const item = (cartItems.value as any[]).find((i: any) => i.referencedId === dobierkaProductId);
                if (isDobierka && !item) await addProduct({ id: dobierkaProductId, quantity: 1 });
                else if (!isDobierka && item) await removeItem(item);
            }
            await refreshCart();
        } catch (e) {
            console.error('[Checkout] setPaymentMethod error:', e);
        }
    };

    // Keď zákazník prepne B2B, Shopware musí prepočítať DPH (reverse charge vs normálna sadzba)
    watch(isCompanyPurchase, async () => {
        const country = shippingAddress.value.countryId;
        if (!country) return;
        try {
            await setCountry(country);
            await refreshCart();
        } catch (e) {
            console.error('[Checkout] B2B context refresh error:', e);
        }
    });

    // Refetch shipping methods + update cart taxes when address changes
    watch([() => shippingAddress.value.countryId, () => shippingAddress.value.zipcode], async ([country]) => {
        if (country) {
            try {
                // setCountry → Shopware prepočíta cart s DPH pre danú krajinu
                await setCountry(country);
                await Promise.all([
                    refreshCart(),
                    getShippingMethods({ onlyAvailable: true } as any),
                ]);

                // Stale selection guard: SK-only metódy (Balíkovo/SPS/Osobný odber)
                // zmiznú mimo SK → reset výberu
                const shippingIds = config.public.shopware.ids.shipping as Record<string, string>;
                const id = selectedShippingMethodId.value;
                const iso = selectedCountryIso.value;
                const isStaleSkOnly =
                    [shippingIds.balikovo, shippingIds.sps, shippingIds.osobnyOdber].includes(id) && iso !== 'SK';
                if (isStaleSkOnly) selectedShippingMethodId.value = '';

                // Toptrans CZ/PL ↔ generický Toptrans — country-aware default
                await applyCountryShippingDefault(iso);
            } catch (e) {
                console.error('[Checkout] updateContext/shipping error:', e);
            }
        }
    });

    const buildCompanyPayload = (addr: ShippingAddressForm): Record<string, unknown> => {
        if (!isCompanyPurchase.value) return {};
        const payload: Record<string, unknown> = {};
        if (addr.company?.trim()) payload.company = addr.company.trim();
        if (addr.icdph?.trim()) payload.vatId = addr.icdph.trim();
        const customFields: Record<string, string> = {};
        if (addr.ico?.trim()) customFields.mtsport_ico = addr.ico.trim();
        if (addr.dic?.trim()) customFields.mtsport_dic = addr.dic.trim();
        if (Object.keys(customFields).length) payload.customFields = customFields;
        return payload;
    };

    const placeOrder = async (): Promise<string | null> => {
        if (!canPlaceOrder.value) return null;

        isSubmitting.value = true;
        submitError.value = null;

        try {
            const addr = shippingAddress.value;
            const billing = isBillingDifferent.value ? billingAddress.value : null;
            const companyPayload = buildCompanyPayload(addr);

            if (!isUserSession.value) {
                // Validácia hesla pri vytváraní účtu
                if (createAccount.value) {
                    if (!accountPassword.value || accountPassword.value.length < 8) {
                        submitError.value = 'Heslo musí mať aspoň 8 znakov.';
                        return null;
                    }
                    if (accountPassword.value !== accountPasswordConfirm.value) {
                        submitError.value = 'Heslá sa nezhodujú.';
                        return null;
                    }
                }

                const billingAddr: Record<string, unknown> = {
                    firstName: billing?.firstName || addr.firstName,
                    lastName: billing?.lastName || addr.lastName,
                    street: billing?.street || addr.street,
                    zipcode: billing?.zipcode || addr.zipcode,
                    city: billing?.city || addr.city,
                    countryId: billing?.countryId || addr.countryId,
                    phoneNumber: addr.phone,
                    ...companyPayload,
                };

                const shippingAddr = isBillingDifferent.value ? {
                    firstName: addr.firstName,
                    lastName: addr.lastName,
                    street: addr.street,
                    zipcode: addr.zipcode,
                    city: addr.city,
                    countryId: addr.countryId,
                    phoneNumber: addr.phone,
                } : undefined;

                await register({
                    firstName: addr.firstName,
                    lastName: addr.lastName,
                    email: addr.email,
                    guest: !createAccount.value,
                    ...(createAccount.value ? { password: accountPassword.value } : {}),
                    billingAddress: billingAddr as any,
                    ...(shippingAddr ? { shippingAddress: shippingAddr } : {}),
                    acceptedDataProtection: true,
                    storefrontUrl: typeof window !== 'undefined'
                      ? window.location.origin
                      : (useRuntimeConfig().public.siteUrl as string || 'https://mtsport.store'),
                });

                // Auto-login after full registration so user lands on thank-you page as authenticated
                if (createAccount.value) {
                    try {
                        await (login as any)({ username: addr.email, password: accountPassword.value });
                        useState('checkoutJustRegistered', () => false).value = true;
                    } catch (e) {
                        console.error('[Checkout] Auto-login after registration failed:', e);
                    }
                }
            } else if (isLoggedIn.value && Object.keys(companyPayload).length) {
                const defaultBillingId = (userDefaultBillingAddress.value as any)?.id;
                if (defaultBillingId) {
                    await apiClient.invoke('updateCustomerAddress patch /account/address/{addressId}' as any, {
                        pathParams: { addressId: defaultBillingId },
                        body: companyPayload as any,
                    });
                }
            }

            await Promise.all([
                setShippingMethod({ id: selectedShippingMethodId.value }),
                setPaymentMethod({ id: selectedPaymentMethodId.value }),
            ]);

            // Strip any HTML from the note field before sending to Shopware
            const rawNote = addr.note?.trim() ?? '';
            const customerComment = rawNote
              ? rawNote.replace(/<[^>]*>/g, '').slice(0, 500) || undefined
              : undefined;

            const rawOrder = await apiClient.invoke('createOrder post /checkout/order', {
                body: customerComment ? { customerComment } : {},
            });

            // canary api-client môže vrátiť Order priamo alebo { data: Order }
            const order = (rawOrder as any)?.data ?? rawOrder;
            const orderId = (order as any)?.id ?? null;

            refreshCart();
            clearStorage();

            const balikovoId = (config.public.shopware.ids.shipping as Record<string, string> | undefined)?.balikovo;
            if (orderId && selectedShippingMethodId.value === balikovoId && selectedPickupPoint.value) {
                try {
                    await $fetch('/api/sps/save-pickup-point', {
                        method: 'POST',
                        body: { orderId, pickupPoint: selectedPickupPoint.value },
                    });
                } catch (e) {
                    console.error('[Checkout] SPS pickup point save error:', e);
                }
            }

            return orderId;
        } catch (err: any) {
            const detail =
                err?.details?.errors?.[0]?.detail ||
                err?.data?.errors?.[0]?.detail ||
                err?.message ||
                'Nastala chyba pri vytváraní objednávky. Skúste to znova.';
            submitError.value = detail;
            return null;
        } finally {
            isSubmitting.value = false;
        }
    };

    onMounted(async () => {
        // 1. Payment methods can load immediately (no country dependency)
        await getPaymentMethods();

        if (sessionShipping.value?.id) selectedShippingMethodId.value = sessionShipping.value.id;
        if (sessionPayment.value?.id) selectedPaymentMethodId.value = sessionPayment.value.id;

        // 2. Load user address if logged in (overwrites navbarCountryId default)
        if (isLoggedIn.value && user.value) {
            shippingAddress.value.email = user.value.email || '';

            const bAddr = userDefaultBillingAddress.value as any;
            const sAddr = userDefaultShippingAddress.value as any;

            const primaryAddr = bAddr || sAddr;

            if (primaryAddr) {
                shippingAddress.value = {
                    ...shippingAddress.value,
                    firstName: primaryAddr.firstName || '',
                    lastName: primaryAddr.lastName || '',
                    phone: primaryAddr.phoneNumber || '',
                    street: primaryAddr.street || '',
                    city: primaryAddr.city || '',
                    zipcode: primaryAddr.zipcode || '',
                    countryId: primaryAddr.countryId || '',
                    company: primaryAddr.company || user.value.company || '',
                    icdph: (user.value as any).vatIds?.[0] || '',
                    ico: primaryAddr.customFields?.mtsport_ico || '',
                    dic: primaryAddr.customFields?.mtsport_dic || '',
                };

                if (shippingAddress.value.company || shippingAddress.value.icdph || shippingAddress.value.ico || shippingAddress.value.dic) {
                    isCompanyPurchase.value = true;
                }
            }

            if (bAddr && sAddr && bAddr.id !== sAddr.id) {
                isBillingDifferent.value = true;

                shippingAddress.value = {
                    ...shippingAddress.value,
                    firstName: sAddr.firstName || '',
                    lastName: sAddr.lastName || '',
                    phone: sAddr.phoneNumber || '',
                    street: sAddr.street || '',
                    city: sAddr.city || '',
                    zipcode: sAddr.zipcode || '',
                    countryId: sAddr.countryId || '',
                    company: sAddr.company || bAddr.company || '',
                    icdph: (user.value as any).vatIds?.[0] || '',
                    ico: sAddr.customFields?.mtsport_ico || bAddr.customFields?.mtsport_ico || '',
                    dic: sAddr.customFields?.mtsport_dic || bAddr.customFields?.mtsport_dic || '',
                };

                billingAddress.value = {
                    ...EMPTY_BILLING,
                    firstName: bAddr.firstName || '',
                    lastName: bAddr.lastName || '',
                    street: bAddr.street || '',
                    city: bAddr.city || '',
                    zipcode: bAddr.zipcode || '',
                    countryId: bAddr.countryId || '',
                    company: bAddr.company || '',
                    icdph: (user.value as any).vatIds?.[0] || '',
                    ico: bAddr.customFields?.mtsport_ico || '',
                    dic: bAddr.customFields?.mtsport_dic || '',
                    email: user.value.email || '',
                };
            }
        }

        // 3. Set country in Shopware BEFORE fetching shipping methods so
        //    availability rules (e.g. SPS SK-only) are evaluated correctly
        if (shippingAddress.value.countryId) {
            try { await setCountry(shippingAddress.value.countryId); } catch {}
        }
        await getShippingMethods({ onlyAvailable: true } as any);

        // Country-default shipping (CZ→Toptrans CZ, PL→Toptrans PL) — pokrýva prípad,
        // keď je krajina CZ/PL už pri mount (watch sa pri initial value nespustí)
        await applyCountryShippingDefault(selectedCountryIso.value);
    });

    return {
        currentStep,
        isSubmitting,
        submitError,
        isBillingDifferent,
        isCompanyPurchase,
        createAccount,
        accountPassword,
        accountPasswordConfirm,
        isExpressShipping,
        agreedToTerms,
        selectedShippingMethodId,
        selectedPaymentMethodId,
        selectedPickupPoint,
        shippingMethods: rawShippingMethods,
        paymentMethods,
        countries: sortedCountriesOptions,
        selectedCountryIso,
        selectedCountryTaxRate,
        isB2bReverseCharge,
        shippingAddress,
        billingAddress,
        canProceedToPayment,
        canPlaceOrder,
        goToStep,
        nextStep,
        prevStep,
        handleShippingMethodChange,
        handlePaymentMethodChange,
        placeOrder,
    };
};
