// Seasonal shelf — the floating row of covers under Book of the Week.
//
// To change the shelf for a new season:
//   1. Set `heading` to the line that appears above the row.
//   2. Set `category` to a catalog category ("Cookbooks", "Travel", "Kids", ...).
//   3. Add any SKUs you don't want in the row to `excludedSkus`.
//
// Books are ordered by popularity (lowest Amazon sales rank first); anything
// without a rank goes at the end. To hide the row, set `category` to "".

export const seasonalShelf = {
  heading: "Gather Round the Table",
  category: "Cookbooks",
  // Miscategorized or off-theme titles — nutrition guides, a gardening book,
  // and allergen cookbooks that don't suit a holiday table.
  excludedSkus: [
    "TC02293", // Real Food for Pregnancy
    "CB04105", // The Autoimmune Protocol Comfort Food Cookbook
    "TC02237", // The How Can It Be Gluten Free Cookbook
    "CB03903", // Detox for Life
    "TC00602", // Boundless Cookbook
    "TC01248", // Backyard Problem Solver
    "TC01245", // Nutrition Facts: The Truth About Food
    "TC01640", // The Story of Seeds
  ],
};
