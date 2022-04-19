import pagination from './functions/paginate'
import save_queue from './functions/saveQueue'
import clean from './functions/clean'
import generateQueue from './functions/generateQueueURL'
import deleteQueue from './functions/deleteQueue'

export default {
    pagination,
    clean,
    music: {
        queue:  {
            url: generateQueue,
            save: save_queue,
            delete: deleteQueue
        }
    }
}