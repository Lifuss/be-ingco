interface Messages {
  [key: number]: string;
}

export class RequestError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

const messages: Messages = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
};

const requestError = (status: number, message = messages[status]) => {
  throw new RequestError(status, message);
};

export default requestError;
