import http from "@axios"
import BaseApi from "./baseApi"
class Orders extends BaseApi {
    post(data) {
        return this.http({
            url: this.url,
            method: "post",
            data
        })
    }
    put(data) {
        return this.http({
            url: `${this.url}/` + data.get("id"),
            method: "put",
            data
        })
    }
}
export default new Orders("/api/orders")