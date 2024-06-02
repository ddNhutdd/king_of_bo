export function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export const localeFixed = (inputStringOrNumberBothAccepted, decimalDigits, separator) => {
  const num = Number(inputStringOrNumberBothAccepted);

  const result = num.toLocaleString("en-US", {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  });

  return result.toString().replaceAll(",", separator);
};

export const localeFixedDown = (inputStringOrNumberBothAccepted, decimalDigits, separator) => {
  const num = Math.floor(Number(inputStringOrNumberBothAccepted) * 100) / 100;

  const result = num.toLocaleString("en-US", {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  });

  return result.toString().replaceAll(",", separator);
};

export const xx = (balance) => {
  return parseFloat(Number(balance).toFixed(2)).toLocaleString("en-US");
};

export const xx2Decimal = (balance) => {
  return parseFloat(Number(balance).toFixed(2)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const xx3 = (balance) => {
  return parseFloat(Number(balance).toFixed(3)).toLocaleString("en-US");
};

// nếu yêu cầu không được làm tròn số thì dùng hàm xx dưới đây, khi đó có bao nhiêu số thập phân giữ lại hết (max 20), phần phía trước vẫn được định dạng
// const xx = (balance) => {
//   return parseFloat(Number(balance).toFixed(20)).toLocaleString("en-US", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 20,
//   });
// };
