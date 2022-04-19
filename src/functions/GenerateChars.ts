export default function generateChars(qtd: number) {
  let result = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charsQtd = chars.length;

  for (let i = 0; i < qtd; i++) {
    if (result.length === 3 || result.length === 7) result += ' ';

    result += chars.charAt(Math.floor(Math.random() * charsQtd));
  }

  return result;
}
