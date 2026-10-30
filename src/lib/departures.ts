// Turns the departures sent by the trip editor into Departure rows.
// Dates are optional: a batch without dates is an "Upcoming" batch that only carries
// spots left, a price or a label until the dates are announced.

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const toText = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

export function toDepartureRows(departures: any[], tripId: string, slug: string) {
  const usedIds = new Set<string>();

  return departures
    .map((dep) => ({
      id: toText(dep.id),
      startDate: toText(dep.startDate),
      endDate: toText(dep.endDate),
      price: toNumber(dep.price),
      originalPrice: toNumber(dep.originalPrice),
      spotsLeft: toNumber(dep.spotsLeft) === null ? null : Math.trunc(toNumber(dep.spotsLeft)!),
      status: dep.status ?? "open",
      label: toText(dep.label),
      note: toText(dep.note),
    }))
    .filter(
      (dep) =>
        dep.startDate ||
        dep.endDate ||
        dep.price !== null ||
        dep.spotsLeft !== null ||
        dep.label ||
        dep.note,
    )
    .map((dep) => {
      // A batch that just got its dates drops the "upcoming" id for a dated one
      const keepId = dep.id && !(dep.startDate && dep.id.includes("-upcoming"));
      const baseId = keepId ? dep.id! : `${slug}-${dep.startDate ?? "upcoming"}`;
      let id = baseId;
      for (let n = 2; usedIds.has(id); n++) id = `${baseId}-${n}`;
      usedIds.add(id);
      return { ...dep, id, tripId };
    });
}

// Both dates or neither: a batch with only one date can't be shown on the website
export function findHalfDatedDeparture(departures: any[]): number {
  return departures.findIndex((dep) => !toText(dep?.startDate) !== !toText(dep?.endDate));
}
