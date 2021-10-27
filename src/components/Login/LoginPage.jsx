import React from 'react';
import {
  useLocation,
} from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function LoginPage() {
  const query = useQuery();

  return (
    <div className="pt-5">
      <LoginSuccessBox registerSuccess={query.get('registersuccess')} />
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function LoginSuccessBox({ registerSuccess }) {
  if (registerSuccess === 'true') {
    return (
      <h1>This is a success reroute from Register Page</h1>
    );
  }

  return (
    <h1>This is a login page</h1>
  );
}
