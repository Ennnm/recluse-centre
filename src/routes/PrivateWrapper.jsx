/* eslint-disable react/prop-types */
import React from 'react';
import {
  Redirect,
} from 'react-router-dom';

export default function PrivateWrapper({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return children;
}
