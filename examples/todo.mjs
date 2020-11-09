import assert from "assert"
import { JSDOM } from "jsdom"

const htmlLayoutTemplate = `
<!DOCTYPE html>
<html>
    <head><title>Testing</title></head>
    <body>
        <header></header>
        <main></main>
        <footer></footer>
    </body>
</html>
`
class ObservableList extends Array {
    constructor(){
        super()
        this.observers = {}
    }
    notify(key, old, value){
        if(!this.observers[key]) return
        this.observers[key].forEach(observer => observer.update(key, old, value))
    }
    observe(key, observer){
        if(!this.observers[key]) this.observers[key] = []
        this.observers[key].push(observer)
    }
    push(item){
        super.push(item)
        this.notify("push", null, item)
    }
}

class LiView {
    constructor(container, model){
        this.model = model
        this.container = container
    }
}
class View {
    constructor(delegate, container, model){
        this.delegate = delegate
        this.container = container
        this.model = model
        this.model.observe("push", this)
        this.views = []
    }
    update(key, old, value){
        const li = this.delegate.createElement("li")
        li.innerHTML = value
        this.container.appendChild(li)
        this.views.push(new LiView(li, value))
    }
}
describe("Starting out", ()=>{
    it("Example setup", ()=>{
        const dom = new JSDOM(htmlLayoutTemplate)
        dom.window.document.querySelector("main").innerHTML = `<ul id="listOfTodos"></ul>`
        assert.ok(dom.window.listOfTodos)
    })
    it("Add todo items in the HTML", ()=>{
        const dom = new JSDOM(htmlLayoutTemplate)
        dom.window.document.querySelector("main").innerHTML = `<ul id="listOfTodos"></ul>`
        const model = new ObservableList()
        new View({createElement(tag){
            return dom.window.document.createElement(tag)
        }}, dom.window.listOfTodos, model)
        model.push({
            id: 1,
            text: "Something todo"
        })
        model.push({
            id: 2,
            text: "Something else"
        })
        assert.ok(dom.window.listOfTodos.querySelectorAll("li").length > 0)
    })
})