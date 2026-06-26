(function (root) {
  'use strict';
  // Global registry that each template file populates. Loaded before any
  // template <script> so window.OBS_TEMPLATES always exists.
  root.OBS_TEMPLATES = root.OBS_TEMPLATES || {};
})(typeof window !== 'undefined' ? window : globalThis);
