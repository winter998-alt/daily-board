// Daily Board Widget v0.2
// Scriptable widget: a reading prompt, not a mini website.

const DATA_URL = "https://winter998-alt.github.io/daily-board/data/daily.json";
const BOARD_URL = "https://winter998-alt.github.io/daily-board/";

async function loadData() {
  try {
    const req = new Request(`${DATA_URL}?t=${Date.now()}`);
    req.timeoutInterval = 15;
    return await req.loadJSON();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function formatDate(value) {
  if (!value) return "TODAY";
  const d = new Date(`${value}T12:00:00+08:00`);
  const f = new DateFormatter();
  f.locale = "zh_TW";
  f.dateFormat = "M月d日 EEE";
  return f.string(d);
}

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const f = new DateFormatter();
  f.locale = "zh_TW";
  f.dateFormat = "HH:mm";
  return f.string(d);
}

function dynamic(light, dark) {
  return Color.dynamic(new Color(light), new Color(dark));
}

function addPill(parent, text) {
  const pill = parent.addStack();
  pill.setPadding(5, 9, 5, 9);
  pill.cornerRadius = 10;
  pill.backgroundColor = dynamic("#E4EAE3", "#202A23");
  const t = pill.addText(text);
  t.font = Font.semiboldSystemFont(10);
  t.textColor = dynamic("#53675A", "#C3D5C8");
}

async function buildWidget(data) {
  const w = new ListWidget();
  w.url = BOARD_URL;
  w.backgroundColor = dynamic("#F4F5F0", "#111411");
  w.setPadding(20, 20, 18, 20);

  const header = w.addStack();
  header.centerAlignContent();

  const brand = header.addText("DAILY BOARD");
  brand.font = Font.boldSystemFont(12);
  brand.textColor = dynamic("#33463A", "#D4E5D9");

  header.addSpacer();

  const date = header.addText(data ? formatDate(data.date) : "OFFLINE");
  date.font = Font.systemFont(10);
  date.textColor = dynamic("#747B74", "#9AA29A");

  w.addSpacer(18);

  if (!data) {
    const title = w.addText("今天的 Daily Board 暫時讀不到資料");
    title.font = Font.boldSystemFont(22);
    title.textColor = dynamic("#1D211D", "#F2F4F0");
    title.lineLimit = 3;
    w.addSpacer(8);
    const hint = w.addText("點一下開啟閱讀頁，或稍後再試。");
    hint.font = Font.systemFont(12);
    hint.textColor = dynamic("#666D66", "#B0B6B0");
    return w;
  }

  const stories = data.report?.stories || [];
  const count = stories.length;
  const first = stories[0] || {};
  const radar = data.report?.radar;
  const mailCount = data.importantMail?.count || 0;

  const countText = w.addText(String(count));
  countText.font = Font.heavySystemFont(54);
  countText.textColor = dynamic("#1D2A22", "#E8F0EA");
  countText.minimumScaleFactor = 0.8;

  const countLabel = w.addText(count === 1 ? "story worth reading today" : "stories worth reading today");
  countLabel.font = Font.semiboldSystemFont(15);
  countLabel.textColor = dynamic("#536158", "#B8C5BC");

  w.addSpacer(16);

  if (first.title) {
    const kicker = w.addText("TODAY'S LEAD");
    kicker.font = Font.boldSystemFont(10);
    kicker.textColor = dynamic("#657A6B", "#B8D0C0");

    w.addSpacer(5);

    const lead = w.addText(first.widgetTitle || first.title);
    lead.font = Font.boldSystemFont(19);
    lead.textColor = dynamic("#181C18", "#F4F5F2");
    lead.lineLimit = 2;

    if (first.widgetSummary || first.dek) {
      w.addSpacer(5);
      const summary = w.addText(first.widgetSummary || first.dek);
      summary.font = Font.systemFont(11);
      summary.textColor = dynamic("#606760", "#AEB5AE");
      summary.lineLimit = 2;
    }
  }

  w.addSpacer(14);

  const pills = w.addStack();
  pills.layoutHorizontally();

  if (radar?.title) {
    addPill(pills, "🔬 Research radar");
    pills.addSpacer(7);
  }

  if (mailCount > 0) {
    addPill(pills, `📩 ${mailCount} important mail`);
  }

  w.addSpacer();

  const footer = w.addStack();
  footer.centerAlignContent();

  const read = footer.addText("Read today's brief →");
  read.font = Font.boldSystemFont(12);
  read.textColor = dynamic("#33463A", "#D4E5D9");

  footer.addSpacer();

  if (data.updatedAt) {
    const updated = footer.addText(`更新 ${formatTime(data.updatedAt)}`);
    updated.font = Font.systemFont(9);
    updated.textColor = dynamic("#7B817B", "#8F968F");
  }

  return w;
}

const data = await loadData();
const widget = await buildWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentLarge();
}

Script.complete();
