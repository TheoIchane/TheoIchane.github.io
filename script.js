const user_page = document.getElementById('user_info');
const proj_page = document.getElementById('projects');
const skill_page = document.getElementById('skills_page');

const pages = {
    user:   user_page,
    projects: proj_page,
    skills: skill_page
};

window.onload = displayPages('user')

function displayPages(page) {
    Object.entries(pages).forEach(([k,v]) => {
        if (k === page) {
            v.style.display = 'flex'
        } else {
            v.style.display = 'none'
        }
    })
}