import Vue from "vue";
import FeatherIcon from "@core/components/feather-icon/FeatherIcon.vue";

import { ValidationObserver, ValidationProvider } from "vee-validate";

Vue.component(FeatherIcon.name, FeatherIcon);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
