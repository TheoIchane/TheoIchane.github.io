
const baseURL = "https://zone01normandie.org/api"

export async function fetchData(query) {
    let token = localStorage.getItem('token')
    let resp = await fetch(baseURL + "/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify({
            query: query
        })
    })
    let r = await resp.json()
    return r.data
}