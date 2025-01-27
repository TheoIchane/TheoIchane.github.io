const head = document.getElementsByTagName('nav')[0]
console.log(head.clientHeight)
document.addEventListener('scroll',stickyHead)

function stickyHead() {
    if (window.scrollY >= head.clientHeight) {
        head.style.position = 'fixed'
    }
}