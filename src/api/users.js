import http from "@axios"
import BaseApi from "./baseApi"
class Users extends BaseApi { }
export default new Users("/api/users")