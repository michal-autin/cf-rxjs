import { Observable } from 'rxjs/Observable'

var observable = Observable.create(observer => {
  observer.next('url-1')
})

function addItem(val) {
  var node = document.createElement('li')
  var textNode = document.createTextNode(val)
  node.appendChild(textNode)
  const anchor = document.getElementById('obs')
  console.log(anchor)
  anchor.appendChild(node)
}

// var a = setTimeout(() => {
function observe() {
  observable.subscribe(
    x => addItem(x),
    err => console.error(err),
    _ => console.log('Complete')
  )
}

function unsubscribe() {
  observable.unsubscribe()
}

export { observe, unsubscribe, addItem }
// }, 4000)

// function mockHTTPRequest(url) {
//   return Observable.of(`Response from ${url}`).delay(2000)
// }

// function timestamp() {
//   return new Date().getTime() - start
// }

// var start = new Date().getTime()

// Observable.of('url-1')
//   .concatMap(url => {
//     console.log(timestamp() + ': Sending request to ' + url)
//     return mockHTTPRequest(url)
//   })
//   .do(response => {
//     console.log(timestamp() + ': ' + response)
//   })

// export { mockHTTPRequest }
