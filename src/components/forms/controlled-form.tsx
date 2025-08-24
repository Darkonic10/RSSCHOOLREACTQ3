import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '@/store/form-data.ts';
import { Autocomplete } from '@/components/ui/autocomplete/autocomplete.tsx';
import styles from './Form.module.css';
import { formSchema, type FormSchema } from '@/types/form.interface.ts';
import { getPasswordStrength } from '@/components/common/common.ts';

export function ControlledForm({ onSuccess }: { onSuccess: () => void }) {
  const setData = useFormStore((s) => s.setData);
  const countries = useFormStore((s) => s.countries);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: FormSchema) => {
    const dataForStore = { ...data, age: data.age as number, file: data.file[0] };
    setData(dataForStore);
    onSuccess();
  };

  const watchedPassword = watch('password', '');
  const strength = getPasswordStrength(watchedPassword);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.controlContainer}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register('name')} />
        <p className={styles.error}>{errors.name?.message}</p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="age">Age</label>
        <input id="age" type="number" {...register('age', { valueAsNumber: true })} />
        <p className={styles.error}>{errors.age?.message}</p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        <p className={styles.error}>{errors.email?.message}</p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        <p className={styles.error}>{errors.password?.message}</p>
        <p className={styles.passwordStrength}>
          <span style={{ color: strength.color }}>{watchedPassword ? strength.label : ''}</span>
        </p>
      </div>

      <div className={styles.controlContainer}>
        <label htmlFor="confirm_password">Confirm password</label>
        <input id="confirm_password" type="password" {...register('confirm_password')} />
        <p className={styles.error}>{errors.confirm_password?.message}</p>
      </div>

      <div className={styles.genderContainer}>
        <div className={styles.genderControlContainer}>
          <div className={styles.genderControl}>
            <label htmlFor="gender_male">Male</label>
            <input type="radio" value="male" id="gender_male" {...register('gender')} />
          </div>
          <div className={styles.genderControl}>
            <label htmlFor="gender_female">Female</label>
            <input type="radio" value="female" id="gender_female" {...register('gender')} />
          </div>
        </div>
        <p className={styles.error}>{errors.gender?.message}</p>
      </div>

      <div className={styles.acceptContainer}>
        <div className={styles.acceptControl}>
          <label htmlFor="agreement">Accept T&C</label>
          <input type="checkbox" id="agreement" {...register('agreement')} />
        </div>
        <p className={styles.error}>{errors.agreement?.message}</p>
      </div>

      <div>
        <input type="file" accept="image/png, image/jpeg" {...register('file')} />
        <p className={styles.error}>{String(errors.file?.message ?? '')}</p>
      </div>

      <div>
        <Autocomplete
          id="country_autocomplete"
          label="Country"
          options={countries}
          value=""
          onChange={(val) => setValue('country', val, { shouldValidate: true })}
        />
        <p className={styles.error}>{errors.country?.message}</p>
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}