import http from "@axios"
import BaseApi from "./baseApi"
class Satuses extends BaseApi { }
export default new Satuses("/api/statuses")