import React, { useCallback } from "react";
import { usePickedCardStore } from "@/store/store.ts";
import style from "./selected-footer.component.module.css";
import CustomButton from "@/components/ui/custom-button/custom-button.tsx";
import { csvDownload } from "@/common/common.ts";

const SelectedFooter: React.FC = () => {
  const selected = usePickedCardStore((s) => s.selected);
  const clearSelected = usePickedCardStore((s) => s.clearSelected);

  const handleDownload = useCallback(() => {
    csvDownload(
      selected,
      ["ID", "Title", "Episodes", "Score", "URL"],
      (anime) => [
        anime.mal_id,
        anime.titles?.[0]?.title ?? "Untitled",
        anime.episodes ?? "Unknown",
        anime.score ?? "N/A",
        anime.url ?? "N/A",
      ],
      `${selected.length}_items`,
    );
  }, [selected]);

  if (selected.length === 0) return null;

  return (
    <div className={style.selectedFooterContainer}>
      <span>{`Picked ${selected.length} element(s)`}</span>
      <div className={style.buttonContainer}>
        <CustomButton onClick={clearSelected}>Cancel selection</CustomButton>
        <CustomButton onClick={handleDownload} disabled={selected.length === 0}>
          Load
        </CustomButton>
      </div>
    </div>
  );
};

export default SelectedFooter;
