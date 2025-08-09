import { fireEvent, screen, waitFor } from "@testing-library/react";
import HeaderComponent from "./header.component.tsx";
import * as routerDom from "react-router-dom";
import { localStorageMock } from "@/mocks";
import { renderWithProviders } from "@/common/test-utils.tsx";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof routerDom>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: "/" }),
  };
});

describe("HeaderComponent", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    localStorage.clear();
    navigateMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input and search button", () => {
    renderWithProviders(<HeaderComponent />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("loads saved search from localStorage on mount", async () => {
    localStorage.setItem("lastSearch", JSON.stringify("Naruto"));
    renderWithProviders(<HeaderComponent />, ["/"]);
    const input = await screen.findByRole("textbox");

    expect(input).toHaveValue("Naruto");
    fireEvent.submit(screen.getByTestId("headerForm"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        { search: "?q=Naruto&page=1" },
        { replace: true },
      );
    });
  });

  it("shows empty input if no saved search in localStorage", () => {
    renderWithProviders(<HeaderComponent />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("updates input trimmed value on change", () => {
    renderWithProviders(<HeaderComponent />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "One Piece   " } });

    expect(input).toHaveValue("One Piece");
  });

  it("saves trimmed search and calls navigate with correct params", () => {
    renderWithProviders(<HeaderComponent />);
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "  Bleach  " } });
    fireEvent.click(button);

    expect(JSON.parse(localStorage.getItem("lastSearch") ?? '""')).toBe(
      "Bleach",
    );
    expect(navigateMock).toHaveBeenCalledWith(
      { search: "?q=Bleach&page=1" },
      { replace: true },
    );
  });

  it("overwrites previous localStorage value on new search", () => {
    localStorage.setItem("lastSearch", JSON.stringify("OldTerm"));
    renderWithProviders(<HeaderComponent />, ["/"]);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "NewTerm" } });
    fireEvent.submit(screen.getByTestId("headerForm"));

    expect(JSON.parse(localStorage.getItem("lastSearch") ?? '""')).toBe(
      "NewTerm",
    );

    expect(navigateMock).toHaveBeenCalledWith(
      { search: "?q=NewTerm&page=1" },
      { replace: true },
    );
  });
});
