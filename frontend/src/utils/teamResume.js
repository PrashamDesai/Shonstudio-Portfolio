const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const asString = (value) => String(value || "").trim();

const fallbackWorkHistoryFromLegacy = (member) => {
  if (!asString(member?.experience)) {
    return [];
  }

  return [
    {
      title: asString(member.role) || "Team Specialist",
      company: "ShonStudio",
      period: asString(member?.resume?.totalExperience) || "Current",
      location: asString(member?.resume?.location),
      summary: asString(member.experience),
      highlights: [],
    },
  ];
};

const fallbackCaseStudiesFromLegacy = (member) =>
  asArray(member?.projects).map((projectName) => ({
    name: asString(projectName),
    client: "Confidential / Portfolio",
    role: asString(member.role),
    period: "",
    summary: "Delivered as part of ShonStudio production portfolio.",
    outcomes: [],
    stack: asArray(member?.coreTech),
    link: "",
  }));

const fallbackEducationFromLegacy = (member) => {
  if (!asString(member?.education)) {
    return [];
  }

  return [
    {
      institution: asString(member.education),
      degree: "",
      period: "",
      details: "",
    },
  ];
};

export const getTeamCategoryLabel = (category) => {
  if (category === "developer") {
    return "Developing";
  }

  if (category === "designer") {
    return "Designing";
  }

  return asString(category) || "Team";
};

export const normalizeTeamResume = (member = {}) => {
  const resume = member.resume || {};
  const normalizedWorkHistory = asArray(resume.workHistory)
    .map((item) => ({
      title: asString(item?.title),
      company: asString(item?.company),
      period: asString(item?.period),
      location: asString(item?.location),
      summary: asString(item?.summary),
      highlights: asArray(item?.highlights).map((entry) => asString(entry)).filter(Boolean),
    }))
    .filter((item) => item.title || item.company || item.summary);

  const normalizedCaseStudies = asArray(resume.caseStudies)
    .map((item) => ({
      name: asString(item?.name),
      client: asString(item?.client),
      role: asString(item?.role),
      period: asString(item?.period),
      summary: asString(item?.summary),
      outcomes: asArray(item?.outcomes).map((entry) => asString(entry)).filter(Boolean),
      stack: asArray(item?.stack).map((entry) => asString(entry)).filter(Boolean),
      link: asString(item?.link),
    }))
    .filter((item) => item.name || item.summary || item.client);

  const normalizedEducationRecords = asArray(resume.educationRecords)
    .map((item) => ({
      institution: asString(item?.institution),
      degree: asString(item?.degree),
      period: asString(item?.period),
      details: asString(item?.details),
    }))
    .filter((item) => item.institution || item.degree || item.details);

  const normalizedTestimonials = asArray(resume.testimonials)
    .map((item) => ({
      author: asString(item?.author),
      role: asString(item?.role),
      company: asString(item?.company),
      quote: asString(item?.quote),
    }))
    .filter((item) => item.quote || item.author || item.company);

  return {
    name: asString(member.name),
    role: asString(member.role),
    categoryLabel: getTeamCategoryLabel(member.category),
    profileImage: asString(member.profileImage),
    summary: asString(member.bio),
    headline: asString(resume.headline) || asString(member.role),
    location: asString(resume.location),
    totalExperience: asString(resume.totalExperience),
    availability: asString(resume.availability),
    preferredEngagement: asString(resume.preferredEngagement),
    contactLinks: {
      email: asString(member?.contactLinks?.email),
      linkedIn: asString(member?.contactLinks?.linkedIn),
      github: asString(member?.contactLinks?.github),
    },
    coreTech: asArray(member.coreTech).map((entry) => asString(entry)).filter(Boolean),
    skills: asArray(member.skills).map((entry) => asString(entry)).filter(Boolean),
    achievements: asArray(resume.achievements).map((entry) => asString(entry)).filter(Boolean),
    certifications: asArray(resume.certifications).map((entry) => asString(entry)).filter(Boolean),
    languages: asArray(resume.languages).map((entry) => asString(entry)).filter(Boolean),
    workHistory: normalizedWorkHistory.length
      ? normalizedWorkHistory
      : fallbackWorkHistoryFromLegacy(member),
    caseStudies: normalizedCaseStudies.length
      ? normalizedCaseStudies
      : fallbackCaseStudiesFromLegacy(member),
    educationRecords: normalizedEducationRecords.length
      ? normalizedEducationRecords
      : fallbackEducationFromLegacy(member),
    testimonials: normalizedTestimonials,
  };
};
