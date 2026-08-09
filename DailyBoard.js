// Daily Board Widget v0.6
// Responsive Scriptable widget: iPhone Medium + iPad Extra Large.
// Green + white botanical-tech reminder with corrected line-art leaves.

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

function familyConfig() {
  const family = config.widgetFamily || "medium";
  const isXL = family === "extraLarge";
  const isLarge = family === "large";

  if (isXL) {
    return {
      family,
      canvasW: 1120,
      canvasH: 620,
      padTop: 34,
      padSide: 42,
      padBottom: 34,
      brand: 17,
      date: 14,
      title: 38,
      subtitle: 17,
      button: 16,
      updated: 13,
      titleLines: 2,
      preview: "extraLarge"
    };
  }

  if (isLarge) {
    return {
      family,
      canvasW: 700,
      canvasH: 700,
      padTop: 28,
      padSide: 30,
      padBottom: 28,
      brand: 14,
      date: 12,
      title: 30,
      subtitle: 14,
      button: 13,
      updated: 11,
      titleLines: 3,
      preview: "large"
    };
  }

  return {
    family: "medium",
    canvasW: 660,
    canvasH: 300,
    padTop: 16,
    padSide: 18,
    padBottom: 14,
    brand: 11,
    date: 9,
    title: 20,
    subtitle: 10.5,
    button: 10,
    updated: 8.5,
    titleLines: 2,
    preview: "medium"
  };
}

function makeBackground(cfg) {
  const width = cfg.canvasW;
  const height = cfg.canvasH;
  const scaleX = width / 660;
  const scaleY = height / 300;

  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  ctx.opaque = true;
  ctx.respectScreenScale = true;

  ctx.setFillColor(new Color("#F7FBF5"));
  ctx.fillRect(new Rect(0, 0, width, height));

  // Soft green zones
  ctx.setFillColor(new Color("#EAF6E8"));
  ctx.fillEllipse(new Rect(width * 0.62, -height * 0.22, width * 0.42, height * 0.72));
  ctx.setFillColor(new Color("#F0F8EE"));
  ctx.fillEllipse(new Rect(width * 0.72, height * 0.38, width * 0.34, height * 0.62));

  // Circuit paths
  ctx.setStrokeColor(new Color("#A7D9B2", 0.75));
  ctx.setLineWidth(cfg.family === "extraLarge" ? 3 : 2);

  const tech = [
    [[330,55],[405,55],[430,78],[500,78]],
    [[370,98],[445,98],[465,118],[560,118]],
    [[315,210],[400,210],[425,185],[500,185]],
    [[390,245],[455,245],[480,220],[565,220]]
  ];

  tech.forEach(points => {
    const p = new Path();
    p.move(new Point(points[0][0] * scaleX, points[0][1] * scaleY));
    for (let i = 1; i < points.length; i++) {
      p.addLine(new Point(points[i][0] * scaleX, points[i][1] * scaleY));
    }
    ctx.addPath(p);
    ctx.strokePath();
  });

  [[405,55],[500,78],[445,98],[560,118],[400,210],[500,185],[455,245],[565,220]].forEach(([x,y]) => {
    const r = cfg.family === "extraLarge" ? 10 : 8;
    ctx.setFillColor(new Color("#79C98D"));
    ctx.fillEllipse(new Rect(x * scaleX - r/2, y * scaleY - r/2, r, r));
  });

  const sx = scaleX;
  const sy = scaleY;
  const plantColor = new Color("#2E7D32", 0.92);
  const veinColor = new Color("#55A95E", 0.60);

  // Subtle circular tech halo behind the plant
  ctx.setStrokeColor(new Color("#6EDB8A", 0.34));
  ctx.setLineWidth(cfg.family === "extraLarge" ? 3 : 2);
  ctx.strokeEllipse(new Rect(445*sx,55*sy,170*sx,170*sy));
  ctx.strokeEllipse(new Rect(465*sx,75*sy,130*sx,130*sy));

  // Botanical line-art: smooth stem
  ctx.setStrokeColor(plantColor);
  ctx.setLineWidth(cfg.family === "extraLarge" ? 5 : 3.3);

  const stem = new Path();
  stem.move(new Point(535*sx, 240*sy));
  stem.addCurve(
    new Point(540*sx, 103*sy),
    new Point(534*sx, 200*sy),
    new Point(540*sx, 145*sy)
  );
  ctx.addPath(stem);
  ctx.strokePath();

  // Left leaf: branch point -> tip -> branch point
  const leftLeaf = new Path();
  leftLeaf.move(new Point(539*sx, 154*sy));
  leftLeaf.addCurve(
    new Point(479*sx, 134*sy),
    new Point(522*sx, 132*sy),
    new Point(497*sx, 124*sy)
  );
  leftLeaf.addCurve(
    new Point(539*sx, 154*sy),
    new Point(492*sx, 154*sy),
    new Point(520*sx, 166*sy)
  );
  ctx.addPath(leftLeaf);
  ctx.strokePath();

  // Right leaf
  const rightLeaf = new Path();
  rightLeaf.move(new Point(540*sx, 128*sy));
  rightLeaf.addCurve(
    new Point(607*sx, 106*sy),
    new Point(558*sx, 101*sy),
    new Point(586*sx, 95*sy)
  );
  rightLeaf.addCurve(
    new Point(540*sx, 128*sy),
    new Point(590*sx, 133*sy),
    new Point(562*sx, 143*sy)
  );
  ctx.addPath(rightLeaf);
  ctx.strokePath();

  // Top leaf
  const topLeaf = new Path();
  topLeaf.move(new Point(540*sx, 106*sy));
  topLeaf.addCurve(
    new Point(542*sx, 37*sy),
    new Point(523*sx, 83*sy),
    new Point(527*sx, 55*sy)
  );
  topLeaf.addCurve(
    new Point(540*sx, 106*sy),
    new Point(561*sx, 58*sy),
    new Point(559*sx, 84*sy)
  );
  ctx.addPath(topLeaf);
  ctx.strokePath();

  // Fine leaf veins
  ctx.setStrokeColor(veinColor);
  ctx.setLineWidth(cfg.family === "extraLarge" ? 2.2 : 1.4);

  const veinLeft = new Path();
  veinLeft.move(new Point(536*sx, 152*sy));
  veinLeft.addLine(new Point(486*sx, 136*sy));
  ctx.addPath(veinLeft);
  ctx.strokePath();

  const veinRight = new Path();
  veinRight.move(new Point(543*sx, 127*sy));
  veinRight.addLine(new Point(600*sx, 109*sy));
  ctx.addPath(veinRight);
  ctx.strokePath();

  const veinTop = new Path();
  veinTop.move(new Point(540*sx, 102*sy));
  veinTop.addLine(new Point(542*sx, 45*sy));
  ctx.addPath(veinTop);
  ctx.strokePath();

  return ctx.getImage();
}

