const CATEGORY_PALETTE = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#34495e",
];

export const CLUSTER_COLOR = "#607d8b";

export const buildCategoryColorMap = (
  categories: string[]
): Record<string, string> => {
  return [...categories].sort().reduce(
    (acc, category, index) => {
      acc[category] = CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
      return acc;
    },
    {} as Record<string, string>
  );
};

export const getCategoryColor = (
  colorMap: Record<string, string>,
  category: string
): string => {
  return colorMap[category] ?? CATEGORY_PALETTE[0];
};
