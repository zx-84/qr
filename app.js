const HISTORY_KEY = "qr-maker-history";
const MAX_FAVORITES = 24;
const PREVIEW_SIZE = 768;
const DISPLAY_SIZE = 320;

const LOGO_PRESETS = {
  qr: buildLogoDataUri("QR", "#1769e0", "#14b8d2"),
  link: buildLogoDataUri("LINK", "#0d4fb6", "#5b8def"),
  wifi: buildLogoDataUri("WIFI", "#0e7490", "#14b8d2"),
  info: buildLogoDataUri("INFO", "#f46d4f", "#ff9b73"),
};

const STYLE_PRESETS = {
  square: { label: "Classique", dark: "#000000", light: "#ffffff", roundness: 0, shape: "square" },
  rounded: { label: "Arrondi", dark: "#1769e0", light: "#ffffff", roundness: 32, shape: "rounded" },
  dots: { label: "Points", dark: "#5b8def", light: "#fff7fb", roundness: 48, shape: "dots" },
  classy: { label: "Classy", dark: "#050816", light: "#f7f8fb", roundness: 28, shape: "rounded", gradient: ["#050816", "#14b8d2"] },
  poster: { label: "Affiche", dark: "#5f1846", light: "#fff7fb", roundness: 36, shape: "rounded", background: "#fff7fb", gradient: ["#5f1846", "#7b245d", "#1769e0"] },
  ocean: { label: "Ocean", dark: "#075985", light: "#ecfeff", roundness: 34, shape: "rounded", background: "#ecfeff", gradient: ["#075985", "#0891b2", "#22d3ee"] },
  berry: { label: "Berry", dark: "#7f1d5a", light: "#fff1f7", roundness: 40, shape: "rounded", background: "#fff1f7", gradient: ["#7f1d5a", "#be185d", "#f97316"] },
  neon: { label: "Neon", dark: "#111827", light: "#f7fbff", roundness: 24, shape: "rounded", background: "#f7fbff", gradient: ["#111827", "#1769e0", "#14b8d2"] },
  soft: { label: "Soft", dark: "#315b7c", light: "#f8fbff", roundness: 44, shape: "dots", background: "#f8fbff", gradient: ["#315b7c", "#5b8def"] },
  ink: { label: "Encre", dark: "#172033", light: "#fbfaf7", roundness: 18, shape: "rounded", background: "#fbfaf7", gradient: ["#172033", "#5f1846"] },
  forest: { label: "Forest", dark: "#14532d", light: "#f0fdf4", roundness: 30, shape: "rounded", background: "#f0fdf4", gradient: ["#14532d", "#22a06b"] },
  sunset: { label: "Sunset", dark: "#9a3412", light: "#fff7ed", roundness: 36, shape: "rounded", background: "#fff7ed", gradient: ["#9a3412", "#f46d4f", "#f59e0b"] },
  violet: { label: "Violet", dark: "#4c1d95", light: "#faf5ff", roundness: 34, shape: "rounded", background: "#faf5ff", gradient: ["#4c1d95", "#7c3aed"] },
  slate: { label: "Slate", dark: "#0f172a", light: "#f8fafc", roundness: 16, shape: "rounded", background: "#f8fafc", gradient: ["#0f172a", "#475569"] },
  candy: { label: "Candy", dark: "#be185d", light: "#fff7fb", roundness: 46, shape: "dots", background: "#fff7fb", gradient: ["#be185d", "#fb7185"] },
  mint: { label: "Mint", dark: "#0f766e", light: "#f0fdfa", roundness: 42, shape: "dots", background: "#f0fdfa", gradient: ["#0f766e", "#2dd4bf"] },
  gold: { label: "Gold", dark: "#713f12", light: "#fffbea", roundness: 24, shape: "rounded", background: "#fffbea", gradient: ["#713f12", "#d97706"] },
  rose: { label: "Rose", dark: "#9f1239", light: "#fff1f2", roundness: 38, shape: "rounded", background: "#fff1f2", gradient: ["#9f1239", "#f43f5e"] },
  ice: { label: "Ice", dark: "#155e75", light: "#f0fdff", roundness: 46, shape: "dots", background: "#f0fdff", gradient: ["#155e75", "#67e8f9"] },
  mono: { label: "Mono", dark: "#262626", light: "#fafafa", roundness: 8, shape: "square" },
  night: { label: "Night", dark: "#e5e7eb", light: "#111827", roundness: 24, shape: "rounded", background: "#111827", gradient: ["#e5e7eb", "#93c5fd"] },
  coral: { label: "Corail", dark: "#c2410c", light: "#fff5f0", roundness: 36, shape: "rounded", background: "#fff5f0", gradient: ["#c2410c", "#f46d4f"] },
  waves: { label: "Image vagues", dark: "#075985", light: "#effcff", roundness: 36, shape: "rounded", background: "#effcff", texture: "waves" },
  marble: { label: "Image marbre", dark: "#334155", light: "#f8fafc", roundness: 22, shape: "rounded", background: "#f8fafc", texture: "marble" },
  paper: { label: "Image papier", dark: "#713f12", light: "#fffbea", roundness: 18, shape: "square", background: "#fffbea", texture: "paper" },
  mosaic: { label: "Image mosaique", dark: "#4c1d95", light: "#faf5ff", roundness: 34, shape: "rounded", background: "#faf5ff", texture: "mosaic" },
  aurora: { label: "Image aurore", dark: "#064e3b", light: "#ecfdf5", roundness: 42, shape: "dots", background: "#ecfdf5", texture: "aurora" },
};