async function buildWidget(data) {
  const cfg = familyConfig();
  const w = new ListWidget();
  w.url = BOARD_URL;
  w.backgroundImage = makeBackground(cfg);
  w.setPadding(cfg.padTop, cfg.padSide, cfg.padBottom, cfg.padSide);

  const header = w.addStack();
  header.centerAlignContent();

  const icon = SFSymbol.named("leaf");
  icon.applyFont(Font.systemFont(cfg.brand));
  const leaf = header.addImage(icon.image);
  leaf.imageSize = new Size(cfg.brand + 2, cfg.brand + 2);
  leaf.tintColor = new Color("#2E7D32");

  header.addSpacer(cfg.family === "extraLarge" ? 10 : 7);

  const brand = header.addText("DAILY BOARD");
  brand.font = Font.boldSystemFont(cfg.brand);
  brand.textColor = new Color("#1F6B35");

  header.addSpacer();

  const date = header.addText(data ? formatDate(data.date) : "OFFLINE");
  date.font = Font.systemFont(cfg.date);
  date.textColor = new Color("#4E6F58");

  w.addSpacer(cfg.family === "extraLarge" ? 40 : 13);

  const content = w.addStack();
  content.layoutHorizontally();

  const left = content.addStack();
  left.layoutVertically();
  left.size = cfg.family === "extraLarge" ? new Size(650, 0) : new Size(0, 0);

  const title = left.addText(data
    ? "來看看生醫界又發生了什麼有趣的事吧"
    : "今天的 Daily Board 暫時還沒連上");
  title.font = Font.boldSystemFont(cfg.title);
  title.textColor = new Color("#145C2C");
  title.lineLimit = cfg.titleLines;
  title.minimumScaleFactor = 0.82;

  left.addSpacer(cfg.family === "extraLarge" ? 16 : 6);

  const subtitle = left.addText(data
    ? "今天的生醫・神經科學摘要已更新"
    : "點一下開啟閱讀頁，或稍後再試。");
  subtitle.font = Font.systemFont(cfg.subtitle);
  subtitle.textColor = new Color("#48634F");
  subtitle.lineLimit = 2;

  if (cfg.family === "extraLarge") {
    left.addSpacer(16);
    const hint = left.addText("從一篇故事開始，慢慢看懂今天的新研究。");
    hint.font = Font.systemFont(14);
    hint.textColor = new Color("#6B846F");
    hint.lineLimit = 2;
  }

  w.addSpacer();

  const footer = w.addStack();
  footer.centerAlignContent();

  const button = footer.addStack();
  button.setPadding(
    cfg.family === "extraLarge" ? 11 : 6,
    cfg.family === "extraLarge" ? 20 : 11,
    cfg.family === "extraLarge" ? 11 : 6,
    cfg.family === "extraLarge" ? 20 : 11
  );
  button.cornerRadius = cfg.family === "extraLarge" ? 18 : 12;
  button.backgroundColor = new Color("#22A447");

  const action = button.addText("打開 Daily Board  →");
  action.font = Font.boldSystemFont(cfg.button);
  action.textColor = Color.white();

  footer.addSpacer();

  if (data?.updatedAt) {
    const updated = footer.addText(`更新 ${formatTime(data.updatedAt)}`);
    updated.font = Font.systemFont(cfg.updated);
    updated.textColor = new Color("#64806B");
  }

  return w;
}

const data = await loadData();
const widget = await buildWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  const cfg = familyConfig();
  if (cfg.preview === "extraLarge") {
    await widget.presentExtraLarge();
  } else if (cfg.preview === "large") {
    await widget.presentLarge();
  } else {
    await widget.presentMedium();
  }
}

Script.complete();
