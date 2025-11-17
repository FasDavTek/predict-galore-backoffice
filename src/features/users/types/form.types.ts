import { User, UserFormData } from './user.types';

export interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserFormData) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  open?: boolean;
}