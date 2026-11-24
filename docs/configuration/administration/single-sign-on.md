# Single Sign-On

Configure enterprise SSO using SAML 2.0 or OpenID Connect (OIDC):

1. Navigate to **Admin → Security → SSO Settings**.
2. Download the NuVision SAML Metadata XML file.
3. Register NuVision as a Service Provider in your IdP (Okta, Azure AD, PingFederate).
4. Paste the IdP Metadata URL or upload the certificate into NuVision.
5. Test SSO authentication with a test account before selecting **Enforce SSO Org-Wide**.
