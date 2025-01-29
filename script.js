const user_page = document.getElementById('user_info');
const proj_page = document.getElementById('projects_page');
const skill_page = document.getElementById('skills_page');

const user_button = document.getElementById('user');
const proj_button = document.getElementById('folder_projects');
const skill_button = document.getElementById('skill');

const pages = {
    user:   [user_page,user_button],
    projects: [proj_page,proj_button],
    skills: [skill_page,skill_button]
};

window.onload = displayPages('user')

function displayPages(page) {
    Object.entries(pages).forEach(([k,v]) => {
        if (k === page) {
            v[0].style.display = 'flex'
            v[1].style.border = '3px solid black'
            v[1].style.borderRadius = '5%'
        } else {
            v[0].style.display = 'none'
            v[1].style.border = 'none'
        }
    })
}