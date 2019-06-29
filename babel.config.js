
module.exports = function (api) {

  api.cache(true);

  const presets = [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current",
          "chrome": "31",
          "safari": "8",
          "ie": "10"
        },
        "corejs": "2",
        "useBuiltIns": "usage"
      }
    ]
  ];

  return {
    presets
  };

};
