export const getDefaultLanguage = () => {
  let x = "en";

  if (localStorage.getItem("language") == null || localStorage.getItem("language") == undefined) {
    x = "en";
  } else if (localStorage.getItem("language") == "en") {
    x = "en";
  } else if (localStorage.getItem("language") == "vn") {
    x = "vn";
  } else if (localStorage.getItem("language") == "kr") {
    x = "kr";
  } else if (localStorage.getItem("language") == "jp") {
    x = "jp";
  } else if (localStorage.getItem("language") == "cn") {
    x = "cn";
  } else if (localStorage.getItem("language") == "th") {
    x = "th";
  } else if (localStorage.getItem("language") == "km") {
    x = "km";
  } else if (localStorage.getItem("language") == "lo") {
    x = "lo";
  } else if (localStorage.getItem("language") == "id") {
    x = "id";
  } else {
    x = "en";
  }

  return x;
};

export const getSupportedLanguageList = () => {
  return [
    {
      code: "en",
      nameKey: "lang1",
      nameText: "English",
    },
    {
      code: "vn",
      nameKey: "lang2",
      nameText: "Tiếng Việt",
    },
    // {
    //   code: "kr",
    //   nameKey: "lang3",
    // },
    // {
    //   code: "jp",
    //   nameKey: "lang4",
    // },
    // {
    //   code: "cn",
    //   nameKey: "lang5",
    // },
    // {
    //   code: "th",
    //   nameKey: "lang6",
    // },
    // {
    //   code: "km",
    //   nameKey: "lang7",
    // },
    // {
    //   code: "lo",
    //   nameKey: "lang8",
    // },
    // {
    //   code: "id",
    //   nameKey: "lang9",
    // },
  ];
};
