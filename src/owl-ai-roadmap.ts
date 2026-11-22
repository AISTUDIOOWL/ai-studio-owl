import "./owl-ai-roadmap.css";

type RoadmapStatus = "completed" | "in_progress" | "planned" | "blocked";
type RoadmapTranslation = Partial<Record<"en" | "es", {
  intro?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  label?: string;
}>>;
type RoadmapTask = {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  translations?: RoadmapTranslation;
};
type RoadmapPhase = {
  id: string;
  title: string;
  subtitle: string;
  status: RoadmapStatus;
  items: RoadmapTask[];
  translations?: RoadmapTranslation;
};
type RoadmapData = {
  schemaVersion: number;
  roadmapVersion: string;
  currentRelease: string;
  currentReleaseTranslations?: Partial<Record<"en" | "es", string>>;
  updatedAt: string;
  refreshIntervalSeconds?: number;
  currentModel: {
    name: string;
    runtime: string;
    endpoint: string;
    status: string;
    note: string;
  };
  intro: string;
  phases: RoadmapPhase[];
  changelog: Array<{ date: string; label: string; description: string; translations?: RoadmapTranslation }>;
  translations?: RoadmapTranslation;
  maintenance?: { sourceFile?: string; refreshNote?: string };
};

type FilterStatus = "all" | RoadmapStatus;
type UiLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  progress: string;
  completed: string;
  active: string;
  pending: string;
  all: string;
  filter: string;
  search: string;
  refresh: string;
  updating: string;
  updated: string;
  model: string;
  modelOnline: string;
  history: string;
  source: string;
  auto: string;
  seconds: string;
  noResults: string;
  tasks: string;
  status: Record<RoadmapStatus, string>;
  error: string;
  retry: string;
  release: string;
  version: string;
  blocked: string;
};

const LABELS: Record<string, UiLabels> = {
  "pt-BR": {
    eyebrow: "AI STUDIO OWL · DESENVOLVIMENTO",
    title: "A evolução da OWL_AI",
    subtitle: "Acompanhe o que já foi construído, o que está em desenvolvimento e os próximos marcos até o lançamento.",
    progress: "Progresso geral",
    completed: "Concluídas",
    active: "Em andamento",
    pending: "Planejadas",
    all: "Todas",
    filter: "Filtrar etapas",
    search: "Buscar tarefas…",
    refresh: "Atualizar agora",
    updating: "Atualizando…",
    updated: "Atualizado em",
    model: "Modelo oficial",
    modelOnline: "Validado localmente",
    history: "Histórico de atualizações",
    source: "Fonte dinâmica",
    auto: "Atualização automática a cada",
    seconds: "segundos",
    noResults: "Nenhuma etapa corresponde ao filtro.",
    tasks: "itens",
    status: { completed: "Concluído", in_progress: "Em andamento", planned: "Planejado", blocked: "Bloqueado" },
    error: "Não foi possível atualizar o roadmap. Exibindo a última versão disponível.",
    retry: "Tentar novamente",
    release: "Estado atual",
    version: "Roadmap",
    blocked: "Bloqueadas"
  },
  en: {
    eyebrow: "AI STUDIO OWL · DEVELOPMENT",
    title: "The evolution of OWL_AI",
    subtitle: "Track what is complete, what is in progress and the milestones ahead of launch.",
    progress: "Overall progress",
    completed: "Completed",
    active: "In progress",
    pending: "Planned",
    all: "All",
    filter: "Filter phases",
    search: "Search roadmap…",
    refresh: "Refresh now",
    updating: "Refreshing…",
    updated: "Updated",
    model: "Official model",
    modelOnline: "Locally verified",
    history: "Update history",
    source: "Live source",
    auto: "Automatic refresh every",
    seconds: "seconds",
    noResults: "No roadmap items match this filter.",
    tasks: "items",
    status: { completed: "Completed", in_progress: "In progress", planned: "Planned", blocked: "Blocked" },
    error: "Could not refresh the roadmap. Showing the last available version.",
    retry: "Try again",
    release: "Current state",
    version: "Roadmap",
    blocked: "Blocked"
  },
  es: {
    eyebrow: "AI STUDIO OWL · DESARROLLO",
    title: "La evolución de OWL_AI",
    subtitle: "Sigue lo que ya está hecho, lo que está en desarrollo y los próximos hitos antes del lanzamiento.",
    progress: "Progreso general",
    completed: "Completadas",
    active: "En progreso",
    pending: "Planificadas",
    all: "Todas",
    filter: "Filtrar fases",
    search: "Buscar en la hoja de ruta…",
    refresh: "Actualizar ahora",
    updating: "Actualizando…",
    updated: "Actualizado",
    model: "Modelo oficial",
    modelOnline: "Validado localmente",
    history: "Historial de actualizaciones",
    source: "Fuente dinámica",
    auto: "Actualización automática cada",
    seconds: "segundos",
    noResults: "Ningún elemento coincide con este filtro.",
    tasks: "elementos",
    status: { completed: "Completado", in_progress: "En progreso", planned: "Planificado", blocked: "Bloqueado" },
    error: "No se pudo actualizar la hoja de ruta. Se muestra la última versión disponible.",
    retry: "Reintentar",
    release: "Estado actual",
    version: "Roadmap",
    blocked: "Bloqueados"
  }
};

