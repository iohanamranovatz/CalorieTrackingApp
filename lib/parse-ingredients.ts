import { ParsedIngredient } from "./types";

export function parseIngredients(text: string): ParsedIngredient[] {
  // First, try to split on commas or newlines
  let lines = text
    .split(/[,\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);

  // If we got a single line with no commas/newlines, try to split on
  // quantity patterns like "550g" that start a new ingredient.
  // e.g. "550g minced beef 400g broccoli 200g boiled potatoes"
  // becomes ["550g minced beef", "400g broccoli", "200g boiled potatoes"]
  if (lines.length === 1) {
    const split = lines[0].split(/(?=\d+(?:\.\d+)?\s*(?:kg|g|grams?)\s)/i);
    const filtered = split.map((s) => s.trim()).filter(Boolean);
    if (filtered.length > 1) {
      lines = filtered;
    }
  }

  const results: ParsedIngredient[] = [];

  for (const line of lines) {
    // Try "500g beef" or "500 g beef" or "1.5kg chicken" or "500g minced beef"
    const match1 = line.match(
      /^(\d+(?:\.\d+)?)\s*(kg|g|grams?)\s+(.+)$/i
    );
    if (match1) {
      const amount = parseFloat(match1[1]);
      const unit = match1[2].toLowerCase();
      const grams = unit.startsWith("kg") ? amount * 1000 : amount;
      results.push({ name: match1[3].trim(), grams });
      continue;
    }

    // Try "beef 500g" or "chicken breast 1.5 kg"
    const match2 = line.match(
      /^(.+?)\s+(\d+(?:\.\d+)?)\s*(kg|g|grams?)$/i
    );
    if (match2) {
      const amount = parseFloat(match2[2]);
      const unit = match2[3].toLowerCase();
      const grams = unit.startsWith("kg") ? amount * 1000 : amount;
      results.push({ name: match2[1].trim(), grams });
      continue;
    }
  }

  return results;
}
