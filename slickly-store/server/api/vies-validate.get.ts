import { defineEventHandler, getQuery, createError } from 'h3';

/**
 * VIES VAT Validation — Nitro Server Route
 * 
 * Volá oficiálny EC VIES SOAP endpoint na overenie IČ DPH.
 * Vstup: ?vatId=SK2121095845
 * Výstup: { valid: boolean, name?: string, address?: string, countryCode: string, vatNumber: string }
 */

const VIES_WSDL_URL = 'https://ec.europa.eu/taxation_customs/vies/services/checkVatService';

function buildSoapEnvelope(countryCode: string, vatNumber: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:checkVat>
         <urn:countryCode>${countryCode}</urn:countryCode>
         <urn:vatNumber>${vatNumber}</urn:vatNumber>
      </urn:checkVat>
   </soapenv:Body>
</soapenv:Envelope>`;
}

function extractTag(xml: string, tag: string): string {
    const regex = new RegExp(`<[^:]*:?${tag}[^>]*>([\\s\\S]*?)<\\/[^:]*:?${tag}>`, 'i');
    const match = xml.match(regex);
    return match?.[1]?.trim() || '';
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const rawVatId = (query.vatId as string || '').trim().replace(/\s/g, '');

    if (!rawVatId || rawVatId.length < 4) {
        throw createError({ statusCode: 400, statusMessage: 'Zadajte platné IČ DPH (min. 4 znaky).' });
    }

    // Prvé 2 znaky = kód krajiny (SK, CZ, DE, AT, ...), zvyšok = číslo
    const countryCode = rawVatId.substring(0, 2).toUpperCase();
    const vatNumber = rawVatId.substring(2);

    if (!/^[A-Z]{2}$/.test(countryCode)) {
        throw createError({ statusCode: 400, statusMessage: 'IČ DPH musí začínať dvojpísmenkovým kódom krajiny (napr. SK, CZ).' });
    }

    if (!vatNumber) {
        throw createError({ statusCode: 400, statusMessage: 'Zadajte číslo za kódom krajiny.' });
    }

    try {
        const soapBody = buildSoapEnvelope(countryCode, vatNumber);

        const response = await $fetch.raw(VIES_WSDL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': '',
            },
            body: soapBody,
            responseType: 'text',
            timeout: 20000,
        });

        const xml = response._data as string;

        const valid = extractTag(xml, 'valid').toLowerCase() === 'true';
        const name = extractTag(xml, 'name');
        const address = extractTag(xml, 'address');

        return {
            valid,
            countryCode,
            vatNumber,
            vatId: rawVatId,
            name: name && name !== '---' ? name : undefined,
            address: address && address !== '---' ? address : undefined,
        };
    } catch (err: any) {
        // VIES SOAP faults
        const message = err?.data || err?.message || '';
        
        if (typeof message === 'string' && message.includes('INVALID_INPUT')) {
            return { valid: false, countryCode, vatNumber, vatId: rawVatId, error: 'Neplatný formát IČ DPH.' };
        }
        if (typeof message === 'string' && message.includes('SERVICE_UNAVAILABLE')) {
            throw createError({ statusCode: 503, statusMessage: 'VIES služba je momentálne nedostupná. Skúste neskôr.' });
        }
        if (typeof message === 'string' && message.includes('MS_UNAVAILABLE')) {
            throw createError({ statusCode: 503, statusMessage: `Validačná služba pre krajinu ${countryCode} je momentálne nedostupná.` });
        }
        if (
            err?.name === 'TimeoutError' ||
            (typeof message === 'string' && (
                message.includes('TIMEOUT') ||
                message.toLowerCase().includes('timeout') ||
                message.toLowerCase().includes('aborted')
            ))
        ) {
            throw createError({ statusCode: 504, statusMessage: `Validačná služba pre krajinu ${countryCode} neodpovedá. Skúste neskôr.` });
        }

        console.error('[vies-validate] Error:', err?.name, err?.statusCode, message);
        throw createError({ statusCode: 502, statusMessage: 'Nepodarilo sa overiť IČ DPH cez VIES.' });
    }
});
