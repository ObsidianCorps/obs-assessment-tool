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
      en: 'A consultant\'s diagnostic tool mapped to ISO/IEC 27001:2022, ISO/IEC 27002:2022, the NIS2 Directive (EU 2022/2555) and CIS Controls v8. 38 questions across 8 domains.',
      sq: 'Mjet diagnostikues i konsulentit i hartuar sipas ISO/IEC 27001:2022, ISO/IEC 27002:2022, Direktivës NIS2 (BE 2022/2555) dhe Kontrolleve CIS v8. 38 pyetje në 8 fusha.'
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
                'Pëlqim i shprehur dhe i dokumentuar për kapturimin dhe publikimin e imazheve të individëve të identifikueshëm'
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
              sq: 'A marrin stafi trajnim të rregullt, të përshtatur me rolin, mbi ndërgjegjësimin e sigurisë, dhe a shtrihet ky gjithashtu tek menaxhmenti?'
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
                'Regjistrat e trajnimeve të mbajtura për çdo punonjës',
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
                'Konsideratë e praktikave të sigurisë së furnitorëve dhe procedurave të zhvillimit të sigurt (NIS2 Neni 21(3))'
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
              sq: 'A vlerësohet risku i furnitorit para anëtarësimit, dhe a ekziston një listë aktuale e furnitorëve kritikë/me risk të lartë?'
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
                'Dëshmi e kërkuar nga furnitorët proporcionale ndaj riskut (p.sh. çertifikime, pyetësorë sigurie, të drejta auditimi)'
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
                'Rregulla të dokumentuara për ndërtimin e fjalëkalimit (gjatësia/kompleksiteti, ose udhëzime për frazë-kalim)',
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
                'Kredencialet admin të paracaktuara/furnitorit ndryshojnë para vënies në punë'
              ]
            },
            followUp: {
              en: 'How many people currently have domain/global admin rights, and is that the minimum needed?',
              sq: 'Sa njerëz kanë aktualisht të drejta domain/global admin, dhe a është kjo minimumi i nevojshëm?'
            },
            references: { iso27001: 'A.8.2, A.8.3, A.8.4', iso27002: '8.2 Privileged access rights; 8.3 Information access restriction; 8.4 Access to source code', nis2: 'Art. 21(2)(i)', cis: 'CIS 5.4, CIS 6.8' }
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
                'Skanim i rregullt i dobësive të aktiveve të brendshme dhe atyre të hapura ndaj jashtë',
                'Prioritizim i bazuar në risk dhe afate korrektuese të synuara (p.sh. më i shpejtë për sistemet e hapura ndaj internetit/kritike)',
                'Një proces i përcaktuar për trajtimin e dobësive të raportuara nga palët e treta (zbulim i koordinuar)'
              ]
            },
            followUp: {
              en: 'What is the average time to patch a critical vulnerability on an internet-facing system?',
              sq: 'Cila është koha mesatare për aplikimin e një patch-i kritik në një sistem të hapur ndaj internetit?'
            },
            references: { iso27001: 'A.8.8', iso27002: '8.8 Management of technical vulnerabilities', nis2: 'Art. 21(2)(c) Vulnerability handling and disclosure', cis: 'CIS 7' }
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
                'Stacionet e punës bllokohen automatikisht pas një periudhe të shkurtër mosaktiviteti, dhe përdoruesit blokohen manualisht kur largohen'
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
                'Rezervat shkëputur/izoluara nga rrjeti i prodhimit pas përfundimit (mbrojtje nga përhapja e ransomware)',
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
                'Bazë minimale sigurie e kërkuar për pajisjet personale (p.sh. bllokim ekrani, kriptim, valuta e sistemit operativ)',
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
              sq: 'A ka një politikë që qeveriset kriptografia/enkriptimi, dhe a zbatohet kur dërgohen të dhëna konfidenciale me email?'
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
          }
        ]
      }
    ]
  };

  root.OBS_TEMPLATES = root.OBS_TEMPLATES || {};
  root.OBS_TEMPLATES[T.id] = T;
  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
