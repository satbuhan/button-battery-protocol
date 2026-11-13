// content.js — Recognition and management of button battery ingestion, nasal
// insertion and aural insertion in a child (suspected/witnessed exposure ->
// immediate actions + pre-removal mitigation -> biplane radiographs ->
// three location-specific limbs [oesophagus; stomach or beyond the pylorus;
// nose or ear] -> discharge safety-netting).
// Data only. Rendering logic lives in app.js.
// Co-authored by Dr. Özgür Karcıoğlu and Dr. Satuk Buğra Han Bozatlı.
//
// Source: Figure 1 ("Original, author-developed pathway for the recognition
// and management of button battery ingestion and insertion in children") of
// an unpublished manuscript on paediatric button battery exposure — a SANRA
// structured narrative review (PubMed/MEDLINE, January 2006 to October 2026;
// 433 records screened to 92 cited references). Figure 1 was supplied as a
// native-shapes PowerPoint slide (no embedded raster image); this build
// rendered it to a 300-DPI PNG (LibreOffice -> PDF -> pdftoppm) to read every
// box directly, and separately inspected the slide's raw XML to settle two
// claims made by the condensation step (see below). See METHODOLOGY.md for
// the fidelity rules this file follows: label/sub text is byte-for-byte as
// authored; meaning/rationale/cautions/refs are added research drawn from
// the manuscript's own text and tables.
//
// A GENUINELY NEW RENDERING FEATURE — box-border style as semantic coding:
// the figure's own caption states that border style encodes evidence
// certainty: solid = guideline-concordant core step (all cited guidance
// agrees); dashed, labelled "LOW CERTAINTY" = preclinical evidence, case
// series or expert opinion; dotted, labelled "LOCAL PROTOCOL" = guidance
// diverges or only one source recommends it. This is the first tool in the
// atlas to carry a `certainty` field per node ("core" | "low" | "local" |
// unset), mapped in style.css to border-style. See METHODOLOGY.md.
//
// CONDENSATION CORRECTIONS — verified directly against the rendered figure
// and the slide's own XML, overriding the automated condensation document:
// 1. COLOUR: the condensation claimed the three branch headers (OESOPHAGUS /
//    STOMACH OR BEYOND THE PYLORUS / NOSE OR EAR) were drawn in three
//    different colours (red/rust, teal, brown/amber). A full tally of every
//    <a:solidFill> colour used anywhere in the slide's raw XML returns only
//    black (#000000) and white (#FFFFFF) — the figure is pure monochrome.
//    All three headers render identically here.
// 2. MISSING ARROW: the condensation flagged "ENDOSCOPY [E, N, P]" and
//    "LOCAL PROTOCOL – ASYMPTOMATIC CHILD [E, N, P]" as stacked "without a
//    connecting arrow between them." A zoomed crop of the rendered figure
//    shows a clear, unambiguous solid arrow with an arrowhead running from
//    the first box into the second. Modelled here as a real edge
//    (endoscopy-stomach -> asymptomatic-child).
// 3. MERGED TEXT: the condensation extracted "A gastric position does not
//    exclude oesophageal injury sustained in transit" as the last bullet
//    line of the "LOCAL PROTOCOL – ASYMPTOMATIC CHILD" box. The rendered
//    figure shows it is actually its own separate, solid-bordered box with
//    its own incoming and outgoing arrows, positioned below the dotted
//    "LOCAL PROTOCOL" box. Modelled here as its own node
//    (gastric-position-note).
// 4. SHAPE: the condensation described "WHERE IS THE BATTERY?" as "a wide
//    rounded rectangle rather than a diamond." The rendered figure shows an
//    unambiguous diamond/rhombus decision shape — rendered here with the
//    atlas's existing decision-diamond style, same as every other tool.
//
// REFERENCES — verification policy for this tool (a deliberate,
// author-directed exception, not an oversight — the SEVENTH tool in this
// atlas to carry this exception, after epinephrine-revisited-protocol,
// ketamine-indications-protocol, haloperidol-adjunct-protocol,
// geriatric-pain-protocol, metoclopramide-ondansetron-protocol and
// spontaneous-pneumothorax-protocol): asked explicitly whether to extend the
// same policy here, the author chose to treat this 92-entry bibliography the
// same way — transcribed directly from the manuscript's own reference list
// and NOT independently re-verified against primary sources for this build.
// Every entry's kind field states this plainly. 88 of 92 entries carry a DOI
// in the manuscript; 4 (non-journal guideline/standard sources) link to the
// cited web page instead, and 1 (no DOI in 1999) links to its PubMed record.
const VERIFIED = "2026-11-13";

