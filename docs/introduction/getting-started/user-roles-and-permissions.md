# User Roles and Permissions

NuVision utilizes Role-Based Access Control (RBAC) to enforce least-privilege security across all modules.

### Default System Roles

| Role | Scope | Permissions |
| :--- | :--- | :--- |
| **Super Admin** | Platform-wide | Full configuration, user provisioning, audit export, and billing |
| **Platform Admin** | Functional Modules | Full create/edit/delete across all modules; cannot alter billing |
| **Contributor** | Assigned Modules | Create, edit, and link records in designated modules |
| **Viewer** | Read-Only | View dashboards, reports, and models; cannot modify records |
