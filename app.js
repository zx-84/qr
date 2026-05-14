const HISTORY_KEY = "qr-maker-history";
const MAX_HISTORY_ITEMS = 10;
const PREVIEW_SIZE = 768;
const DISPLAY_SIZE = 320;

const LOGO_PRESETS = {
  qr: buildLogoDataUri("QR", "#1769e0", "#14b8d2"),
  link: buildLogoDataUri("LINK", "#0d4fb6", "#5b8def"),
  wifi: buildLogoDataUri("WIFI", "#0e7490", "#14b8d2"),
  info: buildLogoDataUri("INFO", "#f46d4f", "#ff9b73"),
};

const MODE_LABELS = {
  text: "Texte",
  note: "Note",
  wifi: "Wi-Fi",
  vcard: "Contact",
  email: "Email",
  phone: "Tel",
  sms: "SMS",
  whatsapp: "WhatsApp",
  location: "Lieu",
  event: "Event",
  social: "Social",
  appstore: "App",
};

const state = {
  mode: "text",
  encoded: "",
  logoSource: "",
  logoType: "none",
  historyFilter: "all",
  history: readHistory(),
  renderVersion: 0,
};

const elements = {
  modeButtons: document.querySelectorAll(".mode-button"),
  panels: document.querySelectorAll(".mode-panel"),
  qrHost: document.querySelector("#qrcode"),
  emptyState: document.querySelector("#empty-state"),
  encodedOutput: document.querySelector("#encoded-output"),
  feedback: document.querySelector("#feedback"),
  qualityPanel: document.querySelector("#quality-panel"),
  qualityDot: document.querySelector("#quality-dot"),
  qualityMessage: document.querySelector("#quality-message"),
  scanCheckPanel: document.querySelector("#scan-check-panel"),
  scanCheckDot: document.querySelector("#scan-check-dot"),
  scanCheckMessage: document.querySelector("#scan-check-message"),
  scanAction: document.querySelector("#scan-action"),
  scanActionText: document.querySelector("#scan-action-text"),
  downloadButton: document.querySelector("#download-button"),
  downloadSvgButton: document.querySelector("#download-svg-button"),
  copyQrButton: document.querySelector("#copy-qr-button"),
  copyButton: document.querySelector("#copy-button"),
  testLinkButton: document.querySelector("#test-link-button"),
  resetButton: document.querySelector("#reset-button"),
  clearHistoryButton: document.querySelector("#clear-history-button"),
  historyList: document.querySelector("#history-list"),
  historyFilter: document.querySelector("#history-filter"),
  logoPresets: document.querySelectorAll(".logo-preset"),
  customLogoPanel: document.querySelector("#custom-logo-panel"),
  logoSettingsPanel: document.querySelector("#logo-settings-panel"),
  logoFile: document.querySelector("#logo-file"),
  logoUrl: document.querySelector("#logo-url"),
  logoUrlButton: document.querySelector("#logo-url-button"),
  templateSelect: document.querySelector("#template-select"),
  designPreset: document.querySelector("#design-preset"),
  formInputs: document.querySelectorAll("input, select, textarea"),
  freeText: document.querySelector("#free-text"),
  noteService: document.querySelector("#note-service"),
  noteUrl: document.querySelector("#note-url"),
  historyName: document.querySelector("#history-name"),
  wifiSsid: document.querySelector("#wifi-ssid"),
  wifiPassword: document.querySelector("#wifi-password"),
  wifiSecurity: document.querySelector("#wifi-security"),
  wifiHidden: document.querySelector("#wifi-hidden"),
  vcardLastname: document.querySelector("#vcard-lastname"),
  vcardFirstname: document.querySelector("#vcard-firstname"),
  vcardPhone: document.querySelector("#vcard-phone"),
  vcardEmail: document.querySelector("#vcard-email"),
  vcardOrg: document.querySelector("#vcard-org"),
  vcardUrl: document.querySelector("#vcard-url"),
  vcardAddress: document.querySelector("#vcard-address"),
  emailTo: document.querySelector("#email-to"),
  emailSubject: document.querySelector("#email-subject"),
  emailBody: document.querySelector("#email-body"),
  phoneNumber: document.querySelector("#phone-number"),
  smsNumber: document.querySelector("#sms-number"),
  smsMessage: document.querySelector("#sms-message"),
  whatsappNumber: document.querySelector("#whatsapp-number"),
  whatsappMessage: document.querySelector("#whatsapp-message"),
  locationQuery: document.querySelector("#location-query"),
  locationLat: document.querySelector("#location-lat"),
  locationLng: document.querySelector("#location-lng"),
  eventTitle: document.querySelector("#event-title"),
  eventStart: document.querySelector("#event-start"),
  eventEnd: document.querySelector("#event-end"),
  eventLocation: document.querySelector("#event-location"),
  eventDescription: document.querySelector("#event-description"),
  socialNetwork: document.querySelector("#social-network"),
  socialValue: document.querySelector("#social-value"),
  appstoreTarget: document.querySelector("#appstore-target"),
  appstoreName: document.querySelector("#appstore-name"),
  appstoreUrl: document.querySelector("#appstore-url"),
  qrSize: document.querySelector("#qr-size"),
  qrErrorLevel: document.querySelector("#qr-error-level"),
  qrDarkColor: document.querySelector("#qr-dark-color"),
  qrLightColor: document.querySelector("#qr-light-color"),
  qrMargin: document.querySelector("#qr-margin"),
  qrMarginOutput: document.querySelector("#qr-margin-output"),
  logoSize: document.querySelector("#logo-size"),
  logoSizeOutput: document.querySelector("#logo-size-output"),
  logoRadius: document.querySelector("#logo-radius"),
  logoRadiusOutput: document.querySelector("#logo-radius-output"),
  logoBackground: document.querySelector("#logo-background"),
};

