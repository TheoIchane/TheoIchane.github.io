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
            <div id="auditBlock">
            <h2>Audit:</h2>
            <div id="auditRatio">Ratio:${this.ratio}</div>
            Reçu:
            <div class="auditXp">
            <div id="totalDown" style="width:${downSize};">&nbsp;</div>
            </div>
            Donné:
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
            <div id="profilBlock">
            <h2>Profil:</h2>
            Lastname: ${this.lastname} <br>
            Firstname: ${this.firstname} <br>
            Email: ${this.email} <br>
            Age: ${this.age} <br>
            Gender: ${this.gender} <br>
            City: ${this.city} <br>
            </div>
            `)
    }

}