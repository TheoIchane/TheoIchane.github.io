const user_info = document.getElementById('user_info')
const proj_page = document.getElementById('projects')


window.onload = displayUserInfo()

function displayUserInfo() {
    user_info.style.display = 'flex'
}

function displayHomePage() {
    homepage.style.display = 'flex'
    user_info.style.display = 'none'
}

function openProjectsFolder() {

}