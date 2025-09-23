import { useLogin } from './useLogin';
import { LoginView } from './Login.view';

export const Login = () => {
  const { handleSubmit, isPending, error } = useLogin();

  return (
    <LoginView
      handleSubmit={handleSubmit}
      isPending={isPending}
      error={error}
    />
  );
};