const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("clicking the Draw button displays the div with id choices", async () => {
    await driver.get("http://localhost:8000");
    const drawBtn = await driver.findElement(By.id("draw"));
    await drawBtn.click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    const display = await choicesDiv.isDisplayed();
    expect(display).toBe(true);
  })

  test("clicking an 'Add to Duo' button displays the div with id = 'player-duo'", async () => {
    await driver.get("http://localhost:8000");
    const addButton = await driver.findElement(By.className("bot-btn"));
    await addButton.click();
    await driver.wait(until.elementLocated(By.id("player-duo")), 1000);
  });
  //Not Sure If this test will run^^^

  test("remove bot from duo returns it to choices", async () => {
    await driver.get("http://localhost:8000");
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
    const addToDuoButtons = await driver.findElements(By.className("bot-btn"));
    await addToDuoButtons[0].click();
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    const botInPlayerDuo = await playerDuoDiv.findElement(
      By.className("bot-card")
    );
    expect(await botInPlayerDuo.isDisplayed()).toBe(true);
    const removeFromDuoButtons = await driver.findElements(
      By.className("bot-btn")
    );
    await removeFromDuoButtons[0].click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    const botInChoices = await choicesDiv.findElement(By.className("bot-card"));
    expect(await botInChoices.isDisplayed()).toBe(true);
  });
