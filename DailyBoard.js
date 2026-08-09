// Daily Board Widget v0.3
// Scriptable medium widget: simple reading reminder.

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

function dynamic(light, dark) {
  return Color.dynamic(new Color(light), new Color(dark));
}

function formatDate(value) {
  if (!value) return "今天";
  const d = new Date(`${value}T12:00:00+08:00`);
  const f = new DateFormatter();
  f.locale = "zh_TW";
  f.dateFormat = "M月d日";
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

async function buildWidget(data) {
  const w = new ListWidget();
  w.url = BOARD_URL;
  w.backgroundColor = dynamic("#F4F5F0", "#111411");
  w.setPadding(18, 20, 16, 20);

  const header = w.addStack();
  header.centerAlignContent();

  const brand = header.addText("DAILY BOARD");
  brand.font = Font.boldSystemFont(11);
  brand.textColor = dynamic("#34463B", "#D4E5D9");

  header.addSpacer();

  const date = header.addText(data ? formatDate(data.date) : "OFFLINE");
  date.font = Font.systemFont(10);
  date.textColor = dynamic("#747B74", "#9AA29A");

  w.addSpacer(15);

  const title = w.addText(data
    ? "來看看生醫界又發生了什麼有趣的事吧"
    : "今天的 Daily Board 暫時還沒連上");
  title.font = Font.boldSystemFont(21);
  title.textColor = dynamic("#1B211C", "#F1F5F2");
  title.lineLimit = 2;
  title.minimumScaleFactor = 0.8;

  w.addSpacer(7);

  const subtitle = w.addText(data
    ? "今天的生醫・神經科學摘要已更新，點一下就能開始讀。"
    : "點一下開啟閱讀頁，或稍後再試。");
  subtitle.font = Font.systemFont(11);
  subtitle.textColor = dynamic("#606760", "#AEB5AE");
  subtitle.lineLimit = 2;

  w.addSpacer();

  const footer = w.addStack();
  footer.centerAlignContent();

  const action = footer.addText("打開 Daily Board →");
  action.font = Font.boldSystemFont(11);
  action.textColor = dynamic("#3D5546", "#D1E4D6");

  footer.addSpacer();

  if (data?.updatedAt) {
    const updated = footer.addText(`更新 ${formatTime(data.updatedAt)}`);
    updated.font = Font.systemFont(9);
    updated.textColor = dynamic("#7C827C", "#8F968F");
  }

  return w;
}

const data = await loadData();
const widget = await buildWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}

Script.complete();