window.addEventListener("load", () => {
  bindEvents();
  syncRangeOutputs();
  renderHistory();
  updateQr();
});

function bindEvents() {
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  elements.formInputs.forEach((input) => {
    if (["logo-file", "logo-url", "template-select", "design-preset"].includes(input.id)) {
      return;
    }

    input.addEventListener("input", handleFormInput);
    input.addEventListener("change", handleFormInput);
  });

  elements.logoPresets.forEach((button) => {
    button.addEventListener("click", () => setLogoPreset(button.dataset.logo));
  });

  elements.logoFile.addEventListener("change", handleLogoUpload);
  elements.logoUrlButton.addEventListener("click", handleLogoUrl);
  elements.logoUrl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogoUrl();
    }
  });

  elements.downloadButton.addEventListener("click", downloadPng);
  elements.downloadSvgButton.addEventListener("click", downloadSvg);
  elements.copyQrButton.addEventListener("click", copyQrImage);
  elements.copyButton.addEventListener("click", copyEncodedContent);
  elements.testLinkButton.addEventListener("click", testEncodedLink);
  elements.resetButton.addEventListener("click", resetForm);
  elements.clearHistoryButton.addEventListener("click", clearHistory);
  elements.historyFilter.addEventListener("change", () => {
    state.historyFilter = elements.historyFilter.value;
    renderHistory();
  });
  elements.templateSelect.addEventListener("change", applyTemplate);
  elements.designPreset.addEventListener("change", applyDesignPreset);
}

function handleFormInput() {
  syncRangeOutputs();
  updateQr();
}

function syncRangeOutputs() {
  elements.qrMarginOutput.textContent = `${elements.qrMargin.value} px`;
  elements.logoSizeOutput.textContent = `${elements.logoSize.value}%`;
  elements.logoRadiusOutput.textContent = `${elements.logoRadius.value}%`;
}

