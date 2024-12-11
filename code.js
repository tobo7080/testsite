const output_csv = document.getElementById('datas_list');
const output_sortcsv = document.getElementById('sorts_list');

var api_url = 'https://script.google.com/macros/s/AKfycbwlkN3rT48eGSGOXbPrBPfvLuMutyprQNXyFerjqdyJ5vVw8Olg2g6tytRnACC8lm-S/exec'; //生成したAPIのURLを指定
let insertElement = '';
let sortElement = '';
let a = 0;
let b = 0;
let c = 0;
let deadlines = [];
let sortdata = [];
let mode = "usually";

const buttonD = document.getElementById('day_btn');
const buttonS = document.getElementById('sort_btn');

fetch(api_url)
  .then(function (fetch_data) {
    return fetch_data.json();
  })
  .then(function (json) {
    for (var i in json) {
      if (json[i].url === "finish") {
        break;
      }
      if (json[i].url !== "month") {
        deadlines[c] = json[i].deadline;
        let cut = deadlines[c].substr(deadlines[c].indexOf('申込締切：') + 5);
        let m = cut.indexOf('/');
        let year24 = cut.indexOf('2024');
        let year25 = cut.indexOf('2025');
        if (year24 !== -1 || year25 !== -1) {
          let k = cut;
          cut = k.substr(k.indexOf('202') + 5);
        }
        let offLine = cut.indexOf('オフライン見学会：');
        let onLine = cut.indexOf('オンライン見学会：');
        if (offLine !== -1 || onLine !== -1) {
          let k = cut;
          cut = k.substr(k.indexOf('見学会：') + 4);
        }
        let cut2;
        let cut3;
        if (m === -1) {
          cut2 = cut.substr(0, cut.indexOf('月')) + cut.substr(cut.indexOf('月') + 1);
          cut3 = cut.substr(0, cut.indexOf('月'));
        }
        else {
          cut2 = cut.substr(0, cut.indexOf('/')) + cut.substr(cut.indexOf('/') + 1);
          cut3 = cut.substr(0, cut.indexOf('/'));
        }
        let kar = parseInt(cut2, 10);
        cut3 = parseInt(cut3, 10);
        let nowyear;
        if (cut3 < 10) {
          nowyear = 2025;
        }
        else {
          nowyear = 2024;
        }
        if (kar < 1000) {
          if (cut3 < 10) {
            if (kar < 100) {
              let keisan1 = parseInt(kar / 10, 10);
              let keisan2 = kar - keisan1 * 10;
              cut2 = kar * 10 - keisan2 * 9;
            }
          }
          else {
            let keisan1 = parseInt(kar / 10, 10);
            let keisan2 = kar - keisan1 * 10;
            cut2 = kar * 10 - keisan2 * 9;
          }
        }
        deadlines[c] = parseInt(cut2, 10) + nowyear * 10000;
        if (isNaN(deadlines[c])) {
          deadlines[c] = 99999999;
        }

        sortdata[c] = [];
        sortdata[c][0] = deadlines[c];
        sortdata[c][1] = b;
        c++;
      }
      if (a % 4 === 0) {
        if (a === 0) {
          insertElement += '<div class="case">'
        }
        else {
          insertElement += '</div>'
          insertElement += '<div class="case">'
        }
      }
      if (json[i].url === "month") {
        if (a % 4 === 0) {
          insertElement += `<div class="block"><img src="${json[i].image}" alt="月"></div>`
        }
        else {
          insertElement += '</div>'
          insertElement += '<div class="case">'
          insertElement += `<div class="block"><img src="${json[i].image}" alt="月"></div>`
          a = 0;
        }
      }
      else {
        insertElement += '<div class="block">'
        insertElement += `<a href="${json[i].url}">`
        insertElement += `<img src="${json[i].image}" alt="イメージ画像">`
        insertElement += `<img src="${json[i].sub}" alt="対象生アイコン">`
        insertElement += `<h3 class="deadline">${json[i].deadline}</h3>`
        insertElement += `<p class="title">${json[i].title}</p>`
        insertElement += '</a></div>'
      }
      a++;
      b++;
    }
    insertElement += '</div>'

    sortdata.sort((a, b) => {
      return a[0] - b[0]
    })
    for (var j = 0; j < c; j++) {
      if (j % 4 === 0) {
        if (j === 0) {
          sortElement += '<div class="case">'
        }
        else {
          sortElement += '</div>'
          sortElement += '<div class="case">'
        }
      }
      sortElement += '<div class="block">'
      sortElement += `<a href="${json[sortdata[j][1]].url}">`
      sortElement += `<img src="${json[sortdata[j][1]].image}" alt="イメージ画像">`
      sortElement += `<img src="${json[sortdata[j][1]].deadline}" alt="対象生アイコン">`
      sortElement += `<h3 class="deadline">${json[sortdata[j][1]].deadline}</h3>`
      sortElement += `<p class="title">${json[sortdata[j][1]].title}</p>`
      sortElement += '</a></div>'
    }
    output_csv.innerHTML = insertElement;
    //output_sortcsv.innerHTML = sortElement;
    //console.log(sortdata);
  });

buttonD.addEventListener('click', function () {
  buttonD.classList.remove('active');
  buttonS.classList.remove('active');
});

buttonS.addEventListener('click', function () {
  buttonD.classList.add('active');
  buttonS.classList.add('active');
});

function change(isDisplay) {
  if (mode === "usually") {
    if (isDisplay === true) {
      mode = "sort"
      output_csv.innerHTML = sortElement;
    }
  }
  else {
    if (isDisplay === false) {
      mode = "usually"
      output_csv.innerHTML = insertElement;
    }
  }
}
//(ᐛ)ここまで見てる人いないだろ()え？見てるって？ｳｿﾀﾞﾄﾞﾝﾄﾞｺﾄﾞｰﾝ