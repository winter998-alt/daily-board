// Daily Board Widget v0.4
// Scriptable medium widget: green + white botanical tech reminder.

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

function makeBackground() {
  const width = 660;
  const height = 300;
  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  ctx.opaque = true;
  ctx.respectScreenScale = true;

  // Soft white-green base
  ctx.setFillColor(new Color("#F7FBF5"));
  ctx.fillRect(new Rect(0, 0, width, height));

  // Pale green glow blocks
  ctx.setFillColor(new Color("#EAF6E8"));
  ctx.fillEllipse(new Rect(420, -70, 260, 260));
  ctx.setFillColor(new Color("#F0F8EE"));
  ctx.fillEllipse(new Rect(500, 120, 220, 220));

  // Tech circuit lines
  ctx.setStrokeColor(new Color("#A7D9B2", 0.75));
  ctx.setLineWidth(2);

  const tech = [
    [[330, 55], [405, 55], [430, 78], [500, 78]],
    [[370, 98], [445, 98], [465, 118], [560, 118]],
    [[315, 210], [400, 210], [425, 185], [500, 185]],
    [[390, 245], [455, 245], [480, 220], [565, 220]]
  ];

  tech.forEach(points => {
    const p = new Path();
    p.move(new Point(points[0][0], points[0][1]));
    for (let i = 1; i < points.length; i++) p.addLine(new Point(points[i][0], points[i][1]));
    ctx.addPath(p);
    ctx.strokePath();
  });

  // Circuit nodes
  [[405,55],[500,78],[445,98],[560,118],[400,210],[500,185],[455,245],[565,220]].forEach(([x,y]) => {
    ctx.setFillColor(new Color("#79C98D"));
    ctx.fillEllipse(new Rect(x - 4, y - 4, 8, 8));
  });

  // Simple botanical line-art sprout on the right
  ctx.setStrokeColor(new Color("#2E7D32"));
  ctx.setLineWidth(4);

  const stem = new Path();
  stem.move(new Point(535, 240));
  stem.addCurve(new Point(535, 240), new Point(538, 170), new Point(540, 105));
  ctx.addPath(stem);
  ctx.strokePath();

  const leftLeaf = new Path();
  leftLeaf.move(new Point(540, 150));
  leftLeaf.addCurve(new Point(525, 132), new Point(500, 126), new Point(480, 136));
  leftLeaf.addCurve(new Point(495, 158), new Point(520, 165), new Point(540, 150));
  ctx.addPath(leftLeaf);
  ctx.strokePath();

  const rightLeaf = new Path();
  rightLeaf.move(new Point(540, 126));
  rightLeaf.addCurve(new Point(558, 101), new Point(585, 96), new Point(605, 108));
  rightLeaf.addCurve(new Point(590, 132), new Point(565, 142), new Point(540, 126));
  ctx.addPath(rightLeaf);
  ctx.strokePath();

  const topLeaf = new Path();
  topLeaf.move(new Point(540, 108));
  topLeaf.addCurve(new Point(525, 82), new Point(526, 55), new Point(542, 38));
  topLeaf.addCurve(new Point(560, 58), new Point(560, 84), new Point(540, 108));
  ctx.addPath(topLeaf);
  ctx.strokePath();

  // A subtle circular tech halo
  ctx.setStrokeColor(new Color("#6EDB8A", 0.45));
  ctx.setLineWidth(2);
  ctx.strokeEllipse(new Rect(445, 55, 170, 170));
  ctx.strokeEllipse(new Rect(465, 75, 130, 130));

  return ctx.getImage();
}

async function buildWidget(data) {
  const w = new ListWidget();
  w.url = BOARD_URL;
  w.backgroundImage = makeBackground();
  w.setPadding(16, 18, 14, 18);

  const header = w.addStack();
  header.centerAlignContent();

  const icon = SFSymbol.named("leaf");
  icon.applyFont(Font.systemFont(11));
  const leaf = header.addImage(icon.image);
  leaf.imageSize = new Size(13, 13);
  leaf.tintColor = new Color("#2E7D32");

  header.addSpacer(7);

  const brand = header.addText("DAILY BOARD");
  brand.font = Font.boldSystemFont(11);
  brand.textColor = new Color("#1F6B35");

  header.addSpacer();

  const date = header.addText(data ? formatDate(data.date) : "OFFLINE");
  date.font = Font.systemFont(9);
  date.textColor = new Color("#4E6F58");

  w.addSpacer(13);

  const title = w.addText(data
    ? "來看看生醫界又發生了什麼有趣的事吧"
    : "今天的 Daily Board 暫時還沒連上");
  title.font = Font.boldSystemFont(20);
  title.textColor = new Color("#145C2C");
  title.lineLimit = 2;
  title.minimumScaleFactor = 0.82;

  w.addSpacer(6);

  const subtitle = w.addText(data
    ? "今天的生醫・神經科學摘要已更新"
    : "點一下開啟閱讀頁，或稍後再試。");
  subtitle.font = Font.systemFont(10.5);
  subtitle.textColor = new Color("#48634F");
  subtitle.lineLimit = 1;

  w.addSpacer();

  const footer = w.addStack();
  footer.centerAlignContent();

  const button = footer.addStack();
  button.setPadding(6, 11, 6, 11);
  button.cornerRadius = 12;
  button.backgroundColor = new Color("#22A447");

  const action = button.addText("打開 Daily Board  →");
  action.font = Font.boldSystemFont(10);
  action.textColor = Color.white();

  footer.addSpacer();

  if (data?.updatedAt) {
    const updated = footer.addText(`更新 ${formatTime(data.updatedAt)}`);
    updated.font = Font.systemFont(8.5);
    updated.textColor = new Color("#64806B");
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
