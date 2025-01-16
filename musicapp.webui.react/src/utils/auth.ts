export interface JwtClaims {
  name: string;
  email: string;
  nameidentifier: string;
}

export const parseJwt = (token: string): JwtClaims => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const claims = JSON.parse(jsonPayload);
    return {
      name: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      nameidentifier: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};
