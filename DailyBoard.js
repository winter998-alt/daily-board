// Daily Board Widget v0.1
// For Scriptable on iPhone / iPad

const DATA_URL = "https://winter998-alt.github.io/daily-board/data/daily.json";
const BOARD_URL = "https://winter998-alt.github.io/daily-board/";

async function loadDailyData() {
  try {
    const request = new Request(`${DATA_URL}?t=${Date.now()}`);
    request.timeoutInterval = 15;
    return await request.loadJSON();
  } catch (error) {
    console.error("Failed to load Daily Board data:", error);
    return null;
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  const formatter = new DateFormatter();
  formatter.locale = "zh_TW";
  formatter.dateFormat = "M月d日 EEEE";
  return formatter.string(date);
}

function formatUpdatedTime(updatedAt) {
  if (!updatedAt) return "";
  const date = new Date(updatedAt);
  const formatter = new DateFormatter();
  formatter.locale = "zh_TW";
  formatter.dateFormat = "HH:mm";
  return formatter.string(date);
}

function addDivider(widget) {
  const divider = widget.addStack();
  divider.size = new Size(0, 1);
  divider.backgroundColor = Color.dynamic(
    new Color("#D9DDD7"),
    new Color("#30352F")
  );
}

function addHeadline(stack, number, title, summary, maxLines = 2) {
  const row = stack.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();

  const numberText = row.addText(number);
  numberText.font = Font.semiboldSystemFont(11);
  numberText.textColor = Color.dynamic(
    new Color("#61766A"),
    new Color("#ABC7B5")
  );

  row.addSpacer(10);

  const content = row.addStack();
  content.layoutVertically();

  const titleText = content.addText(title || "Untitled");
  titleText.font = Font.semiboldSystemFont(15);
  titleText.textColor = Color.dynamic(Color.black(), Color.white());
  titleText.lineLimit = 2;

  if (summary) {
    content.addSpacer(3);
    const summaryText = content.addText(summary);
    summaryText.font = Font.systemFont(11);
    summaryText.textColor = Color.dynamic(
      new Color("#5F655F"),
      new Color("#B5BBB5")
    );
    summaryText.lineLimit = maxLines;
  }

  return row;
}

async function createWidget(data) {
  const widget = new ListWidget();

  widget.backgroundColor = Color.dynamic(
    new Color("#F4F5F0"),
    new Color("#111411")
  );

  widget.setPadding(18, 18, 16, 18);
  widget.url = BOARD_URL;

  const header = widget.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();

  const leftHeader = header.addStack();
  leftHeader.layoutVertically();

  const brand = leftHeader.addText("DAILY BOARD");
  brand.font = Font.boldSystemFont(12);
  brand.textColor = Color.dynamic(
    new Color("#34463B"),
    new Color("#D5E5D9")
  );

  const dateText = leftHeader.addText(
    data ? formatDate(data.date) : "無法取得今日資料"
  );
  dateText.font = Font.systemFont(10);
  dateText.textColor = Color.dynamic(
    new Color("#727972"),
    new Color("#989F98")
  );

  header.addSpacer();

  if (data?.updatedAt) {
    const updated = header.addText(`更新 ${formatUpdatedTime(data.updatedAt)}`);
    updated.font = Font.systemFont(9);
    updated.textColor = Color.dynamic(
      new Color("#7C827C"),
      new Color("#8F968F")
    );
  }

  widget.addSpacer(10);
  addDivider(widget);
  widget.addSpacer(12);

  if (!data) {
    const error = widget.addText("暫時無法讀取 Daily Board。");
    error.font = Font.semiboldSystemFont(15);
    error.textColor = Color.dynamic(Color.black(), Color.white());

    widget.addSpacer(6);

    const hint = widget.addText("點一下開啟完整頁面，或稍後再試。");
    hint.font = Font.systemFont(11);
    hint.textColor = Color.gray();

    return widget;
  }

  const section = widget.addText("BIOMED / NEUROSCIENCE");
  section.font = Font.boldSystemFont(10);
  section.textColor = Color.dynamic(
    new Color("#637B6C"),
    new Color("#B5D0BF")
  );

  widget.addSpacer(8);

  const lead = data.report?.lead;
  if (lead) {
    addHeadline(widget, "01", lead.title, lead.summary, 3);

    if (lead.why) {
      widget.addSpacer(7);

      const whyBox = widget.addStack();
      whyBox.layoutVertically();
      whyBox.setPadding(8, 10, 8, 10);
      whyBox.cornerRadius = 10;
      whyBox.backgroundColor = Color.dynamic(
        new Color("#E3EBE3"),
        new Color("#233128")
      );

      const whyLabel = whyBox.addText("WHY IT MATTERS");
      whyLabel.font = Font.boldSystemFont(9);
      whyLabel.textColor = Color.dynamic(
        new Color("#536C5C"),
        new Color("#B9D3C1")
      );

      whyBox.addSpacer(2);

      const whyText = whyBox.addText(lead.why);
      whyText.font = Font.systemFont(10);
      whyText.textColor = Color.dynamic(
        new Color("#353B36"),
        new Color("#E2E8E2")
      );
      whyText.lineLimit = 2;
    }
  }

  const stories = data.report?.stories || [];
  const storyLimit = config.widgetFamily === "medium" ? 1 : 2;

  for (let i = 0; i < Math.min(stories.length, storyLimit); i++) {
    widget.addSpacer(10);
    addDivider(widget);
    widget.addSpacer(9);

    addHeadline(
      widget,
      String(i + 2).padStart(2, "0"),
      stories[i].title,
      stories[i].summary,
      2
    );
  }

  const isLarge =
    config.widgetFamily === "large" ||
    config.widgetFamily === "extraLarge" ||
    !config.runsInWidget;

  const radar = data.report?.radar;

  if (radar && isLarge) {
    widget.addSpacer(11);

    const radarBox = widget.addStack();
    radarBox.layoutVertically();
    radarBox.setPadding(9, 10, 9, 10);
    radarBox.cornerRadius = 10;
    radarBox.backgroundColor = Color.dynamic(
      new Color("#ECEDE7"),
      new Color("#1A1E1A")
    );

    const radarLabel = radarBox.addText("RESEARCH & CAREER RADAR");
    radarLabel.font = Font.boldSystemFont(9);
    radarLabel.textColor = Color.dynamic(
      new Color("#61766A"),
      new Color("#B5D0BF")
    );

    radarBox.addSpacer(2);

    const radarTitle = radarBox.addText(radar.title || "");
    radarTitle.font = Font.semiboldSystemFont(11);
    radarTitle.textColor = Color.dynamic(Color.black(), Color.white());
    radarTitle.lineLimit = 1;

    if (radar.summary) {
      const radarSummary = radarBox.addText(radar.summary);
      radarSummary.font = Font.systemFont(9);
      radarSummary.textColor = Color.dynamic(
        new Color("#626862"),
        new Color("#ADB3AD")
      );
      radarSummary.lineLimit = 2;
    }
  }

  const mail = data.importantMail || [];

  widget.addSpacer(11);
  addDivider(widget);
  widget.addSpacer(9);

  const mailHeader = widget.addStack();
  mailHeader.layoutHorizontally();

  const mailTitle = mailHeader.addText("IMPORTANT MAIL");
  mailTitle.font = Font.boldSystemFont(10);
  mailTitle.textColor = Color.dynamic(
    new Color("#6C665A"),
    new Color("#D3C9B9")
  );

  mailHeader.addSpacer();

  const mailCount = mailHeader.addText(String(mail.length));
  mailCount.font = Font.boldSystemFont(10);
  mailCount.textColor = Color.dynamic(
    new Color("#6C665A"),
    new Color("#D3C9B9")
  );

  widget.addSpacer(5);

  if (mail.length === 0) {
    const clear = widget.addText("今天沒有需要你注意的郵件。");
    clear.font = Font.systemFont(10);
    clear.textColor = Color.dynamic(
      new Color("#686E68"),
      new Color("#A8AEA8")
    );
  } else {
    const firstMail = mail[0];

    const sender = widget.addText(firstMail.sender || "Important mail");
    sender.font = Font.semiboldSystemFont(10);
    sender.textColor = Color.dynamic(Color.black(), Color.white());
    sender.lineLimit = 1;

    const mailSubject = widget.addText(firstMail.title || firstMail.summary || "");
    mailSubject.font = Font.systemFont(10);
    mailSubject.textColor = Color.dynamic(
      new Color("#555B55"),
      new Color("#C1C7C1")
    );
    mailSubject.lineLimit = 1;

    if (mail.length > 1) {
      const more = widget.addText(`另有 ${mail.length - 1} 封需要注意`);
      more.font = Font.systemFont(9);
      more.textColor = Color.gray();
      more.lineLimit = 1;
    }
  }

  return widget;
}

const data = await loadDailyData();
const widget = await createWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentLarge();
}

Script.complete();
