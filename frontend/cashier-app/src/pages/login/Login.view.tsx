import { Card, Form, Input, SubmitButton } from '@fineract-apps/ui';
import { z } from 'zod';
import { LoginViewProps } from './Login.types';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginView: React.FC<LoginViewProps> = ({
  handleSubmit,
  error,
}) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <h2 className="mb-4 text-center text-2xl font-bold">Cashier Login</h2>
        <Form
          initialValues={{ username: 'mifos', password: 'password' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          <Input
            name="username"
            label="Username"
            placeholder="Enter your username"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <SubmitButton label="Sign In" className="w-full" />
        </Form>
        {!!error && (
          <p className="mt-4 text-center text-red-500">
            Login failed. Please check your credentials.
          </p>
        )}
      </Card>
    </div>
  );
};