import { jsPDF } from "jspdf";

import { normalizeTeamResume } from "./teamResume";

const safeFileName = (value) =>
  String(value || "team-member")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const addWrappedText = (doc, text, x, y, width, lineHeight = 15) => {
  if (!text) {
    return y;
  }

  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

const ensureSpace = ({ doc, y, minimum, margin, pageHeight, drawHeader }) => {
  if (y + minimum <= pageHeight - margin) {
    return y;
  }

  doc.addPage();
  drawHeader();
  return 108;
};

export const downloadTeamResumePdf = (member) => {
  const data = normalizeTeamResume(member);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  const drawHeader = () => {
    doc.setFillColor(17, 28, 44);
    doc.rect(0, 0, pageWidth, 84, "F");

    doc.setTextColor(136, 163, 204);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("ShonStudio Talent Resume", margin, 32);

    doc.setTextColor(235, 242, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(21);
    doc.text(data.name || "Team Member", margin, 56);

    const roleText = `${data.role || "Specialist"} | ${data.categoryLabel}`;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(177, 198, 230);
    doc.text(roleText, margin, 74);
  };

  const addSectionTitle = (title, y) => {
    doc.setTextColor(64, 109, 188);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(String(title || "").toUpperCase(), margin, y);

    doc.setDrawColor(212, 223, 245);
    doc.setLineWidth(1);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);

    return y + 24;
  };

  drawHeader();

  let cursorY = 108;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);

  const quickFacts = [
    data.headline,
    data.totalExperience ? `Experience: ${data.totalExperience}` : "",
    data.location ? `Location: ${data.location}` : "",
    data.availability ? `Availability: ${data.availability}` : "",
    data.preferredEngagement ? `Engagement: ${data.preferredEngagement}` : "",
  ].filter(Boolean);

  if (quickFacts.length) {
    cursorY = addWrappedText(doc, quickFacts.join(" | "), margin, cursorY, contentWidth);
    cursorY += 8;
  }

  const contactLine = [
    data.contactLinks?.email,
    data.contactLinks?.linkedIn,
    data.contactLinks?.github,
  ]
    .filter(Boolean)
    .join(" | ");

  if (contactLine) {
    cursorY = addWrappedText(doc, contactLine, margin, cursorY, contentWidth);
    cursorY += 14;
  }

  cursorY = ensureSpace({
    doc,
    y: cursorY,
    minimum: 80,
    margin,
    pageHeight,
    drawHeader,
  });
  cursorY = addSectionTitle("Professional Summary", cursorY);
  cursorY = addWrappedText(doc, data.summary || "Not provided.", margin, cursorY, contentWidth);
  cursorY += 14;

  const skillLine = [...new Set([...(data.coreTech || []), ...(data.skills || [])])].join(", ");
  if (skillLine) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 70,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Core Skills", cursorY);
    cursorY = addWrappedText(doc, skillLine, margin, cursorY, contentWidth);
    cursorY += 14;
  }

  if (data.achievements.length) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 90,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Key Achievements", cursorY);
    data.achievements.forEach((item) => {
      cursorY = ensureSpace({
        doc,
        y: cursorY,
        minimum: 34,
        margin,
        pageHeight,
        drawHeader,
      });
      cursorY = addWrappedText(doc, `- ${item}`, margin, cursorY, contentWidth);
      cursorY += 3;
    });
    cursorY += 8;
  }

  if (data.workHistory.length) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 120,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Work Experience", cursorY);

    data.workHistory.forEach((item) => {
      cursorY = ensureSpace({
        doc,
        y: cursorY,
        minimum: 88,
        margin,
        pageHeight,
        drawHeader,
      });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11.5);
      cursorY = addWrappedText(
        doc,
        `${item.title || "Role"}${item.company ? `, ${item.company}` : ""}`,
        margin,
        cursorY,
        contentWidth,
      );

      const meta = [item.period, item.location].filter(Boolean).join(" | ");
      if (meta) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(96, 113, 141);
        doc.setFontSize(10.5);
        cursorY = addWrappedText(doc, meta, margin, cursorY, contentWidth);
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(11);
      if (item.summary) {
        cursorY = addWrappedText(doc, item.summary, margin, cursorY + 3, contentWidth);
      }

      (item.highlights || []).forEach((highlight) => {
        cursorY = ensureSpace({
          doc,
          y: cursorY,
          minimum: 30,
          margin,
          pageHeight,
          drawHeader,
        });
        cursorY = addWrappedText(doc, `- ${highlight}`, margin + 6, cursorY + 2, contentWidth - 6);
      });

      cursorY += 10;
    });
  }

  if (data.caseStudies.length) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 110,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Project Portfolio", cursorY);

    data.caseStudies.forEach((item) => {
      cursorY = ensureSpace({
        doc,
        y: cursorY,
        minimum: 80,
        margin,
        pageHeight,
        drawHeader,
      });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11.5);
      cursorY = addWrappedText(doc, item.name || "Project", margin, cursorY, contentWidth);

      const portfolioMeta = [item.role, item.client, item.period].filter(Boolean).join(" | ");
      if (portfolioMeta) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(96, 113, 141);
        doc.setFontSize(10.5);
        cursorY = addWrappedText(doc, portfolioMeta, margin, cursorY, contentWidth);
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(11);
      if (item.summary) {
        cursorY = addWrappedText(doc, item.summary, margin, cursorY + 3, contentWidth);
      }

      if (item.stack?.length) {
        cursorY = addWrappedText(doc, `Stack: ${item.stack.join(", ")}`, margin, cursorY + 1, contentWidth);
      }

      (item.outcomes || []).forEach((outcome) => {
        cursorY = addWrappedText(doc, `- ${outcome}`, margin + 6, cursorY + 2, contentWidth - 6);
      });

      if (item.link) {
        cursorY = addWrappedText(doc, `Link: ${item.link}`, margin, cursorY + 2, contentWidth);
      }

      cursorY += 9;
    });
  }

  if (data.educationRecords.length) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 90,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Education", cursorY);

    data.educationRecords.forEach((item) => {
      cursorY = ensureSpace({
        doc,
        y: cursorY,
        minimum: 50,
        margin,
        pageHeight,
        drawHeader,
      });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11.5);
      cursorY = addWrappedText(
        doc,
        [item.degree, item.institution].filter(Boolean).join(", ") || item.institution || "Education",
        margin,
        cursorY,
        contentWidth,
      );

      doc.setFont("helvetica", "normal");
      doc.setTextColor(96, 113, 141);
      doc.setFontSize(10.5);
      if (item.period) {
        cursorY = addWrappedText(doc, item.period, margin, cursorY, contentWidth);
      }

      doc.setTextColor(55, 65, 81);
      doc.setFontSize(11);
      if (item.details) {
        cursorY = addWrappedText(doc, item.details, margin, cursorY + 2, contentWidth);
      }

      cursorY += 8;
    });
  }

  const credentials = [
    data.certifications.length ? `Certifications: ${data.certifications.join(", ")}` : "",
    data.languages.length ? `Languages: ${data.languages.join(", ")}` : "",
  ].filter(Boolean);

  if (credentials.length) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 74,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Credentials", cursorY);
    credentials.forEach((entry) => {
      cursorY = addWrappedText(doc, entry, margin, cursorY, contentWidth);
      cursorY += 4;
    });
  }

  if (data.testimonials.length) {
    cursorY = ensureSpace({
      doc,
      y: cursorY,
      minimum: 90,
      margin,
      pageHeight,
      drawHeader,
    });
    cursorY = addSectionTitle("Client & Team Endorsements", cursorY);

    data.testimonials.forEach((item) => {
      cursorY = ensureSpace({
        doc,
        y: cursorY,
        minimum: 58,
        margin,
        pageHeight,
        drawHeader,
      });

      doc.setFont("helvetica", "italic");
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(11);
      cursorY = addWrappedText(doc, `"${item.quote}"`, margin, cursorY, contentWidth);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(96, 113, 141);
      doc.setFontSize(10.5);
      const byline = [item.author, item.role, item.company].filter(Boolean).join(" | ");
      if (byline) {
        cursorY = addWrappedText(doc, `- ${byline}`, margin, cursorY + 2, contentWidth);
      }

      cursorY += 6;
    });
  }

  const fileName = `${safeFileName(data.name || "team-member")}-resume.pdf`;
  doc.save(fileName);
};
