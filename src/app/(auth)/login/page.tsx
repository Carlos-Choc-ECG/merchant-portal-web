'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { resolveBrand } from '@/branding/brand';
import { resolveLocale } from '@/locales';
import { FloatingField } from '@/components/forms/FloatingField';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { validateEmail } from '@/utils/validators';

const brand = resolveBrand('ecg');
const locale = resolveLocale('en-US');

const welcomeText = locale.auth.welcome.replace('{brandName}', brand.brandName);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setEmail(nextValue);

    if (emailError && validateEmail(nextValue) === '') {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextError = validateEmail(email);
    setEmailError(nextError);

    if (!nextError) {
      // Replace with real submit logic later.
      console.log('Submitting login request for:', email);
    }
  };

  return (
    <main className="login-page">
      <section className="login-page__card" aria-labelledby="login-page-title">
        <h1 id="login-page-title" className="login-page__title">
          {welcomeText}
        </h1>
        <p className="login-page__description">{locale.auth.subtitle}</p>

        <form className="login-page__form" noValidate onSubmit={handleSubmit}>
          <FormFieldGroup fieldId="email" error={emailError} className="login-page__field">
            <FloatingField
              id="email"
              name="email"
              type="email"
              label={locale.auth.emailLabel}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              icon={<Mail className="login-page__input-icon" aria-hidden="true" />}
              autoComplete="email"
              error={emailError}
              aria-invalid={Boolean(emailError)}
            />
          </FormFieldGroup>

          <button type="submit" className="login-page__submit">
            {locale.auth.submit}
          </button>
        </form>
      </section>
    </main>
  );
}
