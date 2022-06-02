<template>
  <div>
    <div class="d-flex justify-content-end mb-2">
      <b-button variant="primary" @click="clearData"> Добавить </b-button>
    </div>
    <b-card>
      <div class="d-flex justify-contet-between">
        <b-row class="mb-1 w-100">
          <b-col cols="6">
            <b-form-input
              v-model="filterData.search"
              placeholder="Поиск"
              class="w-100"
              @change="fetchAllOrders"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-table striped hover :items="ORDERS" :fields="fields" responsive>
          <template #cell(status)="data">
            <b-badge v-if="data.item.status" :variant="data.item.status.color">
              {{ data.item.status.title }}
            </b-badge>
            <b-badge v-else> Не указан </b-badge>
          </template>
          <template #cell(photo)="data">
            <a
              v-if="data.item.photo && data.item.photo !== 'null'"
              :href="fixImage(data.item.photo)"
              target="_blank"
            >
              <b-img
                style="height: 100px; width: auto"
                :src="fixImage(data.item.photo)"
                fluid
              ></b-img>
            </a>
            <p v-else>Фото не загружено</p>
          </template>
          <template #cell(actions)="data">
            <b-button
              class="p-1"
              v-b-modal.modal-1
              @click="
                () => {
                  formData = JSON.parse(JSON.stringify(data.item));
                  modalPhoto = null;
                }
              "
              variant="warning"
            >
              <feather-icon icon="EditIcon"></feather-icon>
            </b-button>
          </template>
        </b-table>
      </div>
    </b-card>

    <b-modal
      id="modal-1"
      :title="formData.id ? 'Редактирование' : 'Добавление'"
      ok-title="Сохранить"
      cancel-title="Отмена"
      v-model="modalState"
      @ok.prevent="submitHandle"
    >
      <validation-observer ref="validateForm">
        <b-row>
          <b-col>
            <div>
              <label for="">Тип</label>
              <validation-provider
                #default="{ errors }"
                name="Тип"
                rules="required"
              >
                <b-form-input v-model="formData.type" type="text" />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div>
              <label for="">KW</label>
              <validation-provider
                #default="{ errors }"
                name="KW"
                rules="required"
              >
                <b-form-input v-model="formData.kw"></b-form-input>

                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div>
              <label for="">Задача</label>
              <validation-provider
                #default="{ errors }"
                name="Задача"
                rules="required"
              >
                <b-form-input v-model="formData.task"></b-form-input>

                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div>
              <label for="">Имя</label>
              <validation-provider
                #default="{ errors }"
                name="Имя"
                rules="required"
              >
                <b-form-input v-model="formData.clientName"></b-form-input>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div>
              <label for="">Телефон</label>
              <validation-provider
                #default="{ errors }"
                name="Телефон"
                rules="required"
              >
                <b-form-input
                  v-model="formData.phone"
                  :formatter="(v) => v.replace(/[^0-9+]/gm, '')"
                  type="tel"
                ></b-form-input>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div>
              <label for="">Цена</label>
              <validation-provider
                #default="{ errors }"
                name="Цена"
                rules="required"
              >
                <b-form-input type="number" v-model="formData.price">
                </b-form-input>

                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div class="mb-1">
              <label for="">Заклад</label>
              <validation-provider
                #default="{ errors }"
                name="Заклад"
                rules="required"
              >
                <b-form-input
                  type="number"
                  v-model="formData.prepayment"
                ></b-form-input>

                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>

            <div class="mb-1" v-if="formData.status.id">
              <label for="">Статус</label>
              <validation-provider
                #default="{ errors }"
                name="Статус"
                rules="required"
              >
                <v-select
                  v-model="formData.status"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :clearable="false"
                  label="title"
                  :options="STATUSES"
                />

                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div class="mb-1">
              <label for="">Приём</label>
              <validation-provider
                #default="{ errors }"
                name="Приём"
                rules="required"
              >
                <flat-pickr
                  v-model="formData.inputDate"
                  :config="configDate"
                  class="form-control"
                ></flat-pickr>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div class="mb-1">
              <label for="">Цель</label>
              <validation-provider
                #default="{ errors }"
                name="Цель"
                rules="required"
              >
                <flat-pickr
                  v-model="formData.outputDate"
                  :config="configDate"
                  class="form-control"
                ></flat-pickr>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </div>
            <div>
              <label for="">Фото</label>
              <b-img :src="modalPhoto" fluid></b-img>
              <b-form-file
                v-model="formData.photo"
                accept="image/*"
                plain
                @input="getSrcFromFile"
              >
              </b-form-file>
            </div>
          </b-col>
        </b-row>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BModal,
  BRow,
  BCol,
  BButton,
  BFormInput,
  BTable,
  BBadge,
  BFormFile,
  BImg,
} from "bootstrap-vue";

