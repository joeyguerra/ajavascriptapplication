class View {
    constructor(delegate, container, model){
        this.delegate = delegate
        this.container = container
        this.model = model
        this.views = []
    }
}
export default View