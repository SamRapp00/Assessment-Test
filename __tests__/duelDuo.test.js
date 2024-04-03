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

  test("clicking the Draw button displays the div with id = 'choices'", async () => {
    await driver.get("http://localhost:8000");
    const drawButton = await driver.findElement(By.id("draw-button"));
    await drawButton.click();
    await driver.wait(until.elementLocated(By.id("choices")), 1000);
  });

  test("clicking an 'Add to Duo' button displays the div with id = 'player-duo'", async () => {
    await driver.get("http://localhost:8000");
    const addButton = await driver.findElement(By.className("add-to-duo-button"));
    await addButton.click();
    await driver.wait(until.elementLocated(By.id("player-duo")), 1000);
  });

  test("when a bot is 'Removed from Duo', it goes back to 'choices'", async () => {
    await driver.get("http://localhost:8000");
    const addButton = await driver.findElement(By.className("add-to-duo-button"));
    await addButton.click();
    const removeButton = await driver.findElement(By.className("remove-from-duo-button"));
    await removeButton.click();
    await driver.wait(until.elementLocated(By.id("choices")), 1000);
  });
});
