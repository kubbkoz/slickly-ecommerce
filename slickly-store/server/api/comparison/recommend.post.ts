import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';
import Anthropic from '@anthropic-ai/sdk';

export default defineEventHandler(async (event) => {
  const { items } = await readBody(event);
  if (!Array.isArray(items) || items.length < 2) {
    return { recommendation: 'Pridajte aspoň 2 produkty na porovnanie.' };
  }

  const config = useRuntimeConfig();
  const apiKey = config.claudeApiKey as string;
  if (!apiKey) return { recommendation: 'AI odporúčanie nie je dostupné.' };

  const summary = items.map((p: any, i: number) =>
    `${i + 1}. ${p.name} — ${p.price}€${p.oldPrice ? ` (pôvodne ${p.oldPrice}€)` : ''}\n   Kategória: ${p.categoryName}\n   Výrobca: ${p.manufacturer}\n   Specs: ${(p.properties || []).map((s: any) => `${s.group}: ${s.value}`).join(', ')}`
  ).join('\n\n');

  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Si cyklistický odborník. Porovnaj tieto produkty a odporúč najlepší pomer cena/výbava. Odpoveď max 3 vety po slovensky. Buď konkrétny — pomenuj víťaza a prečo.\n\n${summary}`,
      }],
    });
    const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    return { recommendation: text };
  } catch (e: any) {
    if (process.dev) console.error('[comparison] AI failed:', e?.message);
    return { recommendation: 'AI odporúčanie momentálne nedostupné.' };
  }
});