import { required, email } from "@validations";

import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { mapActions, mapState } from "vuex";
import axiosconf from "@/libs/axios.config";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import moment from "moment";
export default {
  components: {
    BCard,
    BModal,
    BRow,
    BCol,
    BButton,
    BFormInput,
    BTable,
    BBadge,
    BFormFile,
    BImg,
    vSelect,
    flatPickr,
    ToastificationContent,
  },
  data() {
    return {
      modalState: false,
      filterData: {
        search: "",
      },
      formData: {
        type: "",
        kw: "",
        task: "",
        clientName: "",
        phone: "",
        price: "",
        prepayment: 0,
        phone: "",
        inputDate: "",
        outputDate: "",
        status: {},
        photo: "",
      },

      modalPhoto: "",
      configDate: {
        locale: Russian,
      },

      fields: [
        {
          key: "id",
          label: "№",
        },
        {
          key: "type",
          label: "Тип",
        },
        {
          key: "kw",
          label: "KW",
        },
        {
          key: "task",
          label: "Задача",
        },
        {
          key: "clientName",
          label: "Имя",
        },
        {
          key: "phone",
          label: "Телефон",
        },
        {
          key: "price",
          label: "Цена",
        },
        {
          key: "prepayment",
          label: "Заклад",
        },
        {
          key: "inputDate",
          label: "Приём",
          formatter: (v) => moment(v).format("DD.MM.YYYY"),
        },
        {
          key: "outputDate",
          label: "Цель",
          formatter: (v) => moment(v).format("DD.MM.YYYY"),
        },
        {
          key: "status",
          label: "Статус",
        },
        {
          key: "photo",
          label: "Фото",
        },
        {
          key: "actions",
          label: "Действия",
        },
      ],
    };
  },
  computed: {
    ...mapState("orders", ["ORDERS"]),
    ...mapState("statuses", ["STATUSES"]),
  },
  mounted() {
    this.fetchAllOrders();
    this.FETCH_ALL_STATUSES();
  },
  methods: {
    ...mapActions("orders", ["FETCH_ALL_ORDERS", "CREATE_ORDER", "EDIT_ORDER"]),
    ...mapActions("statuses", ["FETCH_ALL_STATUSES"]),
    fixImage(url) {
      return axiosconf.baseURL + url;
    },
    async submitHandle() {
      let validate = await this.$refs.validateForm.validate();
      if (!validate) return;

      let {
        id,
        type,
        kw,
        task,
        clientName,
        phone,
        price,
        prepayment,
        status,
        inputDate,
        outputDate,
        photo,
      } = this.formData;

      let item = {
        type,
        kw,
        task,
        clientName,
        phone,
        inputDate: moment(inputDate).format("YYYY-MM-DD"),
        outputDate: moment(outputDate).format("YYYY-MM-DD"),
        price: parseInt(price),
        prepayment: parseInt(prepayment),
        statusId: status.id || 1,
      };
      if (typeof photo !== "string" && photo !== null) {
        item.photo = photo;
      }
      if (id) {
        item.id = id;
      }
      let req = await this.convertToFormdata(item);
      (id ? this.EDIT_ORDER(req) : this.CREATE_ORDER(req))
        .then((r) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Сохранено",
              variant: "success",
            },
          });
          this.fetchAllOrders();
          this.modalState = false;
        })
        .catch((r) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Ошибка",
              variant: "warning",
            },
          });
          this.modalState = false;
        });
    },

    fetchAllOrders() {
      let { search } = this.filterData;
      let params = {
        search,
      };
      this.FETCH_ALL_ORDERS({ params }).catch((r) => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Ошибка",
            variant: "warning",
          },
        });
      });
    },

    clearData() {
      this.modalPhoto = null;
      this.formData = {
        type: "",
        kw: "",
        task: "",
        clientName: "",
        phone: "",
        price: "",
        prepayment: 0,
        phone: "",
        inputDate: "",
        outputDate: "",
        status: {},
        photo: "",
      };
      this.modalState = true;
    },

    //  get source from file
    getSrcFromFile(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.modalPhoto = reader.result;
      };
    },

    async convertToFormdata(item) {
      let form_data = new FormData();
      for (var key in item) {
        if (typeof item[key] === "object" && item[key] && item[key].length) {
          item[key].forEach((element) => {
            form_data.append(key, element);
          });
        } else {
          form_data.append(key, item[key]);
        }
      }
      return form_data;
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>