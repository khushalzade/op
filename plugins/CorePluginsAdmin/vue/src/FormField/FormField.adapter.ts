/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { IScope, ITimeoutService } from 'angular';
import {
  createAngularJsAdapter,
  transformAngularJsBoolAttr,
  transformAngularJsIntAttr,
  useExternalPluginComponent,
} from 'CoreHome';
import { shallowRef } from 'vue';
import FormField from './FormField.vue';
import FieldAngularJsTemplate from './FieldAngularJsTemplate.vue';

function transformVueComponentRef(value?: Record<string, string>) {
  if (!value) {
    return undefined;
  }

  const { plugin, name } = value;
  if (!plugin || !name) {
    throw new Error('Invalid component property given to piwik-field directive, must be '
      + '{plugin: \'...\',name: \'...\'}');
  }

  return useExternalPluginComponent(plugin, name);
}

export default createAngularJsAdapter<[ITimeoutService]>({
  component: FormField,
  scope: {
    modelValue: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default(scope: any) {
        const field = scope.piwikFormField;

        // vue components expect object data as input, so we parse JSON data
        // for angularjs directives that use JSON.
        if (typeof field.value === 'string'
          && field.value
          && (field.type === 'array'
            || field.uiControl === 'multituple'
            || field.uiControl === 'field-array'
            || field.uiControl === 'multiselect'
            || field.uiControl === 'site')
        ) {
          field.value = JSON.parse(field.value);
        }

        if (field.uiControl === 'checkbox') {
          return transformAngularJsBoolAttr(field.value);
        }
        return field.value;
      },
    },
    piwikFormField: {
      vue: 'formField',
      angularJsBind: '=',
      transform(v: unknown, vm: unknown, scope: IScope) {
        const value = v as Record<string, unknown>;
        return {
          ...value,
          condition: value.condition
            ? (values: unknown[]) => scope.$eval(value.condition as string, values)
            : value.condition,
          disabled: transformAngularJsBoolAttr(value.disabled),
          autocomplete: transformAngularJsBoolAttr(value.autocomplete),
          autofocus: transformAngularJsBoolAttr(value.autofocus),
          tabindex: transformAngularJsIntAttr(value.tabindex),
          fullWidth: transformAngularJsBoolAttr(value.fullWidth),
          maxlength: transformAngularJsIntAttr(value.maxlength),
          required: transformAngularJsBoolAttr(value.required),
          rows: transformAngularJsIntAttr(value.rows),
          min: transformAngularJsIntAttr(value.min),
          max: transformAngularJsIntAttr(value.max),
          component: shallowRef(
            value.templateFile
              ? FieldAngularJsTemplate
              : transformVueComponentRef(value.component as Record<string, string>),
          ),
        };
      },
    },
    allSettings: {
      angularJsBind: '=',
    },
  },
  directiveName: 'piwikFormField',
  events: {
    'update:modelValue': (newValue, vm, scope, element, attrs, controller, $timeout) => {
      if (newValue !== scope.piwikFormField.value) {
        $timeout(() => {
          scope.piwikFormField.value = newValue;
        });
      }
    },
  },
  $inject: ['$timeout'],
  postCreate(vm, scope) {
    scope.$watch('piwikFormField.value', (newVal: unknown, oldVal: unknown) => {
      if (newVal !== oldVal) {
        vm.modelValue = newVal;
      }
    });
  },
});
