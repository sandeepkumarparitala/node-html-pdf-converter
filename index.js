var puppeteer = require("puppeteer");
var fs = require("fs");
var hbs = require("handlebars");
var path = require("path");
var data = require("./data.json");
// var moment = require("moment");
// const { MongooseDocument } = require("mongoose");

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}`);
  console.log("path ==>", filePath);
  const html = await fs.readFileSync(filePath, "utf-8");
  return hbs.compile(html)(data);
};

hbs.registerHelper("json", function (obj) {
  return new hbs.SafeString(JSON.stringify(obj));
});

const iife = async function () {
  try {
    const browser = await puppeteer.launch({
      args: ["--window-size=1920,1080"],
    });
    const page = await browser.newPage();
    console.log("jsonData ===> *******", JSON.stringify(data));
    const content = await compile("resume-template.html", data);

    await page.setContent(content);
    await page.emulateMediaFeatures("screen");
    await page.pdf({
      path: "mypdf.pdf",
      //   format: "A4",
      landscape: true,
      printBackground: true,
    });

    console.log("done");
    await browser.close();
    process.exit();
  } catch (e) {
    console.log("our error", e);
  }
};

iife();

// var http = require("http").createServer(app);

// http.listen(config.PORT);
// console.log("App running at http://" + config.HOST + ":" + config.PORT + "/");
