import Vue from 'vue';
import UpdateSharedRunnersForm from './components/shared_runners_form.vue';

export default (containerId = 'update-shared-runners-form') => {
  const containerEl = document.getElementById(containerId);

  const {
    updatePath,
    sharedRunnersSetting,
    parentSharedRunnersSetting,
    runnerEnabledValue,
    runnerDisabledValue,
    runnerAllowOverrideValue,
  } = containerEl.dataset;

  return new Vue({
    el: containerEl,
    provide: {
      updatePath,
      sharedRunnersSetting,
      parentSharedRunnersSetting,
      runnerEnabledValue,
      runnerDisabledValue,
      runnerAllowOverrideValue,
    },
    render(createElement) {
      return createElement(UpdateSharedRunnersForm);
    },
  });
};
