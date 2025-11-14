import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { logIn, getErrorText } from '../../services/slices/auth-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(getErrorText);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(logIn({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorMsg ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
