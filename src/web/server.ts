import http from 'http'
import app from './app'
import axios from 'axios'

/** 
export default class {
    static init() {
        const port = process.env.PORT || 3000

        const server = http.createServer(app)

        server.listen(port)
    }
}
*/

export default class {
  static init() {
    axios.post(`${process.env.WEBURL}`, {
      test: 'oi',
    });
  }
}
