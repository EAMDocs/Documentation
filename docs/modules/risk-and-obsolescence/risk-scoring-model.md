# Risk Scoring Model

Each technology asset receives an automated composite Risk Score (1 to 100) based on weighted factors:

| Risk Factor | Default Weight | Data Source |
| :--- | :--- | :--- |
| **EOL / EOS Proximity** | 30% | PEMVISH Lifecycle Database |
| **CVE Severity (CVSS)** | 25% | NIST National Vulnerability Database |
| **Business Criticality** | 20% | Application Portfolio Module |
| **Asset Redundancy** | 15% | IT Asset Management Module |
| **Vendor Stability** | 10% | Vendor Risk Assessments |
