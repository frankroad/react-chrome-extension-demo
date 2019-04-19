const menus = {
    open : {
        title : '打开todos页面',
        onclick : () => openWindow(
            {
                type : 'popup',
                left : 100,
                top : 100,
                width : 800,
                height : 475,
                url : 'popup.html'
            }
        )
    }
}
createMenus(menus)

function createMenus(menus) {
    for ( let id in menus ) {
        if ( menus.hasOwnProperty(id) ) {
            let v = menus[id]
            chrome.contextMenus.create(
                {
                    id,
                    ...v
                },
                v.callback
            )
        }
    }
}

let windowId = 0

function openWindow(option, callback = () => void 0) {
    chrome.windows.create(
        option,
        (win) => {
            if ( windowId !== 0 ) {
                chrome.windows.remove(windowId)
            }
            callback(win)
            windowId = win.id
        }
    )
}