const MODE_LABELS = {
  text: "Texte",
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
  media: "Media",
};

const state = {
  mode: "text",
  encoded: "",
  logoSource: "",
  logoType: "none",
  styleImageSource: "",
  favorites: readFavorites(),
  renderVersion: 0,
};

const elements = {
  modeButtons: document.querySelectorAll(".mode-button"),
  modeSelect: document.querySelector("#mode-select"),
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
  linkInsight: document.querySelector("#link-insight"),
  linkKind: document.querySelector("#link-kind"),
  linkInsightText: document.querySelector("#link-insight-text"),
  validationPanel: document.querySelector("#validation-panel"),
  validationMessage: document.querySelector("#validation-message"),
  downloadButton: document.querySelector("#download-button"),
  downloadSvgButton: document.querySelector("#download-svg-button"),
  copyQrButton: document.querySelector("#copy-qr-button"),
  copyButton: document.querySelector("#copy-button"),
  testLinkButton: document.querySelector("#test-link-button"),
  favoriteCurrentButton: document.querySelector("#favorite-current-button"),
  favoriteForm: document.querySelector("#favorite-form"),
  confirmFavoriteButton: document.querySelector("#confirm-favorite-button"),
  resetButton: document.querySelector("#reset-button"),
  favoritesList: document.querySelector("#favorites-list"),
  favoritesSearch: document.querySelector("#favorites-search"),
  logoPresets: document.querySelectorAll(".logo-preset"),
  customLogoPanel: document.querySelector("#custom-logo-panel"),
  logoSettingsPanel: document.querySelector("#logo-settings-panel"),
  logoFile: document.querySelector("#logo-file"),
  logoUrl: document.querySelector("#logo-url"),
  logoUrlButton: document.querySelector("#logo-url-button"),
  formInputs: document.querySelectorAll("input, select, textarea"),
  freeText: document.querySelector("#free-text"),
  favoriteName: document.querySelector("#favorite-name"),
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
  mediaType: document.querySelector("#media-type"),
  mediaUrl: document.querySelector("#media-url"),
  qrSize: document.querySelector("#qr-size"),
  qrErrorLevel: document.querySelector("#qr-error-level"),
  qrDarkColor: document.querySelector("#qr-dark-color"),
  qrLightColor: document.querySelector("#qr-light-color"),
  qrStyle: document.querySelector("#qr-style"),
  stylePickerButton: document.querySelector("#style-picker-button"),
  styleCloseButton: document.querySelector("#style-close-button"),
  stylePopover: document.querySelector("#style-popover"),
  styleGallery: document.querySelector("#style-gallery"),
  styleImageFile: document.querySelector("#style-image-file"),
  styleImageUrl: document.querySelector("#style-image-url"),
  styleImageUrlButton: document.querySelector("#style-image-url-button"),
  qrRoundness: document.querySelector("#qr-roundness"),
  qrRoundnessOutput: document.querySelector("#qr-roundness-output"),
  qrMargin: document.querySelector("#qr-margin"),
  qrMarginOutput: document.querySelector("#qr-margin-output"),
  logoSize: document.querySelector("#logo-size"),
  logoSizeOutput: document.querySelector("#logo-size-output"),
  logoRadius: document.querySelector("#logo-radius"),
  logoRadiusOutput: document.querySelector("#logo-radius-output"),
  logoBackground: document.querySelector("#logo-background"),
};

window.addEventListener("load", () => {
  renderStyleOptions();
  bindEvents();
  syncRangeOutputs();
  syncStyleCards();
  writeFavorites();
  renderFavorites();
  updateQr();
  renderStyleThumbnails();
});

function bindEvents() {
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  elements.modeSelect.addEventListener("change", () => setMode(elements.modeSelect.value));
  elements.favoritesSearch.addEventListener("input", renderFavorites);

  elements.formInputs.forEach((input) => {
    if (["logo-file", "logo-url", "mode-select", "favorites-search", "style-image-file", "style-image-url"].includes(input.id)) {
      return;
    }

    input.addEventListener("input", handleFormInput);
    input.addEventListener("change", handleFormInput);
  });

  elements.logoPresets.forEach((button) => {
    button.addEventListener("click", () => setLogoPreset(button.dataset.logo));
  });
  elements.stylePickerButton.addEventListener("click", toggleStylePopover);
  elements.styleCloseButton.addEventListener("click", closeStylePopover);
  elements.styleGallery.addEventListener("click", handleStyleGalleryClick);
  elements.styleImageFile.addEventListener("change", handleStyleImageUpload);
  elements.styleImageUrlButton.addEventListener("click", handleStyleImageUrl);
  elements.styleImageUrl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleStyleImageUrl();
    }
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
  elements.favoriteCurrentButton.addEventListener("click", showFavoriteForm);
  elements.confirmFavoriteButton.addEventListener("click", favoriteCurrentQr);
  elements.resetButton.addEventListener("click", resetForm);
}

function handleFormInput(event) {
  if (event?.target?.id === "qr-style") {
    state.styleImageSource = "";
    applyStyleDefaults(elements.qrStyle.value);
  }

  syncRangeOutputs();
  syncStyleCards();
  updateQr();
}

