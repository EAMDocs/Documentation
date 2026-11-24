# Ghost Asset Detection

A **Ghost Asset** is an asset listed in financial or inventory records that is no longer detected on the network or has been decommissioned without record updates.

### Reconciliation Engine

- NuVision reconciles purchase orders against live agent telemetry and network pings.
- Assets inactive for more than **30 days** (configurable) are automatically flagged as suspected ghost assets.
- Reports isolate ghost assets to prevent paying maintenance, warranties, and software licenses on non-existent hardware.