const REFERENCES = [
  { id: 1, kind: "As cited in the manuscript; not independently re-verified.", text: "Jatana KR, Rhoades K, Milkovich S, Jacobs IN. Basic mechanism of button battery ingestion injuries and novel mitigation strategies after diagnosis and removal. Laryngoscope 2017; 127: 1276-1282 [PMID: 27859311 DOI: 10.1002/lary.26362]", url: "https://doi.org/10.1002/lary.26362" },
  { id: 2, kind: "As cited in the manuscript; not independently re-verified.", text: "Litovitz T, Whitaker N, Clark L, White NC, Marsolek M. Emerging battery-ingestion hazard: clinical implications. Pediatrics 2010; 125: 1168-1177 [PMID: 20498173 DOI: 10.1542/peds.2009-3037]", url: "https://doi.org/10.1542/peds.2009-3037" },
  { id: 3, kind: "As cited in the manuscript; not independently re-verified.", text: "Sharpe SJ, Rochette LM, Smith GA. Pediatric battery-related emergency department visits in the United States, 1990-2009. Pediatrics 2012; 129: 1111-1117 [PMID: 22585763 DOI: 10.1542/peds.2011-0012]", url: "https://doi.org/10.1542/peds.2011-0012" },
  { id: 4, kind: "As cited in the manuscript; not independently re-verified.", text: "Chandler MD, Ilyas K, Jatana KR, Smith GA, McKenzie LB, MacKay JM. Pediatric Battery-Related Emergency Department Visits in the United States: 2010-2019. Pediatrics 2022; 150: e2022056709 [PMID: 36032018 DOI: 10.1542/peds.2022-056709]", url: "https://doi.org/10.1542/peds.2022-056709" },
  { id: 5, kind: "As cited in the manuscript; not independently re-verified.", text: "Haddad N, Wilson JD, Fard D, Levi JR. Pediatric button battery ingestion: Publication trends in the literature. Am J Otolaryngol 2020; 41: 102401 [PMID: 32033802 DOI: 10.1016/j.amjoto.2020.102401]", url: "https://doi.org/10.1016/j.amjoto.2020.102401" },
  { id: 6, kind: "As cited in the manuscript; not independently re-verified.", text: "Litovitz T, Whitaker N, Clark L. Preventing battery ingestions: an analysis of 8648 cases. Pediatrics 2010; 125: 1178-1183 [PMID: 20498172 DOI: 10.1542/peds.2009-3038]", url: "https://doi.org/10.1542/peds.2009-3038" },
  { id: 7, kind: "As cited in the manuscript; not independently re-verified.", text: "Krom H, Visser M, Hulst JM, Wolters VM, Van den Neucker AM, de Meij T, van der Doef HPJ, Norbruis OF, Benninga MA, Smit MJM, Kindermann A. Serious complications after button battery ingestion in children. Eur J Pediatr 2018; 177: 1063-1070 [PMID: 29717359 DOI: 10.1007/s00431-018-3154-6]", url: "https://doi.org/10.1007/s00431-018-3154-6" },
  { id: 8, kind: "As cited in the manuscript; not independently re-verified.", text: "Mubarak A, Benninga MA, Broekaert I, Dolinsek J, Homan M, Mas E, Miele E, Pienar C, Thapar N, Thomson M, Tzivinikos C, de Ridder L. Diagnosis, Management, and Prevention of Button Battery Ingestion in Childhood: A European Society for Paediatric Gastroenterology Hepatology and Nutrition Position Paper. J Pediatr Gastroenterol Nutr 2021; 73: 129-136 [PMID: 33555169 DOI: 10.1097/MPG.0000000000003048]", url: "https://doi.org/10.1097/MPG.0000000000003048" },
  { id: 9, kind: "As cited in the manuscript; not independently re-verified.", text: "Kramer RE, Lerner DG, Lin T, Manfredi M, Shah M, Stephen TC, Gibbons TE, Pall H, Sahn B, McOmber M, Zacur G, Friedlander J, Quiros AJ, Fishman DS, Mamula P; North American Society for Pediatric Gastroenterology, Hepatology, and Nutrition Endoscopy Committee. Management of ingested foreign bodies in children: a clinical report of the NASPGHAN Endoscopy Committee. J Pediatr Gastroenterol Nutr 2015; 60: 562-574 [PMID: 25611037 DOI: 10.1097/MPG.0000000000000729]", url: "https://doi.org/10.1097/MPG.0000000000000729" },
  { id: 10, kind: "As cited in the manuscript; not independently re-verified.", text: "National Capital Poison Center (2018) Button battery ingestion triage and treatment guideline (revised June 2018). Washington, DC: National Capital Poison Center. [cited 2026 Nov 12]. Available from: https://www.poison.org/battery/guideline", url: "https://www.poison.org/battery/guideline" },
  { id: 11, kind: "As cited in the manuscript; not independently re-verified.", text: "Sethia R, Gibbs H, Jacobs IN, Reilly JS, Rhoades K, Jatana KR. Current management of button battery injuries. Laryngoscope Investig Otolaryngol 2021; 6: 549-563 [PMID: 34195377 DOI: 10.1002/lio2.535]", url: "https://doi.org/10.1002/lio2.535" },
  { id: 12, kind: "As cited in the manuscript; not independently re-verified.", text: "Amodio J, Lightman M. A Review of Button Battery Ingestions in Children-Diagnosis and Management. Children (Basel) 2025; 12: 1678 [PMID: 41462818 DOI: 10.3390/children12121678]", url: "https://doi.org/10.3390/children12121678" },
  { id: 13, kind: "As cited in the manuscript; not independently re-verified.", text: "Akman C, Karcioglu O, Ozturk GA, Ucar AB. A Killer in Disguise: Button Battery Ingestions in Acute Care. Curr Pharm Des 2025; 31: 3347-3353 [PMID: 40289972 DOI: 10.2174/0113816128361865250411045020]", url: "https://doi.org/10.2174/0113816128361865250411045020" },
  { id: 14, kind: "As cited in the manuscript; not independently re-verified.", text: "Baethge C, Goldbeck-Wood S, Mertens S. SANRA-a scale for the quality assessment of narrative review articles. Res Integr Peer Rev 2019; 4: 5 [PMID: 30962953 DOI: 10.1186/s41073-019-0064-8]", url: "https://doi.org/10.1186/s41073-019-0064-8" },
  { id: 15, kind: "As cited in the manuscript; not independently re-verified.", text: "Lerner DG, Brumbaugh D, Lightdale JR, Jatana KR, Jacobs IN, Mamula P. Mitigating Risks of Swallowed Button Batteries: New Strategies Before and After Removal. J Pediatr Gastroenterol Nutr 2020; 70: 542-546 [PMID: 32022776 DOI: 10.1097/MPG.0000000000002649]", url: "https://doi.org/10.1097/MPG.0000000000002649" },
  { id: 16, kind: "As cited in the manuscript; not independently re-verified.", text: "Australian Competition and Consumer Commission (2022) Consumer goods (button/coin batteries) safety standard and information standard. Canberra: ACCC. [cited 2026 Jul 30]. Available from: https://www.accc.gov.au/media-release/businesses-on-notice-as-mandatory-button-battery-laws-commence", url: "https://www.accc.gov.au/media-release/businesses-on-notice-as-mandatory-button-battery-laws-commence" },
  { id: 17, kind: "As cited in the manuscript; not independently re-verified.", text: "US Consumer Product Safety Commission (2023) Safety standard for button cell or coin batteries and consumer products containing such batteries. Final rule. Federal Register, 88(182), pp. 65274-65296. [cited 2026 Jul 30]. Available from: https://www.federalregister.gov/documents/2023/09/21/2023-20334", url: "https://www.federalregister.gov/documents/2023/09/21/2023-20334" },
  { id: 18, kind: "As cited in the manuscript; not independently re-verified.", text: "Tanaka J, Yamashita M, Yamashita M, Kajigaya H. Effects of tap water on esophageal burns in dogs from button lithium batteries. Vet Hum Toxicol 1999; 41: 279-282 [PMID: 10509426]", url: "https://pubmed.ncbi.nlm.nih.gov/10509426/" },
  { id: 19, kind: "As cited in the manuscript; not independently re-verified.", text: "Tiryaki T, Livanelioğlu Z, Atayurt H. Early bougienage for relief of stricture formation following caustic esophageal burns. Pediatr Surg Int 2005; 21: 78-80 [PMID: 15619090 DOI: 10.1007/s00383-004-1331-3]", url: "https://doi.org/10.1007/s00383-004-1331-3" },
  { id: 20, kind: "As cited in the manuscript; not independently re-verified.", text: "Cairns R, Brown JA, Lachireddy K, Wylie C, Robinson J, Dawson AH, Buckley NA. Button battery exposures in Australian children: a prospective observational study highlighting the role of poisons information centres. Clin Toxicol (Phila) 2019; 57: 404-410 [PMID: 30663910 DOI: 10.1080/15563650.2018.1537492]", url: "https://doi.org/10.1080/15563650.2018.1537492" },
  { id: 21, kind: "As cited in the manuscript; not independently re-verified.", text: "Labadie M, O'Mahony E, Capaldo L, Courtois A, Lamireau T, Nisse P, Blanc-Brisset I, Puskarczyk E. Severity of button batteries ingestions: data from French Poison Control Centres between 1999 and 2015. Eur J Emerg Med 2018; 25: e1-e8 [PMID: 29240570 DOI: 10.1097/MEJ.0000000000000528]", url: "https://doi.org/10.1097/MEJ.0000000000000528" },
  { id: 22, kind: "As cited in the manuscript; not independently re-verified.", text: "Kiefer A, Duppel U, Schützenmeier A, Lang T, Kittel J, Kabesch M, Kerzel S. Button Battery Ingestions cause the Majority of Severe Complications. Klin Padiatr 2023; 235: 90-97 [PMID: 36758576 DOI: 10.1055/a-2007-1686]", url: "https://doi.org/10.1055/a-2007-1686" },
  { id: 23, kind: "As cited in the manuscript; not independently re-verified.", text: "Gezer HÖ, Ezer SS, Temiz A, İnce E, Hiçsönmez A. Ingested foreign bodies in children: Do they really pass spontaneously from the gastrointestinal tract? A single-centre experience with 1000 cases. Ulus Travma Acil Cerrahi Derg 2020; 26: 247-254 [PMID: 32185763 DOI: 10.14744/tjtes.2019.40350]", url: "https://doi.org/10.14744/tjtes.2019.40350" },
  { id: 24, kind: "As cited in the manuscript; not independently re-verified.", text: "Anand S, Jain V, Agarwala S, Dhua AK, Yadav DK. Esophageal Button Battery in the Pediatric Population: Experience from a Tertiary Care Center. Indian J Pediatr 2020; 87: 591-597 [PMID: 32062820 DOI: 10.1007/s12098-020-03222-1]", url: "https://doi.org/10.1007/s12098-020-03222-1" },
  { id: 25, kind: "As cited in the manuscript; not independently re-verified.", text: "National Capital Poison Center (2025) Button battery ingestion statistics from the National Poison Data System. Washington, DC: National Capital Poison Center. [cited 2026 Jul 30]. Available from: https://www.poison.org/battery/stats", url: "https://www.poison.org/battery/stats" },
  { id: 26, kind: "As cited in the manuscript; not independently re-verified.", text: "Tran C, Nunez C, Eslick GD, Barker R, Elliott EJ. Complications of button battery ingestion or insertion in children: a systematic review and pooled analysis of individual patient-level data. World J Pediatr 2024; 20: 1017-1028 [PMID: 39168931 DOI: 10.1007/s12519-024-00833-y]", url: "https://doi.org/10.1007/s12519-024-00833-y" },
  { id: 27, kind: "As cited in the manuscript; not independently re-verified.", text: "Tran C, Nunez C, Eslick GD, Barker R, Elliott EJ. Button battery exposure in children: a systematic review and meta-analysis. Inj Prev 2025; 31: 265-271 [PMID: 39366737 DOI: 10.1136/ip-2024-045339]", url: "https://doi.org/10.1136/ip-2024-045339" },
  { id: 28, kind: "As cited in the manuscript; not independently re-verified.", text: "Philteos J, James AL, Propst EJ, Ostrow O, McKinnon N, Everett T, Wolter NE. Airway Complications Resulting From Pediatric Esophageal Button Battery Impaction: A Systematic Review. JAMA Otolaryngol Head Neck Surg 2022; 148: 677-683 [PMID: 35616924 DOI: 10.1001/jamaoto.2022.0848]", url: "https://doi.org/10.1001/jamaoto.2022.0848" },
  { id: 29, kind: "As cited in the manuscript; not independently re-verified.", text: "Akinkugbe O, James AL, Ostrow O, Everett T, Wolter NE, McKinnon NK. Vascular Complications in Children Following Button Battery Ingestions: A Systematic Review. Pediatrics 2022; 150: e2022057477 [PMID: 36032017 DOI: 10.1542/peds.2022-057477]", url: "https://doi.org/10.1542/peds.2022-057477" },
  { id: 30, kind: "As cited in the manuscript; not independently re-verified.", text: "Schmidt YM, Muensterer O, Wendling-Keim D. The use of honey in button battery ingestions: a systematic review. Front Pediatr 2023; 11: 1259780 [PMID: 37842023 DOI: 10.3389/fped.2023.1259780]", url: "https://doi.org/10.3389/fped.2023.1259780" },
  { id: 31, kind: "As cited in the manuscript; not independently re-verified.", text: "Soto PH, Reid NE, Litovitz TL. Time to perforation for button batteries lodged in the esophagus. Am J Emerg Med 2019; 37: 805-809 [PMID: 30054113 DOI: 10.1016/j.ajem.2018.07.035]", url: "https://doi.org/10.1016/j.ajem.2018.07.035" },
  { id: 32, kind: "As cited in the manuscript; not independently re-verified.", text: "Vaucel JA, Gil-Jardine C, Paradis C, Enaud R, Labadie M; French Poison Centre Research Group. Pre-hospital triage of children at risk of oesophageal button battery impaction: the button battery impaction score. Clin Toxicol (Phila) 2023; 61: 1047-1054 [PMID: 38270057 DOI: 10.1080/15563650.2023.2289358]", url: "https://doi.org/10.1080/15563650.2023.2289358" },
  { id: 33, kind: "As cited in the manuscript; not independently re-verified.", text: "Xu G, Jia D, Chen J, Pan H, Wu Z. Esophageal button battery impactions in children: an analysis of 89 cases. BMC Pediatr 2024; 24: 388 [PMID: 38851720 DOI: 10.1186/s12887-024-04869-x]", url: "https://doi.org/10.1186/s12887-024-04869-x" },
  { id: 34, kind: "As cited in the manuscript; not independently re-verified.", text: "Lorenzo C, Azevedo S, Lopes J, Fernandes A, Loreto H, Mourato P, Lopes AI. Battery Ingestion in Children, an Ongoing Challenge: Recent Experience of a Tertiary Center. Front Pediatr 2022; 10: 848092 [PMID: 35573958 DOI: 10.3389/fped.2022.848092]", url: "https://doi.org/10.3389/fped.2022.848092" },
  { id: 35, kind: "As cited in the manuscript; not independently re-verified.", text: "Grey NEO, Malone LJ, Miller AL, Carroll HF, Khalaf RT, Kramer RE, Browne LP. Magnetic resonance imaging findings following button battery ingestion. Pediatr Radiol 2021; 51: 1856-1866 [PMID: 34075452 DOI: 10.1007/s00247-021-05085-w]", url: "https://doi.org/10.1007/s00247-021-05085-w" },
  { id: 36, kind: "As cited in the manuscript; not independently re-verified.", text: "Eyring JB, Hemeyer BM, Walker S, Allen WP, Liang S, Stewart C, Meier JD, Padia R. Button Battery Ingestion: Exploring Socioeconomic Risk Factors. Otolaryngol Head Neck Surg 2025; 173: 96-105 [PMID: 40062604 DOI: 10.1002/ohn.1206]", url: "https://doi.org/10.1002/ohn.1206" },
  { id: 37, kind: "As cited in the manuscript; not independently re-verified.", text: "Trieu J, Arason N, Karbakhsh M, McVea DA. Profiling cases of button battery ingestion using Canadian and British Columbia poison centre data. Health Promot Chronic Dis Prev Can 2026; 46: 40-44 [PMID: 41538275 DOI: 10.24095/hpcdp.46.1.05]", url: "https://doi.org/10.24095/hpcdp.46.1.05" },
  { id: 38, kind: "As cited in the manuscript; not independently re-verified.", text: "Hudson AS, Carroll MW. Clinical features, management, and complications of paediatric button battery ingestions in Canada: an active surveillance study using surveys of Canadian paediatricians and paediatric subspecialists. J Can Assoc Gastroenterol 2024; 7: 416-422 [PMID: 39679103 DOI: 10.1093/jcag/gwae032]", url: "https://doi.org/10.1093/jcag/gwae032" },
  { id: 39, kind: "As cited in the manuscript; not independently re-verified.", text: "Dembiński Ł, Copley S, Koletzko B, Grossman Z, Del Torso S, Mujkić-Klarić A, Hadjipanayis A. European paediatricians need to be more aware of the risks faced by children who swallow button batteries and how to treat them. Acta Paediatr 2024; 113: 2658-2663 [PMID: 39166798 DOI: 10.1111/apa.17393]", url: "https://doi.org/10.1111/apa.17393" },
  { id: 40, kind: "As cited in the manuscript; not independently re-verified.", text: "Lorenzo M, Beno S. Evolving threat of pediatric ingestions: a discussion of cannabis and button batteries and their implications for children. Curr Opin Pediatr 2023; 35: 316-323 [PMID: 36876321 DOI: 10.1097/MOP.0000000000001238]", url: "https://doi.org/10.1097/MOP.0000000000001238" },
  { id: 41, kind: "As cited in the manuscript; not independently re-verified.", text: "Tambakis G, Schildkraut T, Delaney I, Gilmore R, Loebenstein M, Taylor A, Holt B, Tsoi EH, Cameron G, Demediuk B, Miller A, Connell W, Wright E, Thompson A, Holmes J. Management of foreign body ingestion in adults: Time to STOP and rethink endoscopy. Endosc Int Open 2023; 11: E1161-E1167 [PMID: 38094028 DOI: 10.1055/a-2201-6928]", url: "https://doi.org/10.1055/a-2201-6928" },
  { id: 42, kind: "As cited in the manuscript; not independently re-verified.", text: "Philteos J, Madan Y, James AL, Propst EJ, Ostrow O, McKinnon N, Everett T, Siu J, Wolter NE. Public knowledge of button battery ingestions: A social media based cross-sectional analysis. Int J Pediatr Otorhinolaryngol 2024; 179: 111902 [PMID: 38479070 DOI: 10.1016/j.ijporl.2024.111902]", url: "https://doi.org/10.1016/j.ijporl.2024.111902" },
  { id: 43, kind: "As cited in the manuscript; not independently re-verified.", text: "Ettyreddy AR, Georg MW, Chi DH, Gaines BA, Simons JP. Button battery injuries in the pediatric aerodigestive tract. Ear Nose Throat J 2015; 94: 486-493 [PMID: 26670755 DOI: 10.1177/014556131509401207]", url: "https://doi.org/10.1177/014556131509401207" },
  { id: 44, kind: "As cited in the manuscript; not independently re-verified.", text: "Völker J, Völker C, Schendzielorz P, Schraven SP, Radeloff A, Mlynski R, Hagen R, Rak K. Pathophysiology of esophageal impairment due to button battery ingestion. Int J Pediatr Otorhinolaryngol 2017; 100: 77-85 [PMID: 28802391 DOI: 10.1016/j.ijporl.2017.06.030]", url: "https://doi.org/10.1016/j.ijporl.2017.06.030" },
  { id: 45, kind: "As cited in the manuscript; not independently re-verified.", text: "Jatana KR, Barron CL, Jacobs IN. Initial clinical application of tissue pH neutralization after esophageal button battery removal in children. Laryngoscope 2019; 129: 1772-1776 [PMID: 30835848 DOI: 10.1002/lary.27904]", url: "https://doi.org/10.1002/lary.27904" },
  { id: 46, kind: "As cited in the manuscript; not independently re-verified.", text: "Chiew AL, Chan BSH. Management of button battery ingestion. Clin Toxicol (Phila) 2023; 61: 1017-1019 [PMID: 38270055 DOI: 10.1080/15563650.2023.2294622]", url: "https://doi.org/10.1080/15563650.2023.2294622" },
  { id: 47, kind: "As cited in the manuscript; not independently re-verified.", text: "Anfang RR, Jatana KR, Linn RL, Rhoades K, Fry J, Jacobs IN. pH-neutralizing esophageal irrigations as a novel mitigation strategy for button battery injury. Laryngoscope 2019; 129: 49-57 [PMID: 29889306 DOI: 10.1002/lary.27312]", url: "https://doi.org/10.1002/lary.27312" },
  { id: 48, kind: "As cited in the manuscript; not independently re-verified.", text: "Buttazzoni E, Gregori D, Paoli B, Soriani N, Baldas S, Rodriguez H, Lorenzoni G; Susy Safe Working Group. Symptoms associated with button batteries injuries in children: An epidemiological review. Int J Pediatr Otorhinolaryngol 2015; 79: 2200-2207 [PMID: 26520908 DOI: 10.1016/j.ijporl.2015.10.003]", url: "https://doi.org/10.1016/j.ijporl.2015.10.003" },
  { id: 49, kind: "As cited in the manuscript; not independently re-verified.", text: "Zipursky AR, Ratnapalan S. Button battery ingestions in children. CMAJ 2021; 193: E1498 [PMID: 34580143 DOI: 10.1503/cmaj.210572]", url: "https://doi.org/10.1503/cmaj.210572" },
  { id: 50, kind: "As cited in the manuscript; not independently re-verified.", text: "Park SJ, Burns H. Button battery injury: An update. Aust J Gen Pract 2022; 51: 471-475 [PMID: 35773156 DOI: 10.31128/AJGP-03-21-5873]", url: "https://doi.org/10.31128/AJGP-03-21-5873" },
  { id: 51, kind: "As cited in the manuscript; not independently re-verified.", text: "Scalise PN, Durgin JM, Staffa SJ, Wynne N, Meisner J, Ngo P, Zendejas B, Kim HB, Demehri FR. Pediatric button battery ingestion: A single center experience and risk score to predict severe outcomes. J Pediatr Surg 2023; 58: 613-618 [PMID: 36646540 DOI: 10.1016/j.jpedsurg.2022.12.017]", url: "https://doi.org/10.1016/j.jpedsurg.2022.12.017" },
  { id: 52, kind: "As cited in the manuscript; not independently re-verified.", text: "Konzett K, Gang S, Poyntner L, Reithmeier E, Dertinger S, Simma B. Case Report: Button battery ingestion-an underestimated emergency in children. Front Pediatr 2024; 12: 1484458 [PMID: 39911772 DOI: 10.3389/fped.2024.1484458]", url: "https://doi.org/10.3389/fped.2024.1484458" },
  { id: 53, kind: "As cited in the manuscript; not independently re-verified.", text: "Vaucel JA, Recher M, Paradis C, Labadie M, Courtois A, Michaud L, Petyt C, Guimber D, Tournoud C, Enaud R, Nisse P; French Poison Control Center (PCC) Research Group. Severe post-pyloric injury after button battery ingestion: Systematic literature review and case report. Arch Pediatr 2023; 30: 501-504 [PMID: 37394366 DOI: 10.1016/j.arcped.2023.05.007]", url: "https://doi.org/10.1016/j.arcped.2023.05.007" },
  { id: 54, kind: "As cited in the manuscript; not independently re-verified.", text: "Duan Q, Zhang F, Wang G, Wang H, Li H, Zhao J, Zhang J, Ni X. Vocal cord paralysis following lithium button battery ingestion in children. Eur J Pediatr 2021; 180: 1059-1066 [PMID: 33048238 DOI: 10.1007/s00431-020-03830-1]", url: "https://doi.org/10.1007/s00431-020-03830-1" },
  { id: 55, kind: "As cited in the manuscript; not independently re-verified.", text: "Leinwand K, Brumbaugh DE, Kramer RE. Button Battery Ingestion in Children: A Paradigm for Management of Severe Pediatric Foreign Body Ingestions. Gastrointest Endosc Clin N Am 2016; 26: 99-118 [PMID: 26616899 DOI: 10.1016/j.giec.2015.08.003]", url: "https://doi.org/10.1016/j.giec.2015.08.003" },
  { id: 56, kind: "As cited in the manuscript; not independently re-verified.", text: "Alreheili KM, Almutairi M, Alsaadi A, Ahmed G, Alhejili A, AlKhatrawi T. A 2-Year-Old Boy Who Developed an Aortoesophageal Fistula After Swallowing a Button Battery, Managed Using a Novel Procedure with Vascular Plug Device as a Bridge to Definitive Surgical Repair. Am J Case Rep 2021; 22: e931013 [PMID: 34407064 DOI: 10.12659/AJCR.931013]", url: "https://doi.org/10.12659/AJCR.931013" },
  { id: 57, kind: "As cited in the manuscript; not independently re-verified.", text: "Saha A, Berg EA, Lerner D, Kramer R, Nemeh C, DeFazio J, Mencin AA. Management of Vascular Complications from Button Battery Ingestions. Curr Gastroenterol Rep 2025; 27: 2 [PMID: 39824971 DOI: 10.1007/s11894-024-00957-1]", url: "https://doi.org/10.1007/s11894-024-00957-1" },
  { id: 58, kind: "As cited in the manuscript; not independently re-verified.", text: "Lohmann J, Klein T, Stenzel M, Aleksic M, Fuchs P, Boemers T, Kaufmann J. Impending esophago-arterial fistula after battery ingestion-First preventive operation on a toddler worldwide. Anaesthesiologie 2025 [PMID: 39776182 DOI: 10.1007/s00101-024-01487-1]", url: "https://doi.org/10.1007/s00101-024-01487-1" },
  { id: 59, kind: "As cited in the manuscript; not independently re-verified.", text: "Yan S, Chen G, Zeng N, Gao C. Characteristics and treatment of pediatric nasal foreign bodies with button batteries-A retrospective analysis of 176 cases. PLoS One 2024; 19: e0309261 [PMID: 39208061 DOI: 10.1371/journal.pone.0309261]", url: "https://doi.org/10.1371/journal.pone.0309261" },
  { id: 60, kind: "As cited in the manuscript; not independently re-verified.", text: "Liao W, Wen G, Zhang X. Button battery intake as foreign body in Chinese children: review of case reports and the literature. Pediatr Emerg Care 2015; 31: 412-415 [PMID: 24732349 DOI: 10.1097/PEC.0000000000000134]", url: "https://doi.org/10.1097/PEC.0000000000000134" },
  { id: 61, kind: "As cited in the manuscript; not independently re-verified.", text: "Wang Z, Du Z, Zhou X, Chen T, Li C. Misdiagnosis of peripheral abscess caused by duodenal foreign body: a case report and literature review. BMC Gastroenterol 2020; 20: 236 [PMID: 32703254 DOI: 10.1186/s12876-020-01335-7]", url: "https://doi.org/10.1186/s12876-020-01335-7" },
  { id: 62, kind: "As cited in the manuscript; not independently re-verified.", text: "Semple T, Calder AD, Ramaswamy M, McHugh K. Button battery ingestion in children-a potentially catastrophic event of which all radiologists must be aware. Br J Radiol 2018; 91: 20160781 [PMID: 28830198 DOI: 10.1259/bjr.20160781]", url: "https://doi.org/10.1259/bjr.20160781" },
  { id: 63, kind: "As cited in the manuscript; not independently re-verified.", text: "Pugmire BS, Lin TK, Pentiuk S, de Alarcon A, Hart CK, Trout AT. Imaging button battery ingestions and insertions in children: a 15-year single-center review. Pediatr Radiol 2017; 47: 178-185 [PMID: 27878583 DOI: 10.1007/s00247-016-3751-3]", url: "https://doi.org/10.1007/s00247-016-3751-3" },
  { id: 64, kind: "As cited in the manuscript; not independently re-verified.", text: "Rostad BS, Richer EJ, Riedesel EL, Alazraki AL. Esophageal discoid foreign body detection and classification using artificial intelligence. Pediatr Radiol 2022; 52: 477-482 [PMID: 34850259 DOI: 10.1007/s00247-021-05240-3]", url: "https://doi.org/10.1007/s00247-021-05240-3" },
  { id: 65, kind: "As cited in the manuscript; not independently re-verified.", text: "Riedesel EL, Richer EJ, Sinclair EM, Sauer CG, Santore MT, Simoneaux SF, Alazraki AL. Serial MRI Findings After Endoscopic Removal of Button Battery From the Esophagus. AJR Am J Roentgenol 2020; 215: 1238-1246 [PMID: 32960667 DOI: 10.2214/AJR.19.22427]", url: "https://doi.org/10.2214/AJR.19.22427" },
  { id: 66, kind: "As cited in the manuscript; not independently re-verified.", text: "Cockrell HC, Greenberg SLM, Knight JA, Green NF, Romberg EK, Bonilla-Velez J, Chapman T. Magnetic resonance imaging of children following esophageal button battery removal: What are we looking for? Clin Imaging 2022; 86: 71-74 [PMID: 35364444 DOI: 10.1016/j.clinimag.2022.03.013]", url: "https://doi.org/10.1016/j.clinimag.2022.03.013" },
  { id: 67, kind: "As cited in the manuscript; not independently re-verified.", text: "Atlas N, Sinclair EM, Simon HK, Riedesel EL, Figueroa J, Kamat PP, Santore MT. Management of esophageal button battery ingestions: resource utilization and outcomes. Pediatr Surg Int 2022; 38: 473-478 [PMID: 35088154 DOI: 10.1007/s00383-021-05058-y]", url: "https://doi.org/10.1007/s00383-021-05058-y" },
  { id: 68, kind: "As cited in the manuscript; not independently re-verified.", text: "Sinclair EM, Santore MT, Agarwal M, Kitzman J, Sauer CG, Riedesel EL. Evolving Clinical Care in Esophageal Button Batteries: Impact of Expert-Opinion Guideline Adoption and Continued Gaps in Care. J Pediatr Gastroenterol Nutr 2022; 74: 236-243 [PMID: 34724451 DOI: 10.1097/MPG.0000000000003346]", url: "https://doi.org/10.1097/MPG.0000000000003346" },
  { id: 69, kind: "As cited in the manuscript; not independently re-verified.", text: "Anfang RR, Jatana KR, Linn RL, Rhoades K, Fry J, Jacobs IN. In Response to pH-Neutralizing Esophageal Irrigations as a Novel Mitigation Strategy. Laryngoscope 2019; 129: E163-E164 [PMID: 30746705 DOI: 10.1002/lary.27754]", url: "https://doi.org/10.1002/lary.27754" },
  { id: 70, kind: "As cited in the manuscript; not independently re-verified.", text: "Gyawali BR, Guragain R, Gyawali DR. Role of Honey and Acetic Acid in Mitigating the Effects of Button Battery in Esophageal Mucosa: A Cadaveric Animal Model Experimental Study. Indian J Otolaryngol Head Neck Surg 2022; 74: 5759-5765 [PMID: 36742683 DOI: 10.1007/s12070-021-02382-6]", url: "https://doi.org/10.1007/s12070-021-02382-6" },
  { id: 71, kind: "As cited in the manuscript; not independently re-verified.", text: "Hoagland MA, Ing RJ, Jatana KR, Jacobs IN, Chatterjee D. Anesthetic Implications of the New Guidelines for Button Battery Ingestion in Children. Anesth Analg 2020; 130: 665-672 [PMID: 30829672 DOI: 10.1213/ANE.0000000000004029]", url: "https://doi.org/10.1213/ANE.0000000000004029" },
  { id: 72, kind: "As cited in the manuscript; not independently re-verified.", text: "Ing RJ, Hoagland M, Mayes L, Twite M. The anesthetic management of button battery ingestion in children. Can J Anaesth 2018; 65: 309-318 [PMID: 29168156 DOI: 10.1007/s12630-017-1023-9]", url: "https://doi.org/10.1007/s12630-017-1023-9" },
  { id: 73, kind: "As cited in the manuscript; not independently re-verified.", text: "Kaufmann J, Grozeva B, Laschat M, Brackhahn M, Rudolph D, Neuhaus N, Hubertus J, Wappler F, Eich C. Rapid and safe removal of foreign bodies in the upper esophagus in children using an optimized Miller size 3 video laryngoscope blade. Paediatr Anaesth 2021; 31: 587-593 [PMID: 33583069 DOI: 10.1111/pan.14158]", url: "https://doi.org/10.1111/pan.14158" },
  { id: 74, kind: "As cited in the manuscript; not independently re-verified.", text: "Al Lawati TT, Al Marhoobi RM. Timing of Button Battery Removal From the Upper Gastrointestinal System in Children. Pediatr Emerg Care 2021; 37: e461-e463 [PMID: 30601350 DOI: 10.1097/PEC.0000000000001697]", url: "https://doi.org/10.1097/PEC.0000000000001697" },
  { id: 75, kind: "As cited in the manuscript; not independently re-verified.", text: "Rosenfeld EH, Sola R Jr, Yu Y, St Peter SD, Shah SR. Battery ingestions in children: Variations in care and development of a clinical algorithm. J Pediatr Surg 2018; 53: 1537-1541 [PMID: 29486889 DOI: 10.1016/j.jpedsurg.2018.01.017]", url: "https://doi.org/10.1016/j.jpedsurg.2018.01.017" },
  { id: 76, kind: "As cited in the manuscript; not independently re-verified.", text: "Ríos G, Rodríguez L, Lucero Y, Miquel I, Arancibia ME, Alliende F. Endoscopic Findings Associated With Button Battery Ingestion in Children: Do We Need to Change the Protocol for Managing Gastric Location? Pediatr Emerg Care 2020; 36: 523-526 [PMID: 29369264 DOI: 10.1097/PEC.0000000000001415]", url: "https://doi.org/10.1097/PEC.0000000000001415" },
  { id: 77, kind: "As cited in the manuscript; not independently re-verified.", text: "Demiroren K. Management of Gastrointestinal Foreign Bodies with Brief Review of the Guidelines. Pediatr Gastroenterol Hepatol Nutr 2023; 26: 1-14 [PMID: 36816435 DOI: 10.5223/pghn.2023.26.1.1]", url: "https://doi.org/10.5223/pghn.2023.26.1.1" },
  { id: 78, kind: "As cited in the manuscript; not independently re-verified.", text: "Holtestaul T, Franko J, Escobar MA Jr, Barlow M. Pediatric Ingestions. Surg Clin North Am 2022; 102: 779-795 [PMID: 36209745 DOI: 10.1016/j.suc.2022.07.009]", url: "https://doi.org/10.1016/j.suc.2022.07.009" },
  { id: 79, kind: "As cited in the manuscript; not independently re-verified.", text: "Brown B, Al-Zubeidi D. Endoscopy findings in an unusually well patient with a chronic retained button battery. J Pediatr Gastroenterol Nutr 2024; 78: 745-746 [PMID: 38299302 DOI: 10.1002/jpn3.12149]", url: "https://doi.org/10.1002/jpn3.12149" },
  { id: 80, kind: "As cited in the manuscript; not independently re-verified.", text: "Goh S, Siu JM, Philteos J, James AL, Ostrow O, McKinnon NK, Everett T, Levine M, Whyte H, Lam CZ, Propst EJ, Wolter NE. Pediatric Esophageal Button Battery Protocol Reduces Time From Presentation to Removal. Laryngoscope 2024; 134: 5170-5177 [PMID: 38934450 DOI: 10.1002/lary.31607]", url: "https://doi.org/10.1002/lary.31607" },
  { id: 81, kind: "As cited in the manuscript; not independently re-verified.", text: "Russell RT, Griffin RL, Weinstein E, Billmire DF. Esophageal button battery ingestions: decreasing time to operative intervention by level I trauma activation. J Pediatr Surg 2014; 49: 1360-1362 [PMID: 25148737 DOI: 10.1016/j.jpedsurg.2014.01.050]", url: "https://doi.org/10.1016/j.jpedsurg.2014.01.050" },
  { id: 82, kind: "As cited in the manuscript; not independently re-verified.", text: "Eliason MJ, Melzer JM, Winters JR, Gallagher TQ. Identifying predictive factors for long-term complications following button battery impactions: A case series and literature review. Int J Pediatr Otorhinolaryngol 2016; 87: 198-202 [PMID: 27368471 DOI: 10.1016/j.ijporl.2016.06.016]", url: "https://doi.org/10.1016/j.ijporl.2016.06.016" },
  { id: 83, kind: "As cited in the manuscript; not independently re-verified.", text: "Lahmar J, Célérier C, Garabédian EN, Couloigner V, Leboulanger N, Denoyelle F. Esophageal lesions following button-battery ingestion in children: Analysis of causes and proposals for preventive measures. Eur Ann Otorhinolaryngol Head Neck Dis 2018; 135: 91-94 [PMID: 29054752 DOI: 10.1016/j.anorl.2017.09.004]", url: "https://doi.org/10.1016/j.anorl.2017.09.004" },
  { id: 84, kind: "As cited in the manuscript; not independently re-verified.", text: "Jatana KR, Chao S, Jacobs IN, Litovitz T. Button Battery Safety: Industry and Academic Partnerships to Drive Change. Otolaryngol Clin North Am 2019; 52: 149-161 [PMID: 30309675 DOI: 10.1016/j.otc.2018.08.009]", url: "https://doi.org/10.1016/j.otc.2018.08.009" },
  { id: 85, kind: "As cited in the manuscript; not independently re-verified.", text: "Chao S, Gibbs H, Rhoades K, Mehrer C, Jacobs IN, Jatana KR. Button battery taping and disposal: Risk reduction strategies for the household setting. Int J Pediatr Otorhinolaryngol 2022; 153: 111008 [PMID: 34986444 DOI: 10.1016/j.ijporl.2021.111008]", url: "https://doi.org/10.1016/j.ijporl.2021.111008" },
  { id: 86, kind: "As cited in the manuscript; not independently re-verified.", text: "Girardi AM, Long DN, Austin G. 'You can be as vigilant as you can, yet they make their way in': A descriptive study of parent and caregiver perspectives towards keeping children safe from button batteries. JPGN Rep 2024; 5: 270-275 [PMID: 39149183 DOI: 10.1002/jpr3.12096]", url: "https://doi.org/10.1002/jpr3.12096" },
  { id: 87, kind: "As cited in the manuscript; not independently re-verified.", text: "Mahesh A, Keogh I, Majeed K. Button battery ingestion in children is potentially fatal: assessing and raising awareness of a decades old problem. J Laryngol Otol 2026; 140: 149-153 [PMID: 41185566 DOI: 10.1017/S0022215125103782]", url: "https://doi.org/10.1017/S0022215125103782" },
  { id: 88, kind: "As cited in the manuscript; not independently re-verified.", text: "Jordan KS, Carpenter C, Steelman SH. Button Battery Ingestion: A Tiny Object with the Potential for a Catastrophic Outcome. Adv Emerg Nurs J 2025; 47: 122-128 [PMID: 40106780 DOI: 10.1097/TME.0000000000000565]", url: "https://doi.org/10.1097/TME.0000000000000565" },
  { id: 89, kind: "As cited in the manuscript; not independently re-verified.", text: "Bolton SM, Saker M, Bass LM. Button battery and magnet ingestions in the pediatric patient. Curr Opin Pediatr 2018; 30: 653-659 [PMID: 30188872 DOI: 10.1097/MOP.0000000000000665]", url: "https://doi.org/10.1097/MOP.0000000000000665" },
  { id: 90, kind: "As cited in the manuscript; not independently re-verified.", text: "Eliason MJ, Ricca RL, Gallagher TQ. Button battery ingestion in children. Curr Opin Otolaryngol Head Neck Surg 2017; 25: 520-526 [PMID: 28858893 DOI: 10.1097/MOO.0000000000000410]", url: "https://doi.org/10.1097/MOO.0000000000000410" },
  { id: 91, kind: "As cited in the manuscript; not independently re-verified.", text: "Jayachandra S, Eslick GD. A systematic review of paediatric foreign body ingestion: presentation, complications, and management. Int J Pediatr Otorhinolaryngol 2013; 77: 311-317 [PMID: 23261258 DOI: 10.1016/j.ijporl.2012.11.025]", url: "https://doi.org/10.1016/j.ijporl.2012.11.025" },
  { id: 92, kind: "As cited in the manuscript; not independently re-verified.", text: "Kipiki PE, Chussi D, Shija P, Kimwaga F, Sadiq A, Mlay K. Button battery ingestion: A serious pitfall of diagnosis of ingested foreign bodies in children from resource-limited settings - A case report. Int J Surg Case Rep 2023; 109: 108593 [PMID: 37536099 DOI: 10.1016/j.ijscr.2023.108593]", url: "https://doi.org/10.1016/j.ijscr.2023.108593" }
];

