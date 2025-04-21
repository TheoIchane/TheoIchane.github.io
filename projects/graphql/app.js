const baseURL = "https://zone01normandie.org/api"
const app = document.getElementById('app')
document.addEventListener('DOMContentLoaded', fetchJWT)

async function fetchJWT() {
    let resp = await fetch(baseURL + "/auth/signin", {
        method: "POST",
        headers : {
            Authorization: "Basic " + btoa("tichane:Poketexio974.")
        }
    })
    let r = await resp.json()
    localStorage.setItem('token',r)
    parseJWT()
}

function loginForm() {

}

function parseJWT() {
    let token = localStorage.getItem('token')
    let r = JSON.parse(atob(token.split('.')[1]))
    console.log(Object.entries(r)[4][1]["x-hasura-token-id"])
    return r
}