export const oktaConfig = {
  clientId: "0oa7noyamoK9JI9dF5d7",
  issuer: "https://dev-71436809.okta.com/oauth2/default",
  redirectUri: "https://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true,
};
