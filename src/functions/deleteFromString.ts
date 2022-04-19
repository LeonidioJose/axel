function deleteFromString(replaced: string | Array<any>, str: string): any {
  if (!Array.isArray(replaced)) {
    let regex = new RegExp(replaced, 'g');

    return str.replace(regex, '');
  } else {
    let nowStr = 'null';
    for (let x of replaced) {
      let regex = new RegExp(x, 'g');

      if (nowStr == 'null') {
        nowStr = str.replace(regex, '');
      } else {
        nowStr = nowStr.replace(regex, '');
      }
    }

    return nowStr;
  }
}

export default deleteFromString;
