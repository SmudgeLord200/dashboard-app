const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8014'

export const fetchAllRestaurants = async () => {
    try {
        const response = await fetch(`${BASE_URL}/restaurants`)
        const data = await response.json()
        return data
    } catch (e) {
        console.error(e)
        throw new Error("Failed to fetch restaurants.")
    }
}

export const initialiseWebSocket = (onMessage: (data: any) => void) => {
    const socket = new WebSocket(`${BASE_URL.replace(/^http/, 'ws')}/ws`)

    socket.onopen = () => {
        console.log("WebSocket connection established")
    }

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            onMessage(data)
        } catch (e) {
            console.error("Error parsing message: ", e)
        }
    }

    socket.onerror = (e) => {
        console.error("WebSocket error: ", e)
    }

    socket.onclose = () => {
        console.log('WebSocket connection closed')
    }

    return socket
}