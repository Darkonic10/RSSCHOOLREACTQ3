import { useRef, useState } from 'react';
import { type MyFormData, useFormStore } from '@/store/form-data.ts';
import styles from './form.module.css';
import { Autocomplete } from '@/components/ui/autocomplete/autocomplete.tsx';
import { formSchema } from '@/types/form.interface.ts';
import { getPasswordStrength } from '@/components/common/common.ts';

export function UncontrolledForm({ onSuccess }: { onSuccess: () => void }) {
  const setData = useFormStore((s) => s.setData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValue, setPasswordValue] = useState('');
  const countries = useFormStore((s) => s.countries);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    const obj = Object.fromEntries(fd.entries());

    const preparedData = {
      ...obj,
      agreement: fd.has('agreement'),
      file: (fd.get('file') as File) || null,
    };

    const result = formSchema.safeParse(preparedData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (result.success) {
      setData(result.data as MyFormData);
      onSuccess();
    }
  };

  const strength = getPasswordStrength(passwordValue);

  return (
    <form className={styles.form} ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className={styles.controlContainer}>
        <label htmlFor="name">Name</label>
        <input name="name" id="name" type="text" />
        <p className={styles.error}>{errors.name && errors.name}</p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="age">Age</label>
        <input name="age" id="age" type="number" />
        <p className={styles.error}>{errors.age && errors.age}</p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="email">Email</label>
        <input name="email" id="email" type="email" />
        <p className={styles.error}>{errors.email && errors.email}</p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="password">Password</label>
        <input name="password" id="password" type="password" onChange={(e) => setPasswordValue(e.target.value)} />
        <p className={styles.error}>{errors.password && errors.password}</p>
        <p className={styles.passwordStrength}>
          <span style={{ color: strength.color }}>{passwordValue ? strength.label : ''}</span>
        </p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="confirm_password">Confirm password</label>
        <input name="confirm_password" id="confirm_password" type="password" />
        <p className={styles.error}>{errors.confirm_password && errors.confirm_password}</p>
      </div>

      <div className={styles.genderContainer}>
        <div className={styles.genderControlContainer}>
          <div className={styles.genderControl}>
            <label htmlFor="gender_male">Male</label>
            <input type="radio" name="gender" id="gender_male" value="male" />
          </div>

          <div className={styles.genderControl}>
            <label htmlFor="gender_female">Female</label>
            <input type="radio" name="gender" id="gender_female" value="female" />
          </div>
        </div>
        <p className={styles.error}>{errors.gender && errors.gender}</p>
      </div>

      <div className={styles.acceptContainer}>
        <div className={styles.acceptControl}>
          <label htmlFor="agreement">Accept T&C</label>
          <input type="checkbox" id="agreement" name="agreement" />
        </div>
        <p className={styles.error}>{errors.agreement && errors.agreement}</p>
      </div>

      <div>
        <input type="file" name="file" accept="image/png, image/jpeg" />
        <p className={styles.error}>{errors.file && errors.file}</p>
      </div>

      <div>
        <Autocomplete
          id="country_autocomplete"
          label="Country"
          options={countries}
          value=""
          onChange={(val) => {
            const hidden = formRef.current?.querySelector<HTMLInputElement>('#country_hidden');
            if (hidden) hidden.value = val;
          }}
        />
        <input type="hidden" id="country_hidden" name="country" />
        <p className={styles.error}>{errors.country && errors.country}</p>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}