import { AxiosError } from 'axios';

export function parseErrorMessage(error: Error): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosError = error as AxiosError<any>;

  if (axiosError.response && axiosError.response.data && axiosError.response.data.errors) {
    return axiosError.response.data.errors[0].detail;
  }

  if (error.message) {
    return error.message;
  }

  return 'Erro';
}