const NODES = [
  {
    id: "entry",
    type: "start",
    label: "SUSPECTED OR WITNESSED BUTTON BATTERY EXPOSURE IN A CHILD",
    sub: "Ingestion, nasal insertion or aural insertion – witnessed, suspected, or unexplained drooling, food refusal, vomiting, stridor or haematemesis",
    meaning: "Entry criterion for the whole pathway: any child under 18 years (peak median age 18–36 months) with witnessed or suspected button-battery ingestion, nasal insertion, or aural insertion, or presenting with unexplained non-specific or red-flag aerodigestive symptoms.",
    rationale: "Up to half of exposures are unwitnessed, and more than half of serious outcomes follow unwitnessed events because of diagnostic delay. Early symptoms overlap with ordinary viral respiratory or gastrointestinal illness, a child who swallowed a 20 mm lithium cell can look deceptively well despite deep mucosal injury already under way, airway symptoms predict tracheo-oesophageal fistula and vocal cord paralysis, and any haematemesis — however small or remote in time — may be a sentinel bleed from an arterio-oesophageal fistula. Society guidance therefore converges on a protocol-driven rather than symptom-driven model of care.",
    cautions: [
      "Dysphagia occurs in roughly a third, fever and cough in roughly a quarter, feeding difficulty in 48.1% and respiratory difficulty in 34.6% of pooled ingestion cases — none of this is specific to button-battery exposure, which is precisely why the entry criterion is suspicion-based rather than symptom-based."
    ],
    refs: [6, 7, 8, 9, 10, 11, 26, 28, 29, 48, 49, 50, 52, 59]
  },
  {
    id: "immediate-actions",
    type: "action",
    certainty: "core",
    label: "IMMEDIATE ACTIONS – ANY SETTING [E, N, P]",
    sub: "• Act on suspicion; do not wait for symptoms or for fasting\n• Transfer at once to a centre with paediatric endoscopy and anaesthesia\n• Nil by mouth apart from a mitigation agent\n• Identify the cell (imprint code, packaging, companion cell) only if this does not delay transfer",
    meaning: "Universal first actions in any setting — pre-hospital, primary care or emergency department — on suspicion alone: begin transfer to a facility with paediatric endoscopy and anaesthesia without waiting for symptoms or an anaesthetic fasting interval, keep the child nil by mouth except for an eligible mitigation agent, and check the battery's imprint code only if doing so costs zero delay.",
    rationale: "Hydroxide generation at the battery's negative pole raises local tissue pH to 10–13, causing measurable mucosal injury within 15 minutes and full-thickness transmural injury within 2–6 hours experimentally — dwell time is the only variable clinicians can actually control. Even a \"spent\" or discharged cell retains enough residual voltage to injure tissue. Recent oral intake does not justify postponing extraction, and in rural or resource-limited settings delayed recognition and transfer is the dominant driver of bad outcomes. Imprint codes encode chemistry/voltage and diameter (e.g. CR2032 = 20 mm diameter, 3.2 mm thick; CR/BR = 3.0 V, LR/L = 1.5 V) and can help anticipate severity, but must never be chased at the expense of transfer time.",
    cautions: [
      "Because this box sits upstream of the anatomical branch point, the figure applies \"transfer at once\" and \"nil by mouth\" to nasal and aural insertions too — yet a series of 176 nasal extractions using a purpose-designed hook needed general anaesthesia in only 6.8% of cases, so the same urgency language covers a substantially lower-acuity group as well."
    ],
    refs: [8, 9, 10, 12, 20, 43, 44, 45, 46, 71, 72, 92]
  },
  {
    id: "mitigation",
    type: "action",
    certainty: "low",
    label: "LOW CERTAINTY – MITIGATION [N, P]",
    sub: "Mainly preclinical evidence. Only if age ≥ 12 months, able to swallow and ingestion ≤ 12 h:\n• Honey 10 mL every 10 min, max. 6 doses (pre-hospital)\n• Sucralfate 1 g/10 mL, 10 mL every 10 min, max. 3 doses (hospital)\nNever delays transfer, imaging or removal; omit if oesophageal dwell may exceed 12 h",
    meaning: "Oral administration of a viscous, mucosal-coating agent — honey or a sucralfate suspension — as a temporary bridge before endoscopic removal, restricted to children aged 12 months or older who can swallow and whose ingestion occurred within 12 hours.",
    rationale: "Porcine and cadaveric studies showed that honey and sucralfate coat the battery, blunt the local pH rise, and reduce burn depth compared with saline. The 12-hour window exists because gross oesophageal perforation rarely manifests early — only 2% of perforations in one series of 290 severe/fatal cases were diagnosed within 24 hours — whereas beyond 12 hours perforation becomes plausible enough that oral agents are withheld. Honey is contraindicated under 12 months because of infant-botulism risk. Mitigation buys time; it is never a substitute for extraction and must never delay transfer, imaging, endoscopy or anaesthesia.",
    cautions: [
      "Home-vs-hospital and age-cutoff wording differs slightly between the figure and the guideline sources it draws on — NASPGHAN allows honey or sucralfate without a strict home/hospital split, and ESPGHAN's own caution threshold for honey is phrased as \"< 1 year\" rather than \"≥ 12 months\" applied identically to both agents; treat the figure's framing as the operative one for this tool.",
      "All dosing and eligibility numbers in this box are guideline-sourced (NASPGHAN 2020 mitigation update; National Capital Poison Center 2018), resting mainly on preclinical animal and cadaveric data — hence the dashed \"LOW CERTAINTY\" border."
    ],
    refs: [8, 10, 15, 30, 31, 47, 69, 70]
  },
  {
    id: "radiographs",
    type: "action",
    certainty: "core",
    label: "ANTEROPOSTERIOR AND LATERAL RADIOGRAPHS OF NECK, CHEST AND ABDOMEN [E, N, P]",
    sub: "Before any other investigation: number of cells, anatomical level, double-rim (halo) sign, orientation of the narrow negative pole",
    meaning: "Immediate two-view plain radiography spanning the entire neck, chest and abdomen, as the mandatory first-line investigation ahead of any other test, regardless of recent oral intake.",
    rationale: "Biplane films localise the battery, exclude a second ingested cell, distinguish a button battery from an ordinary coin via the frontal double-rim (\"halo\") sign and a lateral step-off, and identify the narrower negative pole where hydroxide accumulation and liquefactive necrosis are greatest. Negative-pole orientation predicts which anatomical structures are at risk: anterior proximal-oesophageal orientation threatens the trachea (tracheo-oesophageal fistula), inferior thyroid artery and recurrent laryngeal nerve (vocal cord paralysis); posterior orientation risks spondylodiscitis; mid-oesophageal position carries the highest risk to the aorta. Pre-hospital clinical risk scores and AI radiograph classifiers exist but do not replace plain radiography.",
    cautions: [
      "Whether an isolated, witnessed nasal or aural insertion also needs full neck/chest/abdomen radiographs (e.g. to exclude an occult co-ingested cell) is not explicitly addressed in the manuscript — not stated."
    ],
    refs: [8, 9, 10, 12, 35, 62, 63]
  },
  {
    id: "where-decision",
    type: "decision",
    label: "Where is the battery?",
    meaning: "The central three-way triage point: subsequent management is governed almost entirely by anatomical location and elapsed time, not by symptom burden.",
    rationale: "Oesophageal lodgement carries an odds ratio of 18.66 for any complication and 15.52 for death compared with non-oesophageal locations; roughly three-quarters of oesophageal impactions lodge in the proximal oesophagus. Most cells that traverse the pylorus pass spontaneously (post-pyloric intestinal perforation occurs in only 2.5% of pooled ingestion cases). Nasal and aural insertions cause rapid local tissue destruction — septal perforation in 14% to roughly one-sixth of nasal impactions across two series — and need urgent otolaryngological extraction rather than endoscopy.",
    cautions: [],
    refs: [8, 9, 10, 11, 15, 23, 24, 26, 27, 31, 59, 60]
  },
  {
    id: "oesophagus-header",
    type: "branch",
    label: "OESOPHAGUS",
    meaning: "Column header for the oesophageal limb — the highest-complication-risk location, requiring emergency removal.",
    cautions: [],
    refs: []
  },
  {
    id: "stomach-header",
    type: "branch",
    label: "STOMACH OR BEYOND THE PYLORUS",
    meaning: "Column header for cells that have passed the gastro-oesophageal junction — the limb where current guidance diverges most sharply between observation and endoscopy.",
    cautions: [],
    refs: []
  },
  {
    id: "nose-ear-header",
    type: "branch",
    label: "NOSE OR EAR",
    meaning: "Column header for insertions rather than ingestions — managed as an ENT emergency with no formal gastrointestinal or poison-centre guideline protocol of its own.",
    cautions: [],
    refs: []
  },
  {
    id: "emergency-removal",
    type: "action",
    certainty: "core",
    label: "EMERGENCY ENDOSCOPIC REMOVAL [E, N, P]",
    sub: "Immediately – ideally < 2 h from ingestion – under general anaesthesia with a protected airway",
    meaning: "Immediate endoscopic extraction under general anaesthesia with endotracheal airway protection, ideally within 2 hours of ingestion, as fast as safe anaesthetic and endoscopic resources allow, without waiting for standard nil-by-mouth fasting intervals.",
    rationale: "Transmural histological oesophageal necrosis develops within 2–6 hours experimentally, and complication odds rise sharply with dwell time (greater than 6 hours predicts complications in pooled data; ≥10 hours carries an odds ratio of 3.71, ≥12 hours 5.12). Endoscopy allows direct visualisation for controlled extraction and grading of mucosal burn depth. Senior anaesthetic/surgical backup, large-bore IV access and prepared blood products are advised when the battery sits in the mid-oesophagus or presentation is delayed.",
    cautions: [
      "In centres without immediate paediatric endoscopy, extraction of upper oesophageal cells using an optimised Miller size-3 video laryngoscope blade has been described in a single-centre series — not a substitute for endoscopy where it is available.",
      "Real-world impaction-to-removal intervals run far longer than the 2-hour target in practice (a reported median of 10.5 hours in one series), underscoring how much of the complication burden is driven by pre-hospital and transfer delay rather than in-hospital technique."
    ],
    refs: [1, 8, 9, 10, 26, 27, 31, 35, 71, 72, 73, 74]
  },
  {
    id: "endoscopy-stomach",
    type: "action",
    certainty: "core",
    label: "ENDOSCOPY [E, N, P]",
    sub: "Any symptom, however minor, or a co-ingested magnet",
    meaning: "Mandatory endoscopic evaluation and removal, where accessible, for any child with a battery in the stomach or beyond the pylorus who has any symptom at all — however minor — or who has co-ingested a magnet.",
    rationale: "A symptomatic child whose battery already lies beyond the oesophagus may be signalling active gastric/distal mucosal injury, or oesophageal injury sustained in transit before the cell reached the stomach — endoscopic series show clinically significant oesophageal or gastric burns even when the battery itself is now gastric. A co-ingested magnet with a metallic battery creates a high risk of trans-mural magnetic attraction, pressure necrosis, fistula and perforation across adjacent bowel loops. Every compared guideline agrees on this one indication.",
    cautions: [
      "The figure stacks this box directly above LOCAL PROTOCOL – ASYMPTOMATIC CHILD with a real connecting arrow between them but no explicit decision diamond — read it as: any symptom or co-ingested magnet routes here; genuinely asymptomatic without a magnet routes to the box below.",
      "If a symptomatic battery (or battery-plus-magnet) has already passed beyond the reach of upper endoscopy, the manuscript mentions surgical, CT or ultrasonographic management for intestinal perforation rather than specifying enteroscopy versus surgery — not resolved in the figure."
    ],
    refs: [8, 9, 10, 12, 26, 55, 76, 89]
  },
  {
    id: "ent-removal",
    type: "action",
    certainty: "low",
    label: "LOW CERTAINTY – URGENT ENT REMOVAL",
    sub: "Case series and expert opinion; no guideline protocol\n• Remove as an emergency\n• Inspect for nasal septal perforation and tympanic membrane or ossicular injury\n• Septal perforation is the commonest complication of insertion and may appear after discharge: arrange ENT follow-up",
    meaning: "Emergency otolaryngological extraction of a nasal or aural button battery, targeted inspection of the nasal septum, tympanic membrane, middle-ear ossicles and facial-nerve function, and scheduled ENT outpatient follow-up after discharge.",
    rationale: "Moist nasal and aural cavities complete the same external electrolytic circuit as the oesophagus. Nasal septal perforation — the single commonest complication of insertion — develops within hours to days, occurred in 14% (plus 6% nasal adhesion) in one 159-child series and in roughly one-sixth of a 176-child series with no clean linear relationship to dwell time, and may only become apparent after the child has already been discharged. Aural insertion can destroy the tympanic membrane and ossicles and cause facial-nerve paralysis.",
    cautions: [
      "No formal gastrointestinal or poison-centre guideline covers ENT insertion, hence this box carries no [E]/[N]/[P] tag at all — the whole box rests on case series and expert opinion.",
      "In the same 176-case nasal series, general anaesthesia was needed in only 6.8% of extractions using a purpose-designed hook, most patients being boys aged 1–5 years — useful context for how often this \"emergency removal\" actually escalates to a theatre case."
    ],
    refs: [11, 26, 59, 60]
  },
  {
    id: "delayed-diagnosis",
    type: "action",
    certainty: "local",
    label: "LOCAL PROTOCOL – DELAYED DIAGNOSIS [E]",
    sub: "Diagnosis or removal > 12 h after ingestion: CT or CT angiography before removal; remove where cardiothoracic support is available",
    meaning: "When battery identification or extraction occurs more than 12 hours after ingestion, obtain contrast-enhanced CT or CT angiography before any endoscopic instrumentation to assess vascular integrity, and perform extraction only where cardiothoracic surgical support is available.",
    rationale: "Prolonged oesophageal impaction (≥12 hours, odds ratio 5.12 for complications) is the leading risk factor for lethal vascular injury — an aorto-oesophageal or other arterio-oesophageal fistula. Pre-instrumentation CT shows how close necrosis or oedema lies to the aorta or a major artery, so that extraction does not itself precipitate uncontrolled haemorrhage without cardiothoracic surgery standing by.",
    cautions: [
      "Figure-vs-logic ordering issue: the figure draws a sequential arrow from EMERGENCY ENDOSCOPIC REMOVAL into this box, even though this box's own content (CT before removal, cardiothoracic readiness during removal) only makes sense if elapsed time is checked BEFORE endoscopy, not after it. Read this box as a gate to evaluate before removal in any case diagnosed late, not as a step that follows removal.",
      "In an actively bleeding child, this imaging step must not delay operative control.",
      "NASPGHAN and the National Capital Poison Center guideline do not specify this particular > 12 h pre-removal CT rule — it is sourced to ESPGHAN specifically."
    ],
    refs: [8, 27, 29, 57, 71, 72]
  },
  {
    id: "asymptomatic-child",
    type: "action",
    certainty: "local",
    label: "LOCAL PROTOCOL – ASYMPTOMATIC CHILD [E, N, P]",
    sub: "Guidance diverges (Table 6):\n• Diagnosed ≤ 12 h: observe; repeat radiograph at 7–14 days [E] or if not passed by 10–14 days [P]\n• Young child with a large cell: retrieve if retained (≥ 15 mm, < 6 y, ≥ 4 days [P]; age-based, 2–4 days [N])\n• Delayed diagnosis (> 12 h): consider endoscopy and CT [E]\n• Prior GI surgery or stenosis: lower threshold for endoscopy\n• German guidance: endoscopy in all cases",
    meaning: "Institution-specific management of an asymptomatic child, without a co-ingested magnet, whose battery has passed into the stomach or beyond the pylorus — choosing between expectant observation with scheduled repeat radiography versus endoscopic retrieval or screening for transit oesophageal injury, according to whichever cited guideline the local team follows.",
    rationale: "No comparative study has tested universal endoscopy against expectant observation in this group, so society recommendations genuinely diverge rather than one being simply wrong. The case for observation rests on a high rate of spontaneous passage once past the gastro-oesophageal junction or pylorus, the rarity of severe gastric or post-pyloric injury in unselected cohorts, and the anaesthetic risk and cost of universal endoscopy. The case for retrieval or screening rests on endoscopic series showing real oesophageal or gastric mucosal burns even in cells now sitting in the stomach, the fact that unwitnessed or delayed presentation cannot exclude a prior oesophageal dwell before the cell transited onward, and the added risk from pre-existing intestinal stenosis or prior GI surgery.",
    cautions: [
      "An additional NCPC threshold — \"consider diagnostic endoscopy if a cell ≥ 20 mm in a child < 5 years may have lodged in the oesophagus > 2 h\" — appears in the manuscript's own guideline-comparison table but is omitted from this figure box.",
      "NASPGHAN's \"age-based\" retrieval thresholds for a large retained gastric cell at 2–4 days are not given as explicit numbers anywhere in the manuscript — not stated; the manuscript itself says the source guideline should be consulted for full criteria."
    ],
    refs: [8, 9, 10, 12, 23, 53, 55, 75, 76, 77, 78, 79]
  },
  {
    id: "at-removal",
    type: "action",
    certainty: "low",
    label: "LOW CERTAINTY – AT REMOVAL [N, P]",
    sub: "If no perforation is seen: irrigate with 0.25% sterile acetic acid, 50–150 mL\nRecord negative-pole orientation; grade mucosal injury",
    meaning: "Immediately after extraction, inspect endoscopically to exclude perforation, irrigate the injured mucosa with 50–150 mL of 0.25% sterile acetic acid if no perforation is seen, record the negative pole's anatomical orientation, and grade the depth of mucosal injury.",
    rationale: "In animal models the alkaline tissue milieu persists in devitalised mucosa even after the battery is removed, so liquefactive necrosis keeps progressing; dilute acetic acid neutralises residual alkalinity, reducing injury progression in porcine studies and showing safety and improved mucosal appearance in a small initial clinical series — though no effect on stricture, fistula or mortality has been demonstrated yet. Recording negative-pole orientation and injury grade at this point directly feeds the post-removal imaging and follow-up decisions in the next box.",
    cautions: [
      "Placing \"record negative-pole orientation; grade mucosal injury\" inside this dashed LOW CERTAINTY box visually groups ordinary endoscopic documentation under the preclinical border style — the figure's own caption clarifies that LOW CERTAINTY applies specifically to honey, sucralfate and acetic acid irrigation (and nasal/aural removal), not to documentation itself."
    ],
    refs: [8, 10, 15, 35, 45, 47, 57, 70, 71, 72]
  },
  {
    id: "gastric-position-note",
    type: "reference",
    label: "A gastric position does not exclude oesophageal injury sustained in transit",
    meaning: "A standalone caution, drawn as its own box beneath the asymptomatic-child protocol: finding the battery in the stomach on radiograph does not mean the oesophagus was never injured — the cell may simply have already moved on from where it did its damage.",
    rationale: "The same oesophageal-injury-in-transit concern that justifies endoscopic screening for the delayed-diagnosis subgroup above applies, in principle, to any gastric cell — endoscopic series have documented real oesophageal or gastric mucosal burns even when the battery's current resting place is the stomach.",
    cautions: [
      "Drawn with a solid border in the source figure despite being a caveat rather than an action step — rendered here without a certainty tag, since the figure's three-tier scheme (core/low/local) is defined for guideline-concordant steps, and this box is better read as a plain cross-cutting note."
    ],
    refs: [55, 76]
  },
  {
    id: "after-removal",
    type: "action",
    certainty: "local",
    label: "LOCAL PROTOCOL – AFTER REMOVAL [E, P]",
    sub: "Admit if mucosal injury; oesophagram 1–2 days after removal; CT angiography or MRI according to injury grade or suspected vascular injury; diet and discharge decided by the local team",
    meaning: "Post-extraction inpatient observation, a contrast oesophagram at 1–2 days, selective cross-sectional imaging (CT angiography or MRI, the latter safe only after the battery itself is out) matched to injury severity or suspected vascular/airway injury, and a multidisciplinary decision on feeding, discharge timing and stricture-surveillance endoscopy.",
    rationale: "Gross perforation usually manifests more than 24 hours after lodgement; tracheo-oesophageal fistula and vocal cord paralysis evolve over days; aorto-oesophageal fistula over days to weeks; spondylodiscitis over weeks; oesophageal stricture over weeks to months (43% in one selected tertiary cohort). But the surveillance-imaging evidence itself is expert-derived rather than comparative — surveys show no consensus on which MRI findings should change management, and routine serial MRI increased length of stay and cost without a demonstrable outcome benefit — which is why imaging and discharge decisions are explicitly handed to local multidisciplinary protocol rather than fixed here.",
    cautions: [
      "Preserved tracheo-oesophageal fat plane on MRI had 100% negative predictive value for tracheo-oesophageal fistula in one series, while loss of the fat plane had only 50% positive predictive value — useful for reassurance, much less useful for ruling fistula in."
    ],
    refs: [8, 10, 12, 19, 31, 34, 35, 57, 65, 66, 67, 68, 82]
  },
  {
    id: "discharge",
    type: "action",
    tone: "alarm",
    label: "BEFORE DISCHARGE – WRITTEN SAFETY-NETTING FOR THE CAREGIVER [E, P]",
    sub: "Return IMMEDIATELY for haematemesis or melaena (however small), fever, chest, back or abdominal pain, dysphagia, drooling or respiratory deterioration. Vascular complications may present days to weeks after removal; a small sentinel bleed may precede fatal haemorrhage.",
    meaning: "Explicit written discharge instructions for parents/caregivers mandating immediate emergency re-presentation for any red-flag haemorrhagic, infectious, gastrointestinal or airway symptom, given to every child leaving this pathway regardless of which of the three anatomical limbs they came through.",
    rationale: "Tissue necrosis and peri-vascular inflammation can keep evolving well after battery extraction. Aorto-oesophageal and other arterio-oesophageal fistulae are the leading cause of death in this condition, can present days to weeks after removal — well beyond the index admission — and frequently announce themselves first with a minor, self-limiting sentinel bleed (haematemesis or melaena) before a catastrophic, fatal haemorrhage. Delayed perforation, mediastinitis, tracheo-oesophageal fistula, vocal cord paralysis, spondylodiscitis, stricture and distal bowel perforation or abscess can likewise all present after discharge.",
    cautions: [
      "This box's warning text is written around gastrointestinal/vascular complications; it does not separately mention nasal septal perforation, epistaxis, otorrhoea or facial-nerve weakness, even though the figure draws the NOSE OR EAR limb converging into this very box — the preceding ENT-removal box is where that follow-up gets arranged instead.",
      "The figure lists eight red-flag symptom groups; the manuscript's own narrative summary of this same safety-netting advice lists only six in one sentence (omitting abdominal pain, dysphagia and drooling there, though all three appear elsewhere in the manuscript) — this tool follows the fuller, eight-item figure wording."
    ],
    refs: [8, 10, 26, 28, 29, 31, 34, 35, 52, 61]
  }
];

