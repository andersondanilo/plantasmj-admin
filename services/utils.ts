export function parseErrorMessage(error: any) {
  if (error.response && error.response.data && error.response.data.errors) {
    return error.response.data.errors[0].detail;
  }

  if (error.message) {
    return error.message;
  }

  return 'Erro';
}
