const applytext = (canvas: any, text: string, fontsize: number) => {
  const ctx = canvas.getContext('2d');

  let fontSize = fontsize;

  do {
    ctx.font = `${(fontSize -= 10)}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);

  return ctx.font;
};

export default applytext;
