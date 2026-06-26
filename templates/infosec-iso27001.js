(function (root) {
  'use strict';

  var T = {
    id: 'infosec-iso27001',
    version: '1.0.0',
    title: { en: 'Information Security Assessment Questionnaire' },
    description: {
      en: 'A consultant’s diagnostic tool mapped to ISO/IEC 27001:2022, ISO/IEC 27002:2022, the NIS2 Directive (EU 2022/2555) and CIS Controls v8. 38 questions across 8 domains.'
    },
    languages: ['en'],
    translationStatus: {},
    frameworks: [
      'ISO/IEC 27001:2022',
      'ISO/IEC 27002:2022',
      'NIS2 Directive (EU 2022/2555)',
      'CIS Controls v8'
    ],
    maturityLevels: [
      { level: 1, label: { en: 'Initial', sq: 'Fillestar' }, min: 0, max: 20 },
      { level: 2, label: { en: 'Developing', sq: 'Në zhvillim' }, min: 21, max: 40 },
      { level: 3, label: { en: 'Defined', sq: 'I përcaktuar' }, min: 41, max: 60 },
      { level: 4, label: { en: 'Managed', sq: 'I menaxhuar' }, min: 61, max: 80 },
      { level: 5, label: { en: 'Optimized', sq: 'I optimizuar' }, min: 81, max: 100 }
    ],
    domains: [
      {
        id: 'governance',
        title: { en: 'Governance, security awareness & compliance' },
        customSlots: 2,
        questions: [
          {
            id: 'Q1', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: { en: 'Does a formally approved information security policy exist, and is it actively communicated and enforced?' },
            goodPractice: { en: [
              'A written information security policy approved by top management',
              'A signed user/administrator security charter or acceptable use policy',
              'Documented procedures (not just verbal instructions)',
              'Evidence the policy is communicated to staff and reviewed at planned intervals or after major changes'
            ] },
            followUp: { en: 'Who approved the policy and when was it last reviewed? How is non-compliance handled?' },
            references: { iso27001: 'A.5.1', iso27002: '5.1 Policies for information security', nis2: 'Art. 21(2)(a); Art. 20 (Governance)', cis: 'CIS 14.1' }
          },
          {
            id: 'Q2', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'What is the core business, and which processes or information assets are most critical or sensitive?' },
            goodPractice: { en: [
              'A documented or maintained inventory of information assets',
              'A classification scheme (e.g. public / internal / confidential / restricted)',
              'A clear view of whether confidentiality, integrity, or availability matters most for each asset',
              'Evidence of a formal risk assessment covering these assets'
            ] },
            followUp: { en: 'Do staff know which information they handle is sensitive? When was the risk assessment last updated?' },
            references: { iso27001: 'A.5.9, A.5.12', iso27002: '5.9 Inventory of information and other associated assets; 5.12 Classification of information', nis2: 'Art. 21(2)(i) Asset management', cis: 'CIS 1, CIS 3.1' }
          },
          {
            id: 'Q3', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'What legal, regulatory, and contractual compliance obligations apply to the business, and how are they tracked?' },
            goodPractice: { en: [
              'A maintained register of applicable laws, regulations, sector rules, and contractual obligations',
              'New hires are briefed on relevant obligations during onboarding',
              'A defined process for monitoring legal/regulatory changes (e.g. NIS2 transposition status in relevant Member States, sector-specific rules)'
            ] },
            followUp: { en: 'Who owns the compliance register? How often is it reviewed?' },
            references: { iso27001: 'A.5.31', iso27002: '5.31 Legal, statutory, regulatory and contractual requirements', nis2: 'Art. 21(1) Proportionate measures', cis: 'CIS 14.1' }
          },
          {
            id: 'Q4', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: { en: 'Is processing of personal data compliant with GDPR and applicable image/likeness rights?' },
            goodPractice: { en: [
              'Awareness of GDPR obligations among relevant staff',
              'A Record of Processing Activities (ROPA, GDPR Art. 30) for each category of personal data processed',
              'A lawful basis identified for each processing activity',
              'Explicit, documented consent for capturing and publishing images of identifiable individuals'
            ] },
            followUp: { en: 'Is there a Data Protection Officer or equivalent contact? Has a Data Protection Impact Assessment been done for high-risk processing?' },
            references: { iso27001: 'A.5.34', iso27002: '5.34 Privacy and protection of PII', cis: 'CIS 3.1, CIS 14.1', other: 'GDPR Art. 5, 6, 30' }
          },
          {
            id: 'Q33', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Is the effectiveness of security controls independently reviewed (internal audit, external audit, or penetration test)?' },
            goodPractice: { en: [
              'A schedule of internal audits or independent reviews of the security policy and controls',
              'Periodic technical testing (e.g. vulnerability scans, penetration tests) appropriate to risk',
              'Findings are tracked to closure with owners and deadlines'
            ] },
            followUp: { en: 'When was the last independent review or test performed, and what were the major findings?' },
            references: { iso27001: 'A.5.36, A.5.35', iso27002: '5.35 Independent review of information security; 5.36 Compliance with policies, rules and standards', nis2: 'Art. 21(2)(f) Policies and procedures to assess effectiveness', cis: 'CIS 18' }
          }
        ]
      },
      {
        id: 'people',
        title: { en: 'People & employee lifecycle management' },
        customSlots: 2,
        questions: [
          {
            id: 'Q5', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'Do staff receive regular, role-appropriate security awareness training, and does this extend to management?' },
            goodPractice: { en: [
              'A recurring (at least annual) security awareness programme covering phishing, social engineering, and incident reporting',
              'Training records kept per employee',
              'Management body members also receive cybersecurity training (a specific NIS2 governance expectation)',
              'Simulated phishing or similar exercises, where proportionate'
            ] },
            followUp: { en: 'When was the last training cycle, and what was the completion rate?' },
            references: { iso27001: 'A.6.3', iso27002: '6.3 Information security awareness, education and training', nis2: 'Art. 21(2)(g) Cyber hygiene and training; Art. 20(2) Management training', cis: 'CIS 14' }
          },
          {
            id: 'Q6', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: { en: 'Are there documented joiner/mover/leaver processes, including for contractors and interns?' },
            goodPractice: { en: [
              'A checklist-driven onboarding process, with equipment and access ready on day one',
              'A formal offboarding process that revokes physical and logical access promptly upon departure',
              'Background screening proportionate to role sensitivity',
              'Interns/contractors have defined, time-bound access and sign acceptable-use terms'
            ] },
            followUp: { en: 'How quickly is access revoked after someone leaves? Is this tested?' },
            references: { iso27001: 'A.6.1, A.6.5, A.5.9', iso27002: '6.1 Screening; 6.5 Responsibilities after termination or change of employment; 5.9 Inventory of assets', nis2: 'Art. 21(2)(i) Human resources security', cis: 'CIS 5.1, CIS 6.2, CIS 6.3' }
          },
          {
            id: 'Q7', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Are IT and information security responsibilities formally defined, with named owners and backup coverage?' },
            goodPractice: { en: [
              'A named individual or function responsible for IT operations',
              'A named individual or function responsible for information security, distinct where size allows (segregation of duties)',
              'Documented escalation paths for IT, security, and data protection incidents',
              'Backup/deputy coverage so a single absence doesn’t leave a gap'
            ] },
            followUp: { en: 'What happens if the responsible person is unavailable during an incident?' },
            references: { iso27001: 'A.5.2, A.5.3', iso27002: '5.2 Information security roles and responsibilities; 5.3 Segregation of duties', nis2: 'Art. 20 Governance; Art. 21(2)(b) Incident handling responsibilities', cis: 'CIS 17.1' }
          },
          {
            id: 'Q8', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Is company-issued hardware tracked in an asset inventory with named owners?' },
            goodPractice: { en: [
              'An asset register listing device, assigned user, and status',
              'The register is kept up to date as devices are issued, reassigned, or retired',
              'Off-premises assets (laptops, phones) are covered by the same inventory and protected accordingly'
            ] },
            followUp: { en: 'How is the inventory kept current — manual process or automated (MDM/asset management tool)?' },
            references: { iso27001: 'A.5.9, A.7.9', iso27002: '5.9 Inventory of information and other associated assets; 7.9 Security of assets off-premises', nis2: 'Art. 21(2)(i) Asset management', cis: 'CIS 1.1' }
          },
          {
            id: 'Q9', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: { en: 'Is remote/hybrid working supported by both technical and organisational safeguards?' },
            goodPractice: { en: [
              'Technical controls: VPN or zero-trust access, multi-factor authentication, device encryption',
              'Organisational controls: a remote working policy covering acceptable locations, screen privacy, and use of public networks',
              'Endpoint protection consistent with on-premises devices'
            ] },
            followUp: { en: 'Is MFA mandatory for all remote access, with no exceptions?' },
            references: { iso27001: 'A.6.7, A.8.1', iso27002: '6.7 Remote working; 8.1 User endpoint devices', nis2: 'Art. 21(2)(j) MFA, secured communications; Art. 21(2)(d) Supply chain; Art. 21(2)(i)', cis: 'CIS 12.7, CIS 6.3' }
          }
        ]
      },
      {
        id: 'thirdparty',
        title: { en: 'Third-party & supply chain management' },
        customSlots: 2,
        questions: [
          {
            id: 'Q10', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Do third parties with access to confidential information sign confidentiality (NDA) agreements?' },
            goodPractice: { en: [
              'Standard NDA terms required before sharing confidential information with any third party',
              'NDAs also cover pre-contractual discussions where confidential information may be disclosed',
              'NDA register or tracking of signed agreements'
            ] },
            followUp: { en: 'Is there a standard template, and is legal review required before signing?' },
            references: { iso27001: 'A.5.14, A.6.6', iso27002: '5.14 Information transfer; 6.6 Confidentiality or non-disclosure agreements', nis2: 'Art. 21(2)(d) Supply chain security', cis: 'CIS 15' }
          },
          {
            id: 'Q11', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Do critical service providers commit formally to service levels and security requirements, and are these reviewed?' },
            goodPractice: { en: [
              'SLAs in place for providers whose responsiveness affects business continuity',
              'Security requirements embedded in supplier contracts (not just delivery/performance terms)',
              'Periodic review of contracts and supplier performance against agreed terms',
              'Consideration of supplier security practices and secure development procedures (NIS2 Art. 21(3))'
            ] },
            followUp: { en: 'How are suppliers risk-rated, and is there a list of critical suppliers?' },
            references: { iso27001: 'A.5.20, A.5.22', iso27002: '5.20 Addressing information security within supplier agreements; 5.22 Monitoring, review and change management of supplier services', nis2: 'Art. 21(2)(d) Supply chain; Art. 21(3) Supplier vulnerabilities', cis: 'CIS 15.4, CIS 15.5' }
          },
          {
            id: 'Q12', kind: 'standard', threatIndicator: 2, weight: 1, critical: false,
            text: { en: 'How is premises cleaning/maintenance organised, and what access do cleaning staff have to sensitive areas?' },
            goodPractice: { en: [
              'Clear policy on whether cleaning is done in-house or outsourced',
              'Cleaning scheduled to minimise exposure of confidential material (ideally outside working hours or supervised)',
              'Written instructions for external cleaning staff (e.g. what not to touch or move)',
              'IT/server rooms and archive rooms excluded from general access, or cleaned only under supervision'
            ] },
            followUp: { en: 'Is cleaning staff turnover/vetting tracked by the contracted provider?' },
            references: { iso27001: 'A.7.1, A.7.2', iso27002: '7.1 Physical security perimeters; 7.2 Physical entry', cis: 'CIS 1' }
          },
          {
            id: 'Q13', kind: 'standard', threatIndicator: 2, weight: 1, critical: false,
            text: { en: 'Are visitors controlled, identified, and escorted while on the premises?' },
            goodPractice: { en: [
              'Visitors are received at a reception point and not left to find their own way',
              'Visitors are escorted in non-public areas',
              'Private/restricted areas are clearly distinguished from publicly accessible ones',
              'Visitor identity is logged at reception',
              'Visitors wear a visible badge distinguishing them from staff'
            ] },
            followUp: { en: 'Is the visitor log retained, and for how long?' },
            references: { iso27001: 'A.7.2', iso27002: '7.2 Physical entry', cis: 'CIS 1' }
          },
          {
            id: 'Q34', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'Is supplier risk assessed before onboarding, and is there a current list of critical/high-risk suppliers?' },
            goodPractice: { en: [
              'A documented process to assess security posture of new suppliers before granting access to systems or data',
              'Criteria distinguishing critical/high-risk suppliers (e.g. cloud providers, ICT/MSP, payroll) from low-risk ones',
              'Evidence requested from suppliers proportionate to risk (e.g. certifications, security questionnaires, audit rights)'
            ] },
            followUp: { en: 'What happens if a critical supplier suffers a security incident — is there a notification clause in the contract?' },
            references: { iso27001: 'A.5.19, A.5.21', iso27002: '5.19 Information security in supplier relationships; 5.21 Managing information security in the ICT supply chain', nis2: 'Art. 21(2)(d) Supply chain security; Art. 21(3)', cis: 'CIS 15.1, CIS 15.2' }
          }
        ]
      },
      {
        id: 'physical',
        title: { en: 'Physical & environmental security' },
        customSlots: 2,
        questions: [
          {
            id: 'Q14', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'How are physical access rights granted, and is granting separated from requesting?' },
            goodPractice: { en: [
              'Physical access granted on a need-to-know / least-privilege basis',
              'The person requesting/deciding access is different from the person implementing it (segregation of duties)',
              'Access rights reviewed periodically and revoked promptly when no longer needed'
            ] },
            followUp: { en: 'How often are physical access rights reviewed, and by whom?' },
            references: { iso27001: 'A.7.2, A.5.18', iso27002: '7.2 Physical entry; 5.18 Access rights', nis2: 'Art. 21(2)(i) Access control policies', cis: 'CIS 1' }
          },
          {
            id: 'Q15', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Are entry points to the premises controlled and monitored?' },
            goodPractice: { en: [
              'Physical access mechanisms appropriate to risk (keys, badges, biometrics)',
              'Intrusion alarm covering the premises',
              'Video surveillance where appropriate and legally compliant',
              'Secondary/back doors verified to remain locked, with periodic checks'
            ] },
            followUp: { en: 'Are alarm and surveillance systems tested periodically?' },
            references: { iso27001: 'A.7.2, A.7.4', iso27002: '7.2 Physical entry; 7.4 Physical security monitoring', cis: 'CIS 1' }
          },
          {
            id: 'Q16', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: { en: 'Are restricted-access areas such as the server/IT room and archive room adequately secured?' },
            goodPractice: { en: [
              'IT/server room and archive room are correctly locked at all times',
              'Access limited to a defined, minimal list of authorised personnel',
              'Access events to these rooms are logged where feasible'
            ] },
            followUp: { en: 'Is there a current list of who holds keys/badge access to these rooms?' },
            references: { iso27001: 'A.7.1, A.7.3', iso27002: '7.1 Physical security perimeters; 7.3 Securing offices, rooms and facilities', cis: 'CIS 1' }
          },
          {
            id: 'Q17', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Is critical equipment protected by an uninterruptible power supply (UPS), and is this tested?' },
            goodPractice: { en: [
              'UPS protects equipment where a sudden power cut would be damaging (servers, network gear)',
              'UPS functionality verified periodically (e.g. self-test logs, battery health checks)',
              'UPS capacity sized to actual load and runtime needs'
            ] },
            followUp: { en: 'What is the documented runtime, and has a full power-failure scenario been tested?' },
            references: { iso27001: 'A.7.11, A.7.12', iso27002: '7.11 Supporting utilities; 7.12 Cabling security', nis2: 'Art. 21(1) Resilience of network and information systems', cis: 'CIS 1' }
          }
        ]
      },
      {
        id: 'iam',
        title: { en: 'Identity & access control' },
        customSlots: 2,
        questions: [
          {
            id: 'Q18', kind: 'standard', threatIndicator: 4, weight: 1.3, critical: true,
            text: { en: 'How are logical access rights granted, reviewed, and revoked — and is approval separated from provisioning?' },
            goodPractice: { en: [
              'Access granted on least-privilege / need-to-know basis',
              'The person approving access is different from the person provisioning it',
              'Periodic access reviews (e.g. quarterly or at role change) to remove unneeded privileges',
              'Privileged/admin accounts are separate from standard user accounts and more tightly controlled'
            ] },
            followUp: { en: 'Is there a process for emergency/break-glass access, and is it logged and reviewed afterward?' },
            references: { iso27001: 'A.5.15, A.5.18, A.5.3', iso27002: '5.15 Access control; 5.18 Access rights; 5.3 Segregation of duties', nis2: 'Art. 21(2)(i) Access control policies', cis: 'CIS 5, CIS 6' }
          },
          {
            id: 'Q19', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: { en: 'How is user authentication managed — is multi-factor authentication enforced, and what are the password rules?' },
            goodPractice: { en: [
              'Multi-factor authentication enforced, especially for remote access, email, admin, and cloud accounts (explicit NIS2 expectation)',
              'Documented password construction rules (length/complexity, or passphrase guidance)',
              'Practical guidance for users to build memorable yet strong passwords/passphrases',
              'Passwords treated as strictly personal and never shared',
              'Credentials rotated based on risk (modern guidance favours rotation on compromise/risk rather than fixed time alone, combined with MFA and monitoring)'
            ] },
            followUp: { en: 'Are there any accounts or systems still without MFA? What is the plan to close that gap?' },
            references: { iso27001: 'A.5.17, A.8.5', iso27002: '5.17 Authentication information; 8.5 Secure authentication', nis2: 'Art. 21(2)(j) Multi-factor authentication', cis: 'CIS 6.3, CIS 6.5' }
          },
          {
            id: 'Q35', kind: 'new', threatIndicator: 5, weight: 1.3, critical: true,
            text: { en: 'Are privileged/administrator accounts specifically controlled, monitored, and limited in number?' },
            goodPractice: { en: [
              'Admin rights granted only where strictly necessary, separate from each user’s standard account',
              'A current list of who holds privileged access, reviewed periodically',
              'Privileged account activity logged and monitored for anomalies',
              'Default/vendor admin credentials changed before go-live'
            ] },
            followUp: { en: 'How many people currently have domain/global admin rights, and is that the minimum needed?' },
            references: { iso27001: 'A.8.2, A.8.3, A.8.4', iso27002: '8.2 Privileged access rights; 8.3 Information access restriction; 8.4 Access to source code', nis2: 'Art. 21(2)(i)', cis: 'CIS 5.4, CIS 6.8' }
          }
        ]
      },
      {
        id: 'network',
        title: { en: 'Network & infrastructure security' },
        customSlots: 2,
        questions: [
          {
            id: 'Q20', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'How is the internal network (LAN) segmented and protected at its boundary?' },
            goodPractice: { en: [
              'A firewall correctly configured at the network perimeter',
              'A DMZ separating internet-facing systems from the internal network',
              'Network segmentation isolating sensitive systems (e.g. servers, OT/IoT, guest devices) from general user traffic',
              'Firewall rules reviewed periodically and unused rules removed'
            ] },
            followUp: { en: 'When were the firewall rules last reviewed, and is there a current network diagram?' },
            references: { iso27001: 'A.8.20, A.8.22', iso27002: '8.20 Networks security; 8.22 Segregation of networks', nis2: 'Art. 21(1) Network and information system security', cis: 'CIS 12, CIS 13' }
          },
          {
            id: 'Q21', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'How is the WiFi network segmented and secured, for both staff and guests?' },
            goodPractice: { en: [
              'WiFi access provided only where genuinely needed',
              'Staff and guest WiFi are on logically separate networks (guest network cannot reach internal resources)',
              'Staff WiFi uses strong encryption (WPA2-Enterprise/WPA3) and is not shared via a static, widely known password',
              'Guest WiFi access requires some form of registration or sponsorship'
            ] },
            followUp: { en: 'How often is the guest WiFi password rotated, if static?' },
            references: { iso27001: 'A.8.20, A.8.22', iso27002: '8.20 Networks security; 8.22 Segregation of networks', nis2: 'Art. 21(2)(j) Secured communications', cis: 'CIS 12.2, CIS 12.6' }
          },
          {
            id: 'Q22', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Where suppliers perform remote maintenance, is this controlled, time-limited, and logged?' },
            goodPractice: { en: [
              'Remote maintenance (incoming or outgoing) requires authorisation before each session starts',
              'Remote access tools are disabled by default and enabled only when needed',
              'Remote access software is kept up to date and access is logged',
              'Sessions are time-bound rather than left open indefinitely'
            ] },
            followUp: { en: 'Is there a record of who accessed what, and when, during the last remote session?' },
            references: { iso27001: 'A.8.9, A.5.19', iso27002: '8.9 Configuration management; 5.19 Information security in supplier relationships', nis2: 'Art. 21(2)(d) Supply chain; Art. 21(2)(c) Vulnerability handling', cis: 'CIS 4, CIS 12.5' }
          },
          {
            id: 'Q36', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'Is there a vulnerability management process — identifying, prioritising, and remediating technical vulnerabilities?' },
            goodPractice: { en: [
              'A process for tracking newly disclosed vulnerabilities relevant to the organisation’s systems',
              'Regular vulnerability scanning of internal and external-facing assets',
              'Risk-based prioritisation and target remediation timelines (e.g. faster for internet-facing/critical systems)',
              'A defined process for handling vulnerabilities reported by third parties (coordinated disclosure)'
            ] },
            followUp: { en: 'What is the average time to patch a critical vulnerability on an internet-facing system?' },
            references: { iso27001: 'A.8.8', iso27002: '8.8 Management of technical vulnerabilities', nis2: 'Art. 21(2)(c) Vulnerability handling and disclosure', cis: 'CIS 7' }
          }
        ]
      },
      {
        id: 'data',
        title: { en: 'Information systems & data management' },
        customSlots: 2,
        questions: [
          {
            id: 'Q23', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'How are user workstations managed — patching, admin rights, usage rules, and screen locking?' },
            goodPractice: { en: [
              'Operating system and software kept current with security updates',
              'Local admin rights restricted, not granted to standard users by default',
              'A documented acceptable-use policy for IT equipment',
              'Workstations auto-lock after a short period of inactivity, and users lock manually when stepping away'
            ] },
            followUp: { en: 'Is patching automated/centrally managed, or does it depend on individual users?' },
            references: { iso27001: 'A.8.1, A.8.9, A.8.2', iso27002: '8.1 User endpoint devices; 8.9 Configuration management; 8.2 Privileged access rights', nis2: 'Art. 21(2)(g) Cyber hygiene', cis: 'CIS 4.1, CIS 4.3' }
          },
          {
            id: 'Q24', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'What is the process for patching and updating servers?' },
            goodPractice: { en: [
              'Servers patched on a defined, periodic cycle, with expedited handling for critical security patches',
              'Patches tested before deployment to production where feasible',
              'An inventory of server software/firmware versions to identify what’s out of date'
            ] },
            followUp: { en: 'How long, on average, between a critical patch release and its deployment to production servers?' },
            references: { iso27001: 'A.8.8, A.8.19', iso27002: '8.8 Management of technical vulnerabilities; 8.19 Installation of software on operational systems', nis2: 'Art. 21(2)(c) Vulnerability handling', cis: 'CIS 7.3, CIS 7.4' }
          },
          {
            id: 'Q25', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'How is malware protection managed across the estate, including mobile devices?' },
            goodPractice: { en: [
              'Anti-malware deployed and centrally managed, with up-to-date signatures/detection engines',
              'Coverage extends to mobile devices (smartphones, laptops), not just desktop endpoints',
              'Regular scans scheduled, with alerts routed to someone who acts on them'
            ] },
            followUp: { en: 'Who reviews malware alerts, and what’s the response process when something is detected?' },
            references: { iso27001: 'A.8.7', iso27002: '8.7 Protection against malware', nis2: 'Art. 21(2)(g) Cyber hygiene', cis: 'CIS 10' }
          },
          {
            id: 'Q26', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: { en: 'How are backups managed — scope, frequency, retention, isolation, offsite copies, and restoration testing?' },
            goodPractice: { en: [
              'Backup scope covers all business-relevant data (excluding purely private files)',
              'A defined backup frequency matching business tolerance for data loss (RPO)',
              'A defined retention period matching business tolerance for how far back recovery must reach',
              'Backups disconnected/isolated from the production network after completion (protection against ransomware propagation)',
              'At least one copy stored off-site or in a separate environment, at a meaningful distance/isolation from the primary site',
              'Restoration tested periodically — a backup that has never been restored is not a verified backup'
            ] },
            followUp: { en: 'When was a full restoration last tested, and how long did it take?' },
            references: { iso27001: 'A.8.13', iso27002: '8.13 Information backup', nis2: 'Art. 21(2)(c) Backup management and disaster recovery', cis: 'CIS 11' }
          },
          {
            id: 'Q27', kind: 'standard', threatIndicator: 2, weight: 1, critical: false,
            text: { en: 'How are physical documents stored and destroyed, and is a clear-desk practice in place?' },
            goodPractice: { en: [
              'Documents stored in lockable cabinets when not in active use',
              'A clear-desk policy in place: no confidential material left visible outside working hours',
              'Confidential documents securely destroyed (shredding or equivalent) before disposal'
            ] },
            followUp: { en: 'Is the clear-desk policy spot-checked, or is it assumed compliance?' },
            references: { iso27001: 'A.7.10, A.5.10, A.7.7', iso27002: '7.10 Storage media; 5.10 Acceptable use of information and other assets; 7.7 Clear desk and clear screen', cis: 'CIS 3.5' }
          },
          {
            id: 'Q28', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Is the use of personal devices for work (BYOD) explicitly governed, and is there an inventory of authorised devices?' },
            goodPractice: { en: [
              'A documented BYOD policy defining what’s permitted (e.g. email access only vs. full data access)',
              'Minimum security baseline required for personal devices (e.g. screen lock, encryption, OS currency)',
              'An inventory of authorised personal devices connecting to company resources',
              'A process to revoke company data access from a personal device when an employee leaves'
            ] },
            followUp: { en: 'Can the company remotely wipe company data from a personal device if needed?' },
            references: { iso27001: 'A.6.7, A.8.1', iso27002: '6.7 Remote working; 8.1 User endpoint devices', nis2: 'Art. 21(2)(i)', cis: 'CIS 1.1, CIS 4' }
          },
          {
            id: 'Q29', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: { en: 'Is there a policy governing cryptography/encryption, and is it applied when sending confidential data by email?' },
            goodPractice: { en: [
              'A documented policy on when and how encryption is used (cryptography policy, per NIS2 Art. 21(2)(h))',
              'Confidential data is never sent unencrypted by email',
              'Where encryption keys/passwords are needed, they are transmitted via a different channel than the protected data itself'
            ] },
            followUp: { en: 'Is encryption enforced technically (e.g. automatic email encryption) or does it rely on user discipline?' },
            references: { iso27001: 'A.8.24, A.5.14', iso27002: '8.24 Use of cryptography; 5.14 Information transfer', nis2: 'Art. 21(2)(h) Cryptography and encryption policies', cis: 'CIS 3.10' }
          },
          {
            id: 'Q30', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'How is hardware disposal managed to ensure data cannot be recovered from retired equipment?' },
            goodPractice: { en: [
              'Equipment that has stored confidential data is securely wiped or physically destroyed before disposal/recycling',
              'A documented disposal procedure, ideally with a certificate of destruction for sensitive media',
              'Process applies to all media types: laptops, servers, drives, photocopiers/printers with internal storage, USB drives'
            ] },
            followUp: { en: 'Is disposal handled in-house or by a certified third party, and is there proof of destruction?' },
            references: { iso27001: 'A.7.10, A.7.14', iso27002: '7.10 Storage media; 7.14 Secure disposal or re-use of equipment', cis: 'CIS 3.5' }
          },
          {
            id: 'Q37', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Where software is developed in-house or customised, is a secure development lifecycle followed?' },
            goodPractice: { en: [
              'Security requirements considered at the design stage, not bolted on afterward',
              'Code review and/or static analysis before deployment',
              'Separate development, test, and production environments',
              'Dependencies/libraries tracked and updated for known vulnerabilities'
            ] },
            followUp: { en: 'If this doesn’t apply (no in-house development), confirm and skip — otherwise, what testing happens before code reaches production?' },
            references: { iso27001: 'A.8.25, A.8.28', iso27002: '8.25 Secure development life cycle; 8.28 Secure coding', nis2: 'Art. 21(3) Secure development procedures', cis: 'CIS 16' }
          }
        ]
      },
      {
        id: 'incident',
        title: { en: 'Incident management & business continuity' },
        customSlots: 2,
        questions: [
          {
            id: 'Q31', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: { en: 'Is there a defined incident management process, and do staff know how to report a suspected incident?' },
            goodPractice: { en: [
              'Staff have one or more clear contacts for reporting a suspected incident, with a backup contact for absences',
              'Staff know basic do’s and don’ts when an attack is suspected (e.g. don’t power off a compromised machine, don’t pay a ransom, isolate but preserve evidence)',
              'A defined process to classify incident severity and trigger escalation',
              'Awareness of external reporting obligations where applicable (NIS2 Art. 23: early warning within 24h, incident notification within 72h, for in-scope entities)'
            ] },
            followUp: { en: 'Has this process been exercised (tabletop or live), and when?' },
            references: { iso27001: 'A.5.24, A.5.25, A.6.8', iso27002: '5.24 Information security incident management planning; 5.25 Assessment and decision on information security events; 6.8 Information security event reporting', nis2: 'Art. 21(2)(b) Incident handling; Art. 23 Reporting obligations', cis: 'CIS 17' }
          },
          {
            id: 'Q32', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: { en: 'Is there a tested business continuity / disaster recovery plan covering loss of premises or major systems?' },
            goodPractice: { en: [
              'A written plan describing how the business resumes operations, even in a degraded mode, after a major incident (loss of premises, major system outage)',
              'Recovery time objectives (RTO) and recovery point objectives (RPO) defined for critical systems',
              'Staff are aware of their role in the plan',
              'The plan has been tested or exercised, not just written and filed away'
            ] },
            followUp: { en: 'When was the plan last tested, and what gaps did the test reveal?' },
            references: { iso27001: 'A.5.29, A.5.30', iso27002: '5.29 Information security during disruption; 5.30 ICT readiness for business continuity', nis2: 'Art. 21(2)(c) Business continuity, backup management and disaster recovery', cis: 'CIS 11.5' }
          },
          {
            id: 'Q38', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: { en: 'Are notification obligations to regulators/authorities and affected individuals understood and actionable within required timeframes?' },
            goodPractice: { en: [
              'Clarity on which incidents trigger external notification duties (e.g. GDPR personal data breach notification to the supervisory authority within 72 hours; NIS2 early warning within 24h / notification within 72h for in-scope entities)',
              'Named owner responsible for making and tracking these notifications',
              'Contact details for relevant authorities (national CSIRT, data protection authority) kept current',
              'A post-incident review process to capture lessons learned and update controls'
            ] },
            followUp: { en: 'Has the organisation determined whether it falls under NIS2 as an essential or important entity?' },
            references: { iso27001: 'A.5.26, A.5.27', iso27002: '5.26 Response to information security incidents; 5.27 Learning from information security incidents', nis2: 'Art. 23 Reporting obligations; Art. 21(2)(b)', cis: 'CIS 17.8' }
          }
        ]
      }
    ]
  };

  root.OBS_TEMPLATES = root.OBS_TEMPLATES || {};
  root.OBS_TEMPLATES[T.id] = T;
  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
