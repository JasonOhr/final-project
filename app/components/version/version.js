'use strict';

angular.module('nutritionApp.version', [
  'nutritionApp.version.interpolate-filter',
  'nutritionApp.version.version-directive'
])

.value('version', '0.1');
