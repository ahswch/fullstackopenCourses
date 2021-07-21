const notificationReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.msg
        case 'REMOVE_NOTIFICATION':
            return ''
        default:
            return state
    }
}

let timer
export const showNotification = (msg, showTime) => {
    return async (dispatch) => {
        dispatch({
            type: 'SET_NOTIFICATION',
            msg,
        })

        clearTimeout(timer)
        timer = setTimeout(() => {
            dispatch({
                type: 'REMOVE_NOTIFICATION',
            })
        }, showTime * 1000)
    }
}

export default notificationReducer
