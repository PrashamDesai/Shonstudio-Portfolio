import { jsPDF } from "jspdf";

import { resolveMedia } from "../assets/mediaMap";
import { normalizeTeamResume } from "./teamResume";

const safeFileName = (value) =>
  String(value || "team-member")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const COLORS = {
  deepNavy: [12, 33, 56],
  navy: [23, 52, 84],
  accentBlue: [85, 203, 255],
  accentViolet: [137, 109, 255],
  textStrong: [20, 31, 53],
  textBody: [50, 65, 87],
  textMuted: [95, 114, 143],
  line: [220, 231, 245],
  panel: [248, 251, 255],
  panelStrong: [237, 245, 255],
};

const TOP_BAR_HEIGHT = 74;
const MARGIN = 40;
const BOTTOM_SAFE = 44;

const getImageFormat = (dataUrl) => {
  if (typeof dataUrl !== "string") {
    return null;
  }

  if (dataUrl.startsWith("data:image/png")) {
    return "PNG";
  }

  if (dataUrl.startsWith("data:image/webp")) {
    return "WEBP";
  }

  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) {
    return "JPEG";
  }

  return null;
};

const toDataUrl = async (source) => {
  if (!source || typeof source !== "string") {
    return null;
  }

  if (source.startsWith("data:image/")) {
    return source;
  }

  if (!source.startsWith("http://") && !source.startsWith("https://") && !source.startsWith("/")) {
    return null;
  }

  try {
    const response = await fetch(source);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const addWrappedText = (doc, text, x, y, width, lineHeight = 14) => {
  const value = String(text || "").trim();

  if (!value) {
    return {
      y,
      lines: 0,
    };
  }

  const lines = doc.splitTextToSize(value, width);
  doc.text(lines, x, y);

  return {
    y: y + lines.length * lineHeight,
    lines: lines.length,
  };
};

const estimatedWrappedHeight = (doc, text, width, lineHeight = 14) => {
  const value = String(text || "").trim();
  if (!value) {
    return 0;
  }

  return doc.splitTextToSize(value, width).length * lineHeight;
};

const drawPageChrome = (doc, pageWidth, pageHeight, pageNumber) => {
  doc.setFillColor(...COLORS.deepNavy);
  doc.rect(0, 0, pageWidth, TOP_BAR_HEIGHT, "F");

  doc.setFillColor(...COLORS.navy);
  doc.rect(pageWidth * 0.52, 0, pageWidth * 0.48, TOP_BAR_HEIGHT, "F");

  doc.setFillColor(...COLORS.accentBlue);
  doc.rect(0, TOP_BAR_HEIGHT - 3, pageWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(232, 241, 255);
  doc.text("SHONSTUDIO TALENT RESUME", MARGIN, 27);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(173, 196, 227);
  doc.text("Crafted for hiring and client evaluation", MARGIN, 42);

  doc.setTextColor(184, 207, 236);
  doc.text(`Page ${pageNumber}`, pageWidth - MARGIN, pageHeight - 18, { align: "right" });

  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.7);
  doc.line(MARGIN, pageHeight - 27, pageWidth - MARGIN, pageHeight - 27);
};

const drawChip = (doc, text, x, y, maxWidth) => {
  const label = String(text || "").trim();
  if (!label) {
    return 0;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const content = label.length > 38 ? `${label.slice(0, 35)}...` : label;
  const width = Math.min(maxWidth, doc.getTextWidth(content) + 14);

  doc.setFillColor(230, 242, 255);
  doc.roundedRect(x, y, width, 14, 7, 7, "F");
  doc.setTextColor(49, 86, 131);
  doc.text(content, x + 7, y + 9.7);

  return width + 6;
};

const drawSectionTitle = (doc, title, subtitle, y, pageWidth) => {
  doc.setFillColor(...COLORS.panelStrong);
  doc.roundedRect(MARGIN, y - 14, pageWidth - MARGIN * 2, 24, 7, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(42, 77, 124);
  doc.text(String(title || "").toUpperCase(), MARGIN + 10, y + 1);

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(String(subtitle), pageWidth - MARGIN - 10, y + 1, { align: "right" });
  }

  return y + 20;
};

export const downloadTeamResumePdf = async (member) => {
  const data = normalizeTeamResume(member);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN * 2;
  const safeBottom = pageHeight - BOTTOM_SAFE;
  let pageNumber = 1;

  const nextPage = () => {
    doc.addPage();
    pageNumber += 1;
    drawPageChrome(doc, pageWidth, pageHeight, pageNumber);
    return TOP_BAR_HEIGHT + 34;
  };

  const ensureSpace = (cursorY, requiredHeight) => {
    if (cursorY + requiredHeight <= safeBottom) {
      return cursorY;
    }

    return nextPage();
  };

  drawPageChrome(doc, pageWidth, pageHeight, pageNumber);

  const profileImageData = await toDataUrl(resolveMedia(data.profileImage));
  const profileImageFormat = getImageFormat(profileImageData);

  const heroY = TOP_BAR_HEIGHT + 18;
  const heroHeight = 182;
  doc.setFillColor(...COLORS.panel);
  doc.roundedRect(MARGIN, heroY, contentWidth, heroHeight, 11, 11, "F");
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.9);
  doc.roundedRect(MARGIN, heroY, contentWidth, heroHeight, 11, 11, "S");

  const photoX = MARGIN + 16;
  const photoY = heroY + 16;
  const photoSize = 84;
  doc.setFillColor(223, 236, 252);
  doc.roundedRect(photoX, photoY, photoSize, photoSize, 8, 8, "F");

  if (profileImageData && profileImageFormat) {
    try {
      doc.addImage(profileImageData, profileImageFormat, photoX + 2, photoY + 2, photoSize - 4, photoSize - 4);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...COLORS.textMuted);
      const fallbackInitials = String(data.name || "TM")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "TM";
      doc.text(fallbackInitials, photoX + photoSize / 2, photoY + photoSize / 2 + 6, { align: "center" });
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.textMuted);
    const fallbackInitials = String(data.name || "TM")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "TM";
    doc.text(fallbackInitials, photoX + photoSize / 2, photoY + photoSize / 2 + 6, { align: "center" });
  }

  const titleX = photoX + photoSize + 16;
  const titleWidth = contentWidth - (titleX - MARGIN) - 16;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textStrong);
  doc.setFontSize(25);
  doc.text(data.name || "Team Member", titleX, heroY + 36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(48, 86, 137);
  doc.text(`${data.role || "Specialist"} | ${data.categoryLabel || "Team"}`, titleX, heroY + 53);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textMuted);
  const metaLine = [
    data.location ? `Location: ${data.location}` : "",
    data.totalExperience ? `Experience: ${data.totalExperience}` : "",
    data.availability ? `Availability: ${data.availability}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  if (metaLine) {
    addWrappedText(doc, metaLine, titleX, heroY + 70, titleWidth, 12);
  }

  if (data.headline) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.2);
    doc.setTextColor(...COLORS.textBody);
    addWrappedText(doc, data.headline, titleX, heroY + 88, titleWidth, 12);
  }

  const allContact = [data.contactLinks?.email, data.contactLinks?.linkedIn, data.contactLinks?.github].filter(Boolean);
  let contactY = photoY + photoSize + 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(57, 92, 142);
  doc.text("CONTACT", photoX, contactY);
  contactY += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.textMuted);
  allContact.slice(0, 3).forEach((entry) => {
    const wrapped = doc.splitTextToSize(entry, 140).slice(0, 2);
    doc.text(wrapped, photoX, contactY);
    contactY += wrapped.length * 10 + 2;
  });

  const chips = [
    ...(data.coreTech || []).slice(0, 6),
    ...(data.skills || []).slice(0, 4),
  ].filter(Boolean);

  let chipX = titleX;
  const chipY = heroY + heroHeight - 23;
  chips.forEach((chip) => {
    const consumedWidth = drawChip(doc, chip, chipX, chipY, 104);
    if (!consumedWidth) {
      return;
    }

    if (chipX + consumedWidth > pageWidth - MARGIN - 20) {
      return;
    }
    chipX += consumedWidth;
  });

  let cursorY = heroY + heroHeight + 26;

  cursorY = drawSectionTitle(doc, "Professional Summary", "Executive snapshot", cursorY, pageWidth);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.4);
  doc.setTextColor(...COLORS.textBody);
  const summaryResult = addWrappedText(
    doc,
    data.summary || "Professional profile details were not provided.",
    MARGIN,
    cursorY,
    contentWidth,
    14,
  );
  cursorY = summaryResult.y + 18;

  if (data.achievements.length) {
    const estimatedHeight = 30 + data.achievements.reduce((sum, item) => sum + estimatedWrappedHeight(doc, item, contentWidth - 24, 12), 0);
    cursorY = ensureSpace(cursorY, estimatedHeight + 16);
    cursorY = drawSectionTitle(doc, "Key Achievements", "Proof of impact", cursorY, pageWidth);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.8);
    doc.setTextColor(...COLORS.textBody);
    data.achievements.forEach((item) => {
      cursorY = ensureSpace(cursorY, 24);
      doc.setFillColor(...COLORS.accentBlue);
      doc.circle(MARGIN + 4, cursorY - 3, 1.8, "F");
      const achievementResult = addWrappedText(doc, item, MARGIN + 12, cursorY, contentWidth - 12, 12.5);
      cursorY = achievementResult.y + 4;
    });
    cursorY += 8;
  }

  if (data.workHistory.length) {
    cursorY = ensureSpace(cursorY, 44);
    cursorY = drawSectionTitle(doc, "Work Experience", "Role history and delivery scope", cursorY, pageWidth);

    data.workHistory.forEach((item) => {
      const roleLabel = `${item.title || "Role"}${item.company ? `, ${item.company}` : ""}`;
      const metaLabel = [item.period, item.location].filter(Boolean).join(" | ");
      const summaryHeight = estimatedWrappedHeight(doc, item.summary, contentWidth - 26, 13);
      const highlightsHeight = (item.highlights || []).reduce(
        (sum, entry) => sum + estimatedWrappedHeight(doc, entry, contentWidth - 38, 12),
        0,
      );
      const blockHeight = 58 + summaryHeight + highlightsHeight + ((item.highlights || []).length ? 8 : 0);

      cursorY = ensureSpace(cursorY, blockHeight + 14);

      doc.setFillColor(251, 253, 255);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "F");
      doc.setDrawColor(...COLORS.line);
      doc.setLineWidth(0.8);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.8);
      doc.setTextColor(...COLORS.textStrong);
      doc.text(roleLabel, MARGIN + 12, cursorY + 3);

      if (metaLabel) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.8);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(metaLabel, pageWidth - MARGIN - 12, cursorY + 3, { align: "right" });
      }

      doc.setDrawColor(233, 241, 250);
      doc.setLineWidth(0.6);
      doc.line(MARGIN + 12, cursorY + 10, pageWidth - MARGIN - 12, cursorY + 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.8);
      doc.setTextColor(...COLORS.textBody);
      let blockY = cursorY + 25;

      if (item.summary) {
        const summaryText = addWrappedText(doc, item.summary, MARGIN + 12, blockY, contentWidth - 24, 12.8);
        blockY = summaryText.y + 3;
      }

      (item.highlights || []).forEach((highlight) => {
        doc.setFillColor(...COLORS.accentViolet);
        doc.circle(MARGIN + 15, blockY - 3.5, 1.5, "F");
        const detail = addWrappedText(doc, highlight, MARGIN + 22, blockY, contentWidth - 34, 12.2);
        blockY = detail.y + 2;
      });

      cursorY += blockHeight + 2;
    });

    cursorY += 10;
  }

  if (data.caseStudies.length) {
    cursorY = ensureSpace(cursorY, 44);
    cursorY = drawSectionTitle(doc, "Project Portfolio", "Client-facing case studies", cursorY, pageWidth);

    data.caseStudies.forEach((item) => {
      const caseMeta = [item.role, item.client, item.period].filter(Boolean).join(" | ");
      const summaryHeight = estimatedWrappedHeight(doc, item.summary, contentWidth - 26, 12.8);
      const stackHeight = item.stack?.length ? estimatedWrappedHeight(doc, `Stack: ${item.stack.join(", ")}`, contentWidth - 26, 12) : 0;
      const outcomeHeight = (item.outcomes || []).reduce(
        (sum, entry) => sum + estimatedWrappedHeight(doc, entry, contentWidth - 36, 12),
        0,
      );
      const linkHeight = item.link ? 14 : 0;
      const blockHeight = 56 + summaryHeight + stackHeight + outcomeHeight + linkHeight + ((item.outcomes || []).length ? 6 : 0);

      cursorY = ensureSpace(cursorY, blockHeight + 12);

      doc.setFillColor(...COLORS.panel);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "F");
      doc.setDrawColor(...COLORS.line);
      doc.setLineWidth(0.8);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.8);
      doc.setTextColor(...COLORS.textStrong);
      doc.text(item.name || "Project", MARGIN + 12, cursorY + 2);

      if (caseMeta) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(caseMeta, MARGIN + 12, cursorY + 16);
      }

      let projectY = cursorY + 31;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.6);
      doc.setTextColor(...COLORS.textBody);

      if (item.summary) {
        const summary = addWrappedText(doc, item.summary, MARGIN + 12, projectY, contentWidth - 24, 12.5);
        projectY = summary.y + 2;
      }

      if (item.stack?.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.1);
        doc.setTextColor(54, 92, 145);
        const stackResult = addWrappedText(doc, `Stack: ${item.stack.join(", ")}`, MARGIN + 12, projectY, contentWidth - 24, 12);
        projectY = stackResult.y + 2;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.4);
      doc.setTextColor(...COLORS.textBody);
      (item.outcomes || []).forEach((outcome) => {
        doc.setFillColor(...COLORS.accentBlue);
        doc.circle(MARGIN + 15, projectY - 3.2, 1.4, "F");
        const outcomeResult = addWrappedText(doc, outcome, MARGIN + 22, projectY, contentWidth - 34, 12.2);
        projectY = outcomeResult.y + 2;
      });

      if (item.link) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.8);
        doc.setTextColor(49, 116, 192);
        const linkResult = addWrappedText(doc, `Case study link: ${item.link}`, MARGIN + 12, projectY, contentWidth - 24, 11.7);
        projectY = linkResult.y;
      }

      cursorY += blockHeight;
    });

    cursorY += 10;
  }

  if (data.educationRecords.length) {
    cursorY = ensureSpace(cursorY, 44);
    cursorY = drawSectionTitle(doc, "Education", "Formal studies and specialist learning", cursorY, pageWidth);

    data.educationRecords.forEach((item) => {
      const degreeLine = [item.degree, item.institution].filter(Boolean).join(", ") || item.institution || "Education";
      const detailsHeight = estimatedWrappedHeight(doc, item.details, contentWidth - 24, 12.2);
      const blockHeight = 42 + detailsHeight;

      cursorY = ensureSpace(cursorY, blockHeight + 10);

      doc.setFillColor(252, 254, 255);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "F");
      doc.setDrawColor(...COLORS.line);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.2);
      doc.setTextColor(...COLORS.textStrong);
      doc.text(degreeLine, MARGIN + 12, cursorY + 1);

      if (item.period) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.7);
        doc.setTextColor(...COLORS.textMuted);
        doc.text(item.period, pageWidth - MARGIN - 12, cursorY + 1, { align: "right" });
      }

      if (item.details) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.3);
        doc.setTextColor(...COLORS.textBody);
        const detailsResult = addWrappedText(doc, item.details, MARGIN + 12, cursorY + 17, contentWidth - 24, 12.2);
        cursorY = detailsResult.y + 9;
      } else {
        cursorY += blockHeight - 5;
      }
    });

    cursorY += 8;
  }

  const credentials = [
    data.certifications.length ? `Certifications: ${data.certifications.join(", ")}` : "",
    data.languages.length ? `Languages: ${data.languages.join(", ")}` : "",
    data.preferredEngagement ? `Preferred engagement: ${data.preferredEngagement}` : "",
  ].filter(Boolean);

  if (credentials.length) {
    const credentialsHeight = 36 + credentials.reduce((sum, entry) => sum + estimatedWrappedHeight(doc, entry, contentWidth - 24, 12), 0);
    cursorY = ensureSpace(cursorY, credentialsHeight + 14);
    cursorY = drawSectionTitle(doc, "Credentials", "Trust indicators", cursorY, pageWidth);

    doc.setFillColor(...COLORS.panel);
    doc.roundedRect(MARGIN, cursorY - 14, contentWidth, credentialsHeight, 8, 8, "F");
    doc.setDrawColor(...COLORS.line);
    doc.roundedRect(MARGIN, cursorY - 14, contentWidth, credentialsHeight, 8, 8, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.textBody);

    let credentialsY = cursorY + 2;
    credentials.forEach((entry) => {
      const credentialResult = addWrappedText(doc, entry, MARGIN + 12, credentialsY, contentWidth - 24, 12.2);
      credentialsY = credentialResult.y + 3;
    });

    cursorY += credentialsHeight + 7;
  }

  if (data.testimonials.length) {
    cursorY = ensureSpace(cursorY, 44);
    cursorY = drawSectionTitle(doc, "Client & Team Endorsements", "Social proof", cursorY, pageWidth);

    data.testimonials.forEach((item) => {
      const quoteHeight = estimatedWrappedHeight(doc, item.quote, contentWidth - 36, 13);
      const byline = [item.author, item.role, item.company].filter(Boolean).join(" | ");
      const bylineHeight = byline ? estimatedWrappedHeight(doc, byline, contentWidth - 36, 11.5) : 0;
      const blockHeight = 36 + quoteHeight + bylineHeight;

      cursorY = ensureSpace(cursorY, blockHeight + 12);

      doc.setFillColor(250, 252, 255);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "F");
      doc.setDrawColor(...COLORS.line);
      doc.roundedRect(MARGIN, cursorY - 14, contentWidth, blockHeight, 8, 8, "S");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.8);
      doc.setTextColor(...COLORS.textBody);
      const quoteResult = addWrappedText(
        doc,
        item.quote ? `"${item.quote}"` : "",
        MARGIN + 12,
        cursorY + 1,
        contentWidth - 24,
        13,
      );

      if (byline) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.7);
        doc.setTextColor(...COLORS.textMuted);
        addWrappedText(doc, `- ${byline}`, MARGIN + 12, quoteResult.y + 2, contentWidth - 24, 11.5);
      }

      cursorY += blockHeight;
    });
  }

  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(
    `Generated on ${generatedOn} | ShonStudio Talent Resume`,
    MARGIN,
    pageHeight - 14,
  );

  const fileName = `${safeFileName(data.name || "team-member")}-resume.pdf`;
  doc.save(fileName);
};
