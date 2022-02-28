import http from "@axios"

class BaseApi {
    constructor(url) {
        this.url = url
        this.http = http
    }

    getAll(data) {
        return http.get(this.url, data)
    }

    getById({ params }) {
        return http.get(this.url + params.id, { params })
    }

    post({ params, data }) {
        return http.post(this.url, { params, data })
    }

    put({ params, data }) {
        return http.put(this.url + params.id, { params, data })
    }

    delete({ params }) {
        return http.delete(this.url + params.id, { params })
    }

}

export default BaseApi