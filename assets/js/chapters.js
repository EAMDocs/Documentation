/**
 * chapters.js  –  NuVision User Manual Content
 * PEMVISH LLC  |  All chapter content defined here as structured data.
 * Each chapter is an object: { id, label, icon, group, content (HTML string) }
 */

window.MANUAL_CHAPTERS = [

  /* ══════════════════════════════════════════════════════
     GROUP: INTRODUCTION
  ══════════════════════════════════════════════════════ */
  {
    id: 'overview',
    label: 'Platform Overview',
    icon: 'bi-grid-1x2',
    group: 'Introduction',
    content: `
      <h2 class="section-anchor" id="h-overview">Platform Overview</h2>
      <p>
        <strong>NuVision</strong> is PEMVISH's flagship enterprise SaaS platform — a unified command centre
        that consolidates Enterprise Architecture Management (EAM), Application Portfolio Management (APM),
        IT &amp; Software Asset Management (ITAM/SAM/HAM), Technology Risk Management, and Business Portfolio
        Governance into a single, configuration-driven workspace.
      </p>
      <p>
        Unlike monolithic tools that require months of professional-services engagements, NuVision is delivered
        with a <em>white-glove onboarding</em> experience: PEMVISH engineers configure the platform to match
        your organisation's terminology, workflows, and data models — getting you productive within weeks,
        not quarters.
      </p>

      <div class="pv-callout pv-callout-info">
        <div class="pv-callout-title"><i class="bi bi-info-circle-fill"></i> SOC 2 Compliant</div>
        NuVision is a SOC 2 Type II certified, serverless SaaS platform. All data is encrypted at rest and
        in transit. No infrastructure provisioning is required on your end.
      </div>

      <h3 class="section-anchor" id="h-overview-pillars">Core Pillars</h3>
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-diagram-3 text-primary me-2"></i>Enterprise Architecture</h5>
              <p class="card-text small text-muted">Map business capabilities, visualise system blueprints, and design future-ready IT frameworks with a drag-and-drop modelling canvas.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-collection text-success me-2"></i>App Portfolio Management</h5>
              <p class="card-text small text-muted">Track your entire application inventory, eliminate redundancies, manage EOL timelines, and rationalise your tech stack.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-hdd-stack text-warning me-2"></i>IT Asset Management</h5>
              <p class="card-text small text-muted">Unify workstations, servers, cloud, and network assets in one live inventory. Eliminate ghost assets and automate discovery.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-shield-exclamation text-danger me-2"></i>Risk &amp; Obsolescence</h5>
              <p class="card-text small text-muted">Monitor infrastructure health, track technology risks, and get proactive alerts on EOL/EOS vulnerabilities before they become incidents.</p>
            </div>
          </div>
        </div>
      </div>

      <h3 class="section-anchor" id="h-overview-arch">Technical Architecture</h3>
      <p>NuVision is built on a serverless, multi-tenant cloud architecture with the following key characteristics:</p>
      <table class="pv-table">
        <thead><tr><th>Attribute</th><th>Detail</th></tr></thead>
        <tbody>
          <tr><td>Deployment Model</td><td>Serverless SaaS (no on-prem install required)</td></tr>
          <tr><td>Compliance</td><td>SOC 2 Type II</td></tr>
          <tr><td>Customisation</td><td>Configuration-driven (GUI workflows, no custom code)</td></tr>
          <tr><td>Integrations</td><td>Zero-code connectors to ITSM, HR, Cloud Billing, CMDB</td></tr>
          <tr><td>Data Security</td><td>AES-256 at rest, TLS 1.3 in transit</td></tr>
          <tr><td>Availability SLA</td><td>99.9% uptime</td></tr>
          <tr><td>HQ</td><td>Princeton, NJ, USA (global operations)</td></tr>
        </tbody>
      </table>
    `
  },

  /* ══════════════════════════════════════════════════════
     GETTING STARTED
  ══════════════════════════════════════════════════════ */
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: 'bi-rocket-takeoff',
    group: 'Introduction',
    content: `
      <h2 class="section-anchor" id="h-gs">Getting Started</h2>
      <p>
        This chapter walks new users through account activation, first login, and essential configuration
        steps required before you can begin using NuVision modules.
      </p>

      <h3 class="section-anchor" id="h-gs-prereq">Prerequisites</h3>
      <ul>
        <li>A valid PEMVISH-provisioned tenant URL (e.g., <code>https://yourorg.nuvision.pemvish.com</code>)</li>
        <li>A corporate email address approved by your IT administrator</li>
        <li>Modern browser: Chrome 110+, Edge 110+, Firefox 115+, or Safari 16+</li>
        <li>Minimum screen resolution: 1280 × 768</li>
      </ul>

      <h3 class="section-anchor" id="h-gs-activation">Account Activation</h3>
      <ol class="pv-steps">
        <li>Check your corporate inbox for a welcome email from <strong>noreply@pemvish.com</strong> with the subject line <em>"Your NuVision Account is Ready"</em>.</li>
        <li>Click <strong>Activate Account</strong> in the email. The link is valid for <strong>72 hours</strong>.</li>
        <li>Set a strong password (minimum 12 characters, one uppercase, one number, one special character).</li>
        <li>Enrol in Multi-Factor Authentication (MFA) — TOTP apps such as Google Authenticator or Microsoft Authenticator are supported.</li>
        <li>Accept the platform Terms of Use to complete activation.</li>
      </ol>

      <div class="pv-callout pv-callout-warning">
        <div class="pv-callout-title"><i class="bi bi-exclamation-triangle-fill"></i> Link Expiry</div>
        Activation links expire after 72 hours. If your link has expired, contact your NuVision Administrator
        to resend the invitation from <strong>Admin → Users → Resend Invite</strong>.
      </div>

      <h3 class="section-anchor" id="h-gs-login">First Login</h3>
      <ol class="pv-steps">
        <li>Navigate to your tenant URL.</li>
        <li>Enter your email address and password.</li>
        <li>Complete the MFA challenge.</li>
        <li>On first login, the <strong>Onboarding Wizard</strong> launches automatically — follow the guided steps to configure your organisation's basic profile.</li>
      </ol>

      <h3 class="section-anchor" id="h-gs-roles">Default Roles</h3>
      <table class="pv-table">
        <thead><tr><th>Role</th><th>Description</th><th>Default Permissions</th></tr></thead>
        <tbody>
          <tr><td><span class="pv-badge bg-danger text-white">Super Admin</span></td><td>Full platform access</td><td>All modules, user management, billing</td></tr>
          <tr><td><span class="pv-badge bg-primary text-white">Platform Admin</span></td><td>Module configuration</td><td>All modules, no billing</td></tr>
          <tr><td><span class="pv-badge bg-success text-white">Contributor</span></td><td>Create &amp; edit records</td><td>Assigned modules, no admin settings</td></tr>
          <tr><td><span class="pv-badge bg-secondary text-white">Viewer</span></td><td>Read-only access</td><td>Assigned modules, read-only</td></tr>
        </tbody>
      </table>
    `
  },

  /* ══════════════════════════════════════════════════════
     ENTERPRISE ARCHITECTURE MANAGEMENT
  ══════════════════════════════════════════════════════ */
  {
    id: 'eam',
    label: 'Enterprise Architecture',
    icon: 'bi-diagram-3',
    group: 'Modules',
    content: `
      <h2 class="section-anchor" id="h-eam">Enterprise Architecture Management (EAM)</h2>
      <p>
        The EAM module enables architects and business analysts to build a living blueprint of your
        organisation's business capabilities, application landscape, data flows, and technology strategy.
        All diagrams are stored as structured data — not static images — so they stay up-to-date as your
        environment evolves.
      </p>

      <h3 class="section-anchor" id="h-eam-canvas">Architecture Canvas</h3>
      <p>The Canvas is the primary workspace for building and visualising architecture models.</p>
      <ul>
        <li><strong>Drag-and-drop modelling</strong> — Add domains, capabilities, systems, and relationships from the left-hand palette.</li>
        <li><strong>Layered views</strong> — Toggle between Business, Application, Technology, and Data layers.</li>
        <li><strong>Auto-layout</strong> — Apply hierarchical or force-directed layouts with a single click.</li>
        <li><strong>Export</strong> — Download diagrams as SVG, PNG, or PDF; or embed live links in Confluence/SharePoint.</li>
      </ul>

      <h3 class="section-anchor" id="h-eam-capabilities">Business Capability Mapping</h3>
      <ol class="pv-steps">
        <li>Navigate to <strong>EAM → Capability Map</strong>.</li>
        <li>Click <strong>+ New Capability</strong> and enter a name, description, and business owner.</li>
        <li>Drag child capabilities onto the canvas to build a hierarchical heatmap.</li>
        <li>Colour-code capabilities by maturity, investment level, or strategic priority using the <strong>Heatmap</strong> toolbar.</li>
        <li>Link capabilities to applications, processes, and business units using the <strong>Relationship Editor</strong>.</li>
      </ol>

      <div class="pv-callout pv-callout-success">
        <div class="pv-callout-title"><i class="bi bi-lightbulb-fill"></i> Best Practice</div>
        Start with Level-1 capabilities (5–10 top-level domains) before drilling into sub-capabilities.
        This prevents scope creep and aligns the model with executive reporting.
      </div>

      <h3 class="section-anchor" id="h-eam-roadmap">Architecture Roadmap</h3>
      <p>
        The Roadmap view overlays your capability map with time-phased strategic initiatives,
        showing which capabilities are being invested in, decommissioned, or transformed.
      </p>
      <table class="pv-table">
        <thead><tr><th>View</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>Current State</td><td>Snapshot of today's architecture baseline</td></tr>
          <tr><td>Target State</td><td>Desired future-state architecture</td></tr>
          <tr><td>Transition Plan</td><td>Phased milestones bridging current → target</td></tr>
          <tr><td>Gap Analysis</td><td>Automatically highlights capability gaps and redundancies</td></tr>
        </tbody>
      </table>
    `
  },

  /* ══════════════════════════════════════════════════════
     APPLICATION PORTFOLIO MANAGEMENT
  ══════════════════════════════════════════════════════ */
  {
    id: 'apm',
    label: 'App Portfolio Management',
    icon: 'bi-collection',
    group: 'Modules',
    content: `
      <h2 class="section-anchor" id="h-apm">Application Portfolio Management (APM)</h2>
      <p>
        The APM module gives your organisation a single source of truth for every business application —
        from mission-critical ERP systems to departmental shadow-IT tools. It supports rationalisation
        decisions by scoring applications across cost, risk, business value, and technical health dimensions.
      </p>

      <h3 class="section-anchor" id="h-apm-inventory">Application Inventory</h3>
      <p>Each application record captures:</p>
      <ul>
        <li>Application name, description, business owner, and IT owner</li>
        <li>Hosting model (on-premise, cloud-IaaS, SaaS, hybrid)</li>
        <li>Vendor, version, and license type</li>
        <li>Business capabilities supported</li>
        <li>Integrations and data flows</li>
        <li>Annual cost (license + infrastructure + support)</li>
        <li>EOL / EOS dates and vendor roadmap status</li>
      </ul>

      <h3 class="section-anchor" id="h-apm-score">Rationalisation Scoring</h3>
      <p>
        NuVision calculates a composite <strong>TIME Score</strong> (Tolerate, Invest, Migrate, Eliminate)
        for each application based on configurable weights across four quadrants:
      </p>
      <table class="pv-table">
        <thead><tr><th>Quadrant</th><th>Recommended Action</th><th>Indicators</th></tr></thead>
        <tbody>
          <tr><td><span class="pv-badge bg-primary text-white">Tolerate</span></td><td>Maintain as-is; low investment</td><td>Moderate business value, adequate technical health</td></tr>
          <tr><td><span class="pv-badge bg-success text-white">Invest</span></td><td>Enhance or expand</td><td>High business value, strong technical health</td></tr>
          <tr><td><span class="pv-badge bg-warning">Migrate</span></td><td>Replace or consolidate</td><td>High business value, poor technical health</td></tr>
          <tr><td><span class="pv-badge bg-danger text-white">Eliminate</span></td><td>Decommission</td><td>Low business value, poor technical health</td></tr>
        </tbody>
      </table>

      <h3 class="section-anchor" id="h-apm-import">Bulk Import</h3>
      <ol class="pv-steps">
        <li>Download the PEMVISH import template from <strong>APM → Import → Download Template</strong>.</li>
        <li>Populate the Excel or CSV file with your application data.</li>
        <li>Upload the file; the system validates and flags duplicate or incomplete records.</li>
        <li>Review the import preview and confirm.</li>
      </ol>

      <div class="pv-callout pv-callout-info">
        <div class="pv-callout-title"><i class="bi bi-info-circle-fill"></i> Discovery Integration</div>
        Connect NuVision to your ITSM or CMDB (ServiceNow, Jira Service Management) via the
        Zero-Code Integration Pipeline to auto-populate the application inventory without manual CSV uploads.
      </div>
    `
  },

  /* ══════════════════════════════════════════════════════
     IT ASSET MANAGEMENT
  ══════════════════════════════════════════════════════ */
  {
    id: 'itam',
    label: 'IT Asset Management',
    icon: 'bi-hdd-stack',
    group: 'Modules',
    content: `
      <h2 class="section-anchor" id="h-itam">IT Asset Management (ITAM)</h2>
      <p>
        The ITAM module acts as an infrastructure command centre, providing a unified, real-time inventory
        of all physical and virtual assets across your enterprise — workstations, servers, cloud instances,
        and network devices.
      </p>

      <h3 class="section-anchor" id="h-itam-discovery">Asset Discovery</h3>
      <p>NuVision supports multiple asset discovery mechanisms:</p>
      <ul>
        <li><strong>Agent-based discovery</strong> — Lightweight NuVision Discovery Agent deployed on endpoints (Windows, macOS, Linux).</li>
        <li><strong>Agentless discovery</strong> — WMI, SSH, and SNMP scans from a designated discovery server.</li>
        <li><strong>Cloud-native discovery</strong> — Direct API connectors for AWS, Azure, and GCP to enumerate cloud resources.</li>
        <li><strong>CMDB sync</strong> — Bi-directional sync with ServiceNow CMDB, Jira Assets, or BMC Helix.</li>
      </ul>

      <h3 class="section-anchor" id="h-itam-lifecycle">Asset Lifecycle States</h3>
      <table class="pv-table">
        <thead><tr><th>State</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><span class="pv-badge bg-secondary text-white">Requested</span></td><td>Asset purchase or provisioning has been requested</td></tr>
          <tr><td><span class="pv-badge bg-primary text-white">Ordered</span></td><td>Purchase order raised with vendor</td></tr>
          <tr><td><span class="pv-badge bg-info text-white">In Stock</span></td><td>Received but not yet assigned</td></tr>
          <tr><td><span class="pv-badge bg-success text-white">Deployed</span></td><td>Actively assigned to a user or system</td></tr>
          <tr><td><span class="pv-badge bg-warning">Under Maintenance</span></td><td>Temporarily offline for repair or upgrade</td></tr>
          <tr><td><span class="pv-badge bg-danger text-white">Retired</span></td><td>Decommissioned and removed from active service</td></tr>
        </tbody>
      </table>

      <h3 class="section-anchor" id="h-itam-sam">Software Asset Management (SAM)</h3>
      <p>
        Embedded within ITAM, the SAM sub-module automatically discovers locally installed applications,
        maps them to license entitlements, and calculates compliance status.
      </p>
      <ul>
        <li>Tracks per-seat, volume, subscription, and concurrent-use license models</li>
        <li>Monitors software warranty and support contract expiry dates</li>
        <li>Compares actual usage (via telemetry) against purchased entitlements</li>
        <li>Generates compliance reports ready for vendor audits (Microsoft, Oracle, SAP, Adobe)</li>
      </ul>

      <h3 class="section-anchor" id="h-itam-ham">Hardware Asset Management (HAM)</h3>
      <ul>
        <li>Tracks make, model, serial number, and warranty status for all hardware</li>
        <li>Integrates with vendor warranty APIs (Dell, HP, Lenovo) for real-time warranty checks</li>
        <li>Generates End-of-Warranty alerts 90, 60, and 30 days before expiry</li>
        <li>Supports barcode / QR code scanning for physical asset audits via the NuVision Mobile App</li>
      </ul>

      <div class="pv-callout pv-callout-warning">
        <div class="pv-callout-title"><i class="bi bi-exclamation-triangle-fill"></i> Ghost Asset Alert</div>
        NuVision automatically flags "ghost assets" — assets present in your records but not seen on the
        network for more than 30 days (configurable threshold). Review these in <strong>ITAM → Reconciliation → Ghost Assets</strong>.
      </div>
    `
  },

  /* ══════════════════════════════════════════════════════
     RISK & OBSOLESCENCE
  ══════════════════════════════════════════════════════ */
  {
    id: 'risk',
    label: 'Risk & Obsolescence',
    icon: 'bi-shield-exclamation',
    group: 'Modules',
    content: `
      <h2 class="section-anchor" id="h-risk">Technology Risk &amp; Obsolescence Management</h2>
      <p>
        This module proactively monitors your technology portfolio for risks — including End-of-Life (EOL),
        End-of-Support (EOS), known CVEs, vendor stability risks, and infrastructure health degradation —
        before they become business-impacting incidents.
      </p>

      <h3 class="section-anchor" id="h-risk-dashboard">Risk Dashboard</h3>
      <p>The Risk Dashboard provides an executive-level view:</p>
      <ul>
        <li><strong>Risk Heatmap</strong> — Colour-coded matrix of likelihood vs. impact across technology domains</li>
        <li><strong>EOL/EOS Timeline</strong> — Gantt-style view of upcoming end-of-support dates across the next 24 months</li>
        <li><strong>CVE Feed</strong> — Integrated NIST NVD feed matched against your installed software versions</li>
        <li><strong>Risk Trend Chart</strong> — Week-over-week risk score evolution</li>
      </ul>

      <h3 class="section-anchor" id="h-risk-eol">EOL / EOS Tracking</h3>
      <ol class="pv-steps">
        <li>NuVision maintains a curated EOL database covering 5,000+ products (OS, databases, middleware, hardware).</li>
        <li>As your asset and application records are populated, the system automatically cross-references EOL dates.</li>
        <li>Configurable alert thresholds trigger notifications at 180, 90, and 30 days before EOL.</li>
        <li>Each EOL item generates a <strong>Risk Record</strong> with recommended remediation actions (upgrade, migrate, replace).</li>
      </ol>

      <h3 class="section-anchor" id="h-risk-scoring">Risk Scoring Model</h3>
      <table class="pv-table">
        <thead><tr><th>Factor</th><th>Weight (default)</th><th>Data Source</th></tr></thead>
        <tbody>
          <tr><td>EOL / EOS proximity</td><td>30%</td><td>PEMVISH EOL database</td></tr>
          <tr><td>CVE severity (CVSS score)</td><td>25%</td><td>NIST NVD</td></tr>
          <tr><td>Business criticality of dependent systems</td><td>20%</td><td>APM module</td></tr>
          <tr><td>Asset coverage &amp; redundancy</td><td>15%</td><td>ITAM module</td></tr>
          <tr><td>Vendor stability</td><td>10%</td><td>Manual assessment</td></tr>
        </tbody>
      </table>

      <div class="pv-callout pv-callout-info">
        <div class="pv-callout-title"><i class="bi bi-info-circle-fill"></i> Customisable Weights</div>
        Risk factor weights are fully configurable per-organisation. Navigate to
        <strong>Settings → Risk Configuration → Scoring Model</strong> to adjust weights to match your
        organisation's risk appetite.
      </div>
    `
  },

  /* ══════════════════════════════════════════════════════
     BUSINESS PORTFOLIO & ROADMAP
  ══════════════════════════════════════════════════════ */
  {
    id: 'bpm',
    label: 'Business Portfolio & Roadmap',
    icon: 'bi-graph-up-arrow',
    group: 'Modules',
    content: `
      <h2 class="section-anchor" id="h-bpm">Business Portfolio &amp; Roadmap Planning</h2>
      <p>
        The Business Portfolio module connects strategic initiatives to measurable outcomes by linking
        business goals, roadmap activities, KPI dashboards, and resource investments in a single view
        accessible to leadership and programme teams alike.
      </p>

      <h3 class="section-anchor" id="h-bpm-initiatives">Strategic Initiatives</h3>
      <ul>
        <li>Define initiatives with business owner, sponsor, budget, and target outcomes</li>
        <li>Link initiatives to business capabilities (from EAM) and applications (from APM)</li>
        <li>Track initiative health using RAG (Red/Amber/Green) status and milestone completion</li>
      </ul>

      <h3 class="section-anchor" id="h-bpm-roadmap">Roadmap Planning</h3>
      <p>
        The drag-and-drop roadmap editor lets programme managers plan and communicate quarterly or
        annual delivery timelines:
      </p>
      <ol class="pv-steps">
        <li>Navigate to <strong>Business Portfolio → Roadmap</strong>.</li>
        <li>Select the planning horizon (Quarter, Half-year, Annual, or Custom).</li>
        <li>Drag initiatives onto the timeline swimlane for each business domain.</li>
        <li>Add dependencies between initiatives using the dependency connector tool.</li>
        <li>Publish the roadmap as a shareable link or export to PowerPoint for executive presentations.</li>
      </ol>

      <h3 class="section-anchor" id="h-bpm-kpi">KPI Dashboards</h3>
      <p>
        Build dynamic KPI dashboards that surface real-time performance metrics aligned to strategic goals.
        Supported data sources include:
      </p>
      <ul>
        <li>NuVision native metrics (asset counts, risk scores, application rationalisations)</li>
        <li>Integrated cloud billing data (AWS Cost Explorer, Azure Cost Management)</li>
        <li>Custom metrics via REST API push</li>
        <li>Flat-file upload (CSV/Excel) for metrics from external systems</li>
      </ul>
    `
  },

  /* ══════════════════════════════════════════════════════
     VENDOR PORTFOLIO MANAGEMENT
  ══════════════════════════════════════════════════════ */
  {
    id: 'vendor',
    label: 'Vendor Portfolio Management',
    icon: 'bi-building-check',
    group: 'Modules',
    content: `
      <h2 class="section-anchor" id="h-vendor">Vendor Portfolio Management</h2>
      <p>
        Track all third-party vendor relationships, contracts, compliance obligations, and renewal
        timelines in a centralised register — reducing the risk of surprise renewals, compliance gaps,
        and unmanaged vendor dependencies.
      </p>

      <h3 class="section-anchor" id="h-vendor-register">Vendor Register</h3>
      <p>Each vendor record captures:</p>
      <ul>
        <li>Vendor name, category (software, hardware, cloud, services), and strategic tier (Tier 1–3)</li>
        <li>Primary and secondary contacts</li>
        <li>Products/services consumed with linked asset and application records</li>
        <li>Compliance certifications (ISO 27001, SOC 2, GDPR, etc.)</li>
        <li>Financial exposure (annual spend, payment terms)</li>
        <li>Risk rating (auto-calculated from compliance status and dependency score)</li>
      </ul>

      <h3 class="section-anchor" id="h-vendor-contracts">Contract Tracking</h3>
      <table class="pv-table">
        <thead><tr><th>Contract Field</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Contract Type</td><td>MSA, EULA, SLA, NDA, Subscription, etc.</td></tr>
          <tr><td>Start / End Date</td><td>Auto-triggers renewal alerts at 90, 60, 30 days</td></tr>
          <tr><td>Auto-Renewal Flag</td><td>Flags contracts with auto-renewal clauses for proactive review</td></tr>
          <tr><td>Termination Notice Period</td><td>Tracks notice window to prevent unwanted renewals</td></tr>
          <tr><td>Document Attachment</td><td>Upload signed PDFs directly to the vendor record</td></tr>
        </tbody>
      </table>
    `
  },

  /* ══════════════════════════════════════════════════════
     INTEGRATIONS
  ══════════════════════════════════════════════════════ */
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'bi-plug',
    group: 'Configuration',
    content: `
      <h2 class="section-anchor" id="h-integrations">Integrations &amp; Connectors</h2>
      <p>
        NuVision's Zero-Code Integration Pipeline uses pre-built, configuration-driven connectors to
        feed data from your existing enterprise tools — no scripting or middleware required.
      </p>

      <h3 class="section-anchor" id="h-int-itsm">ITSM &amp; CMDB</h3>
      <ul>
        <li><strong>ServiceNow</strong> — Bi-directional sync for CIs, incidents, change records, and software entitlements.</li>
        <li><strong>Jira Service Management</strong> — Asset and request sync via Jira Assets (Insight).</li>
        <li><strong>BMC Helix / Remedy</strong> — CMDB import and asset lifecycle sync.</li>
      </ul>

      <h3 class="section-anchor" id="h-int-cloud">Cloud Platforms</h3>
      <ul>
        <li><strong>AWS</strong> — EC2, RDS, S3, Lambda, and Cost Explorer</li>
        <li><strong>Microsoft Azure</strong> — VMs, SQL Databases, subscriptions, and Cost Management</li>
        <li><strong>Google Cloud Platform</strong> — Compute Engine, Cloud SQL, BigQuery assets</li>
      </ul>

      <h3 class="section-anchor" id="h-int-hr">HR &amp; Identity</h3>
      <ul>
        <li><strong>Workday / BambooHR</strong> — Sync employee records for asset assignment and onboarding/offboarding automation.</li>
        <li><strong>Okta / Azure AD</strong> — SSO and user provisioning via SAML 2.0 / SCIM 2.0.</li>
        <li><strong>Active Directory</strong> — LDAP-based user and group sync for role mapping.</li>
      </ul>

      <h3 class="section-anchor" id="h-int-setup">Setting Up a Connector</h3>
      <ol class="pv-steps">
        <li>Navigate to <strong>Settings → Integrations → Connector Library</strong>.</li>
        <li>Select the target system from the catalogue and click <strong>Configure</strong>.</li>
        <li>Enter the connection credentials (API key, OAuth tokens, or service account).</li>
        <li>Define the sync scope, field mappings, and sync frequency (real-time webhook or scheduled batch).</li>
        <li>Run a <strong>Test Connection</strong> to validate, then click <strong>Activate</strong>.</li>
      </ol>

      <div class="pv-callout pv-callout-success">
        <div class="pv-callout-title"><i class="bi bi-code-square"></i> REST API</div>
        Every NuVision data entity is accessible via the NuVision REST API (OpenAPI 3.0 documented).
        Download the API spec from <strong>Settings → API → Download OpenAPI Spec</strong>.
        Bearer token authentication with configurable scopes is supported.
      </div>
    `
  },

  /* ══════════════════════════════════════════════════════
     ADMINISTRATION
  ══════════════════════════════════════════════════════ */
  {
    id: 'admin',
    label: 'Administration',
    icon: 'bi-gear',
    group: 'Configuration',
    content: `
      <h2 class="section-anchor" id="h-admin">Administration</h2>
      <p>
        This chapter covers platform administration tasks available to users with the
        <span class="pv-badge bg-danger text-white">Super Admin</span> or
        <span class="pv-badge bg-primary text-white">Platform Admin</span> role.
      </p>

      <h3 class="section-anchor" id="h-admin-users">User Management</h3>
      <ol class="pv-steps">
        <li>Navigate to <strong>Admin → Users &amp; Roles</strong>.</li>
        <li>Click <strong>+ Invite User</strong> and enter the user's email address.</li>
        <li>Assign a base role (Viewer, Contributor, Platform Admin) and optionally restrict access to specific modules.</li>
        <li>Click <strong>Send Invite</strong> — the user receives an activation email.</li>
      </ol>

      <h3 class="section-anchor" id="h-admin-sso">SSO Configuration</h3>
      <p>NuVision supports SAML 2.0 and OIDC for Single Sign-On:</p>
      <ul>
        <li>Navigate to <strong>Admin → Security → SSO</strong>.</li>
        <li>Download the NuVision SAML metadata XML and upload it to your Identity Provider (Okta, Azure AD, Ping).</li>
        <li>Paste your IdP metadata URL or XML into NuVision and save.</li>
        <li>Test SSO with a non-admin user before enforcing it org-wide.</li>
      </ul>

      <h3 class="section-anchor" id="h-admin-audit">Audit Logs</h3>
      <p>
        Every user action in NuVision is captured in tamper-evident audit logs retained for 12 months
        (configurable up to 7 years for compliance requirements).
      </p>
      <ul>
        <li>Filter by user, date range, action type, or module</li>
        <li>Export logs as CSV or JSON for SIEM ingestion (Splunk, Microsoft Sentinel, Datadog)</li>
        <li>Set up real-time Webhook alerts for high-risk actions (bulk deletes, role escalations)</li>
      </ul>

      <h3 class="section-anchor" id="h-admin-backup">Backup &amp; Data Export</h3>
      <div class="pv-callout pv-callout-info">
        <div class="pv-callout-title"><i class="bi bi-info-circle-fill"></i> Data Portability</div>
        PEMVISH guarantees full data portability. All your data can be exported at any time from
        <strong>Admin → Data Management → Full Export</strong>. Exports are delivered as a structured
        ZIP archive containing JSON and CSV files for all entities.
      </div>
    `
  },

  /* ══════════════════════════════════════════════════════
     REPORTS & DASHBOARDS
  ══════════════════════════════════════════════════════ */
  {
    id: 'reports',
    label: 'Reports & Dashboards',
    icon: 'bi-bar-chart-line',
    group: 'Configuration',
    content: `
      <h2 class="section-anchor" id="h-reports">Reports &amp; Dashboards</h2>
      <p>
        NuVision includes a no-code report builder and a customisable dashboard engine so every
        stakeholder — from IT engineers to C-suite executives — can access the right metrics in the
        right format.
      </p>

      <h3 class="section-anchor" id="h-reports-builder">Report Builder</h3>
      <ul>
        <li>Drag-and-drop field selector across all NuVision data entities</li>
        <li>Filter, group, and sort controls with multi-condition logic</li>
        <li>Output formats: interactive table, bar/line/pie chart, or pivot grid</li>
        <li>Schedule automated delivery by email (PDF/CSV) on daily, weekly, or monthly cadence</li>
        <li>Share reports via secure link (no login required for Viewer-scoped reports)</li>
      </ul>

      <h3 class="section-anchor" id="h-reports-dashboards">Dashboard Widgets</h3>
      <table class="pv-table">
        <thead><tr><th>Widget Type</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td>KPI Tile</td><td>Single metric with trend indicator and target threshold</td></tr>
          <tr><td>Bar / Line Chart</td><td>Trend analysis over time or category comparison</td></tr>
          <tr><td>Donut Chart</td><td>Distribution breakdown (e.g., assets by state)</td></tr>
          <tr><td>Risk Heatmap</td><td>2D likelihood × impact matrix</td></tr>
          <tr><td>Data Table</td><td>Sortable, filterable list with drill-down links</td></tr>
          <tr><td>Gantt / Timeline</td><td>Roadmap and EOL timeline visualisation</td></tr>
        </tbody>
      </table>
    `
  },

  /* ══════════════════════════════════════════════════════
     SUPPORT & TROUBLESHOOTING
  ══════════════════════════════════════════════════════ */
  {
    id: 'support',
    label: 'Support & Troubleshooting',
    icon: 'bi-headset',
    group: 'Help',
    content: `
      <h2 class="section-anchor" id="h-support">Support &amp; Troubleshooting</h2>

      <h3 class="section-anchor" id="h-support-channels">Support Channels</h3>
      <table class="pv-table">
        <thead><tr><th>Channel</th><th>Availability</th><th>Use For</th></tr></thead>
        <tbody>
          <tr><td>In-app Chat</td><td>24/5 (Mon–Fri)</td><td>General queries, how-to guidance</td></tr>
          <tr><td>Email: support@pemvish.com</td><td>24/7</td><td>Non-urgent issues, feature requests</td></tr>
          <tr><td>Customer Portal</td><td>24/7</td><td>Ticket submission, status tracking, KB articles</td></tr>
          <tr><td>Emergency Hotline</td><td>24/7 (P1 only)</td><td>Platform outages, data integrity issues</td></tr>
        </tbody>
      </table>

      <h3 class="section-anchor" id="h-support-sla">SLA Response Times</h3>
      <table class="pv-table">
        <thead><tr><th>Priority</th><th>Definition</th><th>Initial Response</th><th>Resolution Target</th></tr></thead>
        <tbody>
          <tr><td><span class="pv-badge bg-danger text-white">P1 Critical</span></td><td>Platform unavailable, data loss risk</td><td>15 minutes</td><td>4 hours</td></tr>
          <tr><td><span class="pv-badge bg-warning">P2 High</span></td><td>Major feature unusable</td><td>2 hours</td><td>24 hours</td></tr>
          <tr><td><span class="pv-badge bg-info text-white">P3 Medium</span></td><td>Feature degraded, workaround exists</td><td>8 hours</td><td>72 hours</td></tr>
          <tr><td><span class="pv-badge bg-secondary text-white">P4 Low</span></td><td>Minor issue / enhancement request</td><td>2 business days</td><td>Next release</td></tr>
        </tbody>
      </table>

      <h3 class="section-anchor" id="h-support-faq">Common Issues</h3>
      <div class="accordion" id="faqAccordion">
        <div class="accordion-item border mb-2 rounded">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
              I cannot log in — the activation link has expired.
            </button>
          </h2>
          <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div class="accordion-body small">
              Ask your NuVision Administrator to resend the invitation from <strong>Admin → Users → [Your Name] → Resend Invite</strong>.
              A new 72-hour link will be emailed to you.
            </div>
          </div>
        </div>
        <div class="accordion-item border mb-2 rounded">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
              The Discovery Agent is not reporting assets.
            </button>
          </h2>
          <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div class="accordion-body small">
              1. Verify the agent service is running: <code>sc query NuVisionAgent</code> (Windows) or <code>systemctl status nuvision-agent</code> (Linux).<br/>
              2. Ensure outbound HTTPS (port 443) is allowed to <code>*.nuvision.pemvish.com</code>.<br/>
              3. Check the agent log at <code>%ProgramData%\\NuVision\\logs\\agent.log</code>.
            </div>
          </div>
        </div>
        <div class="accordion-item border mb-2 rounded">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
              How do I reset my MFA device?
            </button>
          </h2>
          <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div class="accordion-body small">
              A NuVision Administrator can reset your MFA from <strong>Admin → Users → [Your Name] → Reset MFA</strong>.
              You will be prompted to re-enrol on your next login.
            </div>
          </div>
        </div>
      </div>

      <h3 class="section-anchor" id="h-support-release">Release Notes</h3>
      <p>
        NuVision is updated on a 4-week release cadence. Release notes are published at
        <a href="https://pemvish.com" target="_blank">pemvish.com</a> and surfaced in-platform via
        the <i class="bi bi-bell"></i> notification bell in the top navigation bar.
      </p>
    `
  },

  /* ══════════════════════════════════════════════════════
     GLOSSARY
  ══════════════════════════════════════════════════════ */
  {
    id: 'glossary',
    label: 'Glossary',
    icon: 'bi-book',
    group: 'Help',
    content: `
      <h2 class="section-anchor" id="h-glossary">Glossary</h2>
      <p>Key terms used throughout this manual and within the NuVision platform.</p>

      <table class="pv-table">
        <thead><tr><th>Term</th><th>Definition</th></tr></thead>
        <tbody>
          <tr><td><strong>APM</strong></td><td>Application Portfolio Management — the practice of managing the full lifecycle of business applications.</td></tr>
          <tr><td><strong>CMDB</strong></td><td>Configuration Management Database — a repository of information about hardware/software assets and their relationships.</td></tr>
          <tr><td><strong>EAM</strong></td><td>Enterprise Architecture Management — the discipline of aligning business strategy with IT systems and processes.</td></tr>
          <tr><td><strong>EOL</strong></td><td>End of Life — the date after which a vendor no longer sells or manufactures a product.</td></tr>
          <tr><td><strong>EOS</strong></td><td>End of Support — the date after which a vendor no longer provides patches, updates, or technical support.</td></tr>
          <tr><td><strong>Ghost Asset</strong></td><td>An asset that exists in inventory records but is no longer detected on the network.</td></tr>
          <tr><td><strong>HAM</strong></td><td>Hardware Asset Management — tracking and managing physical IT hardware throughout its lifecycle.</td></tr>
          <tr><td><strong>ITAM</strong></td><td>IT Asset Management — the set of business practices that join financial, contractual, and inventory functions for IT assets.</td></tr>
          <tr><td><strong>MFA</strong></td><td>Multi-Factor Authentication — a security mechanism requiring two or more verification factors to access an account.</td></tr>
          <tr><td><strong>NuVision</strong></td><td>PEMVISH's flagship SaaS platform for enterprise technology and architecture governance.</td></tr>
          <tr><td><strong>PEMVISH</strong></td><td>Princeton-based enterprise software company (est. 2022) specialising in configuration-driven enterprise architecture and IT asset management.</td></tr>
          <tr><td><strong>SAM</strong></td><td>Software Asset Management — the management of software licenses, compliance, and usage optimisation.</td></tr>
          <tr><td><strong>SOC 2</strong></td><td>Service Organisation Control 2 — an auditing standard for SaaS providers covering security, availability, and confidentiality.</td></tr>
          <tr><td><strong>TIME Model</strong></td><td>Tolerate, Invest, Migrate, Eliminate — a framework for rationalising an application portfolio.</td></tr>
          <tr><td><strong>Zero-Code Integration</strong></td><td>PEMVISH's configuration-driven connector pipeline that links NuVision to external tools without requiring custom code.</td></tr>
        </tbody>
      </table>
    `
  }

]; // end MANUAL_CHAPTERS
