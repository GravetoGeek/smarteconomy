import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../graphql/mutations/users.mutations';

interface UpdateUserInput {
  email?: string;
  name: string;
  lastname: string;
  birthdate?: string;
  role?: string;
  genderId: string;
  professionId: string;
  profileId?: string;
  password: string;
}

interface UpdateUserVariables {
  id: string;
  input: UpdateUserInput;
}

interface UpdateUserResponse {
  updateUser: {
    success: boolean;
    message: string;
    user: {
      id: string;
      email: string;
      name: string;
      lastname: string;
      birthdate: string;
      role: string;
      genderId: string;
      professionId: string;
      profileId?: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export const useUpdateUser = () => {
  const [updateUserMutation, { data, loading, error }] = useMutation<
    UpdateUserResponse,
    UpdateUserVariables
  >(UPDATE_USER);

  const updateUser = async (id: string, input: UpdateUserInput) => {
    try {
      const result = await updateUserMutation({
        variables: {
          id,
          input,
        },
      });
      return result.data?.updateUser;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return {
    updateUser,
    data: data?.updateUser,
    loading,
    error,
  };
};
