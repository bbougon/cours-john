export const slugify = (toSlug: string): string =>
  toSlug.toLowerCase().replace(' ', '-');
