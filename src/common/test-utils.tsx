import React from "react";
import { render } from "@testing-library/react";
import { type InitialEntry, MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/common/context/themeProvider.tsx";

export function renderWithProviders(
  ui: React.ReactElement,
  initialEntries?: InitialEntry[],
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>{ui}</ThemeProvider>
    </MemoryRouter>,
  );
}