function syncRangeOutputs() {
  elements.qrMarginOutput.textContent = `${elements.qrMargin.value} px`;
  elements.qrRoundnessOutput.textContent = `${elements.qrRoundness.value}%`;
  elements.logoSizeOutput.textContent = `${elements.logoSize.value}%`;
  elements.logoRadiusOutput.textContent = `${elements.logoRadius.value}%`;
}

function setQrStyle(style) {
  state.styleImageSource = "";
  elements.qrStyle.value = style;
  applyStyleDefaults(style);
  syncRangeOutputs();
  syncStyleCards();
  updateQr();
}

function syncStyleCards() {
  elements.styleGallery.querySelectorAll(".style-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.style === elements.qrStyle.value);
  });
}

function applyStyleDefaults(style) {
  const selected = STYLE_PRESETS[style];

  if (!selected) {
    elements.qrRoundness.value = "32";
    return;
  }

  elements.qrDarkColor.value = selected.dark;
  elements.qrLightColor.value = selected.light;
  elements.qrRoundness.value = String(selected.roundness);
}

function renderStyleOptions() {
  elements.qrStyle.innerHTML = "";
  elements.styleGallery.innerHTML = "";

  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Importe depuis image";
  elements.qrStyle.appendChild(customOption);

  Object.entries(STYLE_PRESETS).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.label;
    elements.qrStyle.appendChild(option);

    const button = document.createElement("button");
    button.className = "style-card";
    button.type = "button";
    button.dataset.style = key;

    const preview = document.createElement("span");
    preview.className = "style-preview";
    preview.dataset.preview = key;
    preview.textContent = "QR";

    const label = document.createElement("span");
    label.textContent = preset.label;

    button.append(preview, label);
    elements.styleGallery.appendChild(button);
  });

  elements.qrStyle.value = "rounded";
}

async function renderStyleThumbnails() {
  if (typeof QRCode === "undefined") {
    return;
  }

  for (const [key, preset] of Object.entries(STYLE_PRESETS)) {
    const host = elements.styleGallery.querySelector(`[data-preview="${key}"]`);
    if (!host) {
      continue;
    }

    try {
      const canvas = await renderQrCanvas("https://QR-maker.app", stylePreviewSettings(preset, key), "", 88);
      host.textContent = "";
      host.appendChild(canvas);
    } catch (error) {
      host.textContent = "QR";
    }
  }
}

function stylePreviewSettings(preset, key) {
  return {
    outputSize: 88,
    margin: 8,
    errorLevel: "H",
    darkColor: preset.dark,
    lightColor: preset.light,
    qrStyle: key,
    qrRoundness: preset.roundness / 100,
    qrShape: preset.shape,
    qrGradient: preset.gradient,
    qrBackground: preset.background,
    qrTexture: preset.texture,
    logoSizeRatio: 0.2,
    logoRadiusRatio: 0.2,
    logoBackground: true,
  };
}

function toggleStylePopover() {
  elements.stylePopover.hidden = !elements.stylePopover.hidden;
}

function closeStylePopover() {
  elements.stylePopover.hidden = true;
}

function handleStyleGalleryClick(event) {
  const button = event.target.closest(".style-card");
  if (!button) {
    return;
  }

  setQrStyle(button.dataset.style);
  closeStylePopover();
}

function handleStyleImageUpload() {
  const file = elements.styleImageFile.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    await importStyleFromImage(String(reader.result));
  });
  reader.readAsDataURL(file);
}

async function handleStyleImageUrl() {
  const url = elements.styleImageUrl.value.trim();
  if (!url) {
    setFeedback("Ajoutez un lien d'image a analyser.");
    return;
  }

  try {
    await importStyleFromImage(new URL(url).href, true);
  } catch (error) {
    setFeedback("Lien d'image invalide.");
  }
}

async function importStyleFromImage(source, fromUrl = false) {
  try {
    const image = fromUrl
      ? await loadImage(source, "anonymous")
      : await loadImage(source);
    const palette = extractImagePalette(image, source);
    applyImportedStyle(palette);
    setFeedback("Style importe depuis l'image.");
  } catch (error) {
    const message = fromUrl
      ? "Analyse bloquee par ce site. Importez l'image depuis votre appareil."
      : "Impossible d'analyser cette image.";
    setFeedback(message);
  }
}

function extractImagePalette(image, source) {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, size, size);

  const data = context.getImageData(0, 0, size, size).data;
  const samples = [];

  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha < 180) {
      continue;
    }

    const rgb = [data[index], data[index + 1], data[index + 2]];
    const luminance = getRgbLuminance(rgb);
    const saturation = getRgbSaturation(rgb);
    samples.push({ rgb, luminance, saturation });
  }

  const colorful = samples
    .filter((sample) => sample.saturation > 0.12)
    .sort((a, b) => b.saturation - a.saturation);
  const dark = samples
    .filter((sample) => sample.luminance < 0.54)
    .sort((a, b) => b.saturation - a.saturation || a.luminance - b.luminance);
  const light = samples
    .filter((sample) => sample.luminance > 0.68)
    .sort((a, b) => a.saturation - b.saturation || b.luminance - a.luminance);

  const darkColor = rgbToHex((colorful[0] || dark[0] || samples[0])?.rgb || [23, 105, 224]);
  const accentColor = rgbToHex((colorful[8] || colorful[1] || dark[1] || samples[1])?.rgb || [20, 184, 210]);
  const lightColor = rgbToHex((light[0] || samples.sort((a, b) => b.luminance - a.luminance)[0])?.rgb || [255, 255, 255]);

  return {
    source,
    darkColor,
    accentColor,
    lightColor,
    saturation: average(samples.map((sample) => sample.saturation)),
    contrast: getContrastRatio(darkColor, lightColor),
  };
}

