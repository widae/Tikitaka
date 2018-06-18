
export default class Interpreter{

  interpretLevel = (level) => {
    let result;
    if(level == 0){
      result = "최하";
    }else if(level == 1){
      result = "중하";
    }else if(level == 2){
      result = "중";
    }else if(level == 3){
      result = "중상";
    }else{
      result = "최상";
    }
    return result;
  };

  interpretAgeGroup = (ageGroup) => {
    let first = (Math.floor(ageGroup/3)+1) * 10 + "대";
    let last = Math.floor(ageGroup%3);
    if(last === 0){
      last = " 초반";
    }else if(last === 1){
      last = " 중반";
    }else{
      last = " 후반";
    }
    return first + last;
  }

  interpretPrice = (price) => {
    let str = "";
    let tmp = Math.floor(price/10000);
    if(tmp != 0){
      str = tmp + "만"
    }
    tmp = Math.floor(price/1000%10);
    if(tmp != 0){
      str = str + tmp + "천";
    }
    tmp = Math.floor(price%1000);
    if(tmp != 0){
      str = str + tmp;
    }
    if(price == 0 || price == null){
      str = "0";
    }
    return str + "원";
  };

  interpretTime = (time) => {
    let h1 = Math.floor(time[0]/2);
    if(h1 < 10){
      h1 = "0" + h1;
    }
    let m1 = time[0]%2 === 0 ? "00" : "30";
    let h2 = Math.floor(time[1]/2);
    if(h2 < 10){
      h2 = "0" + h2;
    }
    let m2 = time[1]%2 === 0 ? "00" : "30";
    return h1 + ":" + m1 + "~" + h2 + ":" + m2;
  };

}
