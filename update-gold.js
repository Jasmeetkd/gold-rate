const fs = require("fs");

const API_URL = "https://goldprice.today/api.php";

async function updateGoldRate() {
  try {
    console.log("Fetching latest gold price...");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate required currencies
    if (!data?.INR || !data?.USD) {
      throw new Error("INR or USD gold rate not found");
    }

    const formatRates = (currency) => ({
      ounce: Number(data[currency].ounce),
      gram: Number(data[currency].gram),
      tola: Number(data[currency].tola),
    });

    const result = {
      metal: "gold",

      rates: {
        INR: formatRates("INR"),
        USD: formatRates("USD"),
      },

      updated_at: new Date().toISOString(),
      source: "goldprice.today",
    };

    fs.writeFileSync(
      "gold-rate.json",
      JSON.stringify(result, null, 2)
    );

    console.log("Gold rates updated successfully");
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error("Failed to update gold rate:");
    console.error(error.message);

    process.exit(1);
  }
}

updateGoldRate();