const GLOSSARY = [
  { match: "ESPGHAN", full: "European Society for Paediatric Gastroenterology, Hepatology and Nutrition", def: "One of the three guideline sources this algorithm consolidates (tagged [E] on diagram boxes) — its 2021 position paper on button battery ingestion." },
  { match: "NASPGHAN", full: "North American Society for Pediatric Gastroenterology, Hepatology, and Nutrition", def: "One of the three guideline sources this algorithm consolidates (tagged [N] on diagram boxes) — its 2015 foreign-body clinical report and 2020 mitigation update." },
  { match: "NCPC", full: "National Capital Poison Center", def: "One of the three guideline sources this algorithm consolidates (tagged [P] on diagram boxes) — its button battery ingestion triage and treatment guideline." },
  { match: "TOF", full: "tracheo-oesophageal fistula", def: "An abnormal connection between the trachea and oesophagus that can develop after prolonged oesophageal battery impaction, particularly with anterior negative-pole orientation — evolves over days and predicted by airway symptoms at presentation." },
  { match: "OR", full: "odds ratio", def: "A measure of association used throughout this algorithm's evidence base — e.g. oesophageal location carries an OR of 18.66 for any complication versus non-oesophageal locations." },
  { match: "PPV", full: "positive predictive value", def: "The probability that a positive test result (e.g. loss of the tracheo-oesophageal fat plane on MRI) truly reflects the condition being tested for." },
  { match: "NPV", full: "negative predictive value", def: "The probability that a negative test result (e.g. a preserved tracheo-oesophageal fat plane on MRI) truly reflects the absence of the condition being tested for." }
];

const AGENTS = [];