function currentLanguage(): string {
  const language = (document.documentElement.lang || "pt-BR").toLowerCase();
  if (language.startsWith("es")) return "es";
  if (language.startsWith("en")) return "en";
  return "pt-BR";
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function isStatus(value: unknown): value is RoadmapStatus {
  return value === "completed" || value === "in_progress" || value === "planned" || value === "blocked";
}

function validateData(value: unknown): value is RoadmapData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<RoadmapData>;
  return data.schemaVersion === 1 && typeof data.roadmapVersion === "string" &&
    typeof data.updatedAt === "string" && Array.isArray(data.phases) &&
    data.phases.every((phase) => phase && typeof phase.title === "string" &&
      isStatus(phase.status) && Array.isArray(phase.items) &&
      phase.items.every((item) => item && typeof item.title === "string" && isStatus(item.status))) &&
    Array.isArray(data.changelog) && !!data.currentModel && typeof data.intro === "string";
}

function formatDate(value: string, lang: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const locale = lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function statusLabel(status: RoadmapStatus, labels: Record<RoadmapStatus, string>): string {
  return labels[status] || status;
}

function countTasks(data: RoadmapData) {
  const items = data.phases.flatMap((phase) => phase.items);
  return {
    total: items.length,
    completed: items.filter((item) => item.status === "completed").length,
    active: items.filter((item) => item.status === "in_progress").length,
    planned: items.filter((item) => item.status === "planned").length,
    blocked: items.filter((item) => item.status === "blocked").length
  };
}

function mountOwlAiRoadmap(target: HTMLElement | string = "#owl-ai-roadmap", dataUrl = "/data/owl-ai-roadmap.json"): () => void {
  const mount = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!mount) {
    console.warn("[OWL_AI Roadmap] Mount element not found. Add <section id=\"owl-ai-roadmap\"></section> to the page.");
    return () => undefined;
  }

  const existing = mount.querySelector<HTMLElement>(".oar-root");
  if (existing) existing.remove();

  const root = el("section", "oar-root");
  root.setAttribute("aria-label", "OWL_AI development roadmap");
  mount.append(root);

  let data: RoadmapData | null = null;
  let activeFilter: FilterStatus = "all";
  let searchTerm = "";
  let loading = false;
  let disposed = false;
  let intervalId: number | undefined;
  const lang = currentLanguage();
  const t = LABELS[lang] || LABELS["pt-BR"];

  const header = el("div", "oar-header");
  const headingGroup = el("div", "oar-heading-group");
  const eyebrow = el("div", "oar-eyebrow", t.eyebrow);
  const title = el("h2", "oar-title", t.title);
  title.id = "owl-ai-roadmap-title";
  const intro = el("p", "oar-intro");
  const headerMeta = el("div", "oar-header-meta");
  const releasePill = el("span", "oar-pill oar-pill-release");
  const versionPill = el("span", "oar-pill oar-pill-version");
  headingGroup.append(eyebrow, title, intro);
  headerMeta.append(releasePill, versionPill);
  header.append(headingGroup, headerMeta);

  const modelCard = el("div", "oar-model-card");
  const modelIcon = el("div", "oar-model-icon", "OWL");
  const modelInfo = el("div", "oar-model-info");
  const modelLabel = el("span", "oar-model-label", t.model);
  const modelName = el("strong", "oar-model-name");
  const modelRuntime = el("span", "oar-model-runtime");
  const modelStatus = el("span", "oar-model-status");
  modelInfo.append(modelLabel, modelName, modelRuntime);
  modelCard.append(modelIcon, modelInfo, modelStatus);

  const progressCard = el("div", "oar-progress-card");
  const progressTop = el("div", "oar-progress-top");
  const progressTitle = el("strong", "oar-progress-title", t.progress);
  const progressValue = el("strong", "oar-progress-value", "0%");
  progressTop.append(progressTitle, progressValue);
  const progressTrack = el("div", "oar-progress-track");
  progressTrack.setAttribute("role", "progressbar");
  progressTrack.setAttribute("aria-valuemin", "0");
  progressTrack.setAttribute("aria-valuemax", "100");
  const progressFill = el("div", "oar-progress-fill");
  progressTrack.append(progressFill);
  const stats = el("div", "oar-stats");
  progressCard.append(progressTop, progressTrack, stats);

  const controls = el("div", "oar-controls");
  const filters = el("div", "oar-filters");
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", t.filter);
  const filterDefs: Array<{ id: FilterStatus; label: string }> = [
    { id: "all", label: t.all },
    { id: "completed", label: t.completed },
    { id: "in_progress", label: t.active },
    { id: "planned", label: t.pending },
    { id: "blocked", label: t.blocked }
  ];
  const filterButtons = new Map<FilterStatus, HTMLButtonElement>();
  for (const filter of filterDefs) {
    const button = el("button", "oar-filter", filter.label);
    button.type = "button";
    button.setAttribute("aria-pressed", String(filter.id === activeFilter));
    button.addEventListener("click", () => {
      activeFilter = filter.id;
      renderPhases();
      updateFilterButtons();
    });
    filters.append(button);
    filterButtons.set(filter.id, button);
  }
  const searchInput = el("input", "oar-search");
  searchInput.type = "search";
  searchInput.placeholder = t.search;
  searchInput.setAttribute("aria-label", t.search);
  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value;
    renderPhases();
  });
  const refreshButton = el("button", "oar-refresh", t.refresh);
  refreshButton.type = "button";
  refreshButton.addEventListener("click", () => { void loadData(); });
  controls.append(filters, searchInput, refreshButton);

  const errorMessage = el("div", "oar-error");
  errorMessage.setAttribute("role", "status");
  errorMessage.hidden = true;
  const phasesContainer = el("div", "oar-phases");
  const historySection = el("section", "oar-history");
  const historyTitle = el("h3", "oar-history-title", t.history);
  const historyList = el("div", "oar-history-list");
  historySection.append(historyTitle, historyList);
  const footer = el("div", "oar-footer");
  const footerSource = el("span", "oar-footer-source", `${t.source}: ${dataUrl}`);
  const footerRefresh = el("span", "oar-footer-refresh", `${t.auto} 60 ${t.seconds}`);
  footer.append(footerSource, footerRefresh);

  root.append(header, modelCard, progressCard, controls, errorMessage, phasesContainer, historySection, footer);

  function updateFilterButtons() {
    for (const [id, button] of filterButtons) button.setAttribute("aria-pressed", String(id === activeFilter));
  }

  function renderStats() {
    if (!data) return;
    const counts = countTasks(data);
    const percent = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
    progressValue.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    progressTrack.setAttribute("aria-valuenow", String(percent));
    stats.replaceChildren();
    const values = [
      { label: t.completed, count: counts.completed, cls: "done" },
      { label: t.active, count: counts.active, cls: "active" },
      { label: t.pending, count: counts.planned, cls: "planned" },
      { label: t.blocked, count: counts.blocked, cls: "blocked" }
    ];
    for (const value of values) {
      const stat = el("div", `oar-stat oar-stat-${value.cls}`);
      stat.append(el("strong", "oar-stat-count", String(value.count)), el("span", "oar-stat-label", value.label));
      stats.append(stat);
    }
  }

  function renderHeader() {
    if (!data) return;
    intro.textContent = data.translations?.[lang as "en" | "es"]?.intro || data.intro;
    const releaseLabel = lang === "pt-BR" ? data.currentRelease : data.currentReleaseTranslations?.[lang as "en" | "es"] || data.currentRelease;
    releasePill.textContent = `${t.release}: ${releaseLabel}`;
    versionPill.textContent = `${t.version} v${data.roadmapVersion}`;
    modelName.textContent = data.currentModel.name;
    modelRuntime.textContent = `${data.currentModel.runtime} · ${data.currentModel.endpoint}`;
    modelStatus.textContent = t.modelOnline;
    modelStatus.dataset.status = data.currentModel.status;
    const refreshSeconds = Math.min(300, Math.max(30, Number(data.refreshIntervalSeconds) || 60));
    footerRefresh.textContent = `${t.updated} ${formatDate(data.updatedAt, lang)} · ${t.auto} ${refreshSeconds} ${t.seconds}`;
    if (intervalId !== undefined) window.clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadData();
    }, refreshSeconds * 1000);
  }

  function renderPhases() {
    phasesContainer.replaceChildren();
    if (!data) return;
    const filtered = data.phases.map((phase) => ({
      ...phase,
      items: phase.items.filter((item) => {
        const statusMatch = activeFilter === "all" || item.status === activeFilter;
        const query = searchTerm.trim().toLocaleLowerCase();
        const textMatch = !query || `${item.title} ${item.description} ${phase.title}`.toLocaleLowerCase().includes(query);
        return statusMatch && textMatch;
      })
    })).filter((phase) => phase.items.length > 0);

    if (!filtered.length) {
      phasesContainer.append(el("p", "oar-empty", t.noResults));
      return;
    }

    for (const phase of filtered) {
      const card = el("article", `oar-phase oar-phase-${phase.status}`);
      const phaseHead = el("div", "oar-phase-head");
      const phaseTitleGroup = el("div", "oar-phase-title-group");
      const phaseLocale = phase.translations?.[lang as "en" | "es"];
      const phaseTitle = el("h3", "oar-phase-title", phaseLocale?.title || phase.title);
      const phaseSubtitle = el("p", "oar-phase-subtitle", phaseLocale?.subtitle || phase.subtitle);
      const phaseBadge = el("span", `oar-status oar-status-${phase.status}`, statusLabel(phase.status, t.status));
      phaseTitleGroup.append(phaseTitle, phaseSubtitle);
      phaseHead.append(phaseTitleGroup, phaseBadge);
      const taskList = el("div", "oar-task-list");
      for (const item of phase.items) {
        const task = el("div", `oar-task oar-task-${item.status}`);
        const indicator = el("span", "oar-task-indicator", item.status === "completed" ? "✓" : item.status === "in_progress" ? "↻" : item.status === "blocked" ? "!" : "○");
        indicator.setAttribute("aria-hidden", "true");
        const body = el("div", "oar-task-body");
        const taskLocale = item.translations?.[lang as "en" | "es"];
        const taskTitle = el("strong", "oar-task-title", taskLocale?.title || item.title);
        const taskDescription = el("p", "oar-task-description", taskLocale?.description || item.description);
        body.append(taskTitle, taskDescription);
        const taskStatus = el("span", `oar-task-status oar-status-${item.status}`, statusLabel(item.status, t.status));
        task.append(indicator, body, taskStatus);
        taskList.append(task);
      }
      card.append(phaseHead, taskList);
      phasesContainer.append(card);
    }
  }

  function renderHistory() {
    if (!data) return;
    historyList.replaceChildren();
    for (const entry of [...data.changelog].sort((a, b) => b.date.localeCompare(a.date))) {
      const item = el("article", "oar-history-item");
      const date = el("time", "oar-history-date", formatDate(entry.date, lang));
      date.dateTime = entry.date;
      const body = el("div", "oar-history-body");
      const entryLocale = entry.translations?.[lang as "en" | "es"];
      body.append(el("strong", "oar-history-label", entryLocale?.label || entry.label), el("p", "oar-history-description", entryLocale?.description || entry.description));
      item.append(date, body);
      historyList.append(item);
    }
  }

  async function loadData() {
    if (loading || disposed) return;
    loading = true;
    refreshButton.disabled = true;
    refreshButton.textContent = t.updating;
    try {
      const response = await fetch(`${dataUrl}${dataUrl.includes("?") ? "&" : "?"}_=${Date.now()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const next = await response.json() as unknown;
      if (disposed) return;
      if (!validateData(next)) throw new Error("Invalid roadmap schema");
      data = next;
      errorMessage.hidden = true;
      renderHeader();
      renderStats();
      renderPhases();
      renderHistory();
    } catch (error) {
      console.error("[OWL_AI Roadmap] Failed to refresh:", error);
      errorMessage.textContent = t.error;
      errorMessage.hidden = false;
      if (!data) phasesContainer.append(el("button", "oar-retry", t.retry));
      const retry = phasesContainer.querySelector<HTMLButtonElement>(".oar-retry");
      retry?.addEventListener("click", () => { void loadData(); });
    } finally {
      loading = false;
      refreshButton.disabled = false;
      refreshButton.textContent = t.refresh;
    }
  }

  const onVisibility = () => {
    if (document.visibilityState === "visible") void loadData();
  };
  document.addEventListener("visibilitychange", onVisibility);
  void loadData();
  // Keep retrying at the default interval if the first JSON request fails; a successful
  // response replaces this timer with the interval configured in the published JSON.
  intervalId = window.setInterval(() => {
    if (document.visibilityState === "visible") void loadData();
  }, 60_000);
  return () => {
    disposed = true;
    if (intervalId !== undefined) window.clearInterval(intervalId);
    document.removeEventListener("visibilitychange", onVisibility);
    root.remove();
  };
}


/** Re-mount the localized roadmap whenever the site's active language changes. */
export function initOwlAiRoadmap(target: HTMLElement | string = "#owl-ai-roadmap", dataUrl = "/data/owl-ai-roadmap.json"): () => void {
  let activeLanguage = currentLanguage();
  let dispose = mountOwlAiRoadmap(target, dataUrl);
  const languageObserver = new MutationObserver(() => {
    const nextLanguage = currentLanguage();
    if (nextLanguage === activeLanguage) return;
    activeLanguage = nextLanguage;
    dispose();
    dispose = mountOwlAiRoadmap(target, dataUrl);
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => {
    languageObserver.disconnect();
    dispose();
  };
}
