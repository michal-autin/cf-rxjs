import { Subject } from 'rxjs/Subject'
import { addItem } from './index.js'

var subject = new Subject()

subject.subscribe(
  data => addItem('Subject 1: ' + data),
  err => addItem('Subject 1 error: ' + err),
  _ => addItem('Subject 1: Completed')
)

subject.next('The first thing has beed sent')
