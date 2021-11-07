import React from 'react';
import { render } from 'react-dom';
import './styles.scss';
import 'tailwindcss/tailwind.css';

import App from './App.jsx';

// create an element that React will render stuff into
const rootElement = document.createElement('div');
rootElement.classList.add('page-wrapper');

// put that element onto the page
document.body.appendChild(rootElement);

// have react render the JSX element into the root element.
render(<App />, rootElement);
