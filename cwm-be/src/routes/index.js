const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const equipmentRoute = require("./equipment.route");
const supplyRoute = require("./supply.route");
const carpenterRoute = require("./carpenter.route");
const orderRoute = require("./order.route");
const productRoute = require("./product.route");
const woodRoute = require("./wood.route");
const timekeepingLogRoute = require("./timekeeping_log.route");
const providerRoute = require("./provider.route");
const categoryRoute = require("./category.route");
const userRoute = require("./user.route");
const docsRoute = require("./docs.route");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/carpenter",
    route: carpenterRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/wood",
    route: woodRoute,
  },
  {
    path: "/timekeeping_log",
    route: timekeepingLogRoute,
  },

  {
    path: "/equipment",
    route: equipmentRoute,
  },

  {
    path: "/supply",
    route: supplyRoute,
  },

  {
    path: "/provider",
    route: providerRoute,
  },

  {
    path: "/category",
    route: categoryRoute,
  },

  {
    path: "/user",
    route: userRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const env = "development";

/* istanbul ignore next */
if (env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
