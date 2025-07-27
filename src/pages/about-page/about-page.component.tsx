import React from 'react';

const AboutPageComponent: React.FC = () => {
  return (
    <main style={{ padding: 20 }}>
      <h1>About This Application</h1>
      <p>Author: Дмитрий (Darkonic10)</p>
      <p>
        This application was created as part of the{' '}
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
          RS School React course
        </a>
        .
      </p>
    </main>
  );
};

export default AboutPageComponent;
