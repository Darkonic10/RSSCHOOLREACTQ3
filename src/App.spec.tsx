import { screen } from "@testing-library/react";
import App from "@/App.tsx";
import { renderWithProviders } from "@/common/test-utils.tsx";

test("App renders HeaderComponent", () => {
  renderWithProviders(<App />);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
});
