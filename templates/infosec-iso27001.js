(function (root) {
  'use strict';

  var T = {
    id: 'infosec-iso27001',
    version: '1.0.0',
    title: {
      en: 'Information Security Assessment Questionnaire',
      sq: 'Pyetësor i Vlerësimit të Sigurisë së Informacionit'
    },
    description: {
      en: 'A consultant\'s diagnostic tool mapped to ISO/IEC 27001:2022, ISO/IEC 27002:2022, the NIS2 Directive (EU 2022/2555) and CIS Controls v8. 58 questions across 8 domains.',
      sq: 'Mjet diagnostikues i konsulentit i hartuar sipas ISO/IEC 27001:2022, ISO/IEC 27002:2022, Direktivës NIS2 (BE 2022/2555) dhe Kontrolleve CIS v8. 58 pyetje në 8 fusha.'
    },
    languages: ['en', 'sq'],
    translationStatus: { sq: 'machine-draft' },
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
        title: {
          en: 'Governance, security awareness & compliance',
          sq: 'Qeverisja, ndërgjegjësimi për sigurinë dhe pajtueshmëria'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q1', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: {
              en: 'Does a formally approved information security policy exist, and is it actively communicated and enforced?',
              sq: 'A ekziston një politikë e sigurisë së informacionit e miratuar zyrtarisht, dhe a komunikohet dhe zbatohet ajo në mënyrë aktive?'
            },
            goodPractice: {
              en: [
                'A written information security policy approved by top management',
                'A signed user/administrator security charter or acceptable use policy',
                'Documented procedures (not just verbal instructions)',
                'Evidence the policy is communicated to staff and reviewed at planned intervals or after major changes'
              ],
              sq: [
                'Një politikë e shkruar e sigurisë së informacionit e miratuar nga menaxhmenti i lartë',
                'Një statut i nënshkruar i sigurisë për përdoruesit/administratorët ose politikë e përdorimit të pranueshëm',
                'Procedura të dokumentuara (jo vetëm udhëzime verbale)',
                'Dëshmi se politika komunikohet me stafin dhe rishikohet në intervale të planifikuara ose pas ndryshimeve të mëdha'
              ]
            },
            followUp: {
              en: 'Who approved the policy and when was it last reviewed? How is non-compliance handled?',
              sq: 'Kush e miratoi politikën dhe kur u rishikua për herë të fundit? Si trajtohet mospërputhja?'
            },
            references: { iso27001: 'A.5.1', iso27002: '5.1 Policies for information security', nis2: 'Art. 21(2)(a); Art. 20 (Governance)', cis: 'CIS 14.1' }
          },
          {
            id: 'Q2', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'What is the core business, and which processes or information assets are most critical or sensitive?',
              sq: 'Cili është aktiviteti kryesor i biznesit, dhe cilat procese apo aktive informacioni janë më kritike ose të ndjeshme?'
            },
            goodPractice: {
              en: [
                'A documented or maintained inventory of information assets',
                'A classification scheme (e.g. public / internal / confidential / restricted)',
                'A clear view of whether confidentiality, integrity, or availability matters most for each asset',
                'Evidence of a formal risk assessment covering these assets'
              ],
              sq: [
                'Një inventar i dokumentuar ose i mirëmbajtur i aktiveve të informacionit',
                'Një skemë klasifikimi (p.sh. publik / i brendshëm / konfidencial / i kufizuar)',
                'Një pamje e qartë nëse konfidencialiteti, integriteti ose disponueshmëria ka rëndësi më të madhe për secilin aktiv',
                'Dëshmi e një vlerësimi formal të riskut që mbulon këto aktive'
              ]
            },
            followUp: {
              en: 'Do staff know which information they handle is sensitive? When was the risk assessment last updated?',
              sq: 'A dinë punonjësit se cilat informacione që trajtojnë janë të ndjeshme? Kur u përditësua për herë të fundit vlerësimi i riskut?'
            },
            references: { iso27001: 'A.5.9, A.5.12', iso27002: '5.9 Inventory of information and other associated assets; 5.12 Classification of information', nis2: 'Art. 21(2)(i) Asset management', cis: 'CIS 1, CIS 3.1' }
          },
          {
            id: 'Q3', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'What legal, regulatory, and contractual compliance obligations apply to the business, and how are they tracked?',
              sq: 'Cilat detyrime ligjore, rregullatore dhe kontraktuale të pajtueshmërisë zbatohen për biznesin, dhe si ndiqen ato?'
            },
            goodPractice: {
              en: [
                'A maintained register of applicable laws, regulations, sector rules, and contractual obligations',
                'New hires are briefed on relevant obligations during onboarding',
                'A defined process for monitoring legal/regulatory changes (e.g. NIS2 transposition status in relevant Member States, sector-specific rules)'
              ],
              sq: [
                'Një regjistër i mirëmbajtur i ligjeve, rregulloreve, rregullave sektoriale dhe detyrimeve kontraktuale të zbatueshme',
                'Punonjësit e rinj njoftohen mbi detyrimet përkatëse gjatë procesit të orientimit',
                'Një proces i përcaktuar për monitorimin e ndryshimeve ligjore/rregullatore (p.sh. statusi i transpozimit të NIS2 në Shtetet Anëtare përkatëse, rregullat sektoriale specifike)'
              ]
            },
            followUp: {
              en: 'Who owns the compliance register? How often is it reviewed?',
              sq: 'Kush zotëron regjistrin e pajtueshmërisë? Sa shpesh rishikohet?'
            },
            references: { iso27001: 'A.5.31', iso27002: '5.31 Legal, statutory, regulatory and contractual requirements', nis2: 'Art. 21(1) Proportionate measures', cis: 'CIS 14.1' }
          },
          {
            id: 'Q4', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: {
              en: 'Is processing of personal data compliant with GDPR and applicable image/likeness rights?',
              sq: 'A është përpunimi i të dhënave personale në përputhje me GDPR dhe të drejtat e zbatueshme mbi imazhin/ngjashmërinë?'
            },
            goodPractice: {
              en: [
                'Awareness of GDPR obligations among relevant staff',
                'A Record of Processing Activities (ROPA, GDPR Art. 30) for each category of personal data processed',
                'A lawful basis identified for each processing activity',
                'Explicit, documented consent for capturing and publishing images of identifiable individuals'
              ],
              sq: [
                'Ndërgjegjësim mbi detyrimet GDPR ndër stafin përkatës',
                'Një Regjistër i Aktiviteteve të Përpunimit (ROPA, GDPR Neni 30) për çdo kategori të dhënash personale të përpunuara',
                'Një bazë ligjore e identifikuar për çdo aktivitet përpunimi',
                'Pëlqim i shprehur dhe i dokumentuar për regjistrimin dhe publikimin e imazheve të individëve të identifikueshëm'
              ]
            },
            followUp: {
              en: 'Is there a Data Protection Officer or equivalent contact? Has a Data Protection Impact Assessment been done for high-risk processing?',
              sq: 'A ka një DPO (Zyrtar për Mbrojtjen e të Dhënave) ose kontakt të barasvlershëm? A është kryer një Vlerësim i Ndikimit mbi Mbrojtjen e të Dhënave për përpunimin me risk të lartë?'
            },
            references: { iso27001: 'A.5.34', iso27002: '5.34 Privacy and protection of PII', cis: 'CIS 3.1, CIS 14.1', other: 'GDPR Art. 5, 6, 30' }
          },
          {
            id: 'Q33', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Is the effectiveness of security controls independently reviewed (internal audit, external audit, or penetration test)?',
              sq: 'A rishikohet pavarësisht efektiviteti i kontrolleve të sigurisë (auditim i brendshëm, auditim i jashtëm ose test depërtimi)?'
            },
            goodPractice: {
              en: [
                'A schedule of internal audits or independent reviews of the security policy and controls',
                'Periodic technical testing (e.g. vulnerability scans, penetration tests) appropriate to risk',
                'Findings are tracked to closure with owners and deadlines'
              ],
              sq: [
                'Një orar i auditimeve të brendshme ose rishikimeve të pavarura të politikës dhe kontrolleve të sigurisë',
                'Testim teknik periodik (p.sh. skanime të dobësive, teste depërtimi) i përshtatshëm ndaj riskut',
                'Gjetjet ndiqen deri në mbyllje me pronarë dhe afate'
              ]
            },
            followUp: {
              en: 'When was the last independent review or test performed, and what were the major findings?',
              sq: 'Kur u krye rishikimi ose testimi i fundit i pavarur, dhe cilat ishin gjetjet kryesore?'
            },
            references: { iso27001: 'A.5.36, A.5.35', iso27002: '5.35 Independent review of information security; 5.36 Compliance with policies, rules and standards', nis2: 'Art. 21(2)(f) Policies and procedures to assess effectiveness', cis: 'CIS 18' }
          },
          {
            id: 'Q39', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Does the management body actively oversee information security risks and hold accountability for cybersecurity governance?',
              sq: 'A mbikëqyr aktivisht organi drejtues risqet e sigurisë së informacionit dhe mban përgjegjësi për qeverisjen e sigurisë kibernetike?'
            },
            goodPractice: {
              en: [
                'The management body receives regular reporting on the organisation\'s cybersecurity posture, material risks, and incidents',
                'Management body members have received appropriate cybersecurity training relevant to their oversight role (NIS2 Art. 20(2))',
                'Risk appetite and risk tolerance for cybersecurity are formally approved at management level',
                'Cybersecurity is a standing agenda item at board or senior management meetings',
                'Accountability for security governance is assigned to a named senior manager or executive'
              ],
              sq: [
                'Organi drejtues merr raporte të rregullta mbi qëndrimin e sigurisë kibernetike të organizatës, risqet materiale dhe incidentet',
                'Anëtarët e organit drejtues kanë marrë trajnim të përshtatshëm mbi sigurinë kibernetike të rëndësishëm për rolin e tyre mbikëqyrës (NIS2 Neni 20(2))',
                'Apetiti ndaj riskut dhe toleranca ndaj riskut për sigurinë kibernetike janë miratuar zyrtarisht në nivelin drejtues',
                'Siguria kibernetike është pikë e vazhdueshme e rendit të ditës në mbledhjet e bordit ose menaxhmentit të lartë',
                'Përgjegjësia për qeverisjen e sigurisë është caktuar tek një menaxher ose ekzekutiv i lartë i emërtuar'
              ]
            },
            followUp: {
              en: 'How does the management body receive assurance that cybersecurity risks are being managed effectively?',
              sq: 'Si merr organi drejtues garanci se risqet e sigurisë kibernetike po menaxhohen efektivisht?'
            },
            references: { iso27001: 'A.5.4', iso27002: '5.4 Management responsibilities', nis2: 'Art. 20 Governance; Art. 20(1) Management oversight', cis: 'CIS 17' }
          },
          {
            id: 'Q51', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Does the organisation consume threat intelligence (e.g. national CERT advisories, sector ISACs, vendor feeds) and use it to inform risk assessment and security controls?',
              sq: 'A konsumon organizata inteligjencë kërcënimi (p.sh. këshilla nga CERT kombëtar, ISAC sektorial, furnizime furnitorësh) dhe e përdor atë për të informuar vlerësimin e riskut dhe kontrollet e sigurisë?'
            },
            goodPractice: {
              en: [
                'Subscriptions to at least one authoritative threat intelligence source relevant to the sector (e.g. national CERT mailing list, sector ISAC)',
                'A defined owner or team responsible for reviewing threat advisories and translating them into operational actions',
                'Threat intelligence findings feed into the risk assessment cycle and inform prioritisation of vulnerability remediation',
                'Indicators of compromise (IOCs) from credible feeds are operationalised into detection or blocking rules where technically feasible'
              ],
              sq: [
                'Abonime në të paktën një burim të autorizuar inteligjence kërcënimi të rëndësishëm për sektorin (p.sh. lista postare e CERT kombëtar, ISAC sektorial)',
                'Pronar ose ekip i përcaktuar përgjegjës për rishikimin e këshillave të kërcënimit dhe shndërrimin e tyre në veprime operacionale',
                'Gjetjet e inteligjencës së kërcënimit ushqejnë ciklin e vlerësimit të riskut dhe informojnë prioritizimin e korrigjimit të dobësive',
                'Treguesit e kompromisit (IOC) nga furnizime të besueshme operacionalizohen në rregulla zbulimi ose bllokimi ku është teknikisht e realizueshme'
              ]
            },
            followUp: {
              en: 'How are threat intelligence advisories acted on — who reviews them, and how quickly are relevant mitigations applied?',
              sq: 'Si veprohet mbi këshillat e inteligjencës së kërcënimit — kush i rishikon ato, dhe sa shpejt zbatohen masat zbutëse përkatëse?'
            },
            references: { iso27001: 'A.5.7', iso27002: '5.7 Threat intelligence', nis2: 'Art. 21(2)(a)', cis: 'CIS 13.9, CIS 17' }
          },
          {
            id: 'Q55', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Is information security integrated into project management — with security-by-design requirements considered at the outset of new projects and deployments?',
              sq: 'A integrohet siguria e informacionit në menaxhimin e projekteve — me kërkesat e sigurisë-by-design të konsideruara në fillim të projekteve dhe vendosjeve të reja?'
            },
            goodPractice: {
              en: [
                'A project management methodology or checklist that includes a mandatory security review gate at the design/initiation stage',
                'Security requirements (confidentiality, integrity, availability, access control, logging) are captured as acceptance criteria before a project begins build',
                'Data protection impact assessments (DPIAs) are initiated early for projects involving personal data, not as an afterthought',
                'Security sign-off is required before any new system or significant change is deployed to production',
                'Post-deployment security reviews are scheduled as part of project closure'
              ],
              sq: [
                'Metodologji ose listë kontrolluese e menaxhimit të projekteve që përfshin një pikë të detyrueshme rishikimi sigurie në fazën e projektimit/inicimit',
                'Kërkesat e sigurisë (konfidencialiteti, integriteti, disponueshmëria, kontrolli i aksesit, regjistrimi) kapen si kritere pranimi para fillimit të ndërtimit të projektit',
                'Vlerësimet e ndikimit mbi mbrojtjen e të dhënave (DPIA) inicohen herët për projektet që përfshijnë të dhëna personale, jo si mendim i vonuar',
                'Miratimi i sigurisë kërkohet para vendosjes në prodhim të çdo sistemi të ri ose ndryshimi të rëndësishëm',
                'Rishikimet e sigurisë pas vendosjes planifikohen si pjesë e mbylljes së projektit'
              ]
            },
            followUp: {
              en: 'Can you give an example of a recent project where security requirements were defined at the design stage — what did that process look like?',
              sq: 'A mund të jepni një shembull të një projekti të fundit ku kërkesat e sigurisë u përcaktuan në fazën e projektimit — si dukej ai proces?'
            },
            references: { iso27001: 'A.5.8', iso27002: '5.8 Information security in project management', nis2: 'Art. 21(2)(e)', cis: 'CIS 16' }
          }
        ]
      },
      {
        id: 'people',
        title: {
          en: 'People & employee lifecycle management',
          sq: 'Menaxhimi i personelit dhe ciklit të jetës së punonjësit'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q5', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Do staff receive regular, role-appropriate security awareness training, and does this extend to management?',
              sq: 'A merr stafi trajnim të rregullt, të përshtatur me rolin, mbi ndërgjegjësimin e sigurisë, dhe a shtrihet ky gjithashtu tek menaxhmenti?'
            },
            goodPractice: {
              en: [
                'A recurring (at least annual) security awareness programme covering phishing, social engineering, and incident reporting',
                'Training records kept per employee',
                'Management body members also receive cybersecurity training (a specific NIS2 governance expectation)',
                'Simulated phishing or similar exercises, where proportionate'
              ],
              sq: [
                'Një program i përsëritur (të paktën vjetor) i ndërgjegjësimit të sigurisë që mbulon phishing, inxhinierinë sociale dhe raportimin e incidenteve',
                'Regjistrime trajnimi të mbajtura për çdo punonjës',
                'Anëtarët e organit drejtues gjithashtu marrin trajnim mbi sigurinë kibernetike (një pritje specifike e qeverisjes NIS2)',
                'Ushtrime të simuluara phishing ose të ngjashme, kur është proporcional'
              ]
            },
            followUp: {
              en: 'When was the last training cycle, and what was the completion rate?',
              sq: 'Kur ishte cikli i fundit i trajnimit, dhe cili ishte shkalla e përfundimit?'
            },
            references: { iso27001: 'A.6.3', iso27002: '6.3 Information security awareness, education and training', nis2: 'Art. 21(2)(g) Cyber hygiene and training; Art. 20(2) Management training', cis: 'CIS 14' }
          },
          {
            id: 'Q6', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: {
              en: 'Are there documented joiner/mover/leaver processes, including for contractors and interns?',
              sq: 'A ekzistojnë procese të dokumentuara për hyrjen/lëvizjen/largimin e punonjësve, duke përfshirë kontraktorët dhe stazhistët?'
            },
            goodPractice: {
              en: [
                'A checklist-driven onboarding process, with equipment and access ready on day one',
                'A formal offboarding process that revokes physical and logical access promptly upon departure',
                'Background screening proportionate to role sensitivity',
                'Interns/contractors have defined, time-bound access and sign acceptable-use terms'
              ],
              sq: [
                'Një proces orientimi i drejtuar nga lista kontrolluese, me pajisje dhe akses gati në ditën e parë',
                'Një proces formal largimi që revokon aksesin fizik dhe logjik menjëherë pas largimit',
                'Verifikim i sfondit proporcional ndaj ndjeshmërisë së rolit',
                'Stazhistët/kontraktorët kanë akses të përcaktuar, të kufizuar në kohë dhe nënshkruajnë kushtet e përdorimit të pranueshëm'
              ]
            },
            followUp: {
              en: 'How quickly is access revoked after someone leaves? Is this tested?',
              sq: 'Sa shpejt revokohet aksesi pasi dikush largohet? A testohet kjo?'
            },
            references: { iso27001: 'A.6.1, A.6.5, A.5.9', iso27002: '6.1 Screening; 6.5 Responsibilities after termination or change of employment; 5.9 Inventory of assets', nis2: 'Art. 21(2)(i) Human resources security', cis: 'CIS 5.1, CIS 6.2, CIS 6.3' }
          },
          {
            id: 'Q7', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Are IT and information security responsibilities formally defined, with named owners and backup coverage?',
              sq: 'A janë përgjegjësitë e IT-it dhe sigurisë së informacionit të përcaktuara zyrtarisht, me pronarë të emërtuar dhe mbulim rezervë?'
            },
            goodPractice: {
              en: [
                'A named individual or function responsible for IT operations',
                'A named individual or function responsible for information security, distinct where size allows (segregation of duties)',
                'Documented escalation paths for IT, security, and data protection incidents',
                'Backup/deputy coverage so a single absence doesn\'t leave a gap'
              ],
              sq: [
                'Një individ ose funksion i emërtuar përgjegjës për operacionet IT',
                'Një individ ose funksion i emërtuar përgjegjës për sigurinë e informacionit, i ndarë ku madhësia e lejon (ndarja e detyrave)',
                'Rrugë eskalimi të dokumentuara për incidentet IT, të sigurisë dhe mbrojtjes së të dhënave',
                'Mbulim rezervë/zëvendës që mungesa e një personi të vetëm të mos lërë boshllëk'
              ]
            },
            followUp: {
              en: 'What happens if the responsible person is unavailable during an incident?',
              sq: 'Çfarë ndodh nëse personi përgjegjës është i padisponueshëm gjatë një incidenti?'
            },
            references: { iso27001: 'A.5.2, A.5.3', iso27002: '5.2 Information security roles and responsibilities; 5.3 Segregation of duties', nis2: 'Art. 20 Governance; Art. 21(2)(b) Incident handling responsibilities', cis: 'CIS 17.1' }
          },
          {
            id: 'Q8', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Is company-issued hardware tracked in an asset inventory with named owners?',
              sq: 'A ndiqet hardware-i i lëshuar nga kompania në një inventar aktivesh me pronarë të emërtuar?'
            },
            goodPractice: {
              en: [
                'An asset register listing device, assigned user, and status',
                'The register is kept up to date as devices are issued, reassigned, or retired',
                'Off-premises assets (laptops, phones) are covered by the same inventory and protected accordingly'
              ],
              sq: [
                'Një regjistër aktivesh që liston pajisjen, përdoruesin e caktuar dhe statusin',
                'Regjistri mbahet i përditësuar ndërsa pajisjet lëshohen, ricaktohen ose tërhiqen',
                'Aktivet jashtë selisë (laptopë, telefona) mbulohen nga i njëjti inventar dhe mbrohen në mënyrë të përshtatshme'
              ]
            },
            followUp: {
              en: 'How is the inventory kept current — manual process or automated (MDM/asset management tool)?',
              sq: 'Si mbahet inventari i përditësuar — procesi manual apo i automatizuar (MDM/mjet i menaxhimit të aktiveve)?'
            },
            references: { iso27001: 'A.5.9, A.7.9', iso27002: '5.9 Inventory of information and other associated assets; 7.9 Security of assets off-premises', nis2: 'Art. 21(2)(i) Asset management', cis: 'CIS 1.1' }
          },
          {
            id: 'Q9', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: {
              en: 'Is remote/hybrid working supported by both technical and organisational safeguards?',
              sq: 'A mbështetet puna në distancë/hibride nga masa teknike dhe organizative të sigurisë?'
            },
            goodPractice: {
              en: [
                'Technical controls: VPN or zero-trust access, multi-factor authentication, device encryption',
                'Organisational controls: a remote working policy covering acceptable locations, screen privacy, and use of public networks',
                'Endpoint protection consistent with on-premises devices'
              ],
              sq: [
                'Kontrolle teknike: VPN ose akses zero-trust, autentikim me shumë faktorë (MFA), kriptim i pajisjes',
                'Kontrolle organizative: politikë e punës në distancë që mbulon vendndodhjet e pranueshme, privatësinë e ekranit dhe përdorimin e rrjeteve publike',
                'Mbrojtje e pikave fundore në përputhje me pajisjet brenda selisë'
              ]
            },
            followUp: {
              en: 'Is MFA mandatory for all remote access, with no exceptions?',
              sq: 'A është MFA i detyrueshëm për të gjithë aksesin në distancë, pa asnjë përjashtim?'
            },
            references: { iso27001: 'A.6.7, A.8.1', iso27002: '6.7 Remote working; 8.1 User endpoint devices', nis2: 'Art. 21(2)(j) MFA, secured communications; Art. 21(2)(d) Supply chain; Art. 21(2)(i)', cis: 'CIS 12.7, CIS 6.3' }
          },
          {
            id: 'Q46', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Is there a formal disciplinary process for information security violations, and are staff aware that policy breaches may result in disciplinary action?',
              sq: 'A ka një proces formal disiplinor për shkeljet e sigurisë së informacionit, dhe a janë punonjësit të vetëdijshëm se shkeljet e politikës mund të rezultojnë në veprime disiplinore?'
            },
            goodPractice: {
              en: [
                'A documented disciplinary process covering information security policy breaches, proportionate to severity',
                'The disciplinary process is communicated to all staff — ideally referenced in the security policy or employment contracts',
                'Repeat or serious violations are escalated through HR and, where appropriate, to legal or law-enforcement channels',
                'The process treats accidental and negligent breaches differently from deliberate misconduct'
              ],
              sq: [
                'Proces disiplinor i dokumentuar që mbulon shkeljet e politikës së sigurisë së informacionit, proporcional ndaj ashpërsisë',
                'Procesi disiplinor komunikohet të gjithë stafit — mundësisht i referuar në politikën e sigurisë ose kontratat e punësimit',
                'Shkeljet e përsëritura ose të rënda eskalojnë nëpërmjet HR-it dhe, kur është e përshtatshme, në kanalet ligjore ose të zbatimit të ligjit',
                'Procesi trajton shkeljet aksidentale dhe të pakujdesshme ndryshe nga sjelljet e qëllimshme'
              ]
            },
            followUp: {
              en: 'Has the disciplinary process been invoked in the past, and are lessons from those cases incorporated into training?',
              sq: 'A është zbatuar procesi disiplinor në të kaluarën, dhe a janë mësimet nga ato raste të integruara në trajnim?'
            },
            references: { iso27001: 'A.6.4', iso27002: '6.4 Disciplinary process', nis2: 'Art. 21(2)(i)', cis: 'CIS 14' }
          }
        ]
      },
      {
        id: 'thirdparty',
        title: {
          en: 'Third-party & supply chain management',
          sq: 'Menaxhimi i palëve të treta dhe zinxhirit të furnizimit'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q10', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Do third parties with access to confidential information sign confidentiality (NDA) agreements?',
              sq: 'A nënshkruajnë palët e treta me akses në informacion konfidencial marrëveshje konfidencialiteti (NDA)?'
            },
            goodPractice: {
              en: [
                'Standard NDA terms required before sharing confidential information with any third party',
                'NDAs also cover pre-contractual discussions where confidential information may be disclosed',
                'NDA register or tracking of signed agreements'
              ],
              sq: [
                'Kushte standarde NDA të kërkuara para ndarjes së informacionit konfidencial me çdo palë të tretë',
                'NDA-të mbulojnë gjithashtu diskutimet para-kontraktuale ku mund të zbulohet informacion konfidencial',
                'Regjistër NDA ose gjurmim i marrëveshjeve të nënshkruara'
              ]
            },
            followUp: {
              en: 'Is there a standard template, and is legal review required before signing?',
              sq: 'A ka një model standard, dhe a kërkohet rishikim ligjor para nënshkrimit?'
            },
            references: { iso27001: 'A.5.14, A.6.6', iso27002: '5.14 Information transfer; 6.6 Confidentiality or non-disclosure agreements', nis2: 'Art. 21(2)(d) Supply chain security', cis: 'CIS 15' }
          },
          {
            id: 'Q11', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Do critical service providers commit formally to service levels and security requirements, and are these reviewed?',
              sq: 'A angazhohen zyrtarisht ofruesit kritikë të shërbimeve ndaj niveleve të shërbimit dhe kërkesave të sigurisë, dhe a rishikohen këto?'
            },
            goodPractice: {
              en: [
                'SLAs in place for providers whose responsiveness affects business continuity',
                'Security requirements embedded in supplier contracts (not just delivery/performance terms)',
                'Periodic review of contracts and supplier performance against agreed terms',
                'Consideration of supplier security practices and secure development procedures (NIS2 Art. 21(3))'
              ],
              sq: [
                'SLA-të në vend për ofruesit reaktiviteti i të cilëve ndikon vazhdimësinë e biznesit',
                'Kërkesat e sigurisë të integruara në kontratat e furnitorëve (jo vetëm kushtet e dorëzimit/performancës)',
                'Rishikim periodik i kontratave dhe performancës së furnitorëve ndaj kushteve të rëna dakord',
                'Vlerësim i praktikave të sigurisë së furnitorëve dhe procedurave të zhvillimit të sigurt (NIS2 Neni 21(3))'
              ]
            },
            followUp: {
              en: 'How are suppliers risk-rated, and is there a list of critical suppliers?',
              sq: 'Si vlerësohen furnitorët nga pikëpamja e riskut, dhe a ka një listë të furnitorëve kritikë?'
            },
            references: { iso27001: 'A.5.20, A.5.22', iso27002: '5.20 Addressing information security within supplier agreements; 5.22 Monitoring, review and change management of supplier services', nis2: 'Art. 21(2)(d) Supply chain; Art. 21(3) Supplier vulnerabilities', cis: 'CIS 15.4, CIS 15.5' }
          },
          {
            id: 'Q12', kind: 'standard', threatIndicator: 2, weight: 1, critical: false,
            text: {
              en: 'How is premises cleaning/maintenance organised, and what access do cleaning staff have to sensitive areas?',
              sq: 'Si organizohet pastrimi/mirëmbajtja e selisë, dhe çfarë aksesi kanë stafi i pastrimit në zonat e ndjeshme?'
            },
            goodPractice: {
              en: [
                'Clear policy on whether cleaning is done in-house or outsourced',
                'Cleaning scheduled to minimise exposure of confidential material (ideally outside working hours or supervised)',
                'Written instructions for external cleaning staff (e.g. what not to touch or move)',
                'IT/server rooms and archive rooms excluded from general access, or cleaned only under supervision'
              ],
              sq: [
                'Politikë e qartë nëse pastrimi bëhet brenda kompanisë ose me kontratë të jashtme',
                'Pastrimi i planifikuar për të minimizuar ekspozimin e materialit konfidencial (mundësisht jashtë orarit të punës ose i mbikëqyrur)',
                'Udhëzime të shkruara për stafin e jashtëm të pastrimit (p.sh. çfarë të mos prekin ose lëvizin)',
                'Dhomat e IT/serverëve dhe arkivave të përjashtuara nga aksesi i përgjithshëm, ose pastrohen vetëm nën mbikëqyrje'
              ]
            },
            followUp: {
              en: 'Is cleaning staff turnover/vetting tracked by the contracted provider?',
              sq: 'A ndiqet qarkullimi/verifikimi i stafit të pastrimit nga ofruesi i kontraktuar?'
            },
            references: { iso27001: 'A.7.1, A.7.2', iso27002: '7.1 Physical security perimeters; 7.2 Physical entry', cis: 'CIS 1' }
          },
          {
            id: 'Q13', kind: 'standard', threatIndicator: 2, weight: 1, critical: false,
            text: {
              en: 'Are visitors controlled, identified, and escorted while on the premises?',
              sq: 'A kontrollohen, identifikohen dhe shoqërohen vizitorët gjatë qëndrimit në ambientet e kompanisë?'
            },
            goodPractice: {
              en: [
                'Visitors are received at a reception point and not left to find their own way',
                'Visitors are escorted in non-public areas',
                'Private/restricted areas are clearly distinguished from publicly accessible ones',
                'Visitor identity is logged at reception',
                'Visitors wear a visible badge distinguishing them from staff'
              ],
              sq: [
                'Vizitorët priten në një pikë pritjeje dhe nuk lihen të gjejnë vetë rrugën e tyre',
                'Vizitorët shoqërohen në zonat jo-publike',
                'Zonat private/të kufizuara janë qartazi të ndara nga ato të aksesueshme nga publiku',
                'Identiteti i vizitorëve regjistrohet në pritje',
                'Vizitorët mbajnë një badge të dukshëm që i dallon nga stafi'
              ]
            },
            followUp: {
              en: 'Is the visitor log retained, and for how long?',
              sq: 'A mbahet regjistri i vizitorëve, dhe për sa kohë?'
            },
            references: { iso27001: 'A.7.2', iso27002: '7.2 Physical entry', cis: 'CIS 1' }
          },
          {
            id: 'Q34', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Is supplier risk assessed before onboarding, and is there a current list of critical/high-risk suppliers?',
              sq: 'A vlerësohet risku i furnitorit para pranimit, dhe a ekziston një listë aktuale e furnitorëve kritikë/me risk të lartë?'
            },
            goodPractice: {
              en: [
                'A documented process to assess security posture of new suppliers before granting access to systems or data',
                'Criteria distinguishing critical/high-risk suppliers (e.g. cloud providers, ICT/MSP, payroll) from low-risk ones',
                'Evidence requested from suppliers proportionate to risk (e.g. certifications, security questionnaires, audit rights)'
              ],
              sq: [
                'Një proces i dokumentuar për vlerësimin e qëndrimit të sigurisë të furnitorëve të rinj para dhënies së aksesit në sisteme ose të dhëna',
                'Kritere që dallojnë furnitorët kritikë/me risk të lartë (p.sh. ofruesit cloud, ICT/MSP, pagat) nga ata me risk të ulët',
                'Dëshmi e kërkuar nga furnitorët proporcionale ndaj riskut (p.sh. certifikime, pyetësorë sigurie, të drejta auditimi)'
              ]
            },
            followUp: {
              en: 'What happens if a critical supplier suffers a security incident — is there a notification clause in the contract?',
              sq: 'Çfarë ndodh nëse një furnitor kritik pëson një incident sigurie — a ka klauzolë njoftimi në kontratë?'
            },
            references: { iso27001: 'A.5.19, A.5.21', iso27002: '5.19 Information security in supplier relationships; 5.21 Managing information security in the ICT supply chain', nis2: 'Art. 21(2)(d) Supply chain security; Art. 21(3)', cis: 'CIS 15.1, CIS 15.2' }
          }
        ]
      },
      {
        id: 'physical',
        title: {
          en: 'Physical & environmental security',
          sq: 'Siguria fizike dhe mjedisore'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q14', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'How are physical access rights granted, and is granting separated from requesting?',
              sq: 'Si jepen të drejtat e aksesit fizik, dhe a ndahet dhënia nga kërkesa?'
            },
            goodPractice: {
              en: [
                'Physical access granted on a need-to-know / least-privilege basis',
                'The person requesting/deciding access is different from the person implementing it (segregation of duties)',
                'Access rights reviewed periodically and revoked promptly when no longer needed'
              ],
              sq: [
                'Aksesi fizik i dhënë mbi bazën e nevojës për të njohur / privilegjit minimal',
                'Personi që kërkon/vendos aksesin është i ndryshëm nga ai që e zbaton atë (ndarja e detyrave)',
                'Të drejtat e aksesit rishikohen periodikisht dhe revokohen menjëherë kur nuk nevojiten më'
              ]
            },
            followUp: {
              en: 'How often are physical access rights reviewed, and by whom?',
              sq: 'Sa shpesh rishikohen të drejtat e aksesit fizik, dhe nga kush?'
            },
            references: { iso27001: 'A.7.2, A.5.18', iso27002: '7.2 Physical entry; 5.18 Access rights', nis2: 'Art. 21(2)(i) Access control policies', cis: 'CIS 1' }
          },
          {
            id: 'Q15', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Are entry points to the premises controlled and monitored?',
              sq: 'A kontrollohen dhe monitorohen pikat e hyrjes në ambientet e kompanisë?'
            },
            goodPractice: {
              en: [
                'Physical access mechanisms appropriate to risk (keys, badges, biometrics)',
                'Intrusion alarm covering the premises',
                'Video surveillance where appropriate and legally compliant',
                'Secondary/back doors verified to remain locked, with periodic checks'
              ],
              sq: [
                'Mekanizma të aksesit fizik të përshtatshëm ndaj riskut (çelësa, badge, biometrikë)',
                'Alarm ndërhyrjeje që mbulon ambientet',
                'Mbikëqyrje video ku është e përshtatshme dhe në përputhje me ligjin',
                'Dyert anësore/të pasme verifikohen të mbeten të mbyllura, me kontrolle periodike'
              ]
            },
            followUp: {
              en: 'Are alarm and surveillance systems tested periodically?',
              sq: 'A testohen periodikisht sistemet e alarmit dhe mbikëqyrjes?'
            },
            references: { iso27001: 'A.7.2, A.7.4', iso27002: '7.2 Physical entry; 7.4 Physical security monitoring', cis: 'CIS 1' }
          },
          {
            id: 'Q16', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: {
              en: 'Are restricted-access areas such as the server/IT room and archive room adequately secured?',
              sq: 'A janë zonat me akses të kufizuar si dhoma e serverëve/IT-it dhe dhoma e arkivit të siguruara mjaftueshëm?'
            },
            goodPractice: {
              en: [
                'IT/server room and archive room are correctly locked at all times',
                'Access limited to a defined, minimal list of authorised personnel',
                'Access events to these rooms are logged where feasible'
              ],
              sq: [
                'Dhoma e IT/serverëve dhe dhoma e arkivit janë të mbyllura siç duhet gjatë gjithë kohës',
                'Aksesi i kufizuar në një listë minimale të personelit të autorizuar',
                'Ngjarjet e aksesit në këto dhoma regjistrohen kur është e realizueshme'
              ]
            },
            followUp: {
              en: 'Is there a current list of who holds keys/badge access to these rooms?',
              sq: 'A ka një listë aktuale të atyre që mbajnë çelësat/aksesin me badge në këto dhoma?'
            },
            references: { iso27001: 'A.7.1, A.7.3', iso27002: '7.1 Physical security perimeters; 7.3 Securing offices, rooms and facilities', cis: 'CIS 1' }
          },
          {
            id: 'Q17', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Is critical equipment protected by an uninterruptible power supply (UPS), and is this tested?',
              sq: 'A mbrohen pajisjet kritike nga një furnizim i pandërprerë me energji (UPS), dhe a testohet kjo?'
            },
            goodPractice: {
              en: [
                'UPS protects equipment where a sudden power cut would be damaging (servers, network gear)',
                'UPS functionality verified periodically (e.g. self-test logs, battery health checks)',
                'UPS capacity sized to actual load and runtime needs'
              ],
              sq: [
                'UPS mbron pajisjet ku një ndërprerje e papritur e rrymës do të ishte dëmtuese (serverë, pajisje rrjeti)',
                'Funksionaliteti i UPS verifikohet periodikisht (p.sh. regjistrat e vetë-testimit, kontrollet e shëndetit të baterisë)',
                'Kapaciteti i UPS i dimensionuar sipas ngarkesës aktuale dhe nevojave për kohën e funksionimit'
              ]
            },
            followUp: {
              en: 'What is the documented runtime, and has a full power-failure scenario been tested?',
              sq: 'Cila është koha e funksionimit e dokumentuar, dhe a është testuar një skenar i plotë i dështimit të energjisë?'
            },
            references: { iso27001: 'A.7.11, A.7.12', iso27002: '7.11 Supporting utilities; 7.12 Cabling security', nis2: 'Art. 21(1) Resilience of network and information systems', cis: 'CIS 1' }
          },
          {
            id: 'Q54', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Are equipment areas protected against environmental threats — fire, extreme temperatures, flooding, and humidity — and are these protections tested?',
              sq: 'A mbrohen zonat e pajisjeve ndaj kërcënimeve mjedisore — zjarrit, temperaturave ekstreme, përmbytjeve dhe lagështisë — dhe a testohen këto mbrojtje?'
            },
            goodPractice: {
              en: [
                'Automatic fire detection and suppression systems installed in server rooms and critical equipment areas, with periodic inspection and test records',
                'HVAC or equivalent climate control maintains temperature and humidity within manufacturer-specified safe operating ranges, with alerting on exceedance',
                'Flood/water ingress risk assessed and mitigated (e.g. raised flooring, no overhead water pipes, water detection sensors where relevant)',
                'Environmental monitoring alerts are routed to a responsible owner and acted upon promptly',
                'Environmental control systems are included in the periodic testing and maintenance schedule'
              ],
              sq: [
                'Sisteme automatike zbulimi dhe shuarjeje të zjarrit të instaluara në dhomat e serverëve dhe zonat e pajisjeve kritike, me rekorde inspektimi dhe testimi periodik',
                'HVAC ose sistem ekuivalent i kontrollit të klimës mban temperaturën dhe lagështinë brenda intervaleve të sigurta operative të specifikuara nga prodhuesi, me alarm kur tejkalohen',
                'Risku i përmbytjes/hyrjes së ujit vlerësohet dhe zbutet (p.sh. dysheme e ngritur, asnjë tub uji sipër, sensorë zbulimi uji ku është relevant)',
                'Alarmet e monitorimit mjedisor drejtohen tek një pronar përgjegjës dhe trajtohen menjëherë',
                'Sistemet e kontrollit mjedisor përfshihen në orarin e testimit dhe mirëmbajtjes periodike'
              ]
            },
            followUp: {
              en: 'When were fire suppression, HVAC, and environmental sensors last inspected and tested, and are records available?',
              sq: 'Kur u inspektuan dhe testuan për herë të fundit sistemet e shuarjes së zjarrit, HVAC dhe sensorët mjedisorë, dhe a janë regjistrimet disponibël?'
            },
            references: { iso27001: 'A.7.5', iso27002: '7.5 Protecting against physical and environmental threats', nis2: 'Art. 21(1)', cis: 'CIS 1' }
          }
        ]
      },
      {
        id: 'iam',
        title: {
          en: 'Identity & access control',
          sq: 'Identiteti dhe kontrolli i aksesit'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q18', kind: 'standard', threatIndicator: 4, weight: 1.3, critical: true,
            text: {
              en: 'How are logical access rights granted, reviewed, and revoked — and is approval separated from provisioning?',
              sq: 'Si jepen, rishikohen dhe revokohen të drejtat e aksesit logjik — dhe a ndahet miratimi nga provizionimi?'
            },
            goodPractice: {
              en: [
                'Access granted on least-privilege / need-to-know basis',
                'The person approving access is different from the person provisioning it',
                'Periodic access reviews (e.g. quarterly or at role change) to remove unneeded privileges',
                'Privileged/admin accounts are separate from standard user accounts and more tightly controlled'
              ],
              sq: [
                'Aksesi i dhënë mbi bazën e privilegjit minimal / nevojës për të njohur',
                'Personi që miraton aksesin është i ndryshëm nga ai që e provizionon atë',
                'Rishikime periodike të aksesit (p.sh. çdo tremujor ose kur ndryshon roli) për të hequr privilegjet e panevojshme',
                'Llogaritë e privilegjuara/admin janë të ndara nga llogaritë standarde të përdoruesve dhe kontrollohen më rreptë'
              ]
            },
            followUp: {
              en: 'Is there a process for emergency/break-glass access, and is it logged and reviewed afterward?',
              sq: 'A ka një proces për akses urgjent/break-glass, dhe a regjistrohet dhe rishikohet pas faktit?'
            },
            references: { iso27001: 'A.5.15, A.5.18, A.5.3', iso27002: '5.15 Access control; 5.18 Access rights; 5.3 Segregation of duties', nis2: 'Art. 21(2)(i) Access control policies', cis: 'CIS 5, CIS 6' }
          },
          {
            id: 'Q19', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: {
              en: 'How is user authentication managed — is multi-factor authentication enforced, and what are the password rules?',
              sq: 'Si menaxhohet autentikimi i përdoruesit — a zbatohet autentikimi me shumë faktorë (MFA), dhe cilat janë rregullat e fjalëkalimit?'
            },
            goodPractice: {
              en: [
                'Multi-factor authentication enforced, especially for remote access, email, admin, and cloud accounts (explicit NIS2 expectation)',
                'Documented password construction rules (length/complexity, or passphrase guidance)',
                'Practical guidance for users to build memorable yet strong passwords/passphrases',
                'Passwords treated as strictly personal and never shared',
                'Credentials rotated based on risk (modern guidance favours rotation on compromise/risk rather than fixed time alone, combined with MFA and monitoring)'
              ],
              sq: [
                'MFA i zbatuar, veçanërisht për aksesin në distancë, emailin, llogari admin dhe cloud (pritje e shprehur e NIS2)',
                'Rregulla të dokumentuara për krijimin e fjalëkalimit (gjatësia/kompleksiteti, ose udhëzime për frazë-kalim)',
                'Udhëzime praktike për përdoruesit për të ndërtuar fjalëkalime/fraza-kalim të paharrueshme por të forta',
                'Fjalëkalimet trajtohen si rreptësisht personale dhe nuk ndahen kurrë',
                'Kredencialet rrotullohen bazuar në risk (udhëzimet moderne favorizojnë rrotullimin në kompromis/risk dhe jo vetëm në intervale fikse kohore, të kombinuara me MFA dhe monitorim)'
              ]
            },
            followUp: {
              en: 'Are there any accounts or systems still without MFA? What is the plan to close that gap?',
              sq: 'A ka llogari ose sisteme që ende nuk kanë MFA? Cili është plani për mbylljen e kësaj boshllëke?'
            },
            references: { iso27001: 'A.5.17, A.8.5', iso27002: '5.17 Authentication information; 8.5 Secure authentication', nis2: 'Art. 21(2)(j) Multi-factor authentication', cis: 'CIS 6.3, CIS 6.5' }
          },
          {
            id: 'Q35', kind: 'new', threatIndicator: 5, weight: 1.3, critical: true,
            text: {
              en: 'Are privileged/administrator accounts specifically controlled, monitored, and limited in number?',
              sq: 'A kontrollohen, monitorohen dhe kufizohen në numër llogaritë e privilegjuara/administrator?'
            },
            goodPractice: {
              en: [
                'Admin rights granted only where strictly necessary, separate from each user\'s standard account',
                'A current list of who holds privileged access, reviewed periodically',
                'Privileged account activity logged and monitored for anomalies',
                'Default/vendor admin credentials changed before go-live'
              ],
              sq: [
                'Të drejtat admin jepen vetëm kur është rreptësisht e nevojshme, të ndara nga llogaria standarde e secilit përdorues',
                'Një listë aktuale e atyre që kanë akses të privilegjuar, e rishikuar periodikisht',
                'Aktiviteti i llogarisë së privilegjuar regjistrohet dhe monitorohet për anomali',
                'Kredencialet admin të paracaktuara/furnitorit ndryshohen para vënies në punë'
              ]
            },
            followUp: {
              en: 'How many people currently have domain/global admin rights, and is that the minimum needed?',
              sq: 'Sa njerëz kanë aktualisht të drejta domain/global admin, dhe a është kjo minimumi i nevojshëm?'
            },
            references: { iso27001: 'A.8.2, A.8.3, A.8.4', iso27002: '8.2 Privileged access rights; 8.3 Information access restriction; 8.4 Access to source code', nis2: 'Art. 21(2)(i)', cis: 'CIS 5.4, CIS 6.8' }
          },
          {
            id: 'Q44', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Is identity management centralised where possible (e.g. single sign-on), and are service accounts and API credentials governed?',
              sq: 'A është menaxhimi i identitetit i centralizuar ku është e mundur (p.sh. hyrje e vetme), dhe a qeverisohen llogaritë e shërbimeve dhe kredencialet API?'
            },
            goodPractice: {
              en: [
                'A centralised directory (e.g. Active Directory, Azure AD) or identity provider offering unified authentication where feasible',
                'Single sign-on (SSO) implemented for business-critical applications to reduce password sprawl and simplify offboarding',
                'Service accounts, API keys, and secrets managed in an authorised secrets manager or vault, not embedded in code or spreadsheets',
                'Service account credentials rotated on a defined schedule and immediately on suspected compromise',
                'Unused or orphaned identities and credentials identified and deprovisioned regularly'
              ],
              sq: [
                'Direktori i centralizuar (p.sh. Active Directory, Azure AD) ose ofrues identiteti që ofron autentikimi të unifikuar ku është e realizueshme',
                'Hyrje e vetme (SSO) e implementuar për aplikacionet kritike të biznesit për të reduktuar shpërhapjen e fjalëkalimeve dhe thjeshtuar çprovizionimin',
                'Llogaritë e shërbimeve, çelësat API dhe sekretet e menaxhuara në një menaxher sekretesh ose vault të autorizuar, jo të ngulitura në kod ose spreadsheet',
                'Kredencialet e llogarisë së shërbimit rrotullohen sipas një orari të përcaktuar dhe menjëherë kur dyshohet kompromis',
                'Identitetet dhe kredencialet e papërdorura ose të braktisura identifikohen dhe çprovizionohen rregullisht'
              ]
            },
            followUp: {
              en: 'Are API keys and service credentials stored securely, and is there a process to rotate them promptly if exposed?',
              sq: 'A ruhen çelësat API dhe kredencialet e shërbimeve në mënyrë të sigurt, dhe a ka një proces për t\'i rrotulluar menjëherë nëse ekspozohen?'
            },
            references: { iso27001: 'A.5.16', iso27002: '5.16 Identity management', nis2: 'Art. 21(2)(i)', cis: 'CIS 5, CIS 6' }
          }
        ]
      },
      {
        id: 'network',
        title: {
          en: 'Network & infrastructure security',
          sq: 'Siguria e rrjetit dhe infrastrukturës'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q20', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'How is the internal network (LAN) segmented and protected at its boundary?',
              sq: 'Si segmentohet dhe mbrohet rrjeti i brendshëm (LAN) në kufirin e tij?'
            },
            goodPractice: {
              en: [
                'A firewall correctly configured at the network perimeter',
                'A DMZ separating internet-facing systems from the internal network',
                'Network segmentation isolating sensitive systems (e.g. servers, OT/IoT, guest devices) from general user traffic',
                'Firewall rules reviewed periodically and unused rules removed'
              ],
              sq: [
                'Një mur zjarri i konfiguruar saktë në perimetrin e rrjetit',
                'Një DMZ që ndan sistemet e hapura ndaj internetit nga rrjeti i brendshëm',
                'Segmentimi i rrjetit që izolon sistemet e ndjeshme (p.sh. serverët, OT/IoT, pajisjet e mysafirëve) nga trafiku i përgjithshëm i përdoruesve',
                'Rregullat e murit zjarri rishikohen periodikisht dhe rregullat e papërdorura hiqen'
              ]
            },
            followUp: {
              en: 'When were the firewall rules last reviewed, and is there a current network diagram?',
              sq: 'Kur u rishikuan për herë të fundit rregullat e murit zjarri, dhe a ka një diagram aktual të rrjetit?'
            },
            references: { iso27001: 'A.8.20, A.8.22', iso27002: '8.20 Networks security; 8.22 Segregation of networks', nis2: 'Art. 21(1) Network and information system security', cis: 'CIS 12, CIS 13' }
          },
          {
            id: 'Q21', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'How is the WiFi network segmented and secured, for both staff and guests?',
              sq: 'Si segmentohet dhe sigurohet rrjeti WiFi, si për stafin ashtu edhe për mysafirët?'
            },
            goodPractice: {
              en: [
                'WiFi access provided only where genuinely needed',
                'Staff and guest WiFi are on logically separate networks (guest network cannot reach internal resources)',
                'Staff WiFi uses strong encryption (WPA2-Enterprise/WPA3) and is not shared via a static, widely known password',
                'Guest WiFi access requires some form of registration or sponsorship'
              ],
              sq: [
                'Aksesi WiFi i siguruar vetëm ku është vërtet i nevojshëm',
                'WiFi-ja e stafit dhe e mysafirëve janë në rrjete logjikisht të ndara (rrjeti i mysafirëve nuk mund të arrijë burimet e brendshme)',
                'WiFi-ja e stafit përdor kriptim të fortë (WPA2-Enterprise/WPA3) dhe nuk ndahet nëpërmjet një fjalëkalimi statik të njohur gjerësisht',
                'Aksesi WiFi i mysafirëve kërkon një formë regjistrimi ose sponsorizimi'
              ]
            },
            followUp: {
              en: 'How often is the guest WiFi password rotated, if static?',
              sq: 'Sa shpesh rrotullohet fjalëkalimi i WiFi-së së mysafirëve, nëse është statik?'
            },
            references: { iso27001: 'A.8.20, A.8.22', iso27002: '8.20 Networks security; 8.22 Segregation of networks', nis2: 'Art. 21(2)(j) Secured communications', cis: 'CIS 12.2, CIS 12.6' }
          },
          {
            id: 'Q22', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Where suppliers perform remote maintenance, is this controlled, time-limited, and logged?',
              sq: 'Kur furnitorët kryejnë mirëmbajtje në distancë, a kontrollohet, kufizohet në kohë dhe regjistrohet kjo?'
            },
            goodPractice: {
              en: [
                'Remote maintenance (incoming or outgoing) requires authorisation before each session starts',
                'Remote access tools are disabled by default and enabled only when needed',
                'Remote access software is kept up to date and access is logged',
                'Sessions are time-bound rather than left open indefinitely'
              ],
              sq: [
                'Mirëmbajtja në distancë (hyrëse ose dalëse) kërkon autorizim para fillimit të çdo sesioni',
                'Mjetet e aksesit në distancë janë çaktivizuara si parazgjedhje dhe aktivizohen vetëm kur nevojiten',
                'Software-i i aksesit në distancë mbahet i përditësuar dhe aksesi regjistrohet',
                'Sesionet janë të kufizuara në kohë dhe nuk lihen të hapura pafundësisht'
              ]
            },
            followUp: {
              en: 'Is there a record of who accessed what, and when, during the last remote session?',
              sq: 'A ka një regjistër se kush ka hyrë ku dhe kur, gjatë sesionit të fundit të aksesit në distancë?'
            },
            references: { iso27001: 'A.8.9, A.5.19', iso27002: '8.9 Configuration management; 5.19 Information security in supplier relationships', nis2: 'Art. 21(2)(d) Supply chain; Art. 21(2)(c) Vulnerability handling', cis: 'CIS 4, CIS 12.5' }
          },
          {
            id: 'Q36', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Is there a vulnerability management process — identifying, prioritising, and remediating technical vulnerabilities?',
              sq: 'A ka një proces menaxhimi të dobësive — identifikim, prioritizim dhe korrigjim i dobësive teknike?'
            },
            goodPractice: {
              en: [
                'A process for tracking newly disclosed vulnerabilities relevant to the organisation\'s systems',
                'Regular vulnerability scanning of internal and external-facing assets',
                'Risk-based prioritisation and target remediation timelines (e.g. faster for internet-facing/critical systems)',
                'A defined process for handling vulnerabilities reported by third parties (coordinated disclosure)'
              ],
              sq: [
                'Një proces për gjurmimin e dobësive të zbuluar rishtazi të rëndësishme për sistemet e organizatës',
                'Skanim i rregullt i dobësive të aktiveve të brendshme dhe atyre të hapura ndaj jashtëm',
                'Prioritizim i bazuar në risk dhe afate korrektuese të synuara (p.sh. më i shpejtë për sistemet e hapura ndaj internetit/kritike)',
                'Një proces i përcaktuar për trajtimin e dobësive të raportuara nga palët e treta (zbulim i koordinuar)'
              ]
            },
            followUp: {
              en: 'What is the average time to patch a critical vulnerability on an internet-facing system?',
              sq: 'Cila është koha mesatare për aplikimin e një patch-i kritik në një sistem të hapur ndaj internetit?'
            },
            references: { iso27001: 'A.8.8', iso27002: '8.8 Management of technical vulnerabilities', nis2: 'Art. 21(2)(c) Vulnerability handling and disclosure', cis: 'CIS 7' }
          },
          {
            id: 'Q40', kind: 'new', threatIndicator: 4, weight: 1.3, critical: true,
            text: {
              en: 'Is security event logging centralised, with sufficient retention, and reviewed regularly to detect anomalies or incidents?',
              sq: 'A janë regjistrat e ngjarjeve të sigurisë të centralizuara, me mbajtje të mjaftueshme, dhe rishikohen rregullisht për të zbuluar anomali ose incidente?'
            },
            goodPractice: {
              en: [
                'Centralised log collection from critical systems (servers, firewalls, endpoints, authentication systems)',
                'Log retention period defined and enforced, meeting legal and contractual obligations',
                'Automated alerting or SIEM capability in place for defined event patterns (e.g. repeated failed logins, privilege escalation, large data transfers)',
                'Logs are protected from tampering and remain accessible to authorised responders during incidents',
                'Log review is performed on a regular, scheduled basis — not only reactively after an incident'
              ],
              sq: [
                'Mbledhja e centralizuar e regjistrave nga sistemet kritike (serverë, mure zjarri, pika fundore, sisteme autentikimi)',
                'Periudha e mbajtjes së regjistrave e përcaktuar dhe e zbatuar, duke plotësuar detyrimet ligjore dhe kontraktuale',
                'Alarmim i automatizuar ose aftësi SIEM në vend për modele të caktuara ngjarjesh (p.sh. hyrje të dështuara të përsëritura, eskalim privilegjesh, transferime të mëdha të dhënash)',
                'Regjistrat mbrohen nga manipulimi dhe mbeten të aksesueshëm nga personat e autorizuar gjatë incidenteve',
                'Rishikimi i regjistrave kryhet rregullisht, sipas një orari — jo vetëm në mënyrë reaktive pas një incidenti'
              ]
            },
            followUp: {
              en: 'Who is responsible for reviewing security alerts, and what is the response process when a suspicious event is identified?',
              sq: 'Kush është përgjegjës për rishikimin e alarmeve të sigurisë, dhe cili është procesi i reagimit kur identifikohet një ngjarje e dyshimtë?'
            },
            references: { iso27001: 'A.8.15, A.8.16', iso27002: '8.15 Logging; 8.16 Monitoring activities', nis2: 'Art. 21(2)(b) Incident handling', cis: 'CIS 8' }
          },
          {
            id: 'Q41', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Are email security controls in place, including sender authentication (SPF, DKIM, DMARC) and anti-phishing / anti-spam filtering?',
              sq: 'A janë kontrollet e sigurisë së emailit në vend, duke përfshirë autentikimin e dërguesit (SPF, DKIM, DMARC) dhe filtrimin anti-phishing / anti-spam?'
            },
            goodPractice: {
              en: [
                'SPF, DKIM, and DMARC records published and correctly configured for all sending domains',
                'DMARC policy set to quarantine or reject, with an active reporting address for ongoing monitoring',
                'Anti-spam and anti-phishing filtering active on inbound email, with regular review of quarantine releases',
                'Staff trained to recognise and report phishing and suspicious emails through a defined channel',
                'Links and attachments in email scanned before or upon delivery where technically feasible'
              ],
              sq: [
                'Rekordet SPF, DKIM dhe DMARC të publikuara dhe të konfiguruara saktë për të gjitha domenet dërguese',
                'Politika DMARC e vendosur në karantinë ose refuzim, me adresë aktive raportimi për monitorim të vazhdueshëm',
                'Filtrimi anti-spam dhe anti-phishing aktiv në emailin hyrës, me rishikim të rregullt të lirimeve nga karantina',
                'Stafi i trajnuar për të njohur dhe raportuar phishing dhe emaile të dyshimta nëpërmjet një kanali të përcaktuar',
                'Lidhjet dhe bashkëngjitjet në email skanuar para ose gjatë dërgimit ku është teknikisht e realizueshme'
              ]
            },
            followUp: {
              en: 'Has DMARC enforcement been validated end-to-end, and are DMARC aggregate reports being reviewed to detect spoofing attempts?',
              sq: 'A është validuar zbatimi i DMARC-it nga fundi në fund, dhe a rishikohen raportet agregate të DMARC-it për të zbuluar përpjekje mashtrimi?'
            },
            references: { iso27001: 'A.8.20, A.5.14', iso27002: '8.20 Networks security; 5.14 Information transfer', nis2: 'Art. 21(2)(g) Cyber hygiene', cis: 'CIS 9' }
          },
          {
            id: 'Q47', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Is there a formal IT change management process — with requests, approvals, testing, and rollback procedures — covering both infrastructure and application changes?',
              sq: 'A ka një proces formal të menaxhimit të ndryshimeve IT — me kërkesa, miratime, testim dhe procedura kthimi prapa — që mbulon si ndryshimet e infrastrukturës ashtu edhe ndryshimet e aplikacioneve?'
            },
            goodPractice: {
              en: [
                'A documented change management process requiring formal request, impact assessment, and approval before any change is implemented in production',
                'Changes tested in a non-production environment before deployment, with acceptance criteria defined',
                'Rollback procedures documented and verified for each significant change',
                'Emergency/expedited change procedure in place for urgent fixes, with retrospective review',
                'A change log maintained with records of who approved, tested, and deployed each change'
              ],
              sq: [
                'Proces i dokumentuar i menaxhimit të ndryshimeve që kërkon kërkesë zyrtare, vlerësim ndikimi dhe miratim para zbatimit të çdo ndryshimi në prodhim',
                'Ndryshimet testohen në një mjedis jo-prodhues para vendosjes, me kritere pranimi të përcaktuara',
                'Procedurat e kthimit prapa të dokumentuara dhe të verifikuara për çdo ndryshim të rëndësishëm',
                'Procedurë ndryshimi urgjent/i përshpejtuar në vend për rregullime të ngutshme, me rishikim retrospektiv',
                'Regjistër ndryshimesh i mirëmbajtur me regjistrime se kush miratoi, testoi dhe vendosi çdo ndryshim'
              ]
            },
            followUp: {
              en: 'How are emergency changes handled, and how are they retrospectively reviewed to ensure the change management process is not systematically bypassed?',
              sq: 'Si trajtohen ndryshimet urgjente, dhe si rishikohen retrospektivisht për të siguruar që procesi i menaxhimit të ndryshimeve të mos anashkalohet sistematikisht?'
            },
            references: { iso27001: 'A.8.32', iso27002: '8.32 Change management', nis2: 'Art. 21(2)(e)', cis: 'CIS 4.1, CIS 7.4' }
          },
          {
            id: 'Q48', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Are secure protocols enforced across the organisation (TLS 1.2+/1.3, HTTPS), and have legacy insecure protocols such as Telnet, FTP, and SNMPv1 been disabled?',
              sq: 'A zbatohen protokollet e sigurta në të gjithë organizatën (TLS 1.2+/1.3, HTTPS), dhe a janë çaktivizuar protokollet e vjetëruara të pasigurta si Telnet, FTP dhe SNMPv1?'
            },
            goodPractice: {
              en: [
                'TLS 1.2 or 1.3 enforced for all internal and external web-based services; TLS 1.0 and 1.1 disabled',
                'HTTPS enforced for all externally accessible web applications and services, with HTTP-to-HTTPS redirect and HSTS headers configured',
                'Telnet, FTP, SNMPv1/v2c, and other cleartext management protocols disabled on all network devices and servers where they are not operationally required',
                'A protocol audit or configuration baseline review performed periodically to identify and remediate non-compliant configurations',
                'Encrypted alternatives (SFTP/SCP, SSH, SNMPv3) used wherever a cleartext protocol would otherwise be needed'
              ],
              sq: [
                'TLS 1.2 ose 1.3 i zbatuar për të gjitha shërbimet e bazuara në web të brendshme dhe të jashtme; TLS 1.0 dhe 1.1 të çaktivizuara',
                'HTTPS i zbatuar për të gjitha aplikacionet dhe shërbimet web të aksesueshme nga jashtë, me ridrejtim HTTP-në-HTTPS dhe headers HSTS të konfiguruara',
                'Telnet, FTP, SNMPv1/v2c dhe protokollet e tjera të menaxhimit të tekstit të qartë çaktivizuara në të gjitha pajisjet e rrjetit dhe serverët ku nuk kërkohen operacionalisht',
                'Auditim protokolli ose rishikim i bazës së konfigurimit kryer periodikisht për të identifikuar dhe korrigjuar konfigurime jo-konforme',
                'Alternativa të enkriptuara (SFTP/SCP, SSH, SNMPv3) të përdorura kudo ku ndryshe do të nevojitej protokoll i tekstit të qartë'
              ]
            },
            followUp: {
              en: 'Has a network scan or configuration audit confirmed that no cleartext management protocols are exposed on the internal network or internet-facing interfaces?',
              sq: 'A ka konfirmuar një skanim rrjeti ose auditim konfigurimi se asnjë protokoll menaxhimi tekst të qartë nuk është i ekspozuar në rrjetin e brendshëm ose ndërfaqet e hapura ndaj internetit?'
            },
            references: { iso27001: 'A.8.21', iso27002: '8.21 Security of network services', nis2: 'Art. 21(2)(j)', cis: 'CIS 12.6' }
          },
          {
            id: 'Q49', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Is web filtering in place to block access to malicious or high-risk web categories, and are browsers hardened against common attack vectors?',
              sq: 'A ka filtrimi i uebit në vend për të bllokuar aksesin në kategori maliciozë ose me risk të lartë të uebit, dhe a janë shfletuesit e ngurtësuar kundër vektorëve të zakonshëm të sulmit?'
            },
            goodPractice: {
              en: [
                'A web proxy or DNS-based filtering solution in place that blocks known-malicious domains and high-risk categories (e.g. malware distribution, phishing, command-and-control sites)',
                'Browser policies configured centrally to disable or restrict high-risk features (e.g. unwanted extensions, automatic downloads, Java applets)',
                'Browsers kept up to date with security patches applied promptly, ideally via automated update or centralised management',
                'HTTPS inspection or equivalent visibility into encrypted web traffic where technically feasible and legally permissible'
              ],
              sq: [
                'Zgjidhje filtrimi e bazuar në proxy web ose DNS në vend që bllokon domenet me keqdashje të njohura dhe kategoritë me risk të lartë (p.sh. shpërndarja e malware, phishing, sitet e komandës dhe kontrollit)',
                'Politika shfletuesi të konfiguruara centralisht për të çaktivizuar ose kufizuar veçoritë me risk të lartë (p.sh. shtesa të padëshiruara, shkarkime automatike, Java applets)',
                'Shfletuesit mbahen të përditësuar me patch-e sigurie të zbatuara menjëherë, mundësisht nëpërmjet përditësimit automatik ose menaxhimit të centralizuar',
                'Inspektimi HTTPS ose dukshmëri ekuivalente në trafikun e uebit të enkriptuar ku është teknikisht e realizueshme dhe ligjërisht e lejueshme'
              ]
            },
            followUp: {
              en: 'Are web filtering logs reviewed to identify repeat policy violations or signs of malware communication, and is there a process for handling violations?',
              sq: 'A rishikohen regjistrat e filtrimit të uebit për të identifikuar shkelje të përsëritura të politikës ose shenja të komunikimit të malware, dhe a ka një proces për trajtimin e shkeljeve?'
            },
            references: { iso27001: 'A.8.23', iso27002: '8.23 Web filtering', nis2: 'Art. 21(2)(g)', cis: 'CIS 9.3, CIS 4.8' }
          },
          {
            id: 'Q56', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Are collaboration and communications platforms (voice, video, instant messaging, and file sharing) formally approved, encrypted, and access-controlled?',
              sq: 'A janë platformat e bashkëpunimit dhe komunikimit (zanore, video, mesazhe të çastit dhe ndarje skedarësh) të miratuar zyrtarisht, të enkriptuara dhe me kontroll aksesi?'
            },
            goodPractice: {
              en: [
                'An approved list of collaboration and communications tools, covering voice, video, text/instant messaging, and file sharing; unsanctioned shadow-IT tools are prohibited',
                'Approved tools use end-to-end or transport encryption; use of unencrypted communication channels for business content is prohibited',
                'Access to communications platforms controlled via organisational accounts with MFA, not personal accounts',
                'Retention and data handling policies defined for communications platforms, aligned with legal obligations and data classification',
                'Guest/external participant access scoped to the minimum required, with controls to prevent unintended data sharing'
              ],
              sq: [
                'Listë e miratuar e mjeteve të bashkëpunimit dhe komunikimit, që mbulon zanore, video, tekst/mesazhe të çastit dhe ndarje skedarësh; mjetet e shadow-IT të pasanksionuara janë të ndaluara',
                'Mjetet e miratuara përdorin enkriptim nga fundi-në-fund ose transport; përdorimi i kanaleve të komunikimit të pakriptuara për përmbajtje biznesi është i ndaluar',
                'Aksesi në platformat e komunikimit kontrollohet nëpërmjet llogarive organizative me MFA, jo llogarive personale',
                'Politikat e mbajtjes dhe trajtimit të të dhënave të përcaktuara për platformat e komunikimit, të harmonizuara me detyrimet ligjore dhe klasifikimin e të dhënave',
                'Aksesi i mysafirëve/pjesëmarrësve të jashtëm i kufizuar në minimumin e nevojshëm, me kontrolle për të parandaluar ndarjen e paqëllimtë të të dhënave'
              ]
            },
            followUp: {
              en: 'Is there a process to identify and block the use of unsanctioned communications tools, and has shadow-IT messaging use been assessed?',
              sq: 'A ka një proces për identifikimin dhe bllokimin e përdorimit të mjeteve të komunikimit të pasanksionuara, dhe a është vlerësuar përdorimi i mesazheve shadow-IT?'
            },
            references: { iso27001: 'A.8.20, A.8.21', iso27002: '8.20 Networks security; 8.21 Security of network services', nis2: 'Art. 21(2)(j) Secured voice/video/text communications', cis: 'CIS 9, CIS 12' }
          },
          {
            id: 'Q58', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Is intrusion detection / network threat monitoring in place, providing near-real-time alerting on anomalous or malicious activity, with defined response procedures — beyond basic log collection?',
              sq: 'A ka zbulim ndërhyrjesh / monitorim kërcënimesh të rrjetit në vend, duke siguruar alarmim afër-real-time mbi aktivitetin anomal ose keqdashës, me procedura reagimi të përcaktuara — përtej mbledhjes bazike të regjistrave?'
            },
            goodPractice: {
              en: [
                'An IDS/IPS or network threat detection solution monitoring critical network segments, not only perimeter traffic',
                'Anomaly detection or behavioural analytics capable of identifying lateral movement, unusual data volumes, and credential abuse',
                'Alerts triaged and responded to in near-real-time by a defined owner or SOC function; alerting SLAs defined',
                'IDS/IPS signatures and detection rules kept up to date and tuned to reduce false-positive noise',
                'Threat detection findings integrated into the incident management process with documented escalation and response procedures'
              ],
              sq: [
                'Zgjidhje IDS/IPS ose zbulimi kërcënimesh të rrjetit që monitoron segmente kritike të rrjetit, jo vetëm trafikun e perimetrit',
                'Zbulim anomalish ose analitikë sjelljeje i aftë të identifikojë lëvizje anësore, vëllime të pazakonta të dhënash dhe abuzim kredencialesh',
                'Alarmet e triazhura dhe të reaguar afër-real-time nga një pronar ose funksion SOC i përcaktuar; SLA-të e alarmimit të përcaktuara',
                'Nënshkrimet IDS/IPS dhe rregullat e zbulimit mbahen të përditësuara dhe të akordura për të reduktuar zhurmën false-positive',
                'Gjetjet e zbulimit të kërcënimeve integrohen në procesin e menaxhimit të incidenteve me procedura eskalimi dhe reagimi të dokumentuara'
              ]
            },
            followUp: {
              en: 'How are IDS/IPS alerts reviewed and acted on — is there a defined SLA for responding to high-severity network threat alerts, and who is responsible?',
              sq: 'Si rishikohen dhe veprimet ndaj alarmeve IDS/IPS — a ka SLA të përcaktuar për reagimin ndaj alarmeve të kërcënimeve të rrjetit me ashpërsi të lartë, dhe kush është përgjegjës?'
            },
            references: { iso27001: 'A.8.16', iso27002: '8.16 Monitoring activities', nis2: 'Art. 21(2)(b)', cis: 'CIS 13.3, CIS 13.7' }
          }
        ]
      },
      {
        id: 'data',
        title: {
          en: 'Information systems & data management',
          sq: 'Sistemet e informacionit dhe menaxhimi i të dhënave'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q23', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'How are user workstations managed — patching, admin rights, usage rules, and screen locking?',
              sq: 'Si menaxhohen stacionet e punës të përdoruesve — patch-imi, të drejtat admin, rregullat e përdorimit dhe bllokimi i ekranit?'
            },
            goodPractice: {
              en: [
                'Operating system and software kept current with security updates',
                'Local admin rights restricted, not granted to standard users by default',
                'A documented acceptable-use policy for IT equipment',
                'Workstations auto-lock after a short period of inactivity, and users lock manually when stepping away'
              ],
              sq: [
                'Sistemi operativ dhe softueri mbahen të përditësuar me përditësimet e sigurisë',
                'Të drejtat admin lokale të kufizuara, jo të dhëna si parazgjedhje për përdoruesit standardë',
                'Politikë e dokumentuar e përdorimit të pranueshëm për pajisjet IT',
                'Stacionet e punës bllokohen automatikisht pas një periudhe të shkurtër mosaktiviteti, dhe përdoruesit i bllokojnë manualisht kur largohen'
              ]
            },
            followUp: {
              en: 'Is patching automated/centrally managed, or does it depend on individual users?',
              sq: 'A është patch-imi i automatizuar/i menaxhuar centralisht, apo varet nga përdoruesit individualë?'
            },
            references: { iso27001: 'A.8.1, A.8.9, A.8.2', iso27002: '8.1 User endpoint devices; 8.9 Configuration management; 8.2 Privileged access rights', nis2: 'Art. 21(2)(g) Cyber hygiene', cis: 'CIS 4.1, CIS 4.3' }
          },
          {
            id: 'Q24', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'What is the process for patching and updating servers?',
              sq: 'Cili është procesi për patch-imin dhe përditësimin e serverëve?'
            },
            goodPractice: {
              en: [
                'Servers patched on a defined, periodic cycle, with expedited handling for critical security patches',
                'Patches tested before deployment to production where feasible',
                'An inventory of server software/firmware versions to identify what\'s out of date'
              ],
              sq: [
                'Serverët e patch-uar në një cikël periodik të përcaktuar, me trajtim të përshpejtuar për patch-et kritike të sigurisë',
                'Patch-et testohen para vendosjes në prodhim kur është e realizueshme',
                'Inventar i versioneve të software-it/firmware-it të serverëve për të identifikuar ato të vjetëruara'
              ]
            },
            followUp: {
              en: 'How long, on average, between a critical patch release and its deployment to production servers?',
              sq: 'Sa kohë, mesatarisht, midis lëshimit të një patch-i kritik dhe vendosjes së tij në serverët e prodhimit?'
            },
            references: { iso27001: 'A.8.8, A.8.19', iso27002: '8.8 Management of technical vulnerabilities; 8.19 Installation of software on operational systems', nis2: 'Art. 21(2)(c) Vulnerability handling', cis: 'CIS 7.3, CIS 7.4' }
          },
          {
            id: 'Q25', kind: 'standard', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'How is malware protection managed across the estate, including mobile devices?',
              sq: 'Si menaxhohet mbrojtja ndaj malware-it në të gjithë parkun e pajisjeve, duke përfshirë pajisjet mobile?'
            },
            goodPractice: {
              en: [
                'Anti-malware deployed and centrally managed, with up-to-date signatures/detection engines',
                'Coverage extends to mobile devices (smartphones, laptops), not just desktop endpoints',
                'Regular scans scheduled, with alerts routed to someone who acts on them'
              ],
              sq: [
                'Software anti-malware i vendosur dhe i menaxhuar centralisht, me nënshkrime/motorë zbulimi të përditësuara',
                'Mbulimi shtrihet në pajisjet mobile (smartphone, laptop), jo vetëm pikë fundore desktop',
                'Skanime të rregullta të planifikuara, me alarme të drejtëzuara tek dikush që vepron mbi to'
              ]
            },
            followUp: {
              en: 'Who reviews malware alerts, and what\'s the response process when something is detected?',
              sq: 'Kush rishikon alarmet e malware-it, dhe cili është procesi i reagimit kur diçka zbulohet?'
            },
            references: { iso27001: 'A.8.7', iso27002: '8.7 Protection against malware', nis2: 'Art. 21(2)(g) Cyber hygiene', cis: 'CIS 10' }
          },
          {
            id: 'Q26', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: {
              en: 'How are backups managed — scope, frequency, retention, isolation, offsite copies, and restoration testing?',
              sq: 'Si menaxhohen rezervat — shtrirja, frekuenca, mbajtja, izolimi, kopjet jashtë selisë dhe testimi i rimëkëmbjes?'
            },
            goodPractice: {
              en: [
                'Backup scope covers all business-relevant data (excluding purely private files)',
                'A defined backup frequency matching business tolerance for data loss (RPO)',
                'A defined retention period matching business tolerance for how far back recovery must reach',
                'Backups disconnected/isolated from the production network after completion (protection against ransomware propagation)',
                'At least one copy stored off-site or in a separate environment, at a meaningful distance/isolation from the primary site',
                'Restoration tested periodically — a backup that has never been restored is not a verified backup'
              ],
              sq: [
                'Shtrirja e rezervave mbulon të gjitha të dhënat e rëndësishme për biznesin (duke përjashtuar skedarët plotësisht privatë)',
                'Një frekuencë e rezervave e përcaktuar që përputhet me tolerancën e biznesit ndaj humbjes së të dhënave (RPO)',
                'Një periudhë mbajtjeje e përcaktuar që përputhet me tolerancën e biznesit sa larg duhet arritur rimëkëmbja',
                'Rezervat shkëputen dhe izolohen nga rrjeti i prodhimit pas përfundimit (mbrojtje nga përhapja e ransomware)',
                'Të paktën një kopje e ruajtur jashtë selisë ose në një mjedis të ndarë, në një distancë/izolim kuptimplotë nga siti primar',
                'Rimëkëmbja testohet periodikisht — një rezervë që nuk është rimëkëmbur kurrë nuk është rezervë e verifikuar'
              ]
            },
            followUp: {
              en: 'When was a full restoration last tested, and how long did it take?',
              sq: 'Kur u testua për herë të fundit rimëkëmbja e plotë, dhe sa kohë mori?'
            },
            references: { iso27001: 'A.8.13', iso27002: '8.13 Information backup', nis2: 'Art. 21(2)(c) Backup management and disaster recovery', cis: 'CIS 11' }
          },
          {
            id: 'Q27', kind: 'standard', threatIndicator: 2, weight: 1, critical: false,
            text: {
              en: 'How are physical documents stored and destroyed, and is a clear-desk practice in place?',
              sq: 'Si ruhen dhe shkatërrohen dokumentet fizike, dhe a është vendosur praktika e deskut të pastër?'
            },
            goodPractice: {
              en: [
                'Documents stored in lockable cabinets when not in active use',
                'A clear-desk policy in place: no confidential material left visible outside working hours',
                'Confidential documents securely destroyed (shredding or equivalent) before disposal'
              ],
              sq: [
                'Dokumentet ruhen në kabinete të kyçshme kur nuk janë në përdorim aktiv',
                'Politikë e deskut të pastër e vendosur: asnjë material konfidencial i lënë i dukshëm jashtë orarit të punës',
                'Dokumentet konfidenciale shkatërrohen në mënyrë të sigurt (copëtim ose ekuivalent) para asgjësimit'
              ]
            },
            followUp: {
              en: 'Is the clear-desk policy spot-checked, or is it assumed compliance?',
              sq: 'A kontrollohet rastësisht politika e deskut të pastër, apo supozohet pajtueshmëria?'
            },
            references: { iso27001: 'A.7.10, A.5.10, A.7.7', iso27002: '7.10 Storage media; 5.10 Acceptable use of information and other assets; 7.7 Clear desk and clear screen', cis: 'CIS 3.5' }
          },
          {
            id: 'Q28', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Is the use of personal devices for work (BYOD) explicitly governed, and is there an inventory of authorised devices?',
              sq: 'A qeveriset shprehimisht përdorimi i pajisjeve personale për punë (BYOD), dhe a ka inventar të pajisjeve të autorizuara?'
            },
            goodPractice: {
              en: [
                'A documented BYOD policy defining what\'s permitted (e.g. email access only vs. full data access)',
                'Minimum security baseline required for personal devices (e.g. screen lock, encryption, OS currency)',
                'An inventory of authorised personal devices connecting to company resources',
                'A process to revoke company data access from a personal device when an employee leaves'
              ],
              sq: [
                'Politikë e dokumentuar BYOD që përcakton çfarë lejohet (p.sh. vetëm akses email vs. akses i plotë të dhënash)',
                'Bazë minimale sigurie e kërkuar për pajisjet personale (p.sh. bllokim ekrani, kriptim, sistem operativ i përditësuar)',
                'Inventar i pajisjeve personale të autorizuara që lidhen me burimet e kompanisë',
                'Një proces për revokim të aksesit të të dhënave të kompanisë nga pajisja personale kur një punonjës largohet'
              ]
            },
            followUp: {
              en: 'Can the company remotely wipe company data from a personal device if needed?',
              sq: 'A mund të fshijë kompania nga distanca të dhënat e saj nga pajisja personale nëse nevojitet?'
            },
            references: { iso27001: 'A.6.7, A.8.1', iso27002: '6.7 Remote working; 8.1 User endpoint devices', nis2: 'Art. 21(2)(i)', cis: 'CIS 1.1, CIS 4' }
          },
          {
            id: 'Q29', kind: 'standard', threatIndicator: 4, weight: 1, critical: true,
            text: {
              en: 'Is there a policy governing cryptography/encryption, and is it applied when sending confidential data by email?',
              sq: 'A ekziston një politikë qeverisëse e kriptografisë/enkriptimit, dhe a zbatohet ajo kur dërgohen të dhëna konfidenciale me email?'
            },
            goodPractice: {
              en: [
                'A documented policy on when and how encryption is used (cryptography policy, per NIS2 Art. 21(2)(h))',
                'Confidential data is never sent unencrypted by email',
                'Where encryption keys/passwords are needed, they are transmitted via a different channel than the protected data itself'
              ],
              sq: [
                'Politikë e dokumentuar mbi kur dhe si përdoret enkriptimi (politikë kriptografie, sipas NIS2 Neni 21(2)(h))',
                'Të dhënat konfidenciale nuk dërgohen kurrë të pakriptuara me email',
                'Kur nevojiten çelësa/fjalëkalime enkriptimi, ato transmetohen nëpërmjet një kanali të ndryshëm nga të dhënat e mbrojtura'
              ]
            },
            followUp: {
              en: 'Is encryption enforced technically (e.g. automatic email encryption) or does it rely on user discipline?',
              sq: 'A zbatohet enkriptimi teknikisht (p.sh. enkriptim automatik i emailit) apo mbështetet tek disiplina e përdoruesit?'
            },
            references: { iso27001: 'A.8.24, A.5.14', iso27002: '8.24 Use of cryptography; 5.14 Information transfer', nis2: 'Art. 21(2)(h) Cryptography and encryption policies', cis: 'CIS 3.10' }
          },
          {
            id: 'Q30', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'How is hardware disposal managed to ensure data cannot be recovered from retired equipment?',
              sq: 'Si menaxhohet asgjësimi i hardware-it për të siguruar që të dhënat nuk mund të rimëkëmben nga pajisjet e pensionuara?'
            },
            goodPractice: {
              en: [
                'Equipment that has stored confidential data is securely wiped or physically destroyed before disposal/recycling',
                'A documented disposal procedure, ideally with a certificate of destruction for sensitive media',
                'Process applies to all media types: laptops, servers, drives, photocopiers/printers with internal storage, USB drives'
              ],
              sq: [
                'Pajisjet që kanë ruajtur të dhëna konfidenciale fshihen në mënyrë të sigurt ose shkatërrohen fizikisht para asgjësimit/riciklimit',
                'Procedurë e dokumentuar asgjësimi, mundësisht me certifikatë shkatërrimi për mediat e ndjeshme',
                'Procesi zbatohet për të gjitha llojet e mediave: laptopë, serverë, drive-ra, fotokopjues/printerë me memorje të brendshme, drive-ra USB'
              ]
            },
            followUp: {
              en: 'Is disposal handled in-house or by a certified third party, and is there proof of destruction?',
              sq: 'A trajtohet asgjësimi brenda kompanisë apo nga një palë e tretë e çertifikuar, dhe a ka dëshmi shkatërrimi?'
            },
            references: { iso27001: 'A.7.10, A.7.14', iso27002: '7.10 Storage media; 7.14 Secure disposal or re-use of equipment', cis: 'CIS 3.5' }
          },
          {
            id: 'Q37', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Where software is developed in-house or customised, is a secure development lifecycle followed?',
              sq: 'Kur softueri zhvillohet brenda kompanisë ose personalizohet, a ndiqet një cikël i zhvillimit të sigurt?'
            },
            goodPractice: {
              en: [
                'Security requirements considered at the design stage, not bolted on afterward',
                'Code review and/or static analysis before deployment',
                'Separate development, test, and production environments',
                'Dependencies/libraries tracked and updated for known vulnerabilities'
              ],
              sq: [
                'Kërkesat e sigurisë të konsideruara në fazën e projektimit, jo të shtuara pas faktit',
                'Rishikim kodi dhe/ose analizë statike para vendosjes',
                'Mjedise të ndara zhvillimi, testimi dhe prodhimi',
                'Varësite/bibliotekat e gjurmuara dhe të përditësuara për dobësi të njohura'
              ]
            },
            followUp: {
              en: 'If this doesn\'t apply (no in-house development), confirm and skip — otherwise, what testing happens before code reaches production?',
              sq: 'Nëse kjo nuk zbatohet (asnjë zhvillim i brendshëm), konfirmoni dhe kapërceni — përndryshe, çfarë testimi ndodh para se kodi të arrijë në prodhim?'
            },
            references: { iso27001: 'A.8.25, A.8.28', iso27002: '8.25 Secure development life cycle; 8.28 Secure coding', nis2: 'Art. 21(3) Secure development procedures', cis: 'CIS 16' }
          },
          {
            id: 'Q42', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Is cloud service usage formally governed, with approved providers, understood shared-responsibility boundaries, and periodic security configuration reviews?',
              sq: 'A qeveriset zyrtarisht përdorimi i shërbimeve cloud, me ofrues të miratuar, kufij të kuptuar të përgjegjësisë së ndarë dhe rishikime periodike të konfigurimit të sigurisë?'
            },
            goodPractice: {
              en: [
                'An approved list or sanctioning process for cloud service providers, covering data classification suitability',
                'The shared-responsibility model is understood for each major cloud service: what the provider secures vs. what the organisation must configure',
                'Security configurations reviewed periodically against provider hardening guides or recognised benchmarks (e.g. CIS Benchmarks for cloud platforms)',
                'Data residency, jurisdiction, and data-transfer obligations (e.g. GDPR Chapter V transfers) considered before cloud adoption',
                'Contractual security requirements in place with cloud providers, including provisions for data return and deletion on exit'
              ],
              sq: [
                'Listë e miratuar ose proces sanksionimi për ofruesit e shërbimeve cloud, duke mbuluar përshtatshmërinë e klasifikimit të të dhënave',
                'Modeli i përgjegjësisë së ndarë i kuptuar për secilin shërbim kryesor cloud: çfarë siguron ofruesi vs. çfarë duhet të konfigurojë organizata',
                'Konfigurimet e sigurisë rishikohen periodikisht sipas udhëzuesve të ngurtësimit të ofruesit ose standardeve të njohura (p.sh. CIS Benchmarks për platformat cloud)',
                'Vendbanimi i të dhënave, juridiksioni dhe detyrimet e transferimit të të dhënave (p.sh. transferimet e Kapitullit V të GDPR) të konsideruara para adoptimit cloud',
                'Kërkesat kontraktuale të sigurisë në vend me ofruesit cloud, duke përfshirë dispozita për kthimin dhe fshirjen e të dhënave pas largimit'
              ]
            },
            followUp: {
              en: 'Is there a comprehensive list of all cloud services in use, including those adopted informally by individual teams or staff?',
              sq: 'A ka një listë gjithëpërfshirëse të të gjitha shërbimeve cloud në përdorim, duke përfshirë ato të adoptuar joformalisht nga ekipe ose staf individual?'
            },
            references: { iso27001: 'A.5.23', iso27002: '5.23 Information security for use of cloud services', nis2: 'Art. 21(2)(d) Supply chain security', cis: 'CIS 15, CIS 3' }
          },
          {
            id: 'Q43', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: {
              en: 'Are data leakage prevention (DLP) controls in place to restrict the unauthorised transfer of sensitive data outside approved channels?',
              sq: 'A janë kontrollet e parandalimit të rrjedhjes së të dhënave (DLP) në vend për të kufizuar transferimin e paautorizuar të të dhënave të ndjeshme jashtë kanaleve të miratuara?'
            },
            goodPractice: {
              en: [
                'Data classification drives DLP controls, so protection is proportionate to the sensitivity of the information handled',
                'Technical controls restrict or alert on transfer of sensitive data via email, USB, cloud storage, or unsanctioned messaging tools',
                'Policy prohibits upload of confidential information to personal cloud storage or unsanctioned external accounts',
                'DLP alerts are reviewed and acted upon in a timely manner by a defined owner'
              ],
              sq: [
                'Klasifikimi i të dhënave nxit kontrollet DLP, kështu mbrojtja është proporcionale ndaj ndjeshmërisë së informacionit të trajtuar',
                'Kontrolle teknike kufizojnë ose alarmojnë transferimin e të dhënave të ndjeshme nëpërmjet emailit, USB, ruajtjes cloud ose mjeteve të mesazheve të pasanksionuara',
                'Politika ndalon ngarkimin e informacionit konfidencial në ruajtje cloud personale ose llogari të jashtme të pasanksionuara',
                'Alarmet DLP rishikohen dhe merren masa në kohën e duhur nga një pronar i përcaktuar'
              ]
            },
            followUp: {
              en: 'Are DLP controls enforced technically, or does compliance rely primarily on user awareness and policy alone?',
              sq: 'A zbatohen kontrollet DLP teknikisht, apo pajtueshmëria mbështetet kryesisht tek ndërgjegjësimi i përdoruesit dhe politika?'
            },
            references: { iso27001: 'A.8.12', iso27002: '8.12 Data leakage prevention', nis2: 'Art. 21(2)(h)', cis: 'CIS 3.13' }
          },
          {
            id: 'Q52', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Are security requirements defined before acquiring commercial software or cloud services, and is security assessed as part of the selection process?',
              sq: 'A përcaktohen kërkesat e sigurisë para blerjes së softuerit komercial ose shërbimeve cloud, dhe a vlerësohet siguria si pjesë e procesit të përzgjedhjes?'
            },
            goodPractice: {
              en: [
                'A documented process for capturing security and data-protection requirements before initiating any software or SaaS procurement',
                'Security evaluation criteria included in RFPs and vendor assessments — covering data handling, encryption, access control, incident notification, and certifications',
                'Vendor security documentation (e.g. ISO 27001 certificate, SOC 2 report, penetration test summary) reviewed before contracting',
                'Security requirements flowed down into the contract or terms of service',
                'Post-procurement security configuration review performed before the product goes live in the production environment'
              ],
              sq: [
                'Proces i dokumentuar për kapjen e kërkesave të sigurisë dhe mbrojtjes së të dhënave para inicimit të çdo prokurimi softueri ose SaaS',
                'Kriteret e vlerësimit të sigurisë të përfshira në RFP-të dhe vlerësimet e furnitorëve — që mbulojnë trajtimin e të dhënave, enkriptimin, kontrollin e aksesit, njoftimin e incidenteve dhe certifikimet',
                'Dokumentacioni i sigurisë së furnitorëve (p.sh. certifikata ISO 27001, raporti SOC 2, përmbledhja e testit të depërtimit) rishikuar para kontraktimit',
                'Kërkesat e sigurisë të transferuara në kontratë ose kushtet e shërbimit',
                'Rishikim i konfigurimit të sigurisë pas prokurimit kryer para se produkti të funksionojë në mjedisin e prodhimit'
              ]
            },
            followUp: {
              en: 'What security due-diligence was performed before your most recently adopted software or SaaS platform was contracted — who reviewed it and what did they assess?',
              sq: 'Çfarë due-diligence sigurie u krye para kontraktimit të softuerit ose platformës SaaS të adoptuar së fundmi — kush e rishikoi dhe çfarë vlerësoi?'
            },
            references: { iso27001: 'A.8.26, A.8.27', iso27002: '8.26 Application security requirements; 8.27 Secure system architecture and engineering principles', nis2: 'Art. 21(2)(e)', cis: 'CIS 16.1' }
          },
          {
            id: 'Q53', kind: 'new', threatIndicator: 3, weight: 1.0, critical: false,
            text: {
              en: 'Is there an authorised software inventory, and is the installation of unauthorised or shadow-IT software controlled and monitored?',
              sq: 'A ka inventar të softuerit të autorizuar, dhe a kontrollohet e monitorohet instalimi i softuerit të paautorizuar ose shadow-IT?'
            },
            goodPractice: {
              en: [
                'A maintained inventory of authorised software for each device class or role, used as the baseline for detecting non-compliant installations',
                'Technical controls (application whitelisting, endpoint management policy, or MDM) to prevent or alert on unauthorised software installation',
                'A defined approval process for staff requesting new software — covering security review, licensing, and compatibility checks',
                'Regular scanning or reconciliation of installed software against the authorised inventory to identify and remediate shadow-IT',
                'Staff aware that installing unapproved software is a policy violation, communicated via acceptable use policy'
              ],
              sq: [
                'Inventar i mirëmbajtur i softuerit të autorizuar për çdo klasë pajisje ose rol, i përdorur si bazë për zbulimin e instalimeve jo-konforme',
                'Kontrolle teknike (whitelisting aplikacionesh, politikë menaxhimi pikash fundore ose MDM) për të parandaluar ose alarmuar instalimin e softuerit të paautorizuar',
                'Proces i përcaktuar miratimi për stafin që kërkon softuer të ri — që mbulon rishikimin e sigurisë, licencimin dhe kontrollet e përputhshmërisë',
                'Skanim ose pajtim i rregullt i softuerit të instaluar me inventarin e autorizuar për të identifikuar dhe korrigjuar shadow-IT',
                'Stafi i ndërgjegjshëm se instalimi i softuerit të pamilëfshëm është shkelje e politikës, komunikuar nëpërmjet politikës së përdorimit të pranueshëm'
              ]
            },
            followUp: {
              en: 'Has a scan of installed software been performed recently — were any unauthorised applications found, and if so, how were they handled?',
              sq: 'A është kryer kohët e fundit një skanim i softuerit të instaluar — a u gjetën ndonjë aplikacion i paautorizuar, dhe nëse po, si u trajtuan?'
            },
            references: { iso27001: 'A.5.9', iso27002: '5.9 Inventory of information and other associated assets', nis2: 'Art. 21(2)(i)', cis: 'CIS 2.1, CIS 2.5' }
          }
        ]
      },
      {
        id: 'incident',
        title: {
          en: 'Incident management & business continuity',
          sq: 'Menaxhimi i incidenteve dhe vazhdimësia e biznesit'
        },
        customSlots: 2,
        questions: [
          {
            id: 'Q31', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: {
              en: 'Is there a defined incident management process, and do staff know how to report a suspected incident?',
              sq: 'A ka një proces të përcaktuar menaxhimi të incidenteve, dhe a dinë punonjësit si të raportojnë një incident të dyshuar?'
            },
            goodPractice: {
              en: [
                'Staff have one or more clear contacts for reporting a suspected incident, with a backup contact for absences',
                'Staff know basic do\'s and don\'ts when an attack is suspected (e.g. don\'t power off a compromised machine, don\'t pay a ransom, isolate but preserve evidence)',
                'A defined process to classify incident severity and trigger escalation',
                'Awareness of external reporting obligations where applicable (NIS2 Art. 23: early warning within 24h, incident notification within 72h, for in-scope entities)'
              ],
              sq: [
                'Stafi ka një ose më shumë kontakte të qarta për raportimin e një incidenti të dyshuar, me kontakt rezervë për mungesat',
                'Stafi njeh rregullat bazë kur dyshohet një sulm (p.sh. mos e fikni një makinë të kompromentuar, mos paguani shpërblim, izoloni por ruani provat)',
                'Një proces i përcaktuar për klasifikimin e ashpërsisë së incidentit dhe aktivizimin e eskalimit',
                'Ndërgjegjësim mbi detyrimet e raportimit të jashtëm kur zbatohet (NIS2 Neni 23: paralajmërim i hershëm brenda 24h, njoftim incidenti brenda 72h, për entitetet e përfshira)'
              ]
            },
            followUp: {
              en: 'Has this process been exercised (tabletop or live), and when?',
              sq: 'A është ushtruar ky proces (simulim në tavolinë ose live), dhe kur?'
            },
            references: { iso27001: 'A.5.24, A.5.25, A.6.8', iso27002: '5.24 Information security incident management planning; 5.25 Assessment and decision on information security events; 6.8 Information security event reporting', nis2: 'Art. 21(2)(b) Incident handling; Art. 23 Reporting obligations', cis: 'CIS 17' }
          },
          {
            id: 'Q32', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: {
              en: 'Is there a tested business continuity / disaster recovery plan covering loss of premises or major systems?',
              sq: 'A ka një plan të testuar të vazhdimësisë së biznesit / rimëkëmbjes nga fatkeqësia që mbulon humbjen e selisë ose sistemeve kryesore?'
            },
            goodPractice: {
              en: [
                'A written plan describing how the business resumes operations, even in a degraded mode, after a major incident (loss of premises, major system outage)',
                'Recovery time objectives (RTO) and recovery point objectives (RPO) defined for critical systems',
                'Staff are aware of their role in the plan',
                'The plan has been tested or exercised, not just written and filed away'
              ],
              sq: [
                'Një plan i shkruar që përshkruan si rifillon biznesi operacionet, madje edhe në mënyrë të degraduar, pas një incidenti të madh (humbja e selisë, ndërprerje e madhe e sistemit)',
                'Objektivat e kohës së rimëkëmbjes (RTO) dhe objektivat e pikës së rimëkëmbjes (RPO) të përcaktuara për sistemet kritike',
                'Stafi është i ndërgjegjshëm mbi rolin e tij në plan',
                'Plani është testuar ose ushtruar, jo vetëm shkruar dhe arkivuar'
              ]
            },
            followUp: {
              en: 'When was the plan last tested, and what gaps did the test reveal?',
              sq: 'Kur u testua plani për herë të fundit, dhe çfarë boshllëqesh zbuloi testimi?'
            },
            references: { iso27001: 'A.5.29, A.5.30', iso27002: '5.29 Information security during disruption; 5.30 ICT readiness for business continuity', nis2: 'Art. 21(2)(c) Business continuity, backup management and disaster recovery', cis: 'CIS 11.5' }
          },
          {
            id: 'Q38', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Are notification obligations to regulators/authorities and affected individuals understood and actionable within required timeframes?',
              sq: 'A janë detyrimet e njoftimit ndaj rregullatorëve/autoriteteve dhe individëve të prekur të kuptuara dhe të zbatueshme brenda afateve të kërkuara?'
            },
            goodPractice: {
              en: [
                'Clarity on which incidents trigger external notification duties (e.g. GDPR personal data breach notification to the supervisory authority within 72 hours; NIS2 early warning within 24h / notification within 72h for in-scope entities)',
                'Named owner responsible for making and tracking these notifications',
                'Contact details for relevant authorities (national CSIRT, data protection authority) kept current',
                'A post-incident review process to capture lessons learned and update controls'
              ],
              sq: [
                'Qartësi mbi incidentet që shkaktojnë detyrime njoftimi të jashtëm (p.sh. njoftimi i shkeljes së të dhënave personale GDPR tek autoriteti mbikëqyrës brenda 72 orëve; paralajmërim i hershëm NIS2 brenda 24h / njoftim brenda 72h për entitetet e përfshira)',
                'Pronar i emërtuar përgjegjës për kryerjen dhe gjurmimin e këtyre njoftimeve',
                'Detajet e kontaktit të autoriteteve përkatëse (CSIRT kombëtar, autoriteti i mbrojtjes së të dhënave) të mbajtura të përditësuara',
                'Një proces rishikimi pas incidentit për të kapur mësimet e nxjerra dhe për të përditësuar kontrollet'
              ]
            },
            followUp: {
              en: 'Has the organisation determined whether it falls under NIS2 as an essential or important entity?',
              sq: 'A ka përcaktuar organizata nëse bie nën NIS2 si entitet thelbësor apo i rëndësishëm?'
            },
            references: { iso27001: 'A.5.26, A.5.27', iso27002: '5.26 Response to information security incidents; 5.27 Learning from information security incidents', nis2: 'Art. 23 Reporting obligations; Art. 21(2)(b)', cis: 'CIS 17.8' }
          },
          {
            id: 'Q45', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Are digital evidence and logs preserved and collected in a manner that supports incident investigation and, where necessary, legal or regulatory proceedings?',
              sq: 'A ruhen dhe mblidhen dëshmitë dixhitale dhe regjistrat në një mënyrë që mbështet hetimin e incidenteve dhe, kur është e nevojshme, procedurat ligjore ose rregullatore?'
            },
            goodPractice: {
              en: [
                'Logs and event data are retained with sufficient integrity to be usable as evidence in an investigation or legal proceeding',
                'A defined evidence collection and chain-of-custody procedure, understood by the incident response team',
                'Volatile data (running processes, memory state) is preserved before powering off or reimaging a compromised system',
                'Forensic copies of affected media are taken before remediation where proportionate and feasible',
                'The organisation knows which external parties (legal counsel, law enforcement, forensic providers) to engage when evidence requires professional handling'
              ],
              sq: [
                'Regjistrat dhe të dhënat e ngjarjeve ruhen me integritet të mjaftueshëm për t\'u përdorur si dëshmi në një hetim ose procedurë ligjore',
                'Procedurë e përcaktuar e mbledhjes së dëshmive dhe zinxhirit të kujdestarisë, e kuptuar nga ekipi i reagimit ndaj incidenteve',
                'Të dhënat e paqëndrueshme (procese aktive, gjendja e memorjes) ruhen para se të fiket ose riinstalohet një sistem i kompromentuar',
                'Kopje forensike të mediave të prekura merren para korrigjimit ku është proporcional dhe i realizueshëm',
                'Organizata di cilat palë të jashtme (këshilltar ligjor, zbatim i ligjit, ofrues forensik) të angazhojë kur dëshmia kërkon trajtim profesional'
              ]
            },
            followUp: {
              en: 'If a serious incident occurred today, does the organisation have the internal or contracted capability to preserve and analyse digital evidence?',
              sq: 'Nëse ndodh sot një incident i rëndë, a ka organizata kapacitetin e brendshëm ose të kontraktuar për të ruajtur dhe analizuar dëshminë dixhitale?'
            },
            references: { iso27001: 'A.5.28, A.8.15', iso27002: '5.28 Collection of evidence; 8.15 Logging', nis2: 'Art. 21(2)(b); Art. 23', cis: 'CIS 8.10' }
          },
          {
            id: 'Q50', kind: 'new', threatIndicator: 4, weight: 1.2, critical: true,
            text: {
              en: 'Are critical systems and services built with redundancy and high availability — using HA pairs, failover, or load balancing — to minimise the impact of component failures? (Distinct from process-level BCP/DR — see business continuity question.)',
              sq: 'A janë sistemet dhe shërbimet kritike ndërtuar me tepricë dhe disponueshmëri të lartë — duke përdorur çifte HA, dështim-kalim ose balancim ngarkese — për të minimizuar ndikimin e dështimeve të komponentëve? (I dallueshëm nga BCP/DR në nivel procesi — shihni pyetjen mbi vazhdimësinë e biznesit.)'
            },
            goodPractice: {
              en: [
                'Critical services (e.g. authentication, email, core business applications, network connectivity) deployed with HA architecture — active-active or active-passive — with documented failover procedures',
                'RTO and RPO targets defined per critical system and validated through periodic failover testing',
                'Load balancing used to distribute traffic and prevent single points of failure for user-facing services',
                'Redundant network links and power feeds for critical infrastructure, aligned with the UPS and power continuity controls',
                'HA and failover mechanisms tested on a scheduled basis, not only assumed operational'
              ],
              sq: [
                'Shërbime kritike (p.sh. autentikimi, email, aplikacionet kryesore të biznesit, lidhja e rrjetit) të vendosura me arkitekturë HA — aktiv-aktiv ose aktiv-pasiv — me procedura dështim-kalimi të dokumentuara',
                'Objektivat RTO dhe RPO të përcaktuara për çdo sistem kritik dhe të validuara nëpërmjet testimit periodik të dështim-kalimit',
                'Balancimi i ngarkesës i përdorur për të shpërndarë trafikun dhe parandaluar pikat e vetme të dështimit për shërbimet e drejtpërdrejta ndaj përdoruesit',
                'Lidhje redundante rrjeti dhe furnizim me energji për infrastrukturën kritike, të harmonizuara me kontrollet e UPS dhe vazhdimësisë së energjisë',
                'Mekanizmat HA dhe dështim-kalimi testuar sipas orarit të planifikuar, jo vetëm të supozuara operacionale'
              ]
            },
            followUp: {
              en: 'When were HA and failover mechanisms last tested for critical systems — was the failover seamless, and were any gaps identified?',
              sq: 'Kur u testuan për herë të fundit mekanizmat HA dhe dështim-kalimit për sistemet kritike — a ishte dështim-kalimi i pandërprerë, dhe a u identifikuan boshllëqe?'
            },
            references: { iso27001: 'A.8.14', iso27002: '8.14 Redundancy of information processing facilities', nis2: 'Art. 21(2)(c)', cis: 'CIS 11' }
          },
          {
            id: 'Q57', kind: 'new', threatIndicator: 2, weight: 1.0, critical: false,
            text: {
              en: 'Does the organisation proactively maintain relationships with relevant authorities, national CSIRTs, and sector information-sharing groups ahead of incidents?',
              sq: 'A mban organizata proaktivisht marrëdhënie me autoritetet përkatëse, CSIRT kombëtare dhe grupet sektoriale të ndarjes së informacionit para incidenteve?'
            },
            goodPractice: {
              en: [
                'Up-to-date contact details held for the national CSIRT, the relevant data protection authority, and sector-specific regulators',
                'Membership or registration with relevant sector information-sharing groups (ISACs) or national early-warning platforms where available',
                'Defined internal owner responsible for maintaining authority relationships and receiving threat advisories from official channels',
                'Staff are aware of reporting channels and escalation contacts before an incident occurs — not discovering them for the first time during a crisis'
              ],
              sq: [
                'Detajet e kontaktit të përditësuara të mbajtura për CSIRT kombëtar, autoritetin përkatës të mbrojtjes së të dhënave dhe rregullatorë sektorialë specifikë',
                'Anëtarësim ose regjistrim në grupe sektoriale të ndarjes së informacionit (ISAC) ose platforma kombëtare të paralajmërimit të hershëm ku janë disponibël',
                'Pronar i brendshëm i përcaktuar përgjegjës për mirëmbajtjen e marrëdhënieve me autoritetet dhe marrjen e këshillave të kërcënimit nga kanalet zyrtare',
                'Stafi është i ndërgjegjshëm mbi kanalet e raportimit dhe kontaktet e eskalimit para se të ndodhë një incident — duke mos i zbuluar ato për herë të parë gjatë një krize'
              ]
            },
            followUp: {
              en: 'Has the organisation registered with the national CSIRT or sector ISAC, and when did it last receive or act on a threat advisory from an official authority channel?',
              sq: 'A është regjistruar organizata me CSIRT kombëtar ose ISAC sektorial, dhe kur mori ose veproi për herë të fundit mbi një këshillë kërcënimi nga një kanal autoritetesh zyrtar?'
            },
            references: { iso27001: 'A.5.5, A.5.6', iso27002: '5.5 Contact with authorities; 5.6 Contact with special interest groups', nis2: 'Art. 21(2)(b); Art. 23', cis: 'CIS 17' }
          }
        ]
      }
    ]
  };

  root.OBS_TEMPLATES = root.OBS_TEMPLATES || {};
  root.OBS_TEMPLATES[T.id] = T;
  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
