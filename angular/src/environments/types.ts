export type Environment = {
  api: {
    url: string;
  };
  auth0: {
    audience: string;
    clientId: string;
    domain: string;
    redirectUrl: string;
  };
};
