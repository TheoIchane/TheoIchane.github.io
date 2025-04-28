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

    sortData(entry) {
        let data = new Object()
        let points = ""
        let start = Date.parse(entry[0].createdAt.slice(0,10))
        console.log(entry)
        entry.forEach((elem) => {
            if (!data[(Date.parse(elem.createdAt.slice(0,10)) - start)/100000]) {
                data[(Date.parse(elem.createdAt.slice(0,10)) - start)/100000] = elem.amount
            } else {
                data[(Date.parse(elem.createdAt.slice(0,10)) - start)/100000]+= elem.amount
            }
        })
        let offSet = 120
        let total = 0
        Object.entries(data).forEach(([key,value]) => {
            total += value
            offSet -= Math.ceil(value/10000)
            points += `${Math.ceil(key/1000)}, ${offSet}\n`
        })
        points += `${Math.ceil(Date.now()/1000000000)}, ${offSet}\n`
        return points
    }

    async init() {
        let data = (await fetchData(this.query)).transaction
        console.log(data)
        this.transactions = data.filter((elem) => { return !(elem.path.includes("/piscine-js/") || elem.path.includes("/piscine-go/"))})
        this.trans_go = data.filter((elem) => { return (elem.path.includes("/piscine-go/"))})
        this.trans_js = data.filter((elem) => { return (elem.path.includes("/piscine-js/"))})
    }

    async render() {
        await this.init()
        let cursus_points = this.sortData(this.transactions)
        let js_points = this.sortData(this.trans_js)
        let go_points = this.sortData(this.trans_go)
        return (`
            <div id="xpBlock" class="block">
            <h2>Cursus:</h2>
            <svg width="300" height="1200" xmlns="http://www.w3.org/2000/svg">
  <polyline fill="none" stroke="black" stroke-width="3" points="${cursus_points}" />
</svg>
            </div>

            <div id="xpBlock" class="block">
            <h2>Piscine JS:</h2>
            <svg width="300" height="1200" xmlns="http://www.w3.org/2000/svg">
  <polyline fill="none" stroke="black" stroke-width="3" points="${js_points}" />
</svg>
            </div>

            <div id="xpBlock" class="block">
            <h2>Piscine GO:</h2>
            <svg width="300" height="1200" xmlns="http://www.w3.org/2000/svg">
  <polyline fill="none" stroke="black" stroke-width="3" points="${go_points}" />
</svg>
            </div>
            `)
    }

}
