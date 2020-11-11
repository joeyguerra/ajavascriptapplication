import assert from "assert"
import fs from "fs"
import { JSDOM } from "jsdom"
import ObservableList from "../ObservableList.mjs"
import View from "../View.mjs"
import LiView from "../LiView.mjs"
let htmlLayoutTemplate = ""
class ULView extends View {
    constructor(delegate, container, model){
        super(delegate, container, model)
        this.model.observe("push", this)
    }
    update(key, old, value){
        const li = this.delegate.createElement("li")
        li.innerHTML = value
        this.container.appendChild(li)
        this.views.push(new LiView(li, value))
    }
}
describe("Starting out", ()=>{
    before(async ()=>{
        htmlLayoutTemplate = await fs.promises.readFile("./examples/layout.html", "utf8")
    })
    it("Example setup", ()=>{
        const dom = new JSDOM(htmlLayoutTemplate)
        dom.window.document.querySelector("main").innerHTML = `<ul id="listOfTodos"></ul>`
        assert.ok(dom.window.listOfTodos)
    })
    it("Add todo items in the HTML", ()=>{
        const dom = new JSDOM(htmlLayoutTemplate)
        dom.window.document.querySelector("main").innerHTML = `<ul id="listOfTodos"></ul>`
        const model = new ObservableList()
        new ULView({createElement(tag){
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