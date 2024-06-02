// Hàm objectToArray1:
// + chuyển đổi object thành array
// + tách ra thành 2 array con: arr1 gồm BTC - ETH - BNB - USDT - BUSD, arr2 còn lại
// + sắp xếp từng array theo value tăng dần

// Hàm objectToArray2:
// + logic tương tự nhưng chỉ lấy USDT và BUSD

function compare(a, b) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}

export const objectToArray1 = (obj) => {
  let arr1 = [];
  let arr2 = [];

  for (let key in obj) {
    if (key === "BTC" || key === "ETH" || key === "BNB" || key === "USDT" || key === "BUSD") {
      arr1.push({
        name: key,
        value: obj[key],
      });
    } else {
      if (obj[key] !== 0) {
        arr2.push({
          name: key,
          value: obj[key],
        });
      }
    }
  }

  let arr1_sort = arr1.sort(compare);
  let arr2_sort = arr2.sort(compare);

  return [...arr1_sort, ...arr2_sort];
};

export const objectToArray2 = (obj) => {
  let arr = [];

  for (let key in obj) {
    if (key === "USDT" || key === "BUSD") {
      arr.push({
        name: key,
        value: obj[key],
      });
    }
  }

  return arr.sort(compare);
};
