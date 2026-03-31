// ─────────────────────────────────────────────────────────────────────────────
// Coursify Recommendation Engine — 39 Courses
// ─────────────────────────────────────────────────────────────────────────────

const courses = [
  // ── Engineering ──────────────────────────────────────────────────────────
  { id: 1,  course: "BS Civil Engineering",                      description: "Design and construction of infrastructure — buildings, roads, bridges, and water systems.",          careerPaths: ["Civil Engineer","Structural Engineer","Construction Manager","Urban Planner","Project Engineer"],       riasec:{R:3,I:2,C:1},   mbti:["ISTJ","INTJ","ISTP","ESTP","ESTJ","ENTJ"], strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id: 2,  course: "BS Electrical Engineering",                 description: "Electrical systems, circuits, and power generation for homes, industries, and renewable energy.",      careerPaths: ["Electrical Engineer","Power Systems Engineer","Automation Engineer","R&D Engineer"],                   riasec:{R:3,I:2,C:1},   mbti:["INTJ","ISTJ","INTP","ISTP","ENTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:2,English:1} },
  { id: 3,  course: "BS Computer Engineering",                   description: "Combines hardware and software design for embedded systems and computing devices.",                    careerPaths: ["Computer Engineer","Embedded Systems Developer","Hardware Designer","IoT Engineer"],                  riasec:{I:3,R:2,C:1},   mbti:["INTJ","INTP","ISTJ","ISTP","ENTJ","ENTP"], strands:{STEM:3,TVL:1,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:3,English:1} },
  { id: 4,  course: "BS Mechanical Engineering",                 description: "Design, analysis, and manufacturing of mechanical systems and machines.",                             careerPaths: ["Mechanical Engineer","Automation Specialist","Manufacturing Engineer","HVAC Engineer"],              riasec:{R:3,I:2,C:1},   mbti:["ISTJ","INTJ","ISTP","ESTJ","ENTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id: 5,  course: "BS Electronics Engineering",                description: "Design of electronic circuits, communication systems, and signal processing devices.",               careerPaths: ["Electronics Engineer","Circuit Designer","Telecom Engineer","Signal Processing Engineer"],          riasec:{I:3,R:2,C:1},   mbti:["INTJ","INTP","ISTJ","ISTP","ENTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:2,English:1} },
  { id: 6,  course: "BS Geodetic Engineering",                   description: "Surveying, mapping, GIS, and earth measurement science for land and infrastructure projects.",        careerPaths: ["Geodetic Engineer","Survey Engineer","GIS Specialist","Cartographer"],                              riasec:{R:3,I:2,C:2},   mbti:["ISTJ","INTJ","ISTP","ESTJ"],               strands:{STEM:3,TVL:1,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:2,English:1} },
  { id: 7,  course: "BS Environmental Engineering",              description: "Engineering solutions for pollution control, waste management, and environmental sustainability.",    careerPaths: ["Environmental Engineer","Sustainability Specialist","Waste Management Engineer","EHS Officer"],     riasec:{I:2,R:2,S:1,C:1}, mbti:["INFJ","INTJ","ISTJ","ISFJ","ENFJ"],       strands:{STEM:3,TVL:1,GAS:2,ABM:0,HUMSS:1}, subjects:{Math:2,Science:3,Computer:1,English:2} },
  { id: 8,  course: "BS Agricultural and Biosystems Engineering",description: "Combining agricultural science and engineering to improve farming systems and food production.",      careerPaths: ["Agricultural Engineer","Biosystems Analyst","Farm Equipment Engineer","Irrigation Specialist"],    riasec:{R:3,I:2,S:1},   mbti:["ISTJ","ISTP","ESTJ","INTJ"],               strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:2,Science:3,Computer:1,English:1} },
  { id: 9,  course: "BS Naval Architecture and Marine Engineering",description: "Design of ships, marine vessels, and offshore structures for seafaring and ocean industries.",     careerPaths: ["Naval Architect","Marine Engineer","Offshore Engineer","Ship Designer"],                           riasec:{R:3,I:2,C:1},   mbti:["ISTJ","INTJ","ISTP","ESTP","ESTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },

  // ── Computer Science & IS ────────────────────────────────────────────────
  { id: 10, course: "BS Computer Science",                       description: "Software development, algorithms, artificial intelligence, and computational theory.",               careerPaths: ["Software Engineer","ML Engineer","Data Scientist","Systems Analyst","Cybersecurity Specialist"],   riasec:{I:3,R:2,C:1},   mbti:["INTJ","INTP","ISTJ","ISTP","ENTJ","ENTP"], strands:{STEM:3,TVL:1,ABM:0,HUMSS:0,GAS:1}, subjects:{Math:3,Science:2,Computer:3,English:1} },
  { id: 11, course: "BS Information Technology",                 description: "IT systems, networks, databases, web development, and infrastructure management.",                  careerPaths: ["IT Manager","Network Admin","Web Developer","Database Admin","IT Consultant"],                   riasec:{I:2,R:2,C:2},   mbti:["ISTJ","ESTJ","ISTP","ESTP","ENTJ","INTJ"], strands:{STEM:3,TVL:2,ABM:1,HUMSS:0,GAS:1}, subjects:{Math:2,Science:1,Computer:3,English:1} },
  { id: 12, course: "BS Information Systems",                    description: "Bridge between business and IT — designing systems that support organizational decision-making.",    careerPaths: ["Business Analyst","Systems Analyst","ERP Consultant","Project Manager","IT Auditor"],           riasec:{E:2,C:2,I:1},   mbti:["ESTJ","ENTJ","ISTJ","ENFJ","ESFJ"],        strands:{STEM:2,ABM:3,TVL:1,HUMSS:1,GAS:2}, subjects:{Math:2,Science:1,Computer:3,English:2} },
  { id: 13, course: "BS Data Science",                           description: "Statistical analysis, machine learning, and data visualization to extract insights from data.",      careerPaths: ["Data Scientist","Data Analyst","ML Engineer","Business Intelligence Analyst"],                   riasec:{I:3,C:2,E:1},   mbti:["INTJ","INTP","ISTJ","ENTJ","ENTP"],        strands:{STEM:3,ABM:2,TVL:0,HUMSS:0,GAS:1}, subjects:{Math:3,Science:2,Computer:3,English:1} },
  { id: 14, course: "BS Technology Communication Management",    description: "Manage IT projects, communication systems, and organizational technology strategies.",              careerPaths: ["IT Project Manager","Communication Specialist","Tech Operations Lead"],                          riasec:{E:2,C:2,S:1},   mbti:["ESTJ","ENTJ","ENFJ","ESFJ","ISTJ"],        strands:{ABM:3,STEM:2,GAS:2,HUMSS:1,TVL:1}, subjects:{Math:1,Science:1,Computer:3,English:3} },

  // ── Technology ───────────────────────────────────────────────────────────
  { id: 15, course: "BS Agricultural Technology",                description: "Hands-on application of modern agricultural systems, farm management, and crop production.",         careerPaths: ["Agri-Technologist","Farm Manager","Crop Specialist","Agricultural Consultant"],                  riasec:{R:3,I:1,S:1},   mbti:["ISTP","ESTP","ISTJ","ESTJ"],               strands:{TVL:3,STEM:2,GAS:2,ABM:1,HUMSS:0}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id: 16, course: "BS Electro-Mechanical Technology",          description: "Integration of mechanical and electrical systems for industrial automation and maintenance.",          careerPaths: ["Electro-Mechanical Technician","Automation Engineer","Industrial Maintenance Tech"],            riasec:{R:3,I:2,C:1},   mbti:["ISTP","ESTP","ISTJ","ESTJ"],               strands:{TVL:3,STEM:3,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:2,Science:2,Computer:2,English:1} },
  { id: 17, course: "BS Electronics Technology",                 description: "Applied electronics, circuit maintenance, and communication technology systems.",                    careerPaths: ["Electronics Technician","Circuit Developer","Communication Tech"],                              riasec:{R:3,I:2,C:1},   mbti:["ISTP","ESTP","ISTJ"],                      strands:{TVL:3,STEM:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:2,Science:2,Computer:2,English:1} },
  { id: 18, course: "BS Energy Systems and Management",          description: "Managing energy production, efficiency, and sustainable power systems.",                             careerPaths: ["Energy Manager","Power Systems Engineer","Sustainability Officer","Energy Auditor"],            riasec:{I:2,R:2,E:1,C:1}, mbti:["INTJ","ISTJ","ENTJ","ESTJ"],              strands:{STEM:3,TVL:2,ABM:1,GAS:2,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id: 19, course: "BS Food Processing and Technology",         description: "Food preservation, processing, safety, and quality assurance in food production systems.",           careerPaths: ["Food Technologist","Quality Analyst","Food Safety Inspector","Production Supervisor"],           riasec:{R:2,I:2,C:2},   mbti:["ISTJ","ISFJ","ESTJ","ESFJ"],               strands:{TVL:3,STEM:2,GAS:2,ABM:1,HUMSS:0}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id: 20, course: "BS Manufacturing Engineering Technology",   description: "Industrial production systems, process optimization, and manufacturing automation.",                 careerPaths: ["Manufacturing Engineer","Process Engineer","Production Supervisor","Quality Engineer"],         riasec:{R:3,I:2,C:1},   mbti:["ISTJ","ISTP","ESTJ","ESTP"],               strands:{TVL:3,STEM:2,GAS:1,ABM:1,HUMSS:0}, subjects:{Math:2,Science:2,Computer:2,English:1} },

  // ── Life Sciences ────────────────────────────────────────────────────────
  { id: 21, course: "BS Agriculture",                            description: "Animal science, crop science, dairy science, and entrepreneurship in Philippine agriculture.",        careerPaths: ["Agriculturist","Farm Manager","Agri-Entrepreneur","Crop Scientist","Animal Scientist"],        riasec:{R:2,I:2,S:1},   mbti:["ISTJ","ISTP","ESTJ","ISFJ"],               strands:{TVL:3,STEM:2,GAS:2,ABM:1,HUMSS:0}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id: 22, course: "BS Agroforestry",                           description: "Integrating trees, crops, and livestock for sustainable land use and forest management.",             careerPaths: ["Agroforestry Specialist","Environmental Planner","Forest Manager","Land Use Consultant"],      riasec:{R:2,I:2,S:1},   mbti:["INFJ","ISTJ","ISFJ","INTJ"],               strands:{STEM:2,TVL:2,GAS:2,ABM:0,HUMSS:1}, subjects:{Math:1,Science:3,Computer:1,English:2} },
  { id: 23, course: "BS Horticulture and Management",            description: "Cultivation of fruits, vegetables, ornamental plants, and landscape design.",                        careerPaths: ["Horticulturist","Landscape Manager","Plant Scientist","Garden Designer"],                      riasec:{R:2,I:2,A:1},   mbti:["ISFP","ISFJ","ISTP","INFP"],               strands:{TVL:3,STEM:2,GAS:2,ABM:0,HUMSS:1}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id: 24, course: "BS Marine Biology",                         description: "Study of marine organisms, ecosystems, and ocean conservation science.",                             careerPaths: ["Marine Biologist","Marine Researcher","Ocean Conservationist","Aquaculture Specialist"],       riasec:{I:3,R:1,S:1},   mbti:["INTJ","INTP","INFJ","INFP","ISFJ"],        strands:{STEM:3,GAS:2,TVL:1,ABM:0,HUMSS:1}, subjects:{Math:2,Science:3,Computer:1,English:2} },

  // ── Natural Sciences ─────────────────────────────────────────────────────
  { id: 25, course: "BS Applied Mathematics",                    description: "Mathematical modeling, statistics, and quantitative methods applied to real-world problems.",         careerPaths: ["Mathematician","Actuary","Data Analyst","Operations Research Analyst","Statistician"],        riasec:{I:3,C:2,R:1},   mbti:["INTJ","INTP","ISTJ","INFJ","ENTP"],        strands:{STEM:3,ABM:2,GAS:1,TVL:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:2,English:1} },
  { id: 26, course: "BS Applied Physics",                        description: "Physics principles applied in engineering, technology, research, and emerging industries.",           careerPaths: ["Physicist","Research Scientist","Instrumentation Engineer","Lab Specialist"],                 riasec:{I:3,R:2,C:1},   mbti:["INTJ","INTP","ISTJ","INFJ","INTP"],        strands:{STEM:3,GAS:1,TVL:0,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:2,English:1} },
  { id: 27, course: "BS Chemistry",                              description: "Chemical processes, materials science, laboratory research, and industrial applications.",            careerPaths: ["Chemist","Lab Analyst","Chemical Engineer","Quality Control Specialist","Researcher"],        riasec:{I:3,R:2,C:1},   mbti:["INTJ","ISTJ","INTP","INFJ"],               strands:{STEM:3,GAS:1,TVL:0,ABM:0,HUMSS:0}, subjects:{Math:2,Science:3,Computer:1,English:1} },
  { id: 28, course: "BS Environmental Science",                  description: "Study of ecosystems, climate, pollution, biodiversity, and environmental conservation strategies.",   careerPaths: ["Environmental Scientist","Ecologist","Conservation Officer","Sustainability Analyst"],       riasec:{I:2,R:2,S:1},   mbti:["INFJ","INTJ","ISFJ","ENFJ","INFP"],        strands:{STEM:3,GAS:2,HUMSS:1,ABM:0,TVL:1}, subjects:{Math:2,Science:3,Computer:1,English:2} },

  // ── Social Sciences & Education ──────────────────────────────────────────
  { id: 29, course: "BS Secondary Education (Mathematics)",      description: "Preparing future mathematics teachers with deep content knowledge and pedagogy skills.",             careerPaths: ["Math Teacher","Education Specialist","Curriculum Developer","Academic Coordinator"],          riasec:{S:3,I:2,A:1},   mbti:["ESFJ","ENFJ","ISFJ","INFJ","ESTJ"],        strands:{STEM:2,HUMSS:3,GAS:2,ABM:1,TVL:1}, subjects:{Math:3,Science:1,Computer:1,English:2,Filipino:2} },
  { id: 30, course: "BS Secondary Education (Science)",          description: "Training educators to teach physical, biological, and earth sciences in secondary schools.",          careerPaths: ["Science Teacher","Lab Coordinator","Education Specialist","Academic Supervisor"],            riasec:{S:3,I:2,A:1},   mbti:["ESFJ","ENFJ","ISFJ","INFJ","ESTJ"],        strands:{STEM:2,HUMSS:3,GAS:2,ABM:1,TVL:1}, subjects:{Math:2,Science:3,Computer:1,English:2,Filipino:2} },
  { id: 31, course: "BS Social Work",                            description: "Supporting individuals, families, and communities through social services and advocacy programs.",    careerPaths: ["Social Worker","Community Development Officer","Case Manager","NGO Program Officer"],       riasec:{S:3,A:1,E:1},   mbti:["ENFJ","ESFJ","INFJ","ISFJ","ENFP"],        strands:{HUMSS:3,GAS:2,ABM:1,STEM:0,TVL:0}, subjects:{English:3,Filipino:3,Humanities:2,Science:1} },
  { id: 32, course: "BS Technical-Vocational Teacher Education", description: "Training educators to teach technical and vocational skills in senior high school programs.",         careerPaths: ["Technical Teacher","Vocational Instructor","Training Officer","Curriculum Developer"],      riasec:{S:3,R:1,E:1},   mbti:["ESFJ","ESTJ","ISFJ","ENFJ"],               strands:{TVL:3,HUMSS:2,GAS:2,STEM:1,ABM:1}, subjects:{Math:1,Computer:2,English:2,Filipino:2} },
  { id: 33, course: "BS Technology and Livelihood Education",    description: "Major in Industrial Arts or Home Economics for teaching practical life and technical skills.",        careerPaths: ["TLE Teacher","Skills Trainer","Home Economics Teacher","Industrial Arts Instructor"],       riasec:{S:3,R:2,A:1},   mbti:["ESFJ","ISFJ","ESFP","ENFJ"],               strands:{TVL:3,HUMSS:2,GAS:2,ABM:1,STEM:1}, subjects:{Math:1,Computer:1,English:2,Filipino:3} },

  // ── Business ─────────────────────────────────────────────────────────────
  { id: 34, course: "BS Business Administration",                description: "Management, marketing, finance, and entrepreneurship for leading and managing organizations.",        careerPaths: ["Business Manager","Marketing Specialist","Entrepreneur","Financial Analyst","HR Manager"],   riasec:{E:3,S:2,C:1},   mbti:["ESTJ","ENTJ","ESTP","ENFJ","ESFJ","ENTP"], strands:{ABM:3,HUMSS:2,GAS:2,STEM:1,TVL:1}, subjects:{Math:2,English:2,Filipino:1,Humanities:1} },

  // ── Health Sciences ──────────────────────────────────────────────────────
  { id: 35, course: "BS Nursing",                                description: "Patient care, clinical practice, health assessment, and professional nursing in healthcare settings.", careerPaths: ["Registered Nurse","Clinical Nurse","Public Health Nurse","Nurse Educator","Healthcare Manager"], riasec:{S:3,I:2,R:1},   mbti:["ISFJ","ESFJ","INFJ","ENFJ","ISTJ","ESTJ"], strands:{STEM:3,GAS:2,HUMSS:1,ABM:0,TVL:1}, subjects:{Math:1,Science:3,English:2,Filipino:1} },
  { id: 36, course: "BS Psychology",                             description: "Human behavior, mental processes, emotional wellbeing, and psychological research methods.",          careerPaths: ["Psychologist","Guidance Counselor","HR Specialist","Researcher","Social Worker"],           riasec:{S:3,I:2,A:1},   mbti:["INFJ","INFP","ENFJ","ENFP","ISFJ","ESFJ"], strands:{HUMSS:3,ABM:1,GAS:2,STEM:1,TVL:0}, subjects:{English:3,Filipino:2,Humanities:2,Science:1} },

  // ── Architecture & Arts ──────────────────────────────────────────────────
  { id: 37, course: "BS Architecture",                           description: "Design, planning, and construction of buildings and human spaces with artistic and structural focus.", careerPaths: ["Architect","Urban Designer","Interior Designer","Landscape Architect","Project Manager"],     riasec:{A:3,R:2,I:1},   mbti:["INTJ","INFJ","INTP","INFP","ENTP","ENFP"], strands:{STEM:2,HUMSS:2,GAS:2,ABM:1,TVL:1}, subjects:{Math:2,Science:1,Computer:2,English:2} },

  // ── Humanities ───────────────────────────────────────────────────────────
  { id: 38, course: "AB Communication",                          description: "Media, journalism, public relations, broadcasting, and strategic communication in the modern world.",  careerPaths: ["Journalist","PR Specialist","Broadcaster","Content Creator","Communications Manager"],      riasec:{A:2,S:2,E:2},   mbti:["ENFP","ENFJ","ESFP","ENTP","INFP","INFJ"], strands:{HUMSS:3,ABM:2,GAS:2,STEM:0,TVL:0}, subjects:{English:3,Filipino:3,Humanities:2,Computer:1} },
  { id: 39, course: "AB Political Science",                      description: "Study of government, political systems, law, international relations, and public policy.",             careerPaths: ["Political Scientist","Lawyer","Diplomat","Policy Analyst","Government Officer"],            riasec:{E:2,I:2,S:1},   mbti:["ENTJ","ENFJ","INTJ","INFJ","ENTP","INTP"], strands:{HUMSS:3,ABM:2,GAS:2,STEM:0,TVL:0}, subjects:{English:3,Filipino:2,Humanities:3,Science:0} },
];

const riasecQuestionTypes = {
  q1:"R", q2:"I", q3:"A", q4:"S",  q5:"E",  q6:"C",
  q7:"R", q8:"I", q9:"A", q10:"S", q11:"E", q12:"C",
};

function computeRIASEC(riasecAnswers) {
  const scores = { R:0, I:0, A:0, S:0, E:0, C:0 };
  Object.entries(riasecAnswers || {}).forEach(([qid, rating]) => {
    const type = riasecQuestionTypes[qid];
    if (type && scores[type] !== undefined) scores[type] += rating;
  });
  return scores;
}

function computeMBTI(mbtiAnswers) {
  if (!mbtiAnswers || Object.keys(mbtiAnswers).length < 8) return null;
 
  const dims = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
 
  // mbtiAnswers is keyed by question index (0-7)
  // Map index back to dimension values
  const questions = [
    { dim: "EI" }, { dim: "EI" },
    { dim: "SN" }, { dim: "SN" },
    { dim: "TF" }, { dim: "TF" },
    { dim: "JP" }, { dim: "JP" },
  ];
 
  Object.entries(mbtiAnswers).forEach(([idx, value]) => {
    if (value) dims[value] = (dims[value] || 0) + 1;
  });
 
  const EI = dims.E >= dims.I ? "E" : "I";
  const SN = dims.S >= dims.N ? "S" : "N";
  const TF = dims.T >= dims.F ? "T" : "F";
  const JP = dims.J >= dims.P ? "J" : "P";
 
  return `${EI}${SN}${TF}${JP}`;
}

// Academic answers: { Math: [0-4 score per 10 questions], ... }
// Each subject score = correct/agreed answers out of 10, normalized to 1-5
function computeAcademicScores(academicAnswers) {
  const scores = {};
  Object.entries(academicAnswers || {}).forEach(([subject, answers]) => {
    const total = Object.values(answers).filter(Boolean).length;
    scores[subject] = Math.max(1, Math.round((total / 10) * 5));
  });
  return scores;
}

export function computeRecommendations(answers) {
  const { strand, riasecAnswers, mbtiAnswers, academicAnswers } = answers;
  const riasecScores  = computeRIASEC(riasecAnswers);
  const mbtiType      = computeMBTI(mbtiAnswers);
  const academicScores = computeAcademicScores(academicAnswers);

  const scored = courses.map((course) => {
    let score = 0;
    let breakdown = [];

    // Strand (max 30)
    const strandScore = (course.strands[strand] || 0) * 10;
    score += strandScore;
    if (strandScore > 0) breakdown.push(`Your ${strand} strand aligns with this course.`);

    // RIASEC (max 30)
    let riasecTotal = 0;
    Object.entries(course.riasec).forEach(([type, weight]) => {
      riasecTotal += (riasecScores[type] || 0) * weight;
    });
    const riasecNorm = Math.min(30, Math.round((riasecTotal / 60) * 30));
    score += riasecNorm;
    if (riasecNorm > 12) breakdown.push(`Your interests strongly match this field.`);

    // MBTI (max 20)
    if (mbtiType && course.mbti.includes(mbtiType)) {
      score += 20;
      breakdown.push(`Your ${mbtiType} personality type fits this field.`);
    }

    // Academic (max 20)
    let acadTotal = 0, acadWeight = 0;
    Object.entries(course.subjects).forEach(([subject, weight]) => {
      const rating = (academicScores[subject] || 0);
      acadTotal  += rating * weight;
      acadWeight += weight;
    });
    const acadNorm = acadWeight > 0
      ? Math.min(20, Math.round((acadTotal / (acadWeight * 5)) * 20))
      : 0;
    score += acadNorm;
    if (acadNorm > 10) breakdown.push(`Your academic strengths support this course.`);

    return {
      ...course,
      matchScore: Math.max(30, Math.min(99, score)),
      reason: breakdown[0] || "This course matches your overall profile.",
      whyRecommended: breakdown.length > 0 ? breakdown : ["This course aligns with your general profile."],
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}