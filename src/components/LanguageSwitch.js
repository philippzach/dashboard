import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

function Page() {
  const { i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('de')}>de</button>
      <button onClick={() => changeLanguage('en')}>en</button>
    </div>
  );
}

// loading component for suspense fallback
const Loader = () => <div>loading...</div>;

// here app catches the suspense from page in case translations are not yet loaded
export default function Switcher() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}

/* function Switcher() {
  const { t, i18n,} = useTranslation();
  return (
    <>
      <button
        onClick={() => {
          i18n.changeLanguage('en');
        }}
      >
        EN
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage('de');
        }}
      >
        DE
      </button>
    </>
  );
}
export default Switcher; */
