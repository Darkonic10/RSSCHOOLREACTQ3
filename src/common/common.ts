export function generateRadialGradient(palette: number[][]): string {
  if (palette.length < 4) return "linear-gradient(to bottom, #222, #000)";

  const positions = ["30% 40%", "70% 30%", "40% 70%", "80% 80%"];

  const intensities = ["60%", "60%", "55%", "50%"];

  const gradients = palette.map(([r, g, b], index) => {
    return `radial-gradient(circle at ${positions[index]}, rgba(${r}, ${g}, ${b}, 0.6), transparent ${intensities[index]})`;
  });

  return gradients.join(", ");
}

export function csvDownload<T>(
  data: T[],
  headers: string[],
  rowMapper: (item: T) => (string | number | null | undefined)[],
  filename: string = "option-list",
): void {
  if (!Array.isArray(data)) {
    throw new Error("CSV download requires array data");
  }

  const rows = [headers, ...data.map(rowMapper)];
  const csvContent = rows
    .map((row) =>
      row
        .map((value) => {
          const nonNullableValue = value ?? "";
          return typeof nonNullableValue === "string" &&
            nonNullableValue.includes(",")
            ? `"${nonNullableValue}"`
            : nonNullableValue;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const fullFilename = `${filename}.csv`;

  const url = URL.createObjectURL(blob);
  const anchorElement = document.createElement("a");
  anchorElement.href = url;
  anchorElement.download = fullFilename;
  document.body.append(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}
