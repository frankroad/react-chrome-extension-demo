chrome.storage.sync.get(
    'todos',
    ({ todos }) => setBadgeTextByTodos(todos)
)
chrome.storage.onChanged.addListener(
    ({ todos }) => setBadgeTextByTodos(todos.newValue)
)
const setBadgeTextByTodos = (todos) => {
    if ( Array.isArray(todos) ) {
        chrome.browserAction.setBadgeText({
            text : todos.length === 0 ? '' : todos.length.toString()
        })
    }
}
