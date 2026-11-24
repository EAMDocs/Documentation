# Common Issues

### 1. "Activation Link Expired" Error
- **Cause**: Invitation links expire after 72 hours for security.
- **Resolution**: Have your NuVision Administrator go to **Admin → Users → [Your Name] → Resend Invite**.

### 2. Discovery Agent Not Reporting
- **Resolution**:
  1. Verify the service is active: `sc query NuVisionAgent` (Windows) or `systemctl status nuvision-agent` (Linux).
  2. Confirm outbound HTTPS (port 443) traffic is allowed to `*.nuvision.pemvish.com`.
  3. Inspect local log file at `%ProgramData%\NuVision\logs\agent.log`.

### 3. SSO Login Fails with "Invalid Assertion"
- **Resolution**: Verify that the IdP system clock is synchronized via NTP and ensure your IdP signing certificate has not expired.