function applyImportedStyle(palette) {
  state.styleImageSource = palette.source;
  elements.qrStyle.value = "custom";
  elements.qrDarkColor.value = ensureReadableColor(palette.darkColor, palette.lightColor);
  elements.qrLightColor.value = palette.lightColor;
  elements.qrRoundness.value = palette.saturation > 0.35 ? "40" : "28";
  syncRangeOutputs();
  syncStyleCards();
  updateQr();
}

function ensureReadableColor(darkColor, lightColor) {
  return getContrastRatio(darkColor, lightColor) >= 3.5 ? darkColor : "#111827";
}

function getRgbLuminance(rgb) {
  const adjusted = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return adjusted[0] * 0.2126 + adjusted[1] * 0.7152 + adjusted[2] * 0.0722;
}

function getRgbSaturation(rgb) {
  const values = rgb.map((value) => value / 255);
  const max = Math.max(...values);
  const min = Math.min(...values);
  return max === 0 ? 0 : (max - min) / max;
}

function rgbToHex(rgb) {
  return `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function setMode(mode, options = {}) {
  state.mode = mode;

  elements.modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.modeSelect.value = mode;

  elements.panels.forEach((panel) => {
    const active = panel.dataset.panel === mode;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  if (!options.skipUpdate) {
    updateQr();
  }
}

async function updateQr() {
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
    updateLinkInsight();
    updateValidation();
    updateQuality();
    verifyScan(canvas);
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
  elements.linkInsight.hidden = true;
  elements.validationPanel.hidden = true;
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
  elements.favoriteCurrentButton.disabled = !enabled;
  if (!enabled) {
    elements.favoriteForm.hidden = true;
  }
}

function buildEncodedContent() {
  if (state.mode === "text") {
    return buildTextContent();
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

  if (state.mode === "media") {
    return buildMediaLink();
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

function buildMediaLink() {
  const url = elements.mediaUrl.value.trim();
  return url ? normalizeUrl(url) : "";
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
  const preset = getStylePreset(elements.qrStyle.value);
  return {
    outputSize: Number(elements.qrSize.value),
    margin: Number(elements.qrMargin.value),
    errorLevel: elements.qrErrorLevel.value,
    darkColor: elements.qrDarkColor.value,
    lightColor: elements.qrLightColor.value,
    qrStyle: elements.qrStyle.value,
    qrRoundness: Number(elements.qrRoundness.value) / 100,
    qrShape: preset.shape,
    qrGradient: preset.gradient,
    qrBackground: preset.background,
    qrTexture: preset.texture,
    qrImageSource: state.styleImageSource,
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
  context.fillStyle = getQrBackground(settings);
  context.fillRect(0, 0, outputSize, outputSize);

  let source = sourceCanvas;
  if (!source && sourceImage) {
    source = await imageToCanvas(sourceImage.src, qrSize, qrSize);
  }

  if (sourceCanvas) {
    await drawQrModules(context, sourceCanvas, safeMargin, safeMargin, qrSize, settings);
  } else if (sourceImage) {
    await drawQrModules(context, source, safeMargin, safeMargin, qrSize, settings);
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

async function imageToCanvas(source, width, height) {
  const image = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);
  return canvas;
}

async function drawQrModules(context, sourceCanvas, x, y, size, settings) {
  if (settings.qrStyle === "square") {
    context.drawImage(sourceCanvas, x, y, size, size);
    return;
  }

  const matrix = inferQrMatrix(sourceCanvas, settings.darkColor, settings.lightColor);
  if (!matrix) {
    context.drawImage(sourceCanvas, x, y, size, size);
    return;
  }

  const moduleCount = matrix.length;
  const cell = size / moduleCount;
  const fill = await getQrModuleFill(context, x, y, size, settings);
  context.fillStyle = fill;

  matrix.forEach((row, rowIndex) => {
    row.forEach((dark, colIndex) => {
      if (!dark) {
        return;
      }

      const px = x + colIndex * cell;
      const py = y + rowIndex * cell;
      const isFinder = isFinderModule(rowIndex, colIndex, moduleCount);
      drawStyledModule(context, px, py, cell, settings, isFinder);
    });
  });
}

function inferQrMatrix(canvas, darkColor, lightColor) {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const candidates = [];

  for (let count = 21; count <= 177; count += 4) {
    const cell = canvas.width / count;
    if (cell < 2) {
      break;
    }

    const matrix = [];
    for (let row = 0; row < count; row += 1) {
      const line = [];
      for (let col = 0; col < count; col += 1) {
        const sampleX = Math.min(canvas.width - 1, Math.floor((col + 0.5) * cell));
        const sampleY = Math.min(canvas.height - 1, Math.floor((row + 0.5) * cell));
        const offset = (sampleY * canvas.width + sampleX) * 4;
        const pixel = [
          imageData[offset],
          imageData[offset + 1],
          imageData[offset + 2],
        ];
        line.push(isDarkPixel(pixel, darkColor, lightColor));
      }
      matrix.push(line);
    }

    candidates.push({ matrix, score: scoreFinderPatterns(matrix) });
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  return best?.score >= 120 ? best.matrix : null;
}

function isDarkPixel(pixel, darkColor, lightColor) {
  const dark = hexToRgb(darkColor);
  const light = hexToRgb(lightColor);
  const darkDistance = colorDistance(pixel, dark);
  const lightDistance = colorDistance(pixel, light);
  return darkDistance <= lightDistance;
}

function scoreFinderPatterns(matrix) {
  const count = matrix.length;
  return scoreFinder(matrix, 0, 0)
    + scoreFinder(matrix, 0, count - 7)
    + scoreFinder(matrix, count - 7, 0);
}

function scoreFinder(matrix, startRow, startCol) {
  let score = 0;
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const border = row === 0 || row === 6 || col === 0 || col === 6;
      const center = row >= 2 && row <= 4 && col >= 2 && col <= 4;
      const expected = border || center;
      score += matrix[startRow + row]?.[startCol + col] === expected ? 4 : -3;
    }
  }
  return score;
}

function drawStyledModule(context, x, y, size, settings, isFinder) {
  const shape = settings.qrShape || getStylePreset(settings.qrStyle).shape;
  const gap = shape === "dots" && !isFinder ? size * 0.18 : size * 0.08;
  const moduleX = x + gap / 2;
  const moduleY = y + gap / 2;
  const moduleSize = Math.max(1, size - gap);

  if (shape === "dots" && !isFinder) {
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, moduleSize * 0.46, 0, Math.PI * 2);
    context.fill();
    return;
  }

  const roundness = isFinder ? 0.12 : settings.qrRoundness;
  context.beginPath();
  roundedPath(context, moduleX, moduleY, moduleSize, moduleSize, moduleSize * roundness);
  context.fill();
}

function isFinderModule(row, col, count) {
  return (row < 7 && col < 7)
    || (row < 7 && col >= count - 7)
    || (row >= count - 7 && col < 7);
}

function getQrBackground(settings) {
  return settings.qrBackground || getStylePreset(settings.qrStyle).background || settings.lightColor;
}

async function getQrModuleFill(context, x, y, size, settings) {
  if (settings.qrImageSource) {
    try {
      const image = await loadImage(settings.qrImageSource, settings.qrImageSource.startsWith("data:") ? undefined : "anonymous");
      return createImageFillPattern(context, image, size);
    } catch (error) {
      return settings.darkColor;
    }
  }

  if (settings.qrTexture) {
    return context.createPattern(createTextureCanvas(settings.qrTexture), "repeat") || settings.darkColor;
  }

  const gradientColors = settings.qrGradient || getStylePreset(settings.qrStyle).gradient;
  if (!gradientColors) {
    return settings.darkColor;
  }

  const gradient = context.createLinearGradient(x, y, x + size, y + size);
  gradientColors.forEach((color, index) => {
    gradient.addColorStop(index / Math.max(1, gradientColors.length - 1), color);
  });
  return gradient;
}

function createImageFillPattern(context, image, size) {
  const canvas = document.createElement("canvas");
  canvas.width = 140;
  canvas.height = 140;
  const texture = canvas.getContext("2d");
  texture.drawImage(image, 0, 0, canvas.width, canvas.height);
  texture.globalCompositeOperation = "multiply";
  texture.fillStyle = "rgba(0, 0, 0, 0.18)";
  texture.fillRect(0, 0, canvas.width, canvas.height);
  return context.createPattern(canvas, "repeat") || "#111827";
}

function createTextureCanvas(textureName) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d");

  const textureMap = {
    waves: () => {
      const gradient = context.createLinearGradient(0, 0, 96, 96);
      gradient.addColorStop(0, "#075985");
      gradient.addColorStop(0.55, "#0891b2");
      gradient.addColorStop(1, "#22d3ee");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 96, 96);
      context.strokeStyle = "rgba(255,255,255,0.35)";
      context.lineWidth = 5;
      for (let y = 12; y < 110; y += 22) {
        context.beginPath();
        for (let x = -10; x <= 110; x += 8) {
          const waveY = y + Math.sin(x / 9) * 6;
          x === -10 ? context.moveTo(x, waveY) : context.lineTo(x, waveY);
        }
        context.stroke();
      }
    },
    marble: () => {
      context.fillStyle = "#f8fafc";
      context.fillRect(0, 0, 96, 96);
      for (let i = 0; i < 9; i += 1) {
        context.strokeStyle = i % 2 ? "rgba(51,65,85,0.42)" : "rgba(23,105,224,0.22)";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(-10, i * 13);
        context.bezierCurveTo(20, i * 9 + 18, 54, i * 17 - 20, 106, i * 12 + 8);
        context.stroke();
      }
    },
    paper: () => {
      context.fillStyle = "#fffbea";
      context.fillRect(0, 0, 96, 96);
      for (let i = 0; i < 180; i += 1) {
        context.fillStyle = i % 2 ? "rgba(113,63,18,0.22)" : "rgba(217,119,6,0.2)";
        context.fillRect((i * 37) % 96, (i * 19) % 96, 1.4, 1.4);
      }
    },
    mosaic: () => {
      const colors = ["#4c1d95", "#7c3aed", "#be185d", "#1769e0"];
      for (let y = 0; y < 96; y += 16) {
        for (let x = 0; x < 96; x += 16) {
          context.fillStyle = colors[((x + y) / 16) % colors.length];
          context.fillRect(x, y, 15, 15);
        }
      }
    },
    aurora: () => {
      const gradient = context.createLinearGradient(0, 96, 96, 0);
      gradient.addColorStop(0, "#064e3b");
      gradient.addColorStop(0.45, "#22a06b");
      gradient.addColorStop(1, "#67e8f9");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 96, 96);
      context.fillStyle = "rgba(255,255,255,0.22)";
      for (let x = -20; x < 100; x += 18) {
        context.beginPath();
        context.ellipse(x, 40 + Math.sin(x) * 12, 10, 44, 0.4, 0, Math.PI * 2);
        context.fill();
      }
    },
  };

  (textureMap[textureName] || textureMap.waves)();
  return canvas;
}

function getStylePreset(style) {
  return STYLE_PRESETS[style] || STYLE_PRESETS.rounded;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  return normalized.match(/.{2}/g).map((part) => parseInt(part, 16));
}

function colorDistance(pixel, rgb) {
  return Math.abs(pixel[0] - rgb[0]) + Math.abs(pixel[1] - rgb[1]) + Math.abs(pixel[2] - rgb[2]);
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
  const contrast = getContrastRatio(settings.darkColor, getQrBackground(settings));
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
    media: "Ouvrira le lien public vers l'image, la video, le PDF ou le fichier.",
  };

  elements.scanAction.hidden = !state.encoded;
  elements.scanActionText.textContent = messages[state.mode] || messages.text;
}

function updateLinkInsight() {
  const info = getLinkInfo(state.encoded);
  elements.linkInsight.hidden = !info;

  if (!info) {
    return;
  }

  elements.linkKind.textContent = info.kind;
  elements.linkInsightText.textContent = info.message;
}

function getLinkInfo(value) {
  if (!value) {
    return null;
  }

  if (/^mailto:/i.test(value)) {
    return { kind: "Email", message: "Ouvre l'application email avec les champs prepares." };
  }

  if (/^tel:/i.test(value)) {
    return { kind: "Telephone", message: "Ouvre l'ecran d'appel, puis le telephone demande confirmation." };
  }

  if (/^sms:/i.test(value)) {
    return { kind: "SMS", message: "Ouvre l'application SMS avec le message prepare." };
  }

  if (!/^https?:\/\//i.test(value)) {
    return null;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.toLowerCase();
    if (state.mode === "media") {
      const mediaType = elements.mediaType.options[elements.mediaType.selectedIndex]?.textContent || "Media";
      return {
        kind: mediaType,
        message: `${mediaType} heberge sur ${host}. Le lien doit etre public pour fonctionner sur un autre telephone.`,
      };
    }

    const directTypes = [
      { test: /\.(png|jpe?g|gif|webp|avif|svg)$/i, kind: "Image" },
      { test: /\.(mp4|mov|webm|m4v)$/i, kind: "Video" },
      { test: /\.pdf$/i, kind: "PDF" },
    ];
    const directType = directTypes.find((type) => type.test.test(path));

    if (directType) {
      return { kind: directType.kind, message: `Lien direct detecte sur ${host}.` };
    }

    if (/youtube\.com|youtu\.be/.test(host)) {
      return { kind: "Video", message: "Ouvre YouTube vers cette video ou cette chaine." };
    }

    if (/drive\.google\.com|docs\.google\.com/.test(host)) {
      return { kind: "Google", message: "Ouvre Google Drive/Docs. Verifiez que le partage est public." };
    }

    if (/dropbox\.com|onedrive\.live\.com|1drv\.ms/.test(host)) {
      return { kind: "Fichier", message: "Ouvre un fichier en ligne. Verifiez les droits de partage." };
    }

    if (/apps\.apple\.com|play\.google\.com/.test(host)) {
      return { kind: "App", message: "Ouvre la page de l'application dans la boutique." };
    }

    if (/wa\.me/.test(host)) {
      return { kind: "WhatsApp", message: "Ouvre WhatsApp avec le message prepare." };
    }

    return { kind: "Lien", message: `Ouvre ${host} dans le navigateur.` };
  } catch (error) {
    return null;
  }
}

function updateValidation() {
  const warnings = getValidationWarnings();
  elements.validationPanel.hidden = warnings.length === 0;
  elements.validationMessage.textContent = warnings.join(" ");
}

function getValidationWarnings() {
  const warnings = [];

  if (state.mode === "wifi" && state.encoded && elements.wifiSecurity.value !== "nopass" && !elements.wifiPassword.value) {
    warnings.push("Le mot de passe Wi-Fi est vide alors qu'une securite est choisie.");
  }

  if (state.mode === "email" && elements.emailTo.value.trim() && !isValidEmail(elements.emailTo.value.trim())) {
    warnings.push("L'adresse email semble incomplete.");
  }

  if (state.mode === "phone" && elements.phoneNumber.value.trim() && digitsOnly(elements.phoneNumber.value).length < 8) {
    warnings.push("Le numero de telephone semble trop court.");
  }

  if (state.mode === "sms" && elements.smsNumber.value.trim() && digitsOnly(elements.smsNumber.value).length < 8) {
    warnings.push("Le numero SMS semble trop court.");
  }

  if (state.mode === "whatsapp" && elements.whatsappNumber.value.trim()) {
    const digits = digitsOnly(elements.whatsappNumber.value);
    if (digits.length < 8 || /^0/.test(elements.whatsappNumber.value.trim())) {
      warnings.push("Pour WhatsApp, ajoutez l'indicatif pays, par exemple +262.");
    }
  }

  if (state.mode === "event" && elements.eventStart.value && elements.eventEnd.value) {
    const start = new Date(elements.eventStart.value);
    const end = new Date(elements.eventEnd.value);
    if (end <= start) {
      warnings.push("La fin de l'evenement doit etre apres le debut.");
    }
  }

  if (state.mode === "appstore" && elements.appstoreUrl.value.trim()) {
    const url = elements.appstoreUrl.value.trim();
    if (elements.appstoreTarget.value === "ios" && !/apps\.apple\.com/i.test(url)) {
      warnings.push("Ce lien ne ressemble pas a une page App Store.");
    }
    if (elements.appstoreTarget.value === "android" && !/play\.google\.com/i.test(url)) {
      warnings.push("Ce lien ne ressemble pas a une page Play Store.");
    }
  }

  if (state.mode === "media" && elements.mediaUrl.value.trim()) {
    if (!isHttpUrl(normalizeUrl(elements.mediaUrl.value.trim()))) {
      warnings.push("Le lien media doit etre une URL web.");
    } else {
      warnings.push("Le fichier doit etre partage publiquement pour fonctionner sur un autre telephone.");
    }
  }

  if (state.encoded.length > 700) {
    warnings.push("Le contenu est long : le QR sera plus dense et peut etre moins confortable a scanner.");
  }

  return warnings;
}

function digitsOnly(value) {
  return value.replace(/[^\d]/g, "");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
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

function showFavoriteForm() {
  if (!state.encoded) {
    return;
  }

  elements.favoriteForm.hidden = !elements.favoriteForm.hidden;
  if (!elements.favoriteForm.hidden) {
    elements.favoriteName.focus();
  }
}

function favoriteCurrentQr() {
  if (!state.encoded) {
    return;
  }

  const existingIndex = state.favorites.findIndex((item) => item.content === state.encoded);

  if (existingIndex >= 0) {
    state.favorites[existingIndex] = {
      ...state.favorites[existingIndex],
      favorite: true,
      name: getFavoriteName(),
      fields: collectModeFields(),
      settings: getCurrentSettings(),
      logoSource: state.logoSource,
      logoType: state.logoType,
    };
  } else {
    state.favorites.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      mode: state.mode,
      name: getFavoriteName(),
      content: state.encoded,
      fields: collectModeFields(),
      settings: getCurrentSettings(),
      logoSource: state.logoSource,
      logoType: state.logoType,
      favorite: true,
      createdAt: new Date().toISOString(),
    });
  }

  state.favorites = state.favorites.slice(0, MAX_FAVORITES);
  writeFavorites();
  renderFavorites();
  elements.favoriteForm.hidden = true;
  setFeedback("QR ajoute aux favoris.");
}

function getFavoriteName() {
  const customName = elements.favoriteName.value.trim();
  if (customName) {
    return customName;
  }

  if (state.mode === "wifi") {
    return elements.wifiSsid.value.trim() || "Wi-Fi";
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

  if (state.mode === "media") {
    const selected = elements.mediaType.options[elements.mediaType.selectedIndex]?.textContent || "Media";
    return elements.mediaUrl.value.trim() ? `${selected} en ligne` : "Media";
  }

  return state.encoded.slice(0, 42) || "QR code";
}

function collectModeFields() {
  return {
    text: elements.freeText.value,
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
    mediaType: elements.mediaType.value,
    mediaUrl: elements.mediaUrl.value,
    favoriteName: elements.favoriteName.value,
  };
}

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter((item) => item.favorite && item.mode !== "note") : [];
  } catch (error) {
    return [];
  }
}

function writeFavorites() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.favorites));
}

function renderFavorites() {
  elements.favoritesList.innerHTML = "";

  const query = normalizeSearch(elements.favoritesSearch.value);
  const items = query
    ? state.favorites.filter((item) => normalizeSearch(`${item.name} ${MODE_LABELS[item.mode] || ""} ${item.content}`).includes(query))
    : state.favorites;

  renderFavoriteCollection(
    elements.favoritesList,
    items,
    query ? "Aucun favori ne correspond a cette recherche." : "Aucun favori pour le moment.",
  );
}

function renderFavoriteCollection(container, items, emptyMessage) {
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "favorite-empty";
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "favorite-item";

    const preview = document.createElement("div");
    preview.className = "favorite-preview";
    preview.textContent = "QR";
    renderFavoritePreview(preview, item);

    const details = document.createElement("div");
    const meta = document.createElement("div");
    meta.className = "favorite-meta";

    const badge = document.createElement("span");
    badge.className = "favorite-badge";
    badge.textContent = MODE_LABELS[item.mode] || "QR";

    const time = document.createElement("span");
    time.className = "favorite-time";
    time.textContent = formatDate(item.createdAt);

    const title = document.createElement("h3");
    title.className = "favorite-title";
    title.textContent = item.name || MODE_LABELS[item.mode] || "QR code";

    const content = document.createElement("p");
    content.className = "favorite-content";
    content.textContent = item.content;

    meta.append(badge, time);
    details.append(meta, title, content);

    const actions = document.createElement("div");
    actions.className = "favorite-actions";

    const moveUpButton = createFavoriteButton("\u2191", () => moveFavorite(item.id, -1), "icon-action");
    moveUpButton.title = "Monter";
    moveUpButton.setAttribute("aria-label", "Monter ce favori");
    moveUpButton.disabled = index === 0;
    const moveDownButton = createFavoriteButton("\u2193", () => moveFavorite(item.id, 1), "icon-action");
    moveDownButton.title = "Descendre";
    moveDownButton.setAttribute("aria-label", "Descendre ce favori");
    moveDownButton.disabled = index === items.length - 1;
    const reuseButton = createFavoriteButton("Reprendre", () => reuseFavorite(item));
    const copyQrButton = createFavoriteButton("Copier QR", () => copyFavoriteQr(item));
    const copyContentButton = createFavoriteButton("Copier contenu", () => copyFavoriteContent(item));
    const deleteButton = createFavoriteButton("Supprimer", () => deleteFavorite(item.id), "danger-action");

    actions.append(moveUpButton, moveDownButton, reuseButton, copyQrButton, copyContentButton, deleteButton);
    article.append(preview, details, actions);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

function normalizeSearch(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

async function renderFavoritePreview(container, item) {
  try {
    const canvas = await renderQrCanvas(item.content, normalizeSettings(item.settings), item.logoSource || "", 96);
    container.textContent = "";
    container.appendChild(canvas);
  } catch (error) {
    container.textContent = "QR";
  }
}

function moveFavorite(id, direction) {
  const index = state.favorites.findIndex((item) => item.id === id);
  const nextIndex = index + direction;

  if (index < 0 || nextIndex < 0 || nextIndex >= state.favorites.length) {
    return;
  }

  const [item] = state.favorites.splice(index, 1);
  state.favorites.splice(nextIndex, 0, item);
  writeFavorites();
  renderFavorites();
}

function createFavoriteButton(label, onClick, extraClass = "") {
  const button = document.createElement("button");
  button.className = `small-action ${extraClass}`.trim();
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function reuseFavorite(item) {
  setMode(item.mode || "text");
  applyModeFields(item.fields, item.content);
  applySettings(item.settings);
  state.logoSource = item.logoSource || "";
  state.logoType = normalizeLogoType(item.logoType, state.logoSource);
  updateLogoPresetButtons(state.logoType);
  updateQr();
  setFeedback("Favori charge.");
}

function applyModeFields(fields = {}, content = "") {
  elements.freeText.value = fields.text ?? content;
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
  elements.mediaType.value = fields.mediaType || "image";
  elements.mediaUrl.value = fields.mediaUrl || "";
  elements.favoriteName.value = fields.favoriteName || fields.historyName || "";
}

function applySettings(settings = {}) {
  elements.qrSize.value = String(settings.outputSize || 768);
  elements.qrErrorLevel.value = settings.errorLevel || "H";
  elements.qrDarkColor.value = settings.darkColor || "#111827";
  elements.qrLightColor.value = settings.lightColor || "#ffffff";
  elements.qrStyle.value = settings.qrStyle || "rounded";
  state.styleImageSource = settings.qrImageSource || "";
  elements.qrRoundness.value = String(Math.round((settings.qrRoundness ?? 0.32) * 100));
  elements.qrMargin.value = String(settings.margin || 32);
  elements.logoSize.value = String(Math.round((settings.logoSizeRatio || 0.22) * 100));
  elements.logoRadius.value = String(Math.round((settings.logoRadiusRatio || 0.2) * 100));
  elements.logoBackground.checked = settings.logoBackground !== false;
  syncRangeOutputs();
  syncStyleCards();
}

async function copyFavoriteQr(item) {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    setFeedback("La copie d'image n'est pas prise en charge par ce navigateur.");
    return;
  }

  try {
    const canvas = await renderQrCanvas(item.content, normalizeSettings(item.settings), item.logoSource || "");
    const blob = await canvasToBlob(canvas);
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setFeedback("QR favori copie comme image.");
  } catch (error) {
    setFeedback("Impossible de copier ce QR favori.");
  }
}

async function copyFavoriteContent(item) {
  try {
    await navigator.clipboard.writeText(item.content);
    setFeedback("Contenu du favori copie.");
  } catch (error) {
    setFeedback("Copie du contenu impossible.");
  }
}

function normalizeSettings(settings = {}) {
  const preset = getStylePreset(settings.qrStyle || "rounded");
  return {
    outputSize: settings.outputSize || 768,
    margin: settings.margin ?? 32,
    errorLevel: settings.errorLevel || "H",
    darkColor: settings.darkColor || "#111827",
    lightColor: settings.lightColor || "#ffffff",
    qrStyle: settings.qrStyle || "rounded",
    qrRoundness: settings.qrRoundness ?? 0.32,
    qrShape: settings.qrShape || preset.shape,
    qrGradient: settings.qrGradient || preset.gradient,
    qrBackground: settings.qrBackground || preset.background,
    qrTexture: settings.qrTexture || preset.texture,
    qrImageSource: settings.qrImageSource || "",
    logoSizeRatio: settings.logoSizeRatio || 0.22,
    logoRadiusRatio: settings.logoRadiusRatio ?? 0.2,
    logoBackground: settings.logoBackground !== false,
  };
}

function deleteFavorite(id) {
  state.favorites = state.favorites.filter((item) => item.id !== id);
  writeFavorites();
  renderFavorites();
}

function resetForm() {
  document.querySelector("#qr-form").reset();
  state.mode = "text";
  state.encoded = "";
  state.logoSource = "";
  state.logoType = "none";
  state.styleImageSource = "";
  setMode("text", { skipUpdate: true });
  elements.qrStyle.value = "rounded";
  applyStyleDefaults("rounded");
  updateLogoPresetButtons("none");
  syncRangeOutputs();
  syncStyleCards();
  updateQr();
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
