import InternalError from './errors/InternalError'

class Format {
  formatNumber(number: any, replaceWith: string) {
    if(typeof number !== 'number') {
        throw new InternalError('The input type must be a number')
      }

      const n = String(number),
      p = n.indexOf('.')
  
      return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g,
      (m, i) => p < 0 || i < p ? `${m}${replaceWith}` : m
      )
  }
}

export default Format