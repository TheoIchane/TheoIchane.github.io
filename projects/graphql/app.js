import { AuditBlock, ProfilBlock } from "./js/var.js"
import { fetchData } from "./js/data.js"
const baseURL = "https://zone01normandie.org/api"
const app = document.getElementById('app')
const logout = document.getElementById('logout')
document.addEventListener('DOMContentLoaded', displayInfo)
logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    displayInfo()
})

async function fetchJWT() {
    const ident = document.getElementById('identifier').value
    const password = document.getElementById('password').value
    let resp = await fetch(baseURL + "/auth/signin", {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(`${ident}:${password}`)
        }
    })
    let r = await resp.json()
    if (r.error) {
        console.log(r.error)
        return
    }
    localStorage.setItem("token", r)
    parseJWT(r)
    displayInfo()
}

function loginForm() {
    logout.style.display = 'none'
    let form = document.createElement('form')
    form.id = 'loginForm'
    form.innerHTML = `
    <h1>Login</h1>
    <label for="identifier">Username or Email:</label>
    <input type="text" name="identifier" id="identifier" required>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" required>
    <button>Login</button>`
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        fetchJWT()
    })
    app.innerHTML = ""
    app.appendChild(form)
}

function parseJWT(jwt) {
    let r = JSON.parse(atob(jwt.split('.')[1]))
    localStorage.setItem('user_id', r.sub)
}

async function displayInfo() {
    if (!localStorage.getItem('token')) {
        loginForm()
        return
    }
    logout.style.display = 'block'
    app.innerHTML = ""
    let auditBlock = new AuditBlock()
    app.innerHTML += await auditBlock.render()

    let profilBlock = new ProfilBlock()
    app.innerHTML += await profilBlock.render()
}