function setMode(mode, options = {}) {
  state.mode = mode;

  elements.modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  elements.panels.forEach((panel) => {
    const active = panel.dataset.panel === mode;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  if (!options.skipUpdate) {
    updateQr();
  }
}

async function updateQr(options = {}) {
  let encoded = "";

  try {
    encoded = buildEncodedContent();
    state.encoded = encoded;
    elements.encodedOutput.value = encoded;
    elements.feedback.textContent = "";
  } catch (error) {
    const message = error.message || "Impossible de preparer ce QR code.";
    state.encoded = "";
    elements.encodedOutput.value = "";
    clearQrPreview(message);
    setFeedback(message);
    return;
  }

  if (!encoded) {
    clearQrPreview();
    updateQuality();
    return;
  }

  if (typeof QRCode === "undefined") {
    clearQrPreview("La librairie QR n'a pas pu etre chargee. Verifiez votre connexion puis rechargez la page.");
    return;
  }

  const renderId = ++state.renderVersion;

  try {
    const canvas = await renderQrCanvas(encoded, getCurrentSettings(), state.logoSource, DISPLAY_SIZE);
    if (renderId !== state.renderVersion) {
      return;
    }

    showQrCanvas(canvas);
    setActionState(true);
    updateScanAction();
    updateQuality();
    verifyScan(canvas);

    if (!options.skipHistory) {
      saveCurrentToHistory();
    }
  } catch (error) {
    const message = error.message || "Impossible de generer ce QR code.";
    clearQrPreview(message);
    setFeedback(message);
  }
}

function clearQrPreview(message = "Ajoutez un contenu pour afficher le QR code.") {
  elements.qrHost.innerHTML = "";
  elements.emptyState.textContent = message;
  elements.emptyState.hidden = false;
  elements.scanAction.hidden = true;
  elements.qualityPanel.hidden = true;
  elements.scanCheckPanel.hidden = true;
  setActionState(false);
}

function showQrCanvas(canvas) {
  elements.qrHost.innerHTML = "";
  canvas.className = "qr-canvas";
  canvas.dataset.finalQr = "true";
  elements.qrHost.appendChild(canvas);
  elements.emptyState.hidden = true;
}

function setActionState(enabled) {
  elements.downloadButton.disabled = !enabled;
  elements.downloadSvgButton.disabled = !enabled;
  elements.copyQrButton.disabled = !enabled;
  elements.copyButton.disabled = !state.encoded;
  elements.testLinkButton.disabled = !enabled || !isTestableLink(state.encoded);
}

function buildEncodedContent() {
  if (state.mode === "text") {
    return buildTextContent();
  }

  if (state.mode === "note") {
    return buildNoteLink();
  }

  if (state.mode === "wifi") {
    const ssid = elements.wifiSsid.value.trim();
    if (!ssid) {
      return "";
    }

    const security = elements.wifiSecurity.value;
    const password = security === "nopass" ? "" : elements.wifiPassword.value;
    const hidden = elements.wifiHidden.checked ? "true" : "false";
    return `WIFI:T:${security};S:${escapeWifiValue(ssid)};P:${escapeWifiValue(password)};H:${hidden};;`;
  }

  if (state.mode === "vcard") {
    return buildVCard();
  }

  if (state.mode === "email") {
    const to = elements.emailTo.value.trim();
    if (!to) {
      return "";
    }

    const params = new URLSearchParams();
    if (elements.emailSubject.value.trim()) {
      params.set("subject", elements.emailSubject.value.trim());
    }
    if (elements.emailBody.value.trim()) {
      params.set("body", elements.emailBody.value.trim());
    }

    const query = params.toString();
    return `mailto:${to}${query ? `?${query}` : ""}`;
  }

  if (state.mode === "phone") {
    const phone = elements.phoneNumber.value.trim();
    return phone ? `tel:${phone}` : "";
  }

  if (state.mode === "sms") {
    const phone = elements.smsNumber.value.trim();
    if (!phone) {
      return "";
    }

    const message = elements.smsMessage.value.trim();
    return message ? `sms:${phone}?body=${encodeURIComponent(message)}` : `sms:${phone}`;
  }

  if (state.mode === "whatsapp") {
    const phone = normalizePhoneForWhatsApp(elements.whatsappNumber.value);
    if (!phone) {
      return "";
    }

    const message = elements.whatsappMessage.value.trim();
    return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  }

  if (state.mode === "location") {
    return buildLocationLink();
  }

  if (state.mode === "event") {
    return buildCalendarEvent();
  }

  if (state.mode === "social") {
    return buildSocialLink();
  }

  if (state.mode === "appstore") {
    return buildAppStoreLink();
  }

  return elements.freeText.value.trim();
}

function buildTextContent() {
  const value = elements.freeText.value.trim();
  if (!value) {
    return "";
  }

  return value;
}

function buildNoteLink() {
  const value = elements.noteUrl.value.trim();
  return value ? normalizeUrl(value) : "";
}

function normalizePhoneForWhatsApp(value) {
  return value.replace(/[^\d]/g, "");
}

function buildSocialLink() {
  const network = elements.socialNetwork.value;
  const rawValue = elements.socialValue.value.trim();

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  const handle = rawValue.replace(/^@/, "").replace(/^\/+/, "");
  const bases = {
    instagram: "https://instagram.com/",
    tiktok: "https://www.tiktok.com/@",
    linkedin: "https://www.linkedin.com/in/",
    youtube: "https://www.youtube.com/@",
    facebook: "https://www.facebook.com/",
  };

  return network === "custom" ? normalizeUrl(rawValue) : `${bases[network]}${encodeURIComponent(handle)}`;
}

function buildAppStoreLink() {
  const url = elements.appstoreUrl.value.trim();
  if (url) {
    return normalizeUrl(url);
  }

  const appName = elements.appstoreName.value.trim();
  if (!appName) {
    return "";
  }

  if (elements.appstoreTarget.value === "android") {
    return `https://play.google.com/store/search?q=${encodeURIComponent(appName)}&c=apps`;
  }

  return `https://www.apple.com/search/${encodeURIComponent(appName)}?src=globalnav`;
}

function buildLocationLink() {
  const query = elements.locationQuery.value.trim();
  const lat = elements.locationLat.value.trim().replace(",", ".");
  const lng = elements.locationLng.value.trim().replace(",", ".");

  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
  }

  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : "";
}

function buildCalendarEvent() {
  const title = elements.eventTitle.value.trim();
  const start = elements.eventStart.value;
  const end = elements.eventEnd.value;

  if (!title || !start) {
    return "";
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//QR-maker//FR",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@QR-maker`,
    `DTSTAMP:${formatDateTimeForIcs(new Date())}`,
    `DTSTART:${formatDateTimeForIcs(new Date(start))}`,
    `SUMMARY:${escapeIcs(title)}`,
  ];

  if (end) {
    lines.push(`DTEND:${formatDateTimeForIcs(new Date(end))}`);
  }
  if (elements.eventLocation.value.trim()) {
    lines.push(`LOCATION:${escapeIcs(elements.eventLocation.value.trim())}`);
  }
  if (elements.eventDescription.value.trim()) {
    lines.push(`DESCRIPTION:${escapeIcs(elements.eventDescription.value.trim())}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\n");
}

function buildVCard() {
  const firstName = elements.vcardFirstname.value.trim();
  const lastName = elements.vcardLastname.value.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!fullName && !elements.vcardPhone.value.trim() && !elements.vcardEmail.value.trim()) {
    return "";
  }

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
    `FN:${escapeVCard(fullName || lastName || firstName)}`,
  ];

  addVCardLine(lines, "TEL", elements.vcardPhone.value);
  addVCardLine(lines, "EMAIL", elements.vcardEmail.value);
  addVCardLine(lines, "ORG", elements.vcardOrg.value);
  addVCardLine(lines, "URL", elements.vcardUrl.value);
  addVCardLine(lines, "ADR", elements.vcardAddress.value);
  lines.push("END:VCARD");

  return lines.join("\n");
}

function addVCardLine(lines, key, inputValue) {
  const value = inputValue.trim();
  if (value) {
    lines.push(`${key}:${escapeVCard(value)}`);
  }
}

function escapeWifiValue(value) {
  return value.replace(/([\\;,":])/g, "\\$1");
}

function escapeVCard(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function escapeIcs(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function formatDateTimeForIcs(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function normalizeUrl(value) {
  if (!value) {
    return "";
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function getCurrentSettings() {
  return {
    outputSize: Number(elements.qrSize.value),
    margin: Number(elements.qrMargin.value),
    errorLevel: elements.qrErrorLevel.value,
    darkColor: elements.qrDarkColor.value,
    lightColor: elements.qrLightColor.value,
    logoSizeRatio: Number(elements.logoSize.value) / 100,
    logoRadiusRatio: Number(elements.logoRadius.value) / 100,
    logoBackground: elements.logoBackground.checked,
  };
}

async function renderQrCanvas(encoded, settings, logoSource, outputSize = settings.outputSize) {
  const safeMargin = Math.min(settings.margin, Math.floor(outputSize * 0.18));
  const qrSize = outputSize - safeMargin * 2;
  const scratch = document.createElement("div");
  scratch.style.position = "fixed";
  scratch.style.left = "-9999px";
  scratch.style.top = "-9999px";
  document.body.appendChild(scratch);

  try {
    createQrCode(scratch, encoded, qrSize, settings);
  } catch (error) {
    scratch.remove();
    throw error;
  }

  const sourceCanvas = scratch.querySelector("canvas");
  const sourceImage = scratch.querySelector("img");
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d");
  context.fillStyle = settings.lightColor;
  context.fillRect(0, 0, outputSize, outputSize);

  if (sourceCanvas) {
    context.drawImage(sourceCanvas, safeMargin, safeMargin, qrSize, qrSize);
  } else if (sourceImage) {
    await drawImageFromSource(context, sourceImage.src, safeMargin, safeMargin, qrSize, qrSize);
  } else {
    scratch.remove();
    throw new Error("Rendu QR indisponible.");
  }

  scratch.remove();

  if (logoSource) {
    await drawLogo(context, canvas, settings, logoSource);
  }

  return canvas;
}

function getQrCorrectLevel(level) {
  const levels = {
    L: QRCode.CorrectLevel.L,
    M: QRCode.CorrectLevel.M,
    Q: QRCode.CorrectLevel.Q,
    H: QRCode.CorrectLevel.H,
  };

  return levels[level] || QRCode.CorrectLevel.H;
}

function createQrCode(container, encoded, qrSize, settings) {
  const fallbackLevels = [settings.errorLevel, "Q", "M", "L"].filter((level, index, levels) => (
    levels.indexOf(level) === index
  ));

  for (const level of fallbackLevels) {
    try {
      container.innerHTML = "";
      new QRCode(container, {
        text: encoded,
        width: qrSize,
        height: qrSize,
        colorDark: settings.darkColor,
        colorLight: settings.lightColor,
        correctLevel: getQrCorrectLevel(level),
      });
      return level;
    } catch (error) {
      container.innerHTML = "";
    }
  }

  throw new Error("Contenu trop long pour un QR code fiable. Raccourcissez le texte ou utilisez un lien court.");
}

async function drawImageFromSource(context, source, x, y, width, height) {
  const image = await loadImage(source);
  context.drawImage(image, x, y, width, height);
}

async function drawLogo(context, canvas, settings, logoSource) {
  const logo = await loadLogoImage(logoSource);
  const logoSize = Math.round(canvas.width * settings.logoSizeRatio);
  const padding = settings.logoBackground ? Math.round(logoSize * 0.18) : 0;
  const boxSize = logoSize + padding * 2;
  const x = Math.round((canvas.width - boxSize) / 2);
  const y = Math.round((canvas.height - boxSize) / 2);
  const boxRadius = Math.round(boxSize * 0.18);
  const logoRadius = Math.round(logoSize * settings.logoRadiusRatio);

  if (settings.logoBackground) {
    drawRoundedRect(context, x, y, boxSize, boxSize, boxRadius, settings.lightColor);
  }

  drawRoundedImage(context, logo, x + padding, y + padding, logoSize, logoSize, logoRadius);
}

function updateQuality() {
  if (!state.encoded) {
    elements.qualityPanel.hidden = true;
    return;
  }

  const settings = getCurrentSettings();
  const contrast = getContrastRatio(settings.darkColor, settings.lightColor);
  const warnings = [];

  if (contrast < 4.5) {
    warnings.push("Contraste faible entre le QR et le fond.");
  }

  if (state.logoSource && settings.logoSizeRatio > 0.26) {
    warnings.push("Logo grand : testez le scan avant impression.");
  }

  if (settings.margin < 16) {
    warnings.push("Marge courte : augmentez-la pour les impressions.");
  }

  elements.qualityPanel.hidden = false;
  elements.qualityPanel.classList.toggle("warning", warnings.length > 0);
  elements.qualityDot.classList.toggle("warning", warnings.length > 0);
  elements.qualityMessage.textContent = warnings.length > 0
    ? warnings.join(" ")
    : "Lisibilite correcte avec ces reglages.";
}

function updateScanAction() {
  const messages = {
    text: "Affichera le texte dans l'application de scan, ou ouvrira le lien si c'est une URL.",
    note: "Ouvrira la note partagee en ligne, par exemple Google Docs si le lien est public.",
    wifi: "Proposera de rejoindre le reseau Wi-Fi avec les informations pre-remplies.",
    vcard: "Proposera d'ajouter ce contact au carnet d'adresses.",
    email: "Ouvrira l'application email avec destinataire, sujet et message pre-remplis.",
    phone: "Ouvrira l'application telephone avec ce numero. L'appel ne part pas automatiquement.",
    sms: "Ouvrira l'application SMS avec le numero et le message pre-remplis. Le SMS ne part pas automatiquement.",
    whatsapp: "Ouvrira WhatsApp avec le numero et le message pre-remplis. Le message ne part pas automatiquement.",
    location: "Ouvrira une carte vers ce lieu ou ces coordonnees.",
    event: "Proposera d'ajouter cet evenement au calendrier.",
    social: "Ouvrira le profil ou la page du reseau social choisi.",
    appstore: "Ouvrira la fiche de l'application dans la boutique ou le lien fourni.",
  };

  elements.scanAction.hidden = !state.encoded;
  elements.scanActionText.textContent = messages[state.mode] || messages.text;
}

function verifyScan(canvas) {
  elements.scanCheckPanel.hidden = false;
  elements.scanCheckPanel.classList.remove("warning");
  elements.scanCheckDot.classList.remove("warning");

  if (typeof jsQR === "undefined") {
    elements.scanCheckPanel.classList.add("warning");
    elements.scanCheckDot.classList.add("warning");
    elements.scanCheckMessage.textContent = "Verification de scan indisponible hors ligne.";
    return;
  }

  try {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    const ok = Boolean(result?.data);
    elements.scanCheckPanel.classList.toggle("warning", !ok);
    elements.scanCheckDot.classList.toggle("warning", !ok);
    elements.scanCheckMessage.textContent = ok
      ? "Verification de scan reussie dans le navigateur."
      : "Verification de scan non concluante : testez avec un telephone avant usage.";
  } catch (error) {
    elements.scanCheckPanel.classList.add("warning");
    elements.scanCheckDot.classList.add("warning");
    elements.scanCheckMessage.textContent = "Verification de scan impossible avec ce rendu.";
  }
}

function getContrastRatio(first, second) {
  const lum1 = getLuminance(first);
  const lum2 = getLuminance(second);
  const light = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (light + 0.05) / (dark + 0.05);
}

function getLuminance(hex) {
  const rgb = hex.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16) / 255);
  const adjusted = rgb.map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return adjusted[0] * 0.2126 + adjusted[1] * 0.7152 + adjusted[2] * 0.0722;
}

async function downloadPng() {
  try {
    const canvas = await renderQrCanvas(state.encoded, getCurrentSettings(), state.logoSource);
    downloadUrl(canvas.toDataURL("image/png"), `${fileBaseName()}.png`);
    setFeedback("QR code telecharge en PNG.");
  } catch (error) {
    setFeedback("Telechargement impossible. Importez le logo localement si le lien externe bloque l'export.");
  }
}

async function downloadSvg() {
  try {
    const canvas = await renderQrCanvas(state.encoded, getCurrentSettings(), state.logoSource);
    const dataUrl = canvas.toDataURL("image/png");
    const size = getCurrentSettings().outputSize;
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
      `<image href="${dataUrl}" width="${size}" height="${size}"/>`,
      "</svg>",
    ].join("");
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    downloadUrl(URL.createObjectURL(blob), `${fileBaseName()}.svg`, true);
    setFeedback("QR code telecharge en SVG.");
  } catch (error) {
    setFeedback("Export SVG impossible avec ce logo externe.");
  }
}

function downloadUrl(url, filename, revoke = false) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (revoke) {
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }
}

async function copyQrImage() {
  if (!state.encoded || !navigator.clipboard || typeof ClipboardItem === "undefined") {
    setFeedback("La copie d'image n'est pas prise en charge par ce navigateur.");
    return;
  }

  try {
    const canvas = await renderQrCanvas(state.encoded, getCurrentSettings(), state.logoSource);
    const blob = await canvasToBlob(canvas);
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setFeedback("QR code copie comme image.");
  } catch (error) {
    setFeedback("Impossible de copier l'image. Telechargez le PNG ou importez le logo localement.");
  }
}

async function copyEncodedContent() {
  if (!state.encoded) {
    return;
  }

  try {
    await navigator.clipboard.writeText(state.encoded);
    setFeedback("Contenu copie dans le presse-papiers.");
  } catch (error) {
    elements.encodedOutput.select();
    document.execCommand("copy");
    setFeedback("Contenu copie.");
  }
}

function testEncodedLink() {
  if (!isTestableLink(state.encoded)) {
    setFeedback("Ce contenu n'est pas un lien testable.");
    return;
  }

  window.open(state.encoded, "_blank", "noopener,noreferrer");
}

function isTestableLink(value) {
  return /^(https?:|mailto:|tel:|sms:)/i.test(value || "");
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas vide"));
        }
      }, "image/png");
    } catch (error) {
      reject(error);
    }
  });
}

function saveCurrentToHistory() {
  if (!state.encoded) {
    return;
  }

  const existingIndex = state.history.findIndex((item) => item.content === state.encoded);
  const existingItem = existingIndex >= 0 ? state.history[existingIndex] : null;
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    mode: state.mode,
    name: getHistoryName(),
    content: state.encoded,
    fields: collectModeFields(),
    settings: getCurrentSettings(),
    logoSource: state.logoSource,
    logoType: state.logoType,
    favorite: Boolean(existingItem?.favorite),
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    state.history.splice(existingIndex, 1);
  }

  state.history.unshift(item);
  state.history = state.history.slice(0, MAX_HISTORY_ITEMS);
  writeHistory();
  renderHistory();
}

function getHistoryName() {
  const customName = elements.historyName.value.trim();
  if (customName) {
    return customName;
  }

  if (state.mode === "wifi") {
    return elements.wifiSsid.value.trim() || "Wi-Fi";
  }

  if (state.mode === "note") {
    return elements.noteService.options[elements.noteService.selectedIndex]?.text || "Note";
  }

  if (state.mode === "vcard") {
    return [elements.vcardFirstname.value.trim(), elements.vcardLastname.value.trim()].filter(Boolean).join(" ") || "Contact";
  }

  if (state.mode === "email") {
    return elements.emailTo.value.trim() || "Email";
  }

  if (state.mode === "phone") {
    return elements.phoneNumber.value.trim() || "Telephone";
  }

  if (state.mode === "sms") {
    return elements.smsNumber.value.trim() || "SMS";
  }

  if (state.mode === "whatsapp") {
    return elements.whatsappNumber.value.trim() || "WhatsApp";
  }

  if (state.mode === "location") {
    return elements.locationQuery.value.trim() || "Lieu";
  }

  if (state.mode === "event") {
    return elements.eventTitle.value.trim() || "Evenement";
  }

  if (state.mode === "social") {
    return elements.socialValue.value.trim() || "Reseau social";
  }

  if (state.mode === "appstore") {
    return elements.appstoreName.value.trim() || "App mobile";
  }

  return state.encoded.slice(0, 42) || "QR code";
}

function collectModeFields() {
  return {
    text: elements.freeText.value,
    noteService: elements.noteService.value,
    noteUrl: elements.noteUrl.value,
    wifiSsid: elements.wifiSsid.value,
    wifiPassword: elements.wifiPassword.value,
    wifiSecurity: elements.wifiSecurity.value,
    wifiHidden: elements.wifiHidden.checked,
    vcardLastname: elements.vcardLastname.value,
    vcardFirstname: elements.vcardFirstname.value,
    vcardPhone: elements.vcardPhone.value,
    vcardEmail: elements.vcardEmail.value,
    vcardOrg: elements.vcardOrg.value,
    vcardUrl: elements.vcardUrl.value,
    vcardAddress: elements.vcardAddress.value,
    emailTo: elements.emailTo.value,
    emailSubject: elements.emailSubject.value,
    emailBody: elements.emailBody.value,
    phoneNumber: elements.phoneNumber.value,
    smsNumber: elements.smsNumber.value,
    smsMessage: elements.smsMessage.value,
    whatsappNumber: elements.whatsappNumber.value,
    whatsappMessage: elements.whatsappMessage.value,
    locationQuery: elements.locationQuery.value,
    locationLat: elements.locationLat.value,
    locationLng: elements.locationLng.value,
    eventTitle: elements.eventTitle.value,
    eventStart: elements.eventStart.value,
    eventEnd: elements.eventEnd.value,
    eventLocation: elements.eventLocation.value,
    eventDescription: elements.eventDescription.value,
    socialNetwork: elements.socialNetwork.value,
    socialValue: elements.socialValue.value,
    appstoreTarget: elements.appstoreTarget.value,
    appstoreName: elements.appstoreName.value,
    appstoreUrl: elements.appstoreUrl.value,
    historyName: elements.historyName.value,
  };
}

function readHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function writeHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
}

function renderHistory() {
  elements.historyList.innerHTML = "";
  elements.clearHistoryButton.disabled = state.history.length === 0;

  const filtered = state.history
    .filter((item) => state.historyFilter === "all" || item.mode === state.historyFilter)
    .sort((first, second) => Number(second.favorite) - Number(first.favorite));

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = state.history.length === 0
      ? "Aucun QR code dans l'historique pour le moment."
      : "Aucun QR code pour ce filtre.";
    elements.historyList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach((item) => {
    const article = document.createElement("article");
    article.className = "history-item";

    const details = document.createElement("div");
    const meta = document.createElement("div");
    meta.className = "history-meta";

    const badge = document.createElement("span");
    badge.className = "history-badge";
    badge.textContent = MODE_LABELS[item.mode] || "QR";

    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = formatDate(item.createdAt);

    const title = document.createElement("h3");
    title.className = "history-title";
    title.textContent = `${item.favorite ? "[Favori] " : ""}${item.name || MODE_LABELS[item.mode] || "QR code"}`;

    const content = document.createElement("p");
    content.className = "history-content";
    content.textContent = item.content;

    meta.append(badge, time);
    details.append(meta, title, content);

    const actions = document.createElement("div");
    actions.className = "history-actions";

    const reuseButton = createHistoryButton("Reprendre", () => reuseHistoryItem(item));
    const favoriteButton = createHistoryButton(item.favorite ? "Retirer" : "Favori", () => toggleFavorite(item.id));
    const copyQrButton = createHistoryButton("Copier QR", () => copyHistoryQr(item));
    const copyTextButton = createHistoryButton("Copier texte", () => copyHistoryContent(item));
    const deleteButton = createHistoryButton("Supprimer", () => deleteHistoryItem(item.id), "danger-action");

    actions.append(reuseButton, favoriteButton, copyQrButton, copyTextButton, deleteButton);
    article.append(details, actions);
    fragment.appendChild(article);
  });

  elements.historyList.appendChild(fragment);
}

function toggleFavorite(id) {
  state.history = state.history.map((item) => (
    item.id === id ? { ...item, favorite: !item.favorite } : item
  ));
  writeHistory();
  renderHistory();
}

function createHistoryButton(label, onClick, extraClass = "") {
  const button = document.createElement("button");
  button.className = `small-action ${extraClass}`.trim();
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function reuseHistoryItem(item) {
  setMode(item.mode || "text");
  applyModeFields(item.fields, item.content);
  applySettings(item.settings);
  state.logoSource = item.logoSource || "";
  state.logoType = normalizeLogoType(item.logoType, state.logoSource);
  updateLogoPresetButtons(state.logoType);
  updateQr({ skipHistory: true });
  setFeedback("Element charge depuis l'historique.");
}

function applyModeFields(fields = {}, content = "") {
  elements.freeText.value = fields.text ?? content;
  elements.noteService.value = fields.noteService || "google-docs";
  elements.noteUrl.value = fields.noteUrl || "";
  elements.wifiSsid.value = fields.wifiSsid || "";
  elements.wifiPassword.value = fields.wifiPassword || "";
  elements.wifiSecurity.value = fields.wifiSecurity || "WPA";
  elements.wifiHidden.checked = Boolean(fields.wifiHidden);
  elements.vcardLastname.value = fields.vcardLastname || "";
  elements.vcardFirstname.value = fields.vcardFirstname || "";
  elements.vcardPhone.value = fields.vcardPhone || "";
  elements.vcardEmail.value = fields.vcardEmail || "";
  elements.vcardOrg.value = fields.vcardOrg || "";
  elements.vcardUrl.value = fields.vcardUrl || "";
  elements.vcardAddress.value = fields.vcardAddress || "";
  elements.emailTo.value = fields.emailTo || "";
  elements.emailSubject.value = fields.emailSubject || "";
  elements.emailBody.value = fields.emailBody || "";
  elements.phoneNumber.value = fields.phoneNumber || "";
  elements.smsNumber.value = fields.smsNumber || "";
  elements.smsMessage.value = fields.smsMessage || "";
  elements.whatsappNumber.value = fields.whatsappNumber || "";
  elements.whatsappMessage.value = fields.whatsappMessage || "";
  elements.locationQuery.value = fields.locationQuery || "";
  elements.locationLat.value = fields.locationLat || "";
  elements.locationLng.value = fields.locationLng || "";
  elements.eventTitle.value = fields.eventTitle || "";
  elements.eventStart.value = fields.eventStart || "";
  elements.eventEnd.value = fields.eventEnd || "";
  elements.eventLocation.value = fields.eventLocation || "";
  elements.eventDescription.value = fields.eventDescription || "";
  elements.socialNetwork.value = fields.socialNetwork || "instagram";
  elements.socialValue.value = fields.socialValue || "";
  elements.appstoreTarget.value = fields.appstoreTarget || "ios";
  elements.appstoreName.value = fields.appstoreName || "";
  elements.appstoreUrl.value = fields.appstoreUrl || "";
  elements.historyName.value = fields.historyName || "";
}

function applySettings(settings = {}) {
  elements.qrSize.value = String(settings.outputSize || 768);
  elements.qrErrorLevel.value = settings.errorLevel || "H";
  elements.qrDarkColor.value = settings.darkColor || "#111827";
  elements.qrLightColor.value = settings.lightColor || "#ffffff";
  elements.qrMargin.value = String(settings.margin || 32);
  elements.logoSize.value = String(Math.round((settings.logoSizeRatio || 0.22) * 100));
  elements.logoRadius.value = String(Math.round((settings.logoRadiusRatio || 0.2) * 100));
  elements.logoBackground.checked = settings.logoBackground !== false;
  syncRangeOutputs();
}

async function copyHistoryQr(item) {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    setFeedback("La copie d'image n'est pas prise en charge par ce navigateur.");
    return;
  }

  try {
    const canvas = await renderQrCanvas(item.content, normalizeSettings(item.settings), item.logoSource || "");
    const blob = await canvasToBlob(canvas);
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setFeedback("QR de l'historique copie comme image.");
  } catch (error) {
    setFeedback("Impossible de copier ce QR depuis l'historique.");
  }
}

async function copyHistoryContent(item) {
  try {
    await navigator.clipboard.writeText(item.content);
    setFeedback("Contenu de l'historique copie.");
  } catch (error) {
    setFeedback("Copie impossible depuis l'historique.");
  }
}

function normalizeSettings(settings = {}) {
  return {
    outputSize: settings.outputSize || 768,
    margin: settings.margin ?? 32,
    errorLevel: settings.errorLevel || "H",
    darkColor: settings.darkColor || "#111827",
    lightColor: settings.lightColor || "#ffffff",
    logoSizeRatio: settings.logoSizeRatio || 0.22,
    logoRadiusRatio: settings.logoRadiusRatio ?? 0.2,
    logoBackground: settings.logoBackground !== false,
  };
}

function deleteHistoryItem(id) {
  state.history = state.history.filter((item) => item.id !== id);
  writeHistory();
  renderHistory();
}

function clearHistory() {
  state.history = [];
  writeHistory();
  renderHistory();
  setFeedback("Historique efface.");
}

function resetForm() {
  document.querySelector("#qr-form").reset();
  state.mode = "text";
  state.encoded = "";
  state.logoSource = "";
  state.logoType = "none";
  elements.templateSelect.value = "";
  elements.designPreset.value = "blue";
  setMode("text", { skipUpdate: true });
  updateLogoPresetButtons("none");
  syncRangeOutputs();
  updateQr({ skipHistory: true });
  setFeedback("Formulaire reinitialise.");
}

function setLogoPreset(key) {
  if (key === "custom") {
    if (state.logoType !== "custom") {
      state.logoSource = "";
    }
    state.logoType = "custom";
    updateLogoPresetButtons("custom");
    elements.customLogoPanel.hidden = false;
    updateQr();
    return;
  }

  state.logoType = key;
  state.logoSource = key === "none" ? "" : LOGO_PRESETS[key];
  elements.logoFile.value = "";
  elements.logoUrl.value = "";
  updateLogoPresetButtons(key);
  updateQr();
}

function handleLogoUpload() {
  const file = elements.logoFile.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.logoType = "custom";
    state.logoSource = String(reader.result);
    elements.logoUrl.value = "";
    updateLogoPresetButtons("custom");
    updateQr();
    setFeedback("Logo importe.");
  });
  reader.readAsDataURL(file);
}

function handleLogoUrl() {
  const url = elements.logoUrl.value.trim();
  if (!url) {
    state.logoType = "none";
    state.logoSource = "";
    updateLogoPresetButtons("none");
    updateQr();
    return;
  }

  try {
    state.logoSource = new URL(url).href;
    state.logoType = "custom";
    elements.logoFile.value = "";
    updateLogoPresetButtons("custom");
    updateQr();
    setFeedback("Logo charge depuis le lien.");
  } catch (error) {
    setFeedback("Lien de logo invalide.");
  }
}

function updateLogoPresetButtons(activeKey) {
  elements.logoPresets.forEach((button) => {
    const active = button.dataset.logo === activeKey;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.customLogoPanel.hidden = activeKey !== "custom";
  elements.logoSettingsPanel.hidden = activeKey === "none";
}

function normalizeLogoType(type, source) {
  if (type === "url" || (source && !LOGO_PRESETS[type])) {
    return "custom";
  }

  return type || (source ? "custom" : "none");
}

function applyTemplate() {
  const template = elements.templateSelect.value;
  if (!template) {
    return;
  }

  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  nextHour.setMinutes(0, 0, 0);
  const endHour = new Date(nextHour.getTime() + 60 * 60 * 1000);

  const templates = {
    "wifi-home": () => {
      setMode("wifi", { skipUpdate: true });
      elements.historyName.value = "Wi-Fi maison";
      elements.wifiSsid.value = "Maison";
      elements.wifiPassword.value = "";
      elements.wifiSecurity.value = "WPA";
      elements.wifiHidden.checked = false;
    },
    "business-card": () => {
      setMode("vcard", { skipUpdate: true });
      elements.historyName.value = "Carte pro";
      elements.vcardFirstname.value = "Marie";
      elements.vcardLastname.value = "Dupont";
      elements.vcardPhone.value = "+262 692 00 00 00";
      elements.vcardEmail.value = "contact@example.com";
      elements.vcardOrg.value = "Entreprise";
      elements.vcardUrl.value = "https://exemple.com";
    },
    "shared-note": () => {
      setMode("note", { skipUpdate: true });
      elements.historyName.value = "Note Google Docs";
      elements.noteService.value = "google-docs";
      elements.noteUrl.value = "https://docs.google.com/document/d/...";
    },
    instagram: () => {
      setMode("social", { skipUpdate: true });
      elements.historyName.value = "Lien Instagram";
      elements.socialNetwork.value = "instagram";
      elements.socialValue.value = "votre_compte";
    },
    "restaurant-menu": () => {
      setMode("text", { skipUpdate: true });
      elements.historyName.value = "Menu restaurant";
      elements.freeText.value = "https://exemple.com/menu";
    },
    support: () => {
      setMode("email", { skipUpdate: true });
      elements.historyName.value = "Support client";
      elements.emailTo.value = "support@example.com";
      elements.emailSubject.value = "Demande de support";
      elements.emailBody.value = "Bonjour, j'ai besoin d'aide concernant...";
    },
    whatsapp: () => {
      setMode("whatsapp", { skipUpdate: true });
      elements.historyName.value = "WhatsApp";
      elements.whatsappNumber.value = "+262 692 00 00 00";
      elements.whatsappMessage.value = "Bonjour,";
    },
    event: () => {
      setMode("event", { skipUpdate: true });
      elements.historyName.value = "Evenement";
      elements.eventTitle.value = "Evenement";
      elements.eventStart.value = toLocalDateTimeValue(nextHour);
      elements.eventEnd.value = toLocalDateTimeValue(endHour);
      elements.eventLocation.value = "Lieu a completer";
    },
    location: () => {
      setMode("location", { skipUpdate: true });
      elements.historyName.value = "Localisation";
      elements.locationQuery.value = "Saint-Denis, Reunion";
    },
    social: () => {
      setMode("social", { skipUpdate: true });
      elements.historyName.value = "Reseau social";
      elements.socialNetwork.value = "instagram";
      elements.socialValue.value = "votre_compte";
    },
    appstore: () => {
      setMode("appstore", { skipUpdate: true });
      elements.historyName.value = "App mobile";
      elements.appstoreTarget.value = "ios";
      elements.appstoreName.value = "Mon app";
      elements.appstoreUrl.value = "https://apps.apple.com/";
    },
  };

  templates[template]?.();
  elements.templateSelect.value = "";
  updateQr();
}

function applyDesignPreset() {
  const presets = {
    blue: { dark: "#111827", light: "#ffffff", margin: 32, error: "H" },
    classic: { dark: "#000000", light: "#ffffff", margin: 32, error: "H" },
    premium: { dark: "#050816", light: "#f7f8fb", margin: 40, error: "H" },
    pastel: { dark: "#1769e0", light: "#f6fbff", margin: 36, error: "H" },
    print: { dark: "#000000", light: "#ffffff", margin: 48, error: "H" },
  };

  const preset = presets[elements.designPreset.value];
  if (!preset) {
    return;
  }

  elements.qrDarkColor.value = preset.dark;
  elements.qrLightColor.value = preset.light;
  elements.qrMargin.value = String(preset.margin);
  elements.qrErrorLevel.value = preset.error;
  syncRangeOutputs();
  updateQr();
}

function toLocalDateTimeValue(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function loadLogoImage(source) {
  if (source.startsWith("data:")) {
    return loadImage(source);
  }

  return loadImage(source, "anonymous").catch(() => loadImage(source));
}

function loadImage(source, crossOrigin) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = source;
  });
}

function drawRoundedRect(context, x, y, width, height, radius, color) {
  context.save();
  context.fillStyle = color;
  context.beginPath();
  roundedPath(context, x, y, width, height, radius);
  context.fill();
  context.restore();
}

function drawRoundedImage(context, image, x, y, width, height, radius) {
  context.save();
  context.beginPath();
  roundedPath(context, x, y, width, height, radius);
  context.clip();
  context.drawImage(image, x, y, width, height);
  context.restore();
}

function roundedPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function fileBaseName() {
  return `QR-maker-${new Date().toISOString().slice(0, 10)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function setFeedback(message) {
  elements.feedback.textContent = message;
}

function buildLogoDataUri(text, startColor, endColor) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="g" x1="18" y1="18" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stop-color="${startColor}"/>
          <stop offset="1" stop-color="${endColor}"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="30" fill="url(#g)"/>
      <circle cx="98" cy="30" r="11" fill="rgba(255,255,255,.32)"/>
      <text x="64" y="75" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="white">${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
