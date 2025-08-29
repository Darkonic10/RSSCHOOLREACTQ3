import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import style from './modal.module.css';

export type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
  const [mouseDownTarget, setMouseDownTarget] = useState<EventTarget | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseDownTarget(e.target);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target && mouseDownTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div className={style.overlay} onMouseDown={handleMouseDown} onClick={handleClick} role="dialog" aria-modal="true">
      <div className={style.modal} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        {children}
      </div>
    </div>,
    document.body,
  );
}