import canvas from 'canvas'

export default async function getDimensions(url: string) {
  let propObj = {
    width: 0,
    height: 0,
  };
  
  let img = await canvas.loadImage(url)

  propObj.width = img.width
  propObj.height = img.height

  return propObj;
}
