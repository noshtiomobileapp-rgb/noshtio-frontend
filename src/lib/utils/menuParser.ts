export function parseMenuText(text: string) {
  const lines = text.split("\n");
  const items: any[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const match = line.match(/(.+?)\s+(\d{2,4})$/);
    if (match) {
      items.push({
        name: match[1],
        price: Number(match[2]),
        category: "Uncategorized",
      });
    }
  }

  return items;
}
