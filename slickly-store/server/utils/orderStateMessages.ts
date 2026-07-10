// Shopware state technicalName → SK label + správa
// Tri oddelené mapy — každá má vlastný 'open'

export const ORDER_STATES: Record<string, { label: string; message: string }> = {
  open: {
    label: 'Prijatá',
    message: 'Objednávku sme prijali. Čakáme na potvrdenie platby a naši kolegovia v sklade ju práve pripravujú.'
  },
  in_progress: {
    label: 'V spracovaní',
    message: 'Na vašej objednávke už pracujeme a čoskoro ju odošleme.'
  },
  completed: {
    label: 'Dokončená',
    message: 'Vaša objednávka je kompletne vybavená.'
  },
  done: {
    label: 'Dokončená',
    message: 'Vaša objednávka je kompletne vybavená.'
  },
  cancelled: {
    label: 'Stornovaná',
    message: 'Táto objednávka bola stornovaná. Ak si prajete tovar objednať znova, odporúčam vytvoriť novú objednávku.'
  },
  on_hold: {
    label: 'Pozastavená',
    message: 'Spracovanie objednávky sme museli pozastaviť. Budeme vás čoskoro kontaktovať s viac informáciami.'
  }
};

export const DELIVERY_STATES: Record<string, { label: string; message: string }> = {
  open: {
    label: 'Čaká na odoslanie',
    message: 'Váš tovar už pripravujeme v sklade. Akonáhle ho kuriér prevezme, dám vám vedieť.'
  },
  shipped: {
    label: 'Odoslaná',
    message: 'Balík je už na ceste! Práve ho previezol kuriér a smeruje k vám domov.'
  },
  shipped_partially: {
    label: 'Čiastočne odoslaná',
    message: 'Vaša objednávka je rozdelená. Časť tovaru je už na ceste, zvyšok pripravujeme a odošleme v najbližších dňoch.'
  },
  returned: {
    label: 'Vrátená',
    message: 'Zásielka sa nám vrátila späť do skladu v Lokci. Prosím, overte si vašu doručovaciu adresu, budeme vás kontaktovať.'
  },
  cancelled: {
    label: 'Zrušená',
    message: 'Doručenie bolo zrušené. Kontaktujte prosím našu podporu.'
  }
};

export const PAYMENT_STATES: Record<string, { label: string; message: string }> = {
  open: {
    label: 'Čaká na platbu',
    message: 'Evidujeme vašu objednávku, ale čakáme na potvrdenie platby. Hneď ako peniaze dorazia, pustíme sa do balenia.'
  },
  paid: {
    label: 'Zaplatená',
    message: 'Platbu sme prijali. Všetko je z našej strany vyrovnané.'
  },
  reminded: {
    label: 'Upomienka',
    message: 'Evidujeme vašu objednávku, ale platba zatiaľ neprebehla. Prosím, skontrolujte svoje platobné údaje, aby sme vám mohli tovar odoslať.'
  },
  refunded: {
    label: 'Vrátená platba',
    message: 'Peniaze za vašu objednávku sme vám práve poslali späť na váš účet.'
  },
  cancelled: {
    label: 'Platba zrušená',
    message: 'Platba bola zrušená. Kontaktujte prosím podporu.'
  },
  authorized: {
    label: 'Autorizovaná',
    message: 'Platba bola autorizovaná a čaká na spracovanie.'
  }
};

export function getOrderStateMessage(technicalName: string): { label: string; message: string } {
  return ORDER_STATES[technicalName] || {
    label: 'Neznámy stav',
    message: 'Nemôžeme určiť aktuálny stav vašej objednávky. Kontaktujte prosím našu podporu.'
  };
}

export function getDeliveryStateMessage(technicalName: string): { label: string; message: string } {
  return DELIVERY_STATES[technicalName] || {
    label: 'Neznámy stav doručenia',
    message: 'Nemôžeme určiť stav doručenia.'
  };
}

export function getPaymentStateMessage(technicalName: string): { label: string; message: string } {
  return PAYMENT_STATES[technicalName] || {
    label: 'Neznámy stav platby',
    message: 'Nemôžeme určiť stav platby.'
  };
}

export function buildCombinedStateMessage(states: {
  order?: string;
  delivery?: string;
  payment?: string;
}): string {
  const o = states.order?.toLowerCase() || '';
  const d = states.delivery?.toLowerCase() || '';
  const p = states.payment?.toLowerCase() || '';

  // SCENÁR A: Úspešný priebeh
  if ((o === 'completed' || o === 'done') && p === 'paid' && d === 'shipped') {
    return '✅ Skvelé správy! Vaša objednávka je zaplatená a tovar sme odovzdali kuriérovi. Balík je na ceste k vám.';
  }
  if (o === 'in_progress' && p === 'paid' && d === 'shipped') {
    return '📦 Dobrá správa! Vaša objednávka je zaplatená a kuriér ju už prevzal. Balík smeruje k vám domov.';
  }
  if (o === 'open' && p === 'paid' && d === 'open') {
    return '✅ Platbu sme prijali. Vaša objednávka je v poradí a naši kolegovia v sklade ju práve pripravujú na expedíciu.';
  }
  if (o === 'in_progress' && p === 'paid' && d === 'open') {
    return '⏳ Na vašej objednávke už pracujeme a čoskoro ju odošleme.';
  }
  // shipped + paid (akýkoľvek stav objednávky)
  if (d === 'shipped' && p === 'paid') {
    return '📦 Vaša objednávka je zaplatená a tovar sme odovzdali kuriérovi. Balík je na ceste k vám.';
  }

  // SCENÁR B: Platba
  if (p === 'open' && d === 'open') {
    return '💳 Objednávku sme prijali, ale čakáme na potvrdenie platby. Hneď ako peniaze dorazia, pustíme sa do balenia.';
  }
  if (p === 'reminded') {
    return '💳 Evidujeme vašu objednávku, ale platba zatiaľ neprebehla. Prosím, skontrolujte platobné údaje, aby sme mohli tovar odoslať.';
  }

  // SCENÁR C: Problémy
  if (o === 'cancelled') {
    return '❌ Táto objednávka bola stornovaná. Ak si prajete tovar objednať znova, vytvorte novú objednávku.';
  }
  if (d === 'returned') {
    return '🔄 Zásielka sa nám vrátila do skladu v Lokci. Overte si doručovaciu adresu, budeme vás kontaktovať.';
  }
  if (d === 'shipped_partially') {
    return '📦 Vaša objednávka je rozdelená. Časť tovaru je na ceste, zvyšok odošleme v najbližších dňoch.';
  }
  if (o === 'on_hold') {
    return '⚠️ Spracovanie je momentálne pozastavené. Budeme vás čoskoro kontaktovať.';
  }

  // Fallback — skladaj z dostupných stavov
  const parts: string[] = [];
  if (o === 'completed' || o === 'done') parts.push('Objednávka je vybavená.');
  else if (o === 'in_progress') parts.push('Na objednávke pracujeme.');
  if (p === 'paid') parts.push('Platba bola prijatá.');
  else if (p === 'open' || p === 'reminded') parts.push('Čakáme na potvrdenie platby.');
  if (d === 'shipped') parts.push('Balík je na ceste.');
  else if (d === 'open') parts.push('Tovar sa pripravuje na odoslanie.');

  return parts.length > 0
    ? parts.join(' ')
    : 'Nemôžeme určiť aktuálny stav objednávky. Kontaktujte prosím našu podporu.';
}
