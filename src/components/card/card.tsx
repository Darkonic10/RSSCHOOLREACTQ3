import type { MyFormData } from '@/store/form-data.ts';
import styles from './card.module.css';

type ModalProps = {
  data: MyFormData;
  className?: string;
};

export function Card({ data, className }: ModalProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      <img src={URL.createObjectURL(data.file)} alt="Preview" className={styles.img} />
      <p>Name: {data.name}</p>
      <p>Age: {data.age}</p>
      <p>Email: {data.email}</p>
      <p>Password: {data.password}</p>
      <p>Gender: {data.gender}</p>
      <p>Country: {data.country}</p>
      <p>Accept T&C: Accepted</p>
    </div>
  );
}