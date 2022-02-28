<template>
  <div>
    <div class="d-flex justify-content-end mb-2">
      <b-button v-b-modal.modal-1 variant="primary" @click="clearData">
        Добавить
      </b-button>
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
      <div style="overflow-x: auto">
        <b-table striped hover :items="ORDERS" :fields="fields">
          <template #cell(status)="data">
            <b-badge :variant="data.item.status.color">
              {{ data.item.status.title }}
            </b-badge>
          </template>
          <template #cell(photo)="data">
            <a :href="fixImage(data.item.photo)" target="_blank">
              <b-img :src="fixImage(data.item.photo)" fluid></b-img>
            </a>
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
      title="BootstrapVue"
      ok-title="Сохранить"
      cancel-title="Отмена"
      @ok="submitHandle"
    >
      <b-row>
        <b-col>
          <div>
            <label for="">Тип</label>
            <b-form-input v-model="formData.type"></b-form-input>
          </div>
          <div>
            <label for="">KW</label>
            <b-form-input v-model="formData.kw"></b-form-input>
          </div>
          <div>
            <label for="">Задача</label>
            <b-form-input v-model="formData.task"></b-form-input>
          </div>
          <div>
            <label for="">Имя</label>
            <b-form-input v-model="formData.clientName"></b-form-input>
          </div>
          <div>
            <label for="">Телефон</label>
            <b-form-input
              v-model="formData.phone"
              :formatter="(v) => v.replace(/[^0-9+]/gm, '')"
              type="tel"
            ></b-form-input>
          </div>
          <div>
            <label for="">Цена</label>
            <b-form-input v-model="formData.price"></b-form-input>
          </div>
          <div class="mb-1">
            <label for="">Заклад</label>
            <b-form-input v-model="formData.prepayment"></b-form-input>
          </div>

          <div class="mb-1" v-if="formData.status.id">
            <label for="">Статус</label>
            <v-select
              v-model="formData.status"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :clearable="false"
              label="title"
              :options="STATUSES"
            />
          </div>
          <div class="mb-1">
            <label for="">Приём</label>
            <flat-pickr
              v-model="formData.inputDate"
              :config="configDate"
            ></flat-pickr>
          </div>
          <div class="mb-1">
            <label for="">Цель</label>
            <flat-pickr
              v-model="formData.outputDate"
              :config="configDate"
            ></flat-pickr>
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
        prepayment: "",
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
      items: [
        {
          type: "type",
          kw: "kw",
          task: "task",
          name: "name",
          phone: "phone",
          price: "price",
          prepayment: "prepayment",
          phone: "phone",
          input: "input",
          output: "output",
          status: "status",
          photo: "photo",
          actions: "actions",
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
      if (typeof photo !== "string") {
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
        })
        .catch((r) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Ошибка",
              variant: "warning",
            },
          });
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
      this.formData = {
        type: "",
        kw: "",
        task: "",
        clientName: "",
        phone: "",
        price: "",
        prepayment: "",
        phone: "",
        inputDate: "",
        outputDate: "",
        status: {},
        photo: "",
      };
    },

    //  get source from file
    getSrcFromFile(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("reader.result", reader.result);
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