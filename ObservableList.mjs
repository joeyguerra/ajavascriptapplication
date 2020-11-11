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
export default ObservableList