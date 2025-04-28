import { fetchData } from "./data.js"

export class AuditBlock {
    constructor() {
        this.query = `
        query FullStudentStats {
            user {
                auditRatio
                totalUp
                totalDown
            }
        }`
        this.ratio = 0
        this.totalUp = 0
        this.totalDown = 0
    }

    async init() {
        let data = await fetchData(this.query)
        this.ratio = data.user[0].auditRatio.toFixed(2);
        this.totalDown = data.user[0].totalDown
        this.totalUp = data.user[0].totalUp
    }

    async render() {
        await this.init()
        let upSize,
            downSize;
        if (this.ratio > 1) {
            upSize = "100%"
            downSize = 100 / this.ratio + "%"
        } else {
            downSize = "100%"
            upSize = this.ratio * 100 + "%"
        }
        return (`
            <div id="auditBlock" class="block">
            <h2>Audit:</h2>
            <div id="auditRatio">Ratio:${this.ratio}</div>
            Reçu: ${this.totalDown} xp
            <div class="auditXp">
            <div id="totalDown" style="width:${downSize};">&nbsp;</div>
            </div>
            Donné: ${this.totalUp} xp
            <div class="auditXp">
            <div id="totalUp" style="width:${upSize};">&nbsp;</div>
            </div>
            </div>
            `)
    }
}


export class ProfilBlock {
    constructor() {
        this.query = `
        query FullStudentStats {
            user {
                attrs
            }
        }`
        this.lastname = ""
        this.firstname = ""
        this.email = ""
        this.age = 0
        this.dateOfBirth = new Date()
        this.gender = ""
        this.city = ""
    }

    async init() {
        let data = (await fetchData(this.query)).user[0].attrs
        this.email = data.email
        this.gender = data.gender
        this.lastname = data.lastName
        this.firstname = data.firstName
        this.city = data.addressCity
        let today = new Date()
        this.dateOfBirth = new Date(Date.parse(data.dateOfBirth))
        this.age = today.getFullYear() - this.dateOfBirth.getFullYear()
        let m = today.getMonth() - this.dateOfBirth.getMonth();
        (m < 0 || (m == 0 && today.getDate() < this.dateOfBirth.getDate())) ? this.age -= 1 : this.age
    }

    async render() {
        await this.init()

        return (`
            <div id="profilBlock" class="block">
            <h2>Profil:</h2>
            Lastname: ${this.lastname} <br>
            Firstname: ${this.firstname} <br>
            Age: ${this.age} <br>
            Email: ${this.email} <br>
            City: ${this.city} <br>
            </div>
            `)
    }

}

export class XPBlock {
    constructor() {
        this.query = `
        query GetFullProfile {
                transaction (where: {type: {_eq: "xp"}}) {
                    path
                    amount
                    createdAt
                }
        }`
        this.transactions = []
        this.trans_js = []
        this.trans_go = []
    }

    sortData(entry, x, y) {
        let data = new Object()
        let points = ""
        let start = Date.parse(entry[0].createdAt.slice(0, 10))
        entry.forEach((elem) => {
            if (!data[(Date.parse(elem.createdAt.slice(0, 10)) - start) / 100000]) {
                data[(Date.parse(elem.createdAt.slice(0, 10)) - start) / 100000] = elem.amount
            } else {
                data[(Date.parse(elem.createdAt.slice(0, 10)) - start) / 100000] += elem.amount
            }
        })
        let offSet = 150
        let total = 0
        Object.entries(data).forEach(([key, value]) => {
            total += value
            offSet -= Math.ceil(value / y)
            points += `${Math.ceil(key / x)}, ${offSet}\n`
        })
        return { points: points, amount: total }
    }

    async init() {
        let data = (await fetchData(this.query)).transaction
        this.transactions = data.filter((elem) => { return !(elem.path.includes("/piscine-js/") || elem.path.includes("/piscine-go/")) }).sort((a, b) => {
            return Date.parse(a.createdAt.slice(0, 10)) - Date.parse(b.createdAt.slice(0, 10))
        })
        this.trans_go = data.filter((elem) => { return (elem.path.includes("/piscine-go/")) }).sort((a, b) => {
            return Date.parse(a.createdAt.slice(0, 10)) - Date.parse(b.createdAt.slice(0, 10))
        })
        this.trans_js = data.filter((elem) => { return (elem.path.includes("/piscine-js/")) }).sort((a, b) => {
            return Date.parse(a.createdAt.slice(0, 10)) - Date.parse(b.createdAt.slice(0, 10))
        })
    }

    async render() {
        await this.init()
        let cursus = this.sortData(this.transactions, 75, 1000)
        let js = this.sortData(this.trans_js, 40, 1000)
        let go = this.sortData(this.trans_go, 30, 4500)
        let total = cursus.amount + js.amount + go.amount
        return (`
            <div class="block">
            <h2>Cursus: <span class="amount">${cursus.amount} xp</span></h2>
            <svg width="300" xmlns="http://www.w3.org/2000/svg">
  <polyline fill="none" stroke="rgb(190, 50, 31)" stroke-width="3" points="${cursus.points}" />
</svg>
            </div>

            <div class="block">
            <h2>Piscine JS: <span class="amount">${js.amount} xp</span></h2>
            <svg width="300" xmlns="http://www.w3.org/2000/svg">
  <polyline fill="none" stroke="rgb(207, 195, 27)" stroke-width="3" points="${js.points}" />
</svg>
            </div>

            <div class="block">
            <h2>Piscine GO: <span class="amount">${go.amount} xp</span></h2>
            <svg width="300" xmlns="http://www.w3.org/2000/svg">
  <polyline fill="none" stroke="rgb(49, 66, 177)" stroke-width="3" points="${go.points}" />
</svg>
            </div>

            <div id="pie_chart" class="block">
            <h2 style="
    margin-bottom: 0px;">XP Ratio: </h2> <br>
            <div id="pie_content">
  <svg viewBox="0 0 64 64" class="pie">
  <circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: ${go.amount / total * 100} 100;  stroke-dashoffset: 0">
  </circle>
  <circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: ${js.amount / total * 100} 100; stroke: rgb(207, 195, 27); stroke-dashoffset: -${go.amount / total * 100}; animation-delay: 0.25s">
  </circle>
  <circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: ${cursus.amount / total * 100 + 1} 100; stroke: rgb(190, 50, 31); stroke-dashoffset: -${100 - cursus.amount / total * 100}; animation-delay: 0.5s">
  </circle>
</svg>
<div class="legend">
  <span class="color" style="background-color: rgb(207, 195, 27);">&nbsp;</span> JavaScript <br>
  <span class="color" style="background-color: rgb(190, 50, 31);">&nbsp;</span> Cursus <br>
  <span class="color" style="background-color: rgb(49, 66, 177);">&nbsp;</span> Go
</div>
</div>
</div>
            `)
    }

}